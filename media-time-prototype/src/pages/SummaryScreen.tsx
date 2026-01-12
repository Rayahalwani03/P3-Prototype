import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResultExport } from '../components/ResultExport'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'

export function SummaryScreen() {
  const navigate = useNavigate()
  const {
    hydrated,
    isSessionComplete,
    results,
    participantId,
    participantName,
    consentSignedAt,
    resetSession,
  } =
    useSession()
  const { messages } = useSettings()

  useEffect(() => {
    if (!hydrated) return
    if (!isSessionComplete) {
      navigate('/')
    }
  }, [hydrated, isSessionComplete, navigate])

  const handleReset = () => {
    resetSession()
    navigate('/')
  }

  if (!results.length) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 px-4 py-16 transition-colors duration-300 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-3xl space-y-8"
      >
        <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white/95 p-10 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80">
          <header className="space-y-4">
            <span className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">
              {messages.result.badge}
            </span>
            <h1 className="font-display text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.result.title}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">{messages.result.subtitle}</p>
          </header>

          <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
            <p>{messages.result.debriefingParagraph1}</p>
            <p>{messages.result.debriefingParagraph2}</p>
            <p>{messages.result.debriefingParagraph3}</p>
            <p>{messages.result.debriefingParagraph4}</p>
            <p className="font-medium">{messages.result.debriefingParagraph5}</p>
          </div>

          <ResultExport
            results={results}
            participantId={participantId}
            participantName={participantName}
            consentSignedAt={consentSignedAt}
            onReset={handleReset}
          />
        </div>
      </motion.main>
    </div>
  )
}
