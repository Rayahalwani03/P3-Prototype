import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/shared/Button'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useSession } from '../context/SessionContext'
import { useSettings } from '../context/SettingsContext'
import type { Demographics, MediaUsageFrequency } from '../types'

const frequencyOptions: MediaUsageFrequency[] = ['never', 'rarely', 'sometimes', 'often', 'daily']

export function DemographicsScreen() {
  const navigate = useNavigate()
  const { hydrated, isSessionActive, demographicsCompleted, setDemographics } = useSession()
  const { messages, t } = useSettings()
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [age, setAge] = useState<string>('')
  const [videoUsage, setVideoUsage] = useState<MediaUsageFrequency | null>(null)
  const [podcastUsage, setPodcastUsage] = useState<MediaUsageFrequency | null>(null)
  const [textUsage, setTextUsage] = useState<MediaUsageFrequency | null>(null)
  const [caffeineToday, setCaffeineToday] = useState<boolean | null>(null)
  const [caffeineAmount, setCaffeineAmount] = useState('')

  useEffect(() => {
    if (!hydrated) return
    if (!isSessionActive) {
      navigate('/')
      return
    }
    if (demographicsCompleted) {
      navigate('/instructions')
    }
  }, [hydrated, isSessionActive, demographicsCompleted, navigate])

  const handleSubmit = () => {
    const ageNum = parseInt(age, 10)
    if (!age || Number.isNaN(ageNum) || ageNum < 18) {
      setError(messages.demographics.ageRequired)
      return
    }
    if (!videoUsage) {
      setError(messages.demographics.videoUsageRequired)
      return
    }
    if (!podcastUsage) {
      setError(messages.demographics.podcastUsageRequired)
      return
    }
    if (!textUsage) {
      setError(messages.demographics.textUsageRequired)
      return
    }
    if (caffeineToday === null) {
      setError(messages.demographics.caffeineRequired)
      return
    }
    setError(null)

    const demographics: Demographics = {
      age: ageNum,
      videoUsage,
      podcastUsage,
      textUsage,
      caffeineToday,
      caffeineAmount: caffeineToday ? caffeineAmount : undefined,
    }

    setDemographics(demographics)
    setTransitioning(true)
    window.setTimeout(() => {
      navigate('/instructions')
    }, 500)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 px-4 py-16 transition-colors duration-300 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {transitioning && <LoadingOverlay message={t('loading.loadingInstructions')} />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-3xl space-y-8 rounded-3xl border border-neutral-200 bg-white/95 p-10 shadow-soft backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80"
      >
        <header className="space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-300">
            {messages.demographics.badge}
          </span>
          <h1 className="font-display text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            {messages.demographics.title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">{messages.demographics.intro}</p>
        </header>

        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          {/* Age */}
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {messages.demographics.ageLabel}
            </label>
            <input
              id="age"
              type="number"
              min={18}
              max={120}
              value={age}
              onChange={(event) => {
                setAge(event.target.value)
                if (error) setError(null)
              }}
              className="w-full max-w-xs rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              placeholder={messages.demographics.agePlaceholder}
              required
            />
          </div>

          {/* Media Habits */}
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 dark:border-neutral-700 dark:bg-neutral-900/70">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {messages.demographics.mediaHabitsHeading}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {messages.demographics.mediaHabitsDescription}
              </p>
            </div>

            <div className="space-y-4">
              {/* Video Usage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {messages.demographics.videoUsageLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {frequencyOptions.map((option) => (
                    <button
                      key={`video-${option}`}
                      type="button"
                      onClick={() => setVideoUsage(option)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        videoUsage === option
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-brand-400'
                      }`}
                    >
                      {messages.demographics.frequencyOptions[option]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Podcast Usage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {messages.demographics.podcastUsageLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {frequencyOptions.map((option) => (
                    <button
                      key={`podcast-${option}`}
                      type="button"
                      onClick={() => setPodcastUsage(option)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        podcastUsage === option
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-brand-400'
                      }`}
                    >
                      {messages.demographics.frequencyOptions[option]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Usage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {messages.demographics.textUsageLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {frequencyOptions.map((option) => (
                    <button
                      key={`text-${option}`}
                      type="button"
                      onClick={() => setTextUsage(option)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        textUsage === option
                          ? 'bg-brand-600 text-white dark:bg-brand-500'
                          : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-brand-400'
                      }`}
                    >
                      {messages.demographics.frequencyOptions[option]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Caffeine */}
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 dark:border-neutral-700 dark:bg-neutral-900/70">
            <h2 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {messages.demographics.caffeineHeading}
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {messages.demographics.caffeineLabel}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCaffeineToday(true)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                    caffeineToday === true
                      ? 'bg-brand-600 text-white dark:bg-brand-500'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-brand-400'
                  }`}
                >
                  {messages.demographics.caffeineYes}
                </button>
                <button
                  type="button"
                  onClick={() => setCaffeineToday(false)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                    caffeineToday === false
                      ? 'bg-brand-600 text-white dark:bg-brand-500'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-brand-400'
                  }`}
                >
                  {messages.demographics.caffeineNo}
                </button>
              </div>
            </div>

            {caffeineToday === true && (
              <div className="space-y-2">
                <label htmlFor="caffeineAmount" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {messages.demographics.caffeineAmountLabel}
                </label>
                <input
                  id="caffeineAmount"
                  type="text"
                  value={caffeineAmount}
                  onChange={(event) => setCaffeineAmount(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  placeholder={messages.demographics.caffeineAmountPlaceholder}
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {messages.demographics.continueButton}
            </Button>
          </div>
        </form>
      </motion.main>
    </div>
  )
}

