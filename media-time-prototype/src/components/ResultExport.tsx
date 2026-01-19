import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { resultsToFullCsv } from '../lib/csv'
import type { ConditionResult } from '../types'
import { Button } from './shared/Button'

interface ResultExportProps {
  results: ConditionResult[]
  participantId: string
  participantName?: string
  consentSignedAt?: string
  demographicData?: {
    age?: number
    shortVideosFrequency?: string
    audioFrequency?: string
    textFrequency?: string
    caffeineConsumed?: boolean
    caffeineTimeAgo?: string
    alertness?: number
  }
  onReset: () => void
}


export function ResultExport({
  results,
  participantId,
  participantName,
  consentSignedAt,
  demographicData,
  onReset,
}: ResultExportProps) {
  const { messages } = useSettings()
  const csvContent = useMemo(
    () =>
      resultsToFullCsv({
        results,
        participantId,
        participantName,
        consentSignedAt,
        demographicData,
      }),
    [results, participantId, participantName, consentSignedAt, demographicData],
  )
  const autoDownloadedRef = useRef(false)



  const downloadCsv = (autoDownload = false) => {
    if (!csvContent) return
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    link.href = url
    link.setAttribute('download', `time-perception-${participantId || 'unknown'}-${timestamp}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    if (autoDownload) {
      console.log('📥 CSV file downloaded automatically')
    }
  }

  const handleDownload = () => {
    downloadCsv(false)
  }

  const uploadToGitHub = async () => {
    const GITHUB_UPLOAD_ENABLED = import.meta.env.VITE_GITHUB_UPLOAD_ENABLED === 'true'
    
    if (!GITHUB_UPLOAD_ENABLED || !csvContent) return

    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `time-perception-${participantId || 'unknown'}-${timestamp}.csv`
      
      const response = await fetch('/api/github-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvContent,
          filename,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ CSV uploaded to GitHub:', result.url)
      } else {
        console.warn('⚠️ Failed to upload CSV to GitHub')
      }
    } catch (error) {
      console.warn('⚠️ GitHub upload error:', error)
    }
  }

  // Auto-download CSV when component mounts (experiment is done)
  useEffect(() => {
    if (csvContent && !autoDownloadedRef.current && results.length > 0) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        downloadCsv(true)
        autoDownloadedRef.current = true
        
        // Optionally upload to GitHub if configured
        uploadToGitHub()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [csvContent, results.length])


  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white/95 p-4 sm:p-6 md:p-8 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
          {messages.result.newParticipant}
        </Button>
        <Button variant="primary" size="lg" onClick={handleDownload} disabled={!csvContent} className="w-full sm:w-auto">
          {messages.result.downloadCsv}
        </Button>
      </div>
    </motion.section>
  )
}
