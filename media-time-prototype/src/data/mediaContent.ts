import type { LocalizedParagraphs, LocalizedText, MediaCondition } from '../types'

export const MEDIA_DURATION_SECONDS = 180

export interface MediaMeta {
  type: MediaCondition
  title: LocalizedText
  topic: LocalizedText
  description: LocalizedText
  url?: string
  poster?: string
  transcriptUrl?: string
  article?: {
    heading: LocalizedText
    paragraphs: LocalizedParagraphs
  }
}

export const MEDIA_SEQUENCE: MediaCondition[] = ['video', 'audio', 'text']

export const MEDIA_CONTENT: Record<MediaCondition, MediaMeta> = {
  video: {
    type: 'video',
    title: {
      en: 'Exploring Time Perception',
      de: 'Zeitwahrnehmung erforschen',
    },
    topic: {
      en: 'Cognitive Science',
      de: 'Kognitionswissenschaft',
    },
    description: {
      en: 'Short lecture-style explainer on how different media can stretch or compress our sense of time.',
      de: 'Kurzer Vortrag, der erklärt, wie unterschiedliche Medientypen unser Zeitgefühl dehnen oder stauchen können.',
    },
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  },
  audio: {
    type: 'audio',
    title: {
      en: 'Podcast: Time Slips',
      de: 'Podcast: Zeitverschiebungen',
    },
    topic: {
      en: 'Cognitive Science',
      de: 'Kognitionswissenschaft',
    },
    description: {
      en: 'Narrated podcast episode discussing the psychology of time estimation and media immersion.',
      de: 'Erzählter Podcast über die Psychologie der Zeitschätzung und mediale Immersion.',
    },
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  text: {
    type: 'text',
    title: {
      en: 'Article: When Minutes Stretch',
      de: 'Artikel: Wenn Minuten sich dehnen',
    },
    topic: {
      en: 'Cognitive Science',
      de: 'Kognitionswissenschaft',
    },
    description: {
      en: 'Structured article that walks through the same key ideas about attention, arousal, and perceived duration.',
      de: 'Strukturierter Artikel, der dieselben Kernideen zu Aufmerksamkeit, Erregung und wahrgenommener Dauer vermittelt.',
    },
    article: {
      heading: {
        en: 'Why Media Changes Our Sense of Time',
        de: 'Warum Medien unser Zeitgefühl verändern',
      },
      paragraphs: {
        en: [
          'Psychologists have long noted that time is a construction shaped by attention. When we focus deeply, minutes can disappear; when we monitor the clock, they refuse to budge. Media experiences exploit this malleability. Visual storytelling in particular demands that we track faces, gestures, and moving objects, leaving little bandwidth for the metronome in our minds.',
          'Audio experiences, by contrast, rely heavily on imagination. Podcast narratives often pace themselves around vivid sound design, inviting listeners to fill in scenes with their own mental imagery. This collaboration between narration and imagination can foster a sense of co-presence with the storyteller, which in turn alters our subjective duration.',
          'Reading occupies a curious middle ground. It is self-paced, yet the cadence of sentences and the layout of paragraphs cue how quickly we progress. When typography is comfortable and the text is structured with meaningful subheadings, readers reach a state of flow. The moment that flow breaks—perhaps due to unfamiliar jargon or dense formatting—the internal clock resurfaces.',
          'The experiment you are about to complete compares these three modalities under tightly controlled conditions. Each version shares identical key points about the science of time perception. By measuring your estimated duration, your confidence, and your subjective engagement, researchers can map how modality-specific attention shapes the temporal illusions we feel every day.',
        ],
        de: [
          'Psychologinnen und Psychologen beobachten seit Langem, dass Zeit ein Konstrukt ist, das von Aufmerksamkeit geformt wird. Wenn wir tief fokussiert sind, verfliegen Minuten; wenn wir die Uhr beobachten, vergeht die Zeit quälend langsam. Medienerlebnisse nutzen diese Formbarkeit. Vor allem visuelles Erzählen zwingt uns, Gesichter, Gesten und Bewegungen nachzuverfolgen – für das innere Metronom bleibt kaum Spielraum.',
          'Audioerfahrungen stützen sich dagegen stark auf unsere Vorstellungskraft. Podcast-Erzählungen orientieren ihr Tempo häufig an lebhaften Klangwelten und laden Zuhörerinnen und Zuhörer ein, Szenen mit eigenen Bildern aufzufüllen. Diese Zusammenarbeit von Erzählung und Imagination schafft ein Gefühl der Mit-Präsenz, das wiederum unsere subjektive Dauer verändert.',
          'Lesen nimmt eine besondere Mittelposition ein. Wir bestimmen das Tempo selbst, doch Satzrhythmus und Absatzgestaltung signalisieren, wie schnell wir vorankommen. Stimmt die Typografie und ist der Text sinnvoll gegliedert, geraten Leserinnen und Leser in einen Flow. Bricht dieser Flow – vielleicht durch Fremdwörter oder dichte Layouts – tritt die innere Uhr sofort wieder hervor.',
          'Das Experiment, das Sie gleich absolvieren, vergleicht diese drei Modalitäten unter streng kontrollierten Bedingungen. Jede Version vermittelt identische Kernaussagen zur Wissenschaft der Zeitwahrnehmung. Indem wir Ihre geschätzte Dauer, Ihr Vertrauen und Ihre subjektive Beteiligung messen, lässt sich kartieren, wie aufmerksamkeitsspezifische Faktoren die zeitlichen Illusionen unseres Alltags formen.',
        ],
      },
    },
  },
}
