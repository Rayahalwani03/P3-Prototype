import type { ConditionResult } from '../types'

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
    return headers
      .map((header) => {
        const value = row[header]
        if (value === undefined || value === null) {
          return ''
        }
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}
