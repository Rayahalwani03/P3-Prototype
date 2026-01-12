import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { MediaPlayer } from '../components/MediaPlayer'
import { Button } from '../components/shared/Button'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'
import { MEDIA_DURATION_SECONDS } from '../data/mediaContent'

export function MediaScreen() {
  const navigate = useNavigate()
  const { index } = useParams<{ index: string }>()
  const {
    hydrated,
    isSessionActive,
    conditionOrder,
    currentIndex,
    getConditionByIndex,
    isSessionComplete,
    participantId,
    setReadingStartTime,
  } = useSession()
  const { t, messages } = useSettings()
  const numericIndex = Number(index ?? 0)
  const condition = getConditionByIndex(numericIndex)
  const [playing, setPlaying] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const completionRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const readingStartTimeRef = useRef<number | null>(null)

  const triggerCompletion = useCallback(() => {
    if (completionRef.current) return
    completionRef.current = true
    setPlaying(false)
    setTransitioning(true)
    window.setTimeout(() => {
      navigate(`/questionnaire/${numericIndex}`)
    }, 400)
  }, [navigate, numericIndex])

  const handleTextContinue = useCallback(() => {
    if (completionRef.current) return
    if (condition !== 'text') return
    
    const readingDuration = readingStartTimeRef.current 
      ? Math.round((Date.now() - readingStartTimeRef.current) / 1000)
      : 0
    
    if (setReadingStartTime) {
      setReadingStartTime(readingDuration)
    }
    
    triggerCompletion()
  }, [condition, triggerCompletion, setReadingStartTime])

  const handleSkip = useCallback(() => {
    if (completionRef.current) return
    if (condition === 'text') return // Skip only for video and audio
    
    // Clear the timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    
    // Set reading duration to 0 for skipped media
    if (setReadingStartTime) {
      setReadingStartTime(0)
    }
    
    triggerCompletion()
  }, [condition, triggerCompletion, setReadingStartTime])

  useEffect(() => {
    if (!hydrated) return
    if (!isSessionActive) {
      navigate('/')
      return
    }
    if (isSessionComplete) {
      navigate('/summary')
      return
    }

    if (Number.isNaN(numericIndex) || numericIndex < 0 || numericIndex >= conditionOrder.length) {
      navigate(`/media/${currentIndex}`)
      return
    }

    if (numericIndex !== currentIndex) {
      navigate(`/media/${currentIndex}`)
      return
    }

    setPlaying(true)
    setPlaybackError(false)
    completionRef.current = false
    
    // For text condition, track reading start time and don't set a timer
    if (condition === 'text') {
      readingStartTimeRef.current = Date.now()
      if (setReadingStartTime) {
        setReadingStartTime(0) // Reset reading time
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    } else {
      // For video and audio, use the fixed duration timer
      readingStartTimeRef.current = null
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => {
        triggerCompletion()
      }, MEDIA_DURATION_SECONDS * 1000)
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [
    hydrated,
    isSessionActive,
    isSessionComplete,
    numericIndex,
    conditionOrder.length,
    currentIndex,
    navigate,
    triggerCompletion,
    condition,
    setReadingStartTime,
  ])

  const handlePlaybackError = () => {
    setPlaybackError(true)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  if (!condition) {
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 px-4 py-10 transition-colors duration-300 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {transitioning && <LoadingOverlay message={t('loading.loadingQuestionnaire')} />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
      >
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">
              {t('media.participantLabel', { id: participantId || '—' })}
            </p>
            <h1 className="font-display text-4xl font-semibold capitalize text-neutral-900 dark:text-neutral-100">
              {messages.media.conditionLabels[condition]}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {t('media.conditionProgress', { current: numericIndex + 1, total: conditionOrder.length })}
            </p>
          </div>
          <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-300">{messages.media.focusReminder}</p>
        </div>

        <MediaPlayer condition={condition} playing={playing} onError={handlePlaybackError} />

        {condition === 'text' ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{messages.media.textContinueMessage}</p>
            <Button size="lg" onClick={handleTextContinue}>
              {messages.media.textContinueButton}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-neutral-200 bg-white/80 p-5 text-sm text-neutral-600 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
              <p>{messages.media.stalledMessage}</p>
              {playbackError && <p className="mt-2 text-rose-600 dark:text-rose-400">{messages.media.errorMessage}</p>}
            </div>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{messages.media.skipMessage}</p>
              <Button size="lg" variant="secondary" onClick={handleSkip}>
                {messages.media.skipButton}
              </Button>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  )
}
