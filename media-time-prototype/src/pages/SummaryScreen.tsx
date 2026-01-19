import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResultExport } from '../components/ResultExport'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'
import { isGoogleSheetsConfigured, sendToGoogleSheets } from '../lib/googleSheets'

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
    demographicData,
    orderNumber,
  } =
    useSession()
  const { messages } = useSettings()
  const [googleSheetsSent, setGoogleSheetsSent] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!isSessionComplete) {
      navigate('/')
    }
  }, [hydrated, isSessionComplete, navigate])

  // Send data to Google Sheets automatically when screen loads
  useEffect(() => {
    if (!hydrated || !isSessionComplete || !results.length || googleSheetsSent) return
    
    if (!isGoogleSheetsConfigured()) {
      console.warn('⚠️ Google Sheets not configured.')
      console.warn('📝 To fix this:')
      console.warn('   1. For local development: Add VITE_GOOGLE_SHEETS_WEB_APP_URL to .env file')
      console.warn('   2. For Vercel: Go to Dashboard → Settings → Environment Variables')
      console.warn('      Add VITE_GOOGLE_SHEETS_WEB_APP_URL with your Web App URL')
      console.warn('      Make sure to add it for Production, Preview, and Development')
      console.warn('   3. Redeploy after adding environment variables')
      return
    }

    const sendData = async () => {
      console.log('Sending data to Google Sheets...', {
        participantId,
        resultsCount: results.length,
        hasDemographics: !!demographicData,
      })
      
      const success = await sendToGoogleSheets({
        participantId,
        participantName,
        consentSignedAt,
        orderNumber,
        ...demographicData,
        results,
      })
      
      if (success) {
        setGoogleSheetsSent(true)
        console.log('✅ Data sent to Google Sheets successfully')
      } else {
        console.error('❌ Failed to send data to Google Sheets')
      }
    }

    sendData()
  }, [hydrated, isSessionComplete, results, participantId, participantName, consentSignedAt, demographicData, orderNumber, googleSheetsSent])

  const handleReset = () => {
    resetSession()
    navigate('/')
  }

  if (!results.length) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16 transition-colors duration-300 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-3xl space-y-6 sm:space-y-8"
      >
        <div className="space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 md:p-10 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80">
          <header className="space-y-3 sm:space-y-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.result.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">{messages.result.subtitle}</p>
          </header>

          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
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
            demographicData={demographicData}
            onReset={handleReset}
          />
        </div>
      </motion.main>
    </div>
  )
}
