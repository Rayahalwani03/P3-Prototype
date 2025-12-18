export type MediaCondition = 'video' | 'audio' | 'text'

export type Language = 'en' | 'de'

export type ThemeMode = 'light' | 'dark'

export type LocalizedText = Record<Language, string>

export type LocalizedParagraphs = Record<Language, string[]>

export type MediaUsageFrequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'daily'

export interface Demographics {
  age: number
  videoUsage: MediaUsageFrequency
  podcastUsage: MediaUsageFrequency
  textUsage: MediaUsageFrequency
  caffeineToday: boolean
  caffeineAmount?: string
}

export interface ConditionResult {
  participantId: string
  condition: MediaCondition
  realDurationSec: number
  estimatedTimeSec: number
  confidence: number
  absorption: number
  enjoyment: number
  attention: number
  effort: number
  lostTrackOfTime: number
  mindWandering: number
  arousal: number
  familiarity: number
  qualitativeFeedback: string
  timestamp: string
}

export type LikertScale = 1 | 2 | 3 | 4 | 5 | 6 | 7
