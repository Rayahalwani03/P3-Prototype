import { Fragment, useMemo } from 'react'
import clsx from 'clsx'
import type { ConditionResult, Demographics } from '../types'
import { Button } from './shared/Button'
import { resultsToCsv } from '../lib/csv'
import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'

function formatDurationRange(results: ConditionResult[]): string {
  if (!results.length) return '—'
  const durations = results.map((r) => r.realDurationSec)
  const min = Math.min(...durations)
  const max = Math.max(...durations)
  const formatSingle = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }
  if (min === max) {
    return formatSingle(min)
  }
  return `${formatSingle(min)} – ${formatSingle(max)}`
}

interface ResultExportProps {
  results: ConditionResult[]
  participantId: string
  participantName?: string
  consentSignatureDataUrl?: string
  consentSignedAt?: string
  demographics?: Demographics
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
  consentSignatureDataUrl,
  consentSignedAt,
  demographics,
  onReset,
}: ResultExportProps) {
  const { messages } = useSettings()
  const csvContent = useMemo(() => resultsToCsv(results, demographics), [results, demographics])

  const meanError = useMemo(() => {
    if (!results.length) return 0
    const totalError = results.reduce((acc, result) => acc + (result.estimatedTimeSec - result.realDurationSec), 0)
    return totalError / results.length
  }, [results])

  const hasQualitativeFeedback = useMemo(
    () => results.some((result) => result.qualitativeFeedback && result.qualitativeFeedback.trim().length > 0),
    [results],
  )

  const handleDownload = () => {
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
  }

  const handleDownloadSignature = () => {
    if (!consentSignatureDataUrl) return
    const link = document.createElement('a')
    link.href = consentSignatureDataUrl
    const timestamp = new Date().toISOString().split('T')[0]
    link.download = `consent-signature-${participantId || 'unknown'}-${timestamp}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <p className="text-xl font-semibold">{formatDurationRange(results)}</p>
          </div>
        </div>
      </div>

      {(consentSignatureDataUrl || consentSignedAt || participantName) && (
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            {consentSignatureDataUrl && (
              <Button type="button" variant="ghost" onClick={handleDownloadSignature}>
                {messages.result.downloadSignature}
              </Button>
            )}
          </div>
          {consentSignatureDataUrl ? (
            <div className="overflow-hidden rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-950">
              <img
                src={consentSignatureDataUrl}
                alt={messages.result.signatureAlt}
                className="h-32 w-full object-contain p-4"
              />
            </div>
          ) : (
            <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
              {messages.result.missingSignature}
            </p>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-neutral-200 text-sm dark:divide-neutral-700">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">{messages.result.table.condition}</th>
              <th className="px-4 py-3">{messages.result.table.estimate}</th>
              <th className="px-4 py-3">{messages.result.table.confidence}</th>
              <th className="px-4 py-3">{messages.result.table.engagement}</th>
              <th className="px-4 py-3">{messages.result.table.difference}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
            {results.map((result) => {
              const diff = result.estimatedTimeSec - result.realDurationSec
              const engagementMean = (
                result.absorption + result.enjoyment + result.attention + result.effort + result.lostTrackOfTime
              ) / 5

              return (
                <Fragment key={result.condition}>
                  <tr className="hover:bg-brand-50/40 dark:hover:bg-brand-400/10">
                    <td className="px-4 py-3 font-medium capitalize text-neutral-800 dark:text-neutral-100">
                      {messages.media.conditionLabels[result.condition]}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-200">
                      {formatDuration(result.estimatedTimeSec)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{result.confidence}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{engagementMean.toFixed(1)}</td>
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

      {hasQualitativeFeedback && (
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-500 dark:text-brand-300">
              {messages.result.qualitativeHeading}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.result.qualitativeTitle}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{messages.result.qualitativeSubtitle}</p>
          </div>
          <div className="space-y-3">
            {results
              .filter((result) => result.qualitativeFeedback && result.qualitativeFeedback.trim().length > 0)
              .map((result) => (
                <article
                  key={`${result.condition}-qualitative`}
                  className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">
                    <span>{messages.media.conditionLabels[result.condition]}</span>
                    <span>{formatDateTime(result.timestamp)}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{result.qualitativeFeedback}</p>
                </article>
              ))}
          </div>
        </div>
      )}

      {/* Debriefing Section */}
      <div className="space-y-4 rounded-2xl border border-brand-100 bg-brand-50/30 p-6 shadow-sm dark:border-brand-400/30 dark:bg-brand-400/5">
        <h3 className="font-display text-2xl font-semibold text-brand-800 dark:text-brand-200">
          {messages.result.debriefingHeading}
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {messages.result.debriefingParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
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
