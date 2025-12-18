import type { ConditionResult, Demographics } from '../types'

function escapeValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export function resultsToCsv(results: ConditionResult[], demographics?: Demographics): string {
  if (!results.length) return ''

  const headers = [
    'participantId',
    'condition',
    'realDurationSec',
    'estimatedTimeSec',
    'temporalBias',
    'confidence',
    'absorption',
    'enjoyment',
    'attention',
    'effort',
    'lostTrackOfTime',
    'mindWandering',
    'arousal',
    'familiarity',
    'qualitativeFeedback',
    'timestamp',
    // Demographics columns
    'age',
    'videoUsage',
    'podcastUsage',
    'textUsage',
    'caffeineToday',
    'caffeineAmount',
  ]

  const lines = results.map((result) => {
    const temporalBias = result.estimatedTimeSec - result.realDurationSec
    const row: Record<string, unknown> = {
      ...result,
      temporalBias,
      age: demographics?.age,
      videoUsage: demographics?.videoUsage,
      podcastUsage: demographics?.podcastUsage,
      textUsage: demographics?.textUsage,
      caffeineToday: demographics?.caffeineToday,
      caffeineAmount: demographics?.caffeineAmount,
    }
    return headers.map((header) => escapeValue(row[header])).join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}
