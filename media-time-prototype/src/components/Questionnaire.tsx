import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import { Button } from './shared/Button'
import type { LikertScale } from '../types'
import { useSettings } from '../context/SettingsContext'

export interface QuestionnaireSubmitPayload {
  estimatedTimeSec: number
  confidence: LikertScale
  absorption: LikertScale
  enjoyment: LikertScale
  attention: LikertScale
  effort: LikertScale
  lostTrackOfTime: LikertScale
  mindWandering: LikertScale
  arousal: LikertScale
  familiarity: LikertScale
  qualitativeFeedback: string
}

interface QuestionnaireProps {
  onSubmit: (values: QuestionnaireSubmitPayload) => Promise<void> | void
  isSubmitting?: boolean
}

interface QuestionnaireFormValues {
  estimatedMinutes: number | ''
  estimatedSeconds: number | ''
  confidence: LikertScale | null
  absorption: LikertScale | null
  enjoyment: LikertScale | null
  attention: LikertScale | null
  effort: LikertScale | null
  lostTrackOfTime: LikertScale | null
  mindWandering: LikertScale | null
  arousal: LikertScale | null
  familiarity: LikertScale | null
  qualitativeFeedback: string
}

type LikertQuestionId = Exclude<keyof QuestionnaireSubmitPayload, 'estimatedTimeSec'>

interface LikertQuestion {
  id: LikertQuestionId
  labelKey: string
  leftKey: string
  rightKey: string
}

const likertScaleValues: LikertScale[] = [1, 2, 3, 4, 5, 6, 7]

const likertQuestions: LikertQuestion[] = [
  {
    id: 'confidence',
    labelKey: 'questionnaire.likert.confidence.label',
    leftKey: 'questionnaire.likert.confidence.left',
    rightKey: 'questionnaire.likert.confidence.right',
  },
  {
    id: 'absorption',
    labelKey: 'questionnaire.likert.absorption.label',
    leftKey: 'questionnaire.likert.absorption.left',
    rightKey: 'questionnaire.likert.absorption.right',
  },
  {
    id: 'enjoyment',
    labelKey: 'questionnaire.likert.enjoyment.label',
    leftKey: 'questionnaire.likert.enjoyment.left',
    rightKey: 'questionnaire.likert.enjoyment.right',
  },
  {
    id: 'attention',
    labelKey: 'questionnaire.likert.attention.label',
    leftKey: 'questionnaire.likert.attention.left',
    rightKey: 'questionnaire.likert.attention.right',
  },
  {
    id: 'effort',
    labelKey: 'questionnaire.likert.effort.label',
    leftKey: 'questionnaire.likert.effort.left',
    rightKey: 'questionnaire.likert.effort.right',
  },
  {
    id: 'lostTrackOfTime',
    labelKey: 'questionnaire.likert.lostTrackOfTime.label',
    leftKey: 'questionnaire.likert.lostTrackOfTime.left',
    rightKey: 'questionnaire.likert.lostTrackOfTime.right',
  },
  {
    id: 'mindWandering',
    labelKey: 'questionnaire.likert.mindWandering.label',
    leftKey: 'questionnaire.likert.mindWandering.left',
    rightKey: 'questionnaire.likert.mindWandering.right',
  },
  {
    id: 'arousal',
    labelKey: 'questionnaire.likert.arousal.label',
    leftKey: 'questionnaire.likert.arousal.left',
    rightKey: 'questionnaire.likert.arousal.right',
  },
  {
    id: 'familiarity',
    labelKey: 'questionnaire.likert.familiarity.label',
    leftKey: 'questionnaire.likert.familiarity.left',
    rightKey: 'questionnaire.likert.familiarity.right',
  },
]

const initialValues: QuestionnaireFormValues = {
  estimatedMinutes: '',
  estimatedSeconds: '',
  confidence: null,
  absorption: null,
  enjoyment: null,
  attention: null,
  effort: null,
  lostTrackOfTime: null,
  mindWandering: null,
  arousal: null,
  familiarity: null,
  qualitativeFeedback: '',
}

function parsePositiveInt(value: number | ''): number {
  if (value === '') return 0
  return Math.max(0, Math.floor(Number(value)))
}

export function Questionnaire({ onSubmit, isSubmitting = false }: QuestionnaireProps) {
  const { t, messages } = useSettings()
  const [values, setValues] = useState<QuestionnaireFormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => {
    const minutes = parsePositiveInt(values.estimatedMinutes)
    const seconds = parsePositiveInt(values.estimatedSeconds)
    const hasDuration = minutes > 0 || seconds > 0
    if (!hasDuration || seconds >= 60) {
      return false
    }
    const hasQualitative = values.qualitativeFeedback.trim().length > 0
    if (!hasQualitative) {
      return false
    }
    return likertQuestions.every((question) => values[question.id] !== null)
  }, [values])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const minutes = parsePositiveInt(values.estimatedMinutes)
    const seconds = parsePositiveInt(values.estimatedSeconds)
    const durationErrors: Record<string, string> = {}

    if (minutes === 0 && seconds === 0) {
      durationErrors.estimatedMinutes = messages.questionnaire.validation.positiveDuration
      durationErrors.estimatedSeconds = messages.questionnaire.validation.positiveDuration
    }

    if (seconds >= 60) {
      durationErrors.estimatedSeconds = messages.questionnaire.validation.secondsRange
    }

    const likertErrors: Record<string, string> = {}
    likertQuestions.forEach((question) => {
      if (values[question.id] === null) {
        likertErrors[question.id] = messages.questionnaire.validation.required
      }
    })

    const qualitativeError: Record<string, string> = {}
    if (!values.qualitativeFeedback.trim()) {
      qualitativeError.qualitativeFeedback = messages.questionnaire.validation.feedbackRequired
    }

    const combinedErrors = { ...durationErrors, ...likertErrors, ...qualitativeError }

    if (Object.keys(combinedErrors).length > 0) {
      setErrors(combinedErrors)
      return
    }

    setErrors({})
    const totalSeconds = minutes * 60 + seconds

    await onSubmit({
      estimatedTimeSec: totalSeconds,
      confidence: values.confidence!,
      absorption: values.absorption!,
      enjoyment: values.enjoyment!,
      attention: values.attention!,
      effort: values.effort!,
      lostTrackOfTime: values.lostTrackOfTime!,
      mindWandering: values.mindWandering!,
      arousal: values.arousal!,
      familiarity: values.familiarity!,
      qualitativeFeedback: values.qualitativeFeedback.trim(),
    })

    setValues(initialValues)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-neutral-200 bg-white/95 p-8 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
    >
      <div>
        <h2 className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
          {messages.questionnaire.timeHeading}
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">{messages.questionnaire.timeDescription}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {messages.questionnaire.minutesLabel}
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            aria-label={messages.questionnaire.minutesAria}
            value={values.estimatedMinutes}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                estimatedMinutes: event.target.value === '' ? '' : Number(event.target.value),
              }))
            }
            className={clsx(
              'w-full rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100',
              errors.estimatedMinutes && 'border-red-400 focus:ring-red-100 dark:border-red-500',
            )}
            placeholder={messages.questionnaire.minutesPlaceholder}
          />
          {errors.estimatedMinutes && <p className="text-sm text-red-500 dark:text-red-400">{errors.estimatedMinutes}</p>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {messages.questionnaire.secondsLabel}
          <input
            type="number"
            min={0}
            max={59}
            step={1}
            inputMode="numeric"
            aria-label={messages.questionnaire.secondsAria}
            value={values.estimatedSeconds}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                estimatedSeconds: event.target.value === '' ? '' : Number(event.target.value),
              }))
            }
            className={clsx(
              'w-full rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100',
              errors.estimatedSeconds && 'border-red-400 focus:ring-red-100 dark:border-red-500',
            )}
            placeholder={messages.questionnaire.secondsPlaceholder}
          />
          {errors.estimatedSeconds && <p className="text-sm text-red-500 dark:text-red-400">{errors.estimatedSeconds}</p>}
        </label>
      </div>

      <div className="grid gap-6">
        {likertQuestions.map((question) => (
          <div key={question.id} className="space-y-4">
            <div>
              <p className="text-base font-medium text-neutral-800 dark:text-neutral-100">{t(question.labelKey)}</p>
              <div className="mt-1 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-neutral-400 dark:text-neutral-500">
                <span>{t(question.leftKey)}</span>
                <span>{t(question.rightKey)}</span>
              </div>
            </div>
            <RadioGroup
              value={(values[question.id] ?? undefined) as LikertScale | undefined}
              onChange={(value: LikertScale) => setValues((prev) => ({ ...prev, [question.id]: value }))}
              className="grid grid-cols-7 gap-2"
            >
              {likertScaleValues.map((option) => (
                <RadioGroup.Option key={option} value={option}>
                  {({ checked }) => (
                    <button
                      type="button"
                      className={clsx(
                        'flex h-12 w-full items-center justify-center rounded-2xl border transition',
                        checked
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-400 dark:bg-brand-400/20 dark:text-brand-200'
                          : 'border-neutral-200 bg-white text-neutral-500 hover:border-brand-200 hover:text-brand-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-brand-400 dark:hover:text-brand-200',
                      )}
                    >
                      <span className="text-sm font-semibold">{option}</span>
                    </button>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
            {errors[question.id] && <p className="text-xs text-red-500 dark:text-red-400">{errors[question.id]}</p>}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
            {messages.questionnaire.qualitativeHeading}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">
            {messages.questionnaire.qualitativeDescription}
          </p>
        </div>
        <textarea
          rows={5}
          maxLength={2000}
          value={values.qualitativeFeedback}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              qualitativeFeedback: event.target.value,
            }))
          }
          className={clsx(
            'w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-base text-neutral-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100',
            errors.qualitativeFeedback && 'border-red-400 focus:ring-red-100 dark:border-red-500',
          )}
          placeholder={messages.questionnaire.qualitativePlaceholder}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{messages.questionnaire.qualitativeHelper}</span>
          <span>
            {values.qualitativeFeedback.length}/{2000}
          </span>
        </div>
        {errors.qualitativeFeedback && (
          <p className="text-sm text-red-500 dark:text-red-400">{errors.qualitativeFeedback}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" size="lg" loading={isSubmitting} disabled={!isValid || isSubmitting}>
          {messages.questionnaire.submit}
        </Button>
      </div>
    </form>
  )
}
