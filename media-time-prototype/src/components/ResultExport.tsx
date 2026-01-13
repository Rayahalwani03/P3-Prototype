import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Fragment, useEffect, useMemo, useRef } from 'react'
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

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60)
  const seconds = Math.max(0, totalSeconds) % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
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

  const meanError = useMemo(() => {
    if (!results.length) return 0
    const totalError = results.reduce((acc, result) => acc + (result.estimatedTimeSec - result.realDurationSec), 0)
    return totalError / results.length
  }, [results])

  const averageActualDuration = useMemo(() => {
    if (!results.length) return 0
    const totalDuration = results.reduce((acc, result) => acc + result.realDurationSec, 0)
    return totalDuration / results.length
  }, [results])


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


  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl space-y-8 rounded-3xl border border-neutral-200 bg-white/95 p-8 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">{messages.result.badge}</p>
        <h2 className="font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          {messages.result.title}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-300">{messages.result.subtitle}</p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 text-brand-800 dark:border-brand-400/40 dark:bg-brand-400/10 dark:text-brand-200">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-400 dark:text-brand-200">
              {messages.result.participantLabel}
            </p>
            <p className="text-xl font-semibold">{participantId || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-400 dark:text-brand-200">
              {messages.result.meanErrorLabel}
            </p>
            <p className="text-xl font-semibold">
              {meanError > 0 ? '+' : ''}
              {meanError.toFixed(1)} {messages.result.secondsSuffix}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-400 dark:text-brand-200">
              {messages.result.actualDurationLabel}
            </p>
            <p className="text-xl font-semibold">{formatDuration(averageActualDuration)}</p>
          </div>
        </div>
      </div>

      {(consentSignedAt || participantName) && (
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400 dark:text-neutral-500">
              {messages.result.consentHeading}
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              {messages.result.consentSignedAt}: {formatDateTime(consentSignedAt)}
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              {messages.result.consentParticipantName}: {participantName?.trim() || '—'}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-neutral-200 text-sm dark:divide-neutral-700">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">{messages.result.table.condition}</th>
              <th className="px-4 py-3">{messages.result.table.estimate}</th>
              <th className="px-4 py-3">{messages.result.table.actualDuration}</th>
              <th className="px-4 py-3">{messages.result.table.confidence}</th>
              <th className="px-4 py-3">{messages.result.table.engagement}</th>
              <th className="px-4 py-3">{messages.result.table.difference}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {results.map((result) => {
              const diff = result.estimatedTimeSec - result.realDurationSec
              const immersionMean =
                (result.immersion1 + result.immersion2 + result.immersion3 + result.immersion4 + result.immersion5) / 5
              const engagementMean =
                (result.engagement1 + result.engagement2 + result.engagement3 + result.engagement4 + result.engagement5) / 5
              const overallEngagement = (immersionMean + engagementMean) / 2

              return (
                <Fragment key={result.condition}>
                  <tr className="hover:bg-brand-50/40 dark:hover:bg-brand-400/10">
                    <td className="px-4 py-3 font-medium capitalize text-neutral-800 dark:text-neutral-100">
                      {messages.media.conditionLabels[result.condition]}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-200">
                      {formatDuration(result.estimatedTimeSec)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {formatDuration(result.realDurationSec)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{result.confidence}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{overallEngagement.toFixed(1)}</td>
                    <td
                      className={clsx(
                        'px-4 py-3 font-semibold',
                        diff >= 0
                          ? 'text-emerald-600 dark:text-emerald-300'
                          : 'text-rose-600 dark:text-rose-300',
                      )}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff} {messages.result.secondsSuffix}
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onReset}>
          {messages.result.newParticipant}
        </Button>
        <Button variant="primary" size="lg" onClick={handleDownload} disabled={!csvContent}>
          {messages.result.downloadCsv}
        </Button>
      </div>
    </motion.section>
  )
}
