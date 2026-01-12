import type { ConditionResult } from '../types'

interface CsvExportData {
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
}

function escapeCsvValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export function resultsToCsv(results: ConditionResult[]): string {
  if (!results.length) return ''
  const headers = [
    'participantId',
    'condition',
    'realDurationSec',
    'estimatedTimeSec',
    'confidence',
    'immersion1',
    'immersion2',
    'immersion3',
    'immersion4',
    'immersion5',
    'engagement1',
    'engagement2',
    'engagement3',
    'engagement4',
    'engagement5',
    'familiarity',
    'timestamp',
  ]

  const lines = results.map((result) => {
    const row = result as unknown as Record<string, unknown>
    return headers.map((header) => escapeCsvValue(row[header])).join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}

export function resultsToFullCsv(data: CsvExportData): string {
  if (!data.results.length) return ''
  
  // Remove duplicates based on condition and timestamp
  const uniqueResults = data.results.reduce((acc, result) => {
    const existing = acc.find(
      (r) => r.condition === result.condition && r.timestamp === result.timestamp
    )
    if (!existing) {
      acc.push(result)
    }
    return acc
  }, [] as ConditionResult[])

  const headers = [
    'Participant ID',
    'Participant Name',
    'Consent Signed At',
    'Age',
    'Short Videos Frequency',
    'Audio Frequency',
    'Text Frequency',
    'Caffeine Consumed',
    'Caffeine Time Ago',
    'Alertness',
    'Condition',
    'Real Duration (sec)',
    'Estimated Duration (sec)',
    'Temporal Bias (sec)',
    'Confidence',
    'Immersion 1',
    'Immersion 2',
    'Immersion 3',
    'Immersion 4',
    'Immersion 5',
    'Immersion Mean',
    'Engagement 1',
    'Engagement 2',
    'Engagement 3',
    'Engagement 4',
    'Engagement 5',
    'Engagement Mean',
    'Overall Engagement',
    'Familiarity',
    'Timestamp',
  ]

  const lines = uniqueResults.map((result) => {
    const temporalBias = result.estimatedTimeSec - result.realDurationSec
    const immersionMean =
      (result.immersion1 + result.immersion2 + result.immersion3 + result.immersion4 + result.immersion5) / 5
    const engagementMean =
      (result.engagement1 + result.engagement2 + result.engagement3 + result.engagement4 + result.engagement5) / 5
    const overallEngagement = (immersionMean + engagementMean) / 2

    return [
      escapeCsvValue(data.participantId),
      escapeCsvValue(data.participantName || ''),
      escapeCsvValue(data.consentSignedAt || ''),
      escapeCsvValue(data.demographicData?.age || ''),
      escapeCsvValue(data.demographicData?.shortVideosFrequency || ''),
      escapeCsvValue(data.demographicData?.audioFrequency || ''),
      escapeCsvValue(data.demographicData?.textFrequency || ''),
      escapeCsvValue(data.demographicData?.caffeineConsumed !== undefined ? (data.demographicData.caffeineConsumed ? 'Yes' : 'No') : ''),
      escapeCsvValue(data.demographicData?.caffeineTimeAgo || ''),
      escapeCsvValue(data.demographicData?.alertness || ''),
      escapeCsvValue(result.condition),
      escapeCsvValue(result.realDurationSec),
      escapeCsvValue(result.estimatedTimeSec),
      escapeCsvValue(temporalBias),
      escapeCsvValue(result.confidence),
      escapeCsvValue(result.immersion1),
      escapeCsvValue(result.immersion2),
      escapeCsvValue(result.immersion3),
      escapeCsvValue(result.immersion4),
      escapeCsvValue(result.immersion5),
      escapeCsvValue(immersionMean.toFixed(2)),
      escapeCsvValue(result.engagement1),
      escapeCsvValue(result.engagement2),
      escapeCsvValue(result.engagement3),
      escapeCsvValue(result.engagement4),
      escapeCsvValue(result.engagement5),
      escapeCsvValue(engagementMean.toFixed(2)),
      escapeCsvValue(overallEngagement.toFixed(2)),
      escapeCsvValue(result.familiarity),
      escapeCsvValue(result.timestamp),
    ].join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}
