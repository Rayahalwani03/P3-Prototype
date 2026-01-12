import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/shared/Button'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'

export function InstructionsScreen() {
  const navigate = useNavigate()
  const { hydrated, isSessionActive } = useSession()
  const { messages, t } = useSettings()
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!isSessionActive) {
      navigate('/')
    }
  }, [hydrated, isSessionActive, navigate])

  const handleStart = () => {
    setTransitioning(true)
    window.setTimeout(() => {
      navigate('/media/0')
    }, 500)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-neutral-100 px-4 py-16 transition-colors duration-300 dark:from-neutral-950 dark:to-neutral-900">
      {transitioning && <LoadingOverlay message={t('loading.loadingFirstCondition')} />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-3xl space-y-8 rounded-3xl border border-neutral-200 bg-white/95 p-10 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
      >
        <header className="space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">
            {messages.instructions.badge}
          </span>
          <h1 className="font-display text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            {messages.instructions.title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">{messages.instructions.intro}</p>
        </header>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.instructions.duringHeading}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-200">
              {(messages.instructions.duringPoints || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.instructions.afterHeading}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-200">
              {(messages.instructions.afterPoints || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.instructions.importantNotesHeading}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-200">
              {(messages.instructions.importantNotes || []).map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleStart}>
            {messages.instructions.startButton}
          </Button>
        </div>
      </motion.main>
    </div>
  )
}
