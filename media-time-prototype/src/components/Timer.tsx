import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  duration: number
  isRunning: boolean
  onComplete?: () => void
  className?: string
  label?: string
}

const UPDATE_INTERVAL_MS = 250

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remaining = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export function Timer({ duration, isRunning, onComplete, className, label = 'Time remaining' }: TimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const completionTriggeredRef = useRef(false)

  useEffect(() => {
    setRemaining(duration)
    completionTriggeredRef.current = false
  }, [duration])

  useEffect(() => {
    if (!isRunning) return

    const targetTimestamp = Date.now() + duration * 1000

    const tick = () => {
      const delta = Math.max(0, Math.round((targetTimestamp - Date.now()) / 1000))
      setRemaining(delta)
      if (delta <= 0 && !completionTriggeredRef.current) {
        completionTriggeredRef.current = true
        onComplete?.()
      }
    }

    tick()
    const interval = window.setInterval(tick, UPDATE_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [duration, isRunning, onComplete])

  const progress = useMemo(() => {
    if (duration === 0) return 1
    return (duration - remaining) / duration
  }, [duration, remaining])

  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-soft backdrop-blur ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">{label}</p>
          <p className="font-display text-4xl font-semibold text-brand-700">{formatTime(remaining)}</p>
        </div>
        <div className="relative h-16 w-16">
          <svg className="h-full w-full -rotate-90 transform text-neutral-200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-40" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              className="text-brand-500"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ ease: 'easeInOut', duration: UPDATE_INTERVAL_MS / 1000, repeat: 0 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-brand-600">
            {Math.round(progress * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}


