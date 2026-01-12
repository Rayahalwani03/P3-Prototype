import type { ReactNode } from 'react'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type { MediaMeta } from '../data/mediaContent'
import { MEDIA_CONTENT, MEDIA_DURATION_SECONDS, MEDIA_SEQUENCE } from '../data/mediaContent'
import { shuffle } from '../lib/array'
import { clearStorage, readFromStorage, writeToStorage } from '../lib/storage'
import type { ConditionResult, MediaCondition } from '../types'

const STORAGE_KEY = 'mtp_session_state_v1'

interface SessionState {
  participantId: string
  consentGiven: boolean
  participantName: string
  consentSignatureDataUrl?: string
  consentSignedAt?: string
  conditionOrder: MediaCondition[]
  currentIndex: number
  results: ConditionResult[]
  startedAt?: string
  readingDurationSec?: number
}

interface StartSessionPayload {
  participantId: string
  participantName: string
  consentSignedAt: string
  consentSignatureDataUrl?: string
}

interface SessionContextValue {
  hydrated: boolean
  participantId: string
  consentGiven: boolean
  participantName: string
  consentSignatureDataUrl?: string
  consentSignedAt?: string
  conditionOrder: MediaCondition[]
  currentIndex: number
  currentCondition: MediaCondition | null
  results: ConditionResult[]
  isSessionActive: boolean
  isSessionComplete: boolean
  startSession: (payload: StartSessionPayload) => void
  submitResult: (result: Omit<ConditionResult, 'participantId' | 'condition' | 'realDurationSec' | 'timestamp'>) => void
  markConsent: (value: boolean) => void
  resetSession: () => void
  getConditionByIndex: (index: number) => MediaCondition | null
  getMediaMeta: (condition: MediaCondition) => MediaMeta
  setReadingStartTime: (durationSec: number) => void
}

const defaultState: SessionState = {
  participantId: '',
  consentGiven: false,
  participantName: '',
  consentSignatureDataUrl: undefined,
  consentSignedAt: undefined,
  conditionOrder: [],
  currentIndex: 0,
  results: [],
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
    ({ participantId, participantName, consentSignedAt, consentSignatureDataUrl }: StartSessionPayload) => {
      const randomizedOrder = shuffle(MEDIA_SEQUENCE)
      const newState: SessionState = {
        participantId,
        consentGiven: true,
        participantName,
        consentSignedAt,
        consentSignatureDataUrl,
        conditionOrder: randomizedOrder,
        currentIndex: 0,
        results: [],
        startedAt: new Date().toISOString(),
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
        // Use reading duration for text condition, fixed duration for video/audio
        const realDurationSec = condition === 'text' && prev.readingDurationSec 
          ? prev.readingDurationSec 
          : MEDIA_DURATION_SECONDS
        const fullResult: ConditionResult = {
          participantId: prev.participantId,
          condition,
          realDurationSec,
          timestamp: new Date().toISOString(),
          ...resultPayload,
        }
        const updatedResults = [...prev.results.filter((entry) => entry.condition !== condition), fullResult]
        const nextIndex = Math.min(prev.currentIndex + 1, prev.conditionOrder.length)
        return { ...prev, results: updatedResults, currentIndex: nextIndex, readingDurationSec: undefined }
      })
    },
    [setState],
  )

  const setReadingStartTime = useCallback((durationSec: number) => {
    setState((prev) => ({ ...prev, readingDurationSec: durationSec }))
  }, [])

  const markConsent = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, consentGiven: value }))
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
    conditionOrder: state.conditionOrder,
    currentIndex: state.currentIndex,
    currentCondition,
    results: state.results,
    isSessionActive,
    isSessionComplete,
    startSession,
    submitResult,
    markConsent,
    resetSession,
    getConditionByIndex,
    getMediaMeta,
    setReadingStartTime,
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
