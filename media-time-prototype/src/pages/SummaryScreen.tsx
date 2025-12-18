import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    consentSignatureDataUrl,
    consentSignedAt,
    demographics,
    resetSession,
  } = useSession()
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
        className="w-full"
      >
        <ResultExport
          results={results}
          participantId={participantId}
          participantName={participantName}
          consentSignatureDataUrl={consentSignatureDataUrl}
          consentSignedAt={consentSignedAt}
          demographics={demographics}
          onReset={handleReset}
        />
        <p className="mt-6 text-center text-xs uppercase tracking-[0.32em] text-neutral-400 dark:text-neutral-500">
          {messages.result.closingReminder}
        </p>
      </motion.main>
    </div>
  )
}
