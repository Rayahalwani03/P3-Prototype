import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MediaPlayer } from '../components/MediaPlayer'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { Button } from '../components/shared/Button'
import { MEDIA_DURATION_SECONDS } from '../data/mediaContent'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'

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
    startTextReading,
  } = useSession()
  const { t, messages } = useSettings()
  const numericIndex = Number(index ?? 0)
  const condition = getConditionByIndex(numericIndex)
  const [playing, setPlaying] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const completionRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const textStartTimeRef = useRef<string | null>(null)

  const isTextCondition = condition === 'text'

  const triggerCompletion = useCallback(() => {
    if (completionRef.current) return
    completionRef.current = true
    setPlaying(false)
    setTransitioning(true)

    // Calculate reading duration for text condition
    if (isTextCondition && textStartTimeRef.current) {
      const startTime = new Date(textStartTimeRef.current).getTime()
      const endTime = Date.now()
      const durationSec = Math.round((endTime - startTime) / 1000)
      // Store duration in sessionStorage for questionnaire to use
      sessionStorage.setItem('textReadingDuration', String(durationSec))
    }

    window.setTimeout(() => {
      navigate(`/questionnaire/${numericIndex}`)
    }, 400)
  }, [navigate, numericIndex, isTextCondition])

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

    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    // For text condition: self-paced, no timer
    // For video/audio: fixed 3-minute timer
    if (isTextCondition) {
      // Start tracking reading time
      const now = new Date().toISOString()
      textStartTimeRef.current = now
      startTextReading()
    } else {
      textStartTimeRef.current = null
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
    isTextCondition,
    startTextReading,
  ])

  const handlePlaybackError = () => {
    setPlaybackError(true)
  }

  const handleSkip = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    triggerCompletion()
  }

  const handleDoneReading = () => {
    triggerCompletion()
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
          <div className="flex flex-col items-end gap-3">
            <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-300">{messages.media.focusReminder}</p>
            <Button variant="secondary" onClick={handleSkip} disabled={transitioning}>
              {messages.media.skipButton}
            </Button>
          </div>
        </div>

        <MediaPlayer condition={condition} playing={playing} onError={handlePlaybackError} />

        <div className="rounded-3xl border border-neutral-200 bg-white/80 p-5 text-sm text-neutral-600 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
          {isTextCondition ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p>{messages.media.textReadingNote}</p>
              <Button variant="primary" size="lg" onClick={handleDoneReading} disabled={transitioning}>
                {messages.media.doneReadingButton}
              </Button>
            </div>
          ) : (
            <>
              <p>{messages.media.stalledMessage}</p>
              {playbackError && <p className="mt-2 text-rose-600 dark:text-rose-400">{messages.media.errorMessage}</p>}
            </>
          )}
        </div>
      </motion.main>
    </div>
  )
}
