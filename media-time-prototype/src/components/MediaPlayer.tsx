import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import ReactPlayer from 'react-player'
import { motion } from 'framer-motion'
import type { MediaCondition } from '../types'
import { MEDIA_CONTENT } from '../data/mediaContent'
import { useSettings } from '../context/SettingsContext'
import { Button } from './shared/Button'

const Player = ReactPlayer as unknown as (props: Record<string, unknown>) => ReactElement

interface MediaPlayerProps {
  condition: MediaCondition
  playing: boolean
  onReady?: () => void
  onError?: (error: Error) => void
}

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export function MediaPlayer({ condition, playing, onReady, onError }: MediaPlayerProps) {
  const { language, messages } = useSettings()
  const meta = useMemo(() => MEDIA_CONTENT[condition], [condition])
  const topic = meta.topic[language]
  const title = meta.title[language]
  const description = meta.description[language]
  const [userInteracted, setUserInteracted] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlayerError = (event: unknown) => {
    const normalized = event instanceof Error ? event : new Error('Playback error')
    onError?.(normalized)
  }

  const handleUserInteraction = async () => {
    setUserInteracted(true)
    if (condition === 'video' && videoRef.current) {
      try {
        videoRef.current.muted = false
        await videoRef.current.play()
      } catch (error) {
        handlePlayerError(error)
      }
    } else if (condition === 'audio' && audioRef.current) {
      try {
        audioRef.current.muted = false
        await audioRef.current.play()
      } catch (error) {
        handlePlayerError(error)
      }
    }
  }

  const handlePlayerReady = () => {
    setPlayerReady(true)
    onReady?.()
  }

  useEffect(() => {
    setUserInteracted(false)
    setPlayerReady(false)
  }, [condition])

  useEffect(() => {
    if (condition === 'video' && videoRef.current) {
      if (playing && userInteracted) {
        videoRef.current.play().catch(handlePlayerError)
      } else {
        videoRef.current.pause()
      }
    } else if (condition === 'audio' && audioRef.current) {
      if (playing && userInteracted) {
        audioRef.current.play().catch(handlePlayerError)
      } else {
        audioRef.current.pause()
      }
    }
  }, [condition, playing, userInteracted])

  const mediaCard = (() => {
    switch (condition) {
      case 'video':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-soft">
            <video
              ref={videoRef}
              src={meta.url ?? ''}
              className="h-full w-full object-contain"
              playsInline
              muted={!userInteracted}
              controls={false}
              onLoadedMetadata={handlePlayerReady}
              onError={(e) => handlePlayerError(e)}
            />
            {meta.poster && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            )}
            {!userInteracted && playerReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Button
                  size="lg"
                  onClick={handleUserInteraction}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  {messages.media.playButton}
                </Button>
              </div>
            )}
          </div>
        )
      case 'audio':
        return (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-8 text-white shadow-soft">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/80">{messages.media.audioBadge}</p>
                <h2 className="font-display text-3xl font-semibold">{title}</h2>
                <p className="mt-2 max-w-xl text-sm text-white/80">{description}</p>
              </div>
              <div className="relative h-28 w-28">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full border-4 border-white"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                />
                <div className="absolute inset-10 rounded-full bg-white text-center text-brand-600">
                  <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em]">
                    {messages.media.audioInnerLabel}
                  </div>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={meta.url ?? ''}
              muted={!userInteracted}
              onLoadedMetadata={handlePlayerReady}
              onError={(e) => handlePlayerError(e)}
            />
            {!userInteracted && playerReady && (
              <div className="mt-4 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleUserInteraction}
                  className="bg-white/90 text-brand-700 hover:bg-white"
                >
                  {messages.media.playButton}
                </Button>
              </div>
            )}
          </div>
        )
      case 'text':
      default:
        return (
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose prose-neutral max-w-3xl rounded-3xl border border-neutral-200 bg-white/90 p-8 text-neutral-800 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80 dark:prose-invert"
          >
            <h2 className="font-display text-3xl text-brand-700 dark:text-brand-300">{meta.article?.heading[language]}</h2>
            {meta.article?.paragraphs[language]?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.article>
        )
    }
  })()

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex w-full flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">{topic}</span>
        <h1 className="font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100 md:text-4xl">{title}</h1>
        <p className="max-w-3xl text-base text-neutral-600 dark:text-neutral-300">{description}</p>
      </div>
      {mediaCard}
    </motion.div>
  )
}
