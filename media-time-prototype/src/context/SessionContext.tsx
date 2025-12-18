import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { MEDIA_CONTENT, MEDIA_SEQUENCE, MEDIA_DURATION_SECONDS } from '../data/mediaContent'
import type { MediaMeta } from '../data/mediaContent'
import type { ConditionResult, Demographics, MediaCondition } from '../types'
import { shuffle } from '../lib/array'
import { clearStorage, readFromStorage, writeToStorage } from '../lib/storage'

const STORAGE_KEY = 'mtp_session_state_v1'

interface SessionState {
  participantId: string
  consentGiven: boolean
  participantName: string
  consentSignatureDataUrl?: string
  consentSignedAt?: string
  demographics?: Demographics
  demographicsCompleted: boolean
  conditionOrder: MediaCondition[]
  currentIndex: number
  results: ConditionResult[]
  startedAt?: string
  textReadingStartedAt?: string
}

interface StartSessionPayload {
  participantId: string
  participantName: string
  consentSignatureDataUrl: string
  consentSignedAt: string
}

interface SessionContextValue {
  hydrated: boolean
  participantId: string
  consentGiven: boolean
  participantName: string
  consentSignatureDataUrl?: string
  consentSignedAt?: string
  demographics?: Demographics
  demographicsCompleted: boolean
  conditionOrder: MediaCondition[]
  currentIndex: number
  currentCondition: MediaCondition | null
  results: ConditionResult[]
  isSessionActive: boolean
  isSessionComplete: boolean
  textReadingStartedAt?: string
  startSession: (payload: StartSessionPayload) => void
  setDemographics: (demographics: Demographics) => void
  submitResult: (result: Omit<ConditionResult, 'participantId' | 'condition' | 'timestamp'> & { realDurationSec?: number }) => void
  markConsent: (value: boolean) => void
  resetSession: () => void
  getConditionByIndex: (index: number) => MediaCondition | null
  getMediaMeta: (condition: MediaCondition) => MediaMeta
  startTextReading: () => void
}

const defaultState: SessionState = {
  participantId: '',
  consentGiven: false,
  participantName: '',
  consentSignatureDataUrl: undefined,
  consentSignedAt: undefined,
  demographics: undefined,
  demographicsCompleted: false,
  conditionOrder: [],
  currentIndex: 0,
  results: [],
  textReadingStartedAt: undefined,
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(defaultState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readFromStorage<SessionState>(STORAGE_KEY)
    if (stored) {
      setState((prev) => ({
        ...prev,
        ...stored,
        participantName: stored.participantName ?? '',
      }))
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeToStorage(STORAGE_KEY, state)
  }, [hydrated, state])

  const currentCondition = useMemo<MediaCondition | null>(() => {
    if (!state.conditionOrder.length) return null
    if (state.currentIndex >= state.conditionOrder.length) return null
    return state.conditionOrder[state.currentIndex]
  }, [state])

  const isSessionActive = Boolean(state.participantId && state.conditionOrder.length)
  const isSessionComplete =
    isSessionActive && state.results.length === state.conditionOrder.length && state.conditionOrder.length > 0

  const startSession = useCallback(
    ({ participantId, participantName, consentSignatureDataUrl, consentSignedAt }: StartSessionPayload) => {
      const randomizedOrder = shuffle(MEDIA_SEQUENCE)
      const newState: SessionState = {
        participantId,
        consentGiven: true,
        participantName,
        consentSignatureDataUrl,
        consentSignedAt,
        demographics: undefined,
        demographicsCompleted: false,
        conditionOrder: randomizedOrder,
        currentIndex: 0,
        results: [],
        startedAt: new Date().toISOString(),
        textReadingStartedAt: undefined,
      }
      setState(newState)
    },
    [setState],
  )

  const submitResult = useCallback<SessionContextValue['submitResult']>(
    (resultPayload) => {
      setState((prev) => {
        if (!prev.conditionOrder.length) {
          return prev
        }
        const condition = prev.conditionOrder[Math.min(prev.currentIndex, prev.conditionOrder.length - 1)]
        const actualDuration = resultPayload.realDurationSec ?? MEDIA_DURATION_SECONDS
        const fullResult: ConditionResult = {
          participantId: prev.participantId,
          condition,
          realDurationSec: actualDuration,
          timestamp: new Date().toISOString(),
          estimatedTimeSec: resultPayload.estimatedTimeSec,
          confidence: resultPayload.confidence,
          absorption: resultPayload.absorption,
          enjoyment: resultPayload.enjoyment,
          attention: resultPayload.attention,
          effort: resultPayload.effort,
          lostTrackOfTime: resultPayload.lostTrackOfTime,
          mindWandering: resultPayload.mindWandering,
          arousal: resultPayload.arousal,
          familiarity: resultPayload.familiarity,
          qualitativeFeedback: resultPayload.qualitativeFeedback,
        }
        const updatedResults = [...prev.results.filter((entry) => entry.condition !== condition), fullResult]
        const nextIndex = Math.min(prev.currentIndex + 1, prev.conditionOrder.length)
        return { ...prev, results: updatedResults, currentIndex: nextIndex, textReadingStartedAt: undefined }
      })
    },
    [setState],
  )

  const markConsent = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, consentGiven: value }))
  }, [])

  const setDemographics = useCallback((demographics: Demographics) => {
    setState((prev) => ({ ...prev, demographics, demographicsCompleted: true }))
  }, [])

  const startTextReading = useCallback(() => {
    setState((prev) => ({ ...prev, textReadingStartedAt: new Date().toISOString() }))
  }, [])

  const resetSession = useCallback(() => {
    setState({ ...defaultState })
    clearStorage(STORAGE_KEY)
  }, [])

  const getConditionByIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= state.conditionOrder.length) return null
      return state.conditionOrder[index]
    },
    [state.conditionOrder],
  )

  const getMediaMeta = useCallback(
    (condition: MediaCondition) => {
      return MEDIA_CONTENT[condition]
    },
    [],
  )

  const value: SessionContextValue = {
    hydrated,
    participantId: state.participantId,
    consentGiven: state.consentGiven,
    participantName: state.participantName,
    consentSignatureDataUrl: state.consentSignatureDataUrl,
    consentSignedAt: state.consentSignedAt,
    demographics: state.demographics,
    demographicsCompleted: state.demographicsCompleted,
    conditionOrder: state.conditionOrder,
    currentIndex: state.currentIndex,
    currentCondition,
    results: state.results,
    isSessionActive,
    isSessionComplete,
    textReadingStartedAt: state.textReadingStartedAt,
    startSession,
    setDemographics,
    submitResult,
    markConsent,
    resetSession,
    getConditionByIndex,
    getMediaMeta,
    startTextReading,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
