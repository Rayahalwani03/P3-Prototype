import type { Language } from '../types'

type TranslationTree = {
  settings: {
    languageLabel: string
    english: string
    german: string
    themeLabel: string
    light: string
    dark: string
    exitLabel: string
    exitConfirm: string
  }
  loading: {
    preparingNext: string
    loadingInstructions: string
    loadingFirstCondition: string
    loadingQuestionnaire: string
    savingResponses: string
    keepWindowOpen: string
  }
  welcome: {
    badge: string
    title: string
    description: string
    resumeWarning: string
    participantLabel: string
    participantPlaceholder: string
    nameLabel: string
    namePlaceholder: string
    nameHelper: string
    idHelper: string
    copyId: string
    copySuccess: string
    copyFailure: string
    regenerateId: string
    consentHeading: string
    consentParagraphs: string[]
    consentText: string
    nameRequired: string
    signatureLabel: string
    signatureHelper: string
    signatureClear: string
    signatureRequired: string
    stats: string
    startButton: string
    idRequired: string
    consentRequired: string
  }
  demographics: {
    badge: string
    title: string
    intro: string
    ageLabel: string
    agePlaceholder: string
    ageRequired: string
    mediaHabitsHeading: string
    mediaHabitsDescription: string
    videoUsageLabel: string
    podcastUsageLabel: string
    textUsageLabel: string
    videoUsageRequired: string
    podcastUsageRequired: string
    textUsageRequired: string
    frequencyOptions: {
      never: string
      rarely: string
      sometimes: string
      often: string
      daily: string
    }
    caffeineHeading: string
    caffeineLabel: string
    caffeineYes: string
    caffeineNo: string
    caffeineRequired: string
    caffeineAmountLabel: string
    caffeineAmountPlaceholder: string
    continueButton: string
  }
  instructions: {
    badge: string
    title: string
    intro: string
    points: string[]
    readyLabel: string
    checklist: string
    startButton: string
  }
  media: {
    participantLabel: string
    conditionProgress: string
    focusReminder: string
    stalledMessage: string
    errorMessage: string
    audioBadge: string
    audioInnerLabel: string
    skipButton: string
    textReadingNote: string
    doneReadingButton: string
    conditionLabels: Record<'video' | 'audio' | 'text', string>
  }
  questionnaireScreen: {
    badge: string
    title: string
    intro: string
  }
  questionnaire: {
    timeHeading: string
    timeDescription: string
    minutesLabel: string
    secondsLabel: string
    minutesPlaceholder: string
    secondsPlaceholder: string
    minutesAria: string
    secondsAria: string
    qualitativeHeading: string
    qualitativeDescription: string
    qualitativePlaceholder: string
    qualitativeHelper: string
    submit: string
    validation: {
      positiveDuration: string
      secondsRange: string
      required: string
      feedbackRequired: string
    }
    likert: {
      confidence: {
        label: string
        left: string
        right: string
      }
      absorption: {
        label: string
        left: string
        right: string
      }
      enjoyment: {
        label: string
        left: string
        right: string
      }
      attention: {
        label: string
        left: string
        right: string
      }
      effort: {
        label: string
        left: string
        right: string
      }
      lostTrackOfTime: {
        label: string
        left: string
        right: string
      }
      mindWandering: {
        label: string
        left: string
        right: string
      }
      arousal: {
        label: string
        left: string
        right: string
      }
      familiarity: {
        label: string
        left: string
        right: string
      }
    }
  }
  result: {
    badge: string
    title: string
    subtitle: string
    participantLabel: string
    meanErrorLabel: string
    actualDurationLabel: string
    consentHeading: string
    consentSignedAt: string
    consentParticipantName: string
    downloadSignature: string
    signatureAlt: string
    missingSignature: string
    qualitativeHeading: string
    qualitativeTitle: string
    qualitativeSubtitle: string
    debriefingHeading: string
    debriefingParagraphs: string[]
    table: {
      condition: string
      estimate: string
      confidence: string
      engagement: string
      difference: string
    }
    newParticipant: string
    downloadCsv: string
    closingReminder: string
    secondsSuffix: string
  }
}

export const translations: Record<Language, TranslationTree> = {
  en: {
    settings: {
      languageLabel: 'Language',
      english: 'English',
      german: 'Deutsch',
      themeLabel: 'Theme',
      light: 'Light',
      dark: 'Dark',
      exitLabel: 'Exit study',
      exitConfirm: 'Exit the study? Unsaved progress will be cleared and you will return to the welcome screen.',
    },
    loading: {
      preparingNext: 'Preparing next condition…',
      loadingInstructions: 'Loading instructions…',
      loadingFirstCondition: 'Loading first condition…',
      loadingQuestionnaire: 'Loading questionnaire…',
      savingResponses: 'Saving responses…',
      keepWindowOpen: 'Please keep the window open.',
    },
    welcome: {
      badge: 'Time Perception Study',
      title: 'Media Time Perception Prototype',
      description:
        'Welcome! You will experience three short media pieces on the same topic. After each one, you will estimate its duration and rate your engagement. The study takes approximately 12 minutes. Please silence notifications and ensure your device battery is sufficient before starting.',
      resumeWarning:
        'An active session for participant {{id}} was found. Starting again will overwrite the previous session data stored on this device.',
      participantLabel: 'Participant ID',
      participantPlaceholder: 'Enter assigned ID',
      nameLabel: 'Full name',
      namePlaceholder: 'First and last name',
      nameHelper: 'Used only for the consent record. It will not appear in exported data.',
      idHelper: 'Share this anonymized identifier with the participant; it appears in exports only.',
      copyId: 'Copy ID',
      copySuccess: 'Copied!',
      copyFailure: 'Copy unavailable',
      regenerateId: 'Generate new ID',
      consentHeading: 'Research consent summary',
      consentParagraphs: [
        'This prototype is part of a research study that examines how people perceive time across different media formats.',
        'You will experience three media conditions on the same topic. Each lasts three minutes and is followed by a short questionnaire about your impressions and time estimate.',
        'Your full name is stored only with this consent record. Exported data contains the anonymized participant ID only.',
        'Participation is voluntary. You may withdraw at any time by selecting the Exit option; any responses not yet exported will be removed from this device.',
      ],
      consentText: 'I have read the consent summary above and agree to participate in this prototype study.',
      nameRequired: 'Full name is required.',
      consentRequired: 'Consent is required before continuing.',
      signatureLabel: 'Please sign to confirm your consent',
      signatureHelper: 'Use a mouse, trackpad, or touch input to draw your signature. Clear it if you need to try again.',
      signatureClear: 'Clear signature',
      signatureRequired: 'A signature is required before continuing.',
      stats: '3 conditions · ~9 minutes of media · 3 surveys',
      startButton: 'Begin session',
      idRequired: 'Participant ID is required.',
    },
    demographics: {
      badge: 'About You',
      title: 'Demographics Questionnaire',
      intro: 'Please provide some background information. This helps us understand media consumption patterns.',
      ageLabel: 'Age',
      agePlaceholder: 'Enter your age',
      ageRequired: 'Age is required (18 or older).',
      mediaHabitsHeading: 'Media Consumption Habits',
      mediaHabitsDescription: 'How often do you typically consume each type of media?',
      videoUsageLabel: 'Short videos (YouTube, TikTok, Reels)',
      podcastUsageLabel: 'Audio podcasts',
      textUsageLabel: 'Online articles / blogs',
      videoUsageRequired: 'Please select how often you watch short videos.',
      podcastUsageRequired: 'Please select how often you listen to podcasts.',
      textUsageRequired: 'Please select how often you read articles/blogs.',
      frequencyOptions: {
        never: 'Never',
        rarely: 'Rarely',
        sometimes: 'Sometimes',
        often: 'Often',
        daily: 'Daily',
      },
      caffeineHeading: "Today's Caffeine Intake",
      caffeineLabel: 'Have you consumed caffeine today (coffee, tea, energy drinks)?',
      caffeineYes: 'Yes',
      caffeineNo: 'No',
      caffeineRequired: 'Please indicate whether you consumed caffeine today.',
      caffeineAmountLabel: 'Approximate amount',
      caffeineAmountPlaceholder: 'e.g., 2 cups of coffee',
      continueButton: 'Continue to instructions',
    },
    instructions: {
      badge: 'Instructions',
      title: 'What to Expect',
      intro:
        'You will complete three media experiences covering the same topic. Video and audio each last exactly three minutes. For the text condition, read at your natural pace and click "Done reading" when finished.',
      points: [
        'Video and audio play automatically with no playback controls. The text condition lets you read at your own pace.',
        'After each media experience, answer all questions before continuing. Every field is required.',
        'Avoid looking at clocks or other timers. The questionnaire will ask you to estimate the duration in minutes and seconds.',
        'Your personalized order is randomized once per session (3 conditions total).',
        'Results stay on this device. Download the CSV summary after the final questionnaire to save your data.',
      ],
      readyLabel: 'Ready when you are',
      checklist: 'Ensure your speakers or headphones are working. Brightness up, distractions down.',
      startButton: 'Start first media condition',
    },
    media: {
      participantLabel: 'Participant {{id}}',
      conditionProgress: 'Condition {{current}} of {{total}}',
      focusReminder: 'The media starts immediately. Please keep the tab focused until the questionnaire appears.',
      stalledMessage: 'If playback stalls, stay on this screen. The questionnaire will unlock automatically after three minutes.',
      errorMessage: 'Playback encountered an issue. Remain on this screen; the questionnaire will open as soon as the timer completes.',
      audioBadge: 'Podcast Session',
      audioInnerLabel: 'Audio',
      skipButton: 'Skip to questionnaire',
      textReadingNote: 'Read at your natural pace. When you have finished reading, click the button below.',
      doneReadingButton: 'Done reading',
      conditionLabels: {
        video: 'Video',
        audio: 'Podcast',
        text: 'Article',
      },
    },
    questionnaireScreen: {
      badge: 'Post-condition survey',
      title: 'Post-media questionnaire',
      intro: 'Please answer every item before continuing. Your responses remain local until you export the final CSV.',
    },
    questionnaire: {
      timeHeading: 'Time estimation',
      timeDescription: 'Please estimate how long the media lasted in minutes and seconds.',
      minutesLabel: 'Minutes',
      secondsLabel: 'Seconds',
      minutesPlaceholder: 'mm',
      secondsPlaceholder: 'ss',
      minutesAria: 'Estimated minutes',
      secondsAria: 'Estimated seconds',
      qualitativeHeading: 'Qualitative reflection',
      qualitativeDescription: 'In a few sentences, describe anything that stood out during this media condition.',
      qualitativePlaceholder: 'Share thoughts, emotions, or notable moments you experienced during this media session…',
      qualitativeHelper: 'Please provide at least one sentence (maximum 2000 characters).',
      submit: 'Submit responses',
      validation: {
        positiveDuration: 'Provide a positive duration before continuing.',
        secondsRange: 'Seconds must be between 0 and 59.',
        required: 'This rating is required.',
        feedbackRequired: 'Please describe your experience before continuing.',
      },
      likert: {
        confidence: {
          label: 'How confident are you in your time estimate?',
          left: 'Not confident',
          right: 'Extremely confident',
        },
        absorption: {
          label: 'I felt absorbed in the content.',
          left: 'Strongly disagree',
          right: 'Strongly agree',
        },
        enjoyment: {
          label: 'I enjoyed this media experience.',
          left: 'Strongly disagree',
          right: 'Strongly agree',
        },
        attention: {
          label: 'I paid close attention throughout.',
          left: 'Strongly disagree',
          right: 'Strongly agree',
        },
        effort: {
          label: 'It required effort to stay with the content.',
          left: 'Not at all',
          right: 'Very much',
        },
        lostTrackOfTime: {
          label: 'I lost track of time.',
          left: 'Not at all true',
          right: 'Very true',
        },
        mindWandering: {
          label: 'My mind wandered during the experience.',
          left: 'Never',
          right: 'Very often',
        },
        arousal: {
          label: 'I felt physiologically aroused (energized).',
          left: 'Low arousal',
          right: 'High arousal',
        },
        familiarity: {
          label: 'I am familiar with this topic.',
          left: 'Not at all',
          right: 'Extremely',
        },
      },
    },
    result: {
      badge: 'Summary',
      title: 'Thank you for participating!',
      subtitle: 'You completed all media conditions. Download the CSV below to store responses locally before closing this window.',
      participantLabel: 'Participant ID',
      meanErrorLabel: 'Average signed error',
      actualDurationLabel: 'Actual duration per task',
      consentHeading: 'Consent record',
      consentSignedAt: 'Signed on',
      consentParticipantName: 'Participant name',
      downloadSignature: 'Download signature',
      signatureAlt: 'Participant consent signature',
      missingSignature: 'No signature was captured for this session.',
      qualitativeHeading: 'Qualitative insights',
      qualitativeTitle: 'Participant reflections by condition',
      qualitativeSubtitle: 'These comments remain on this device and are included in the CSV export.',
      debriefingHeading: 'Study Debriefing',
      debriefingParagraphs: [
        'Thank you for completing this study on media and time perception.',
        'The purpose of this research was to investigate how different media modalities—video, audio podcast, and text—affect your subjective perception of time. We measured whether variations in immersion and engagement across these media types lead to systematic differences in how long you felt the content lasted.',
        'Research suggests that when we are highly immersed or engaged, we tend to underestimate how much time has passed. By comparing your duration estimates, confidence ratings, and self-reported engagement across the three conditions, we can examine how media format shapes temporal experience.',
        'Your responses are stored locally on this device and can be downloaded as a CSV file. No personal identifying information beyond your anonymized participant ID is included in the exported data.',
        'If you have any questions about this study, please contact the research team.',
      ],
      table: {
        condition: 'Condition',
        estimate: 'Estimate (mm:ss)',
        confidence: 'Confidence',
        engagement: 'Engagement',
        difference: 'Difference',
      },
      newParticipant: 'Start a new participant',
      downloadCsv: 'Download CSV',
      closingReminder: 'Download completed? You may now close this window.',
      secondsSuffix: 'sec',
    },
  },
  de: {
    settings: {
      languageLabel: 'Sprache',
      english: 'Englisch',
      german: 'Deutsch',
      themeLabel: 'Darstellung',
      light: 'Hell',
      dark: 'Dunkel',
      exitLabel: 'Studie beenden',
      exitConfirm: 'Möchten Sie die Studie beenden? Nicht exportierte Fortschritte werden gelöscht und Sie kehren zur Startseite zurück.',
    },
    loading: {
      preparingNext: 'Nächste Bedingung wird vorbereitet…',
      loadingInstructions: 'Anleitung wird geladen…',
      loadingFirstCondition: 'Erste Bedingung wird geladen…',
      loadingQuestionnaire: 'Fragebogen wird geladen…',
      savingResponses: 'Antworten werden gespeichert…',
      keepWindowOpen: 'Bitte lassen Sie dieses Fenster geöffnet.',
    },
    welcome: {
      badge: 'Studie zur Zeitwahrnehmung',
      title: 'Prototype zur Medien-Zeitwahrnehmung',
      description:
        'Willkommen! Sie erleben drei kurze Medienformate zum selben Thema. Danach schätzen Sie jeweils die Dauer und bewerten Ihre Beteiligung. Der Ablauf dauert rund 12 Minuten. Bitte schalten Sie Benachrichtigungen aus und stellen Sie sicher, dass Ihr Gerät ausreichend Akku hat.',
      resumeWarning:
        'Für die Teilnehmer-ID {{id}} wurde eine aktive Sitzung gefunden. Ein Neustart überschreibt die bisher lokal gespeicherten Daten.',
      participantLabel: 'Teilnehmer-ID',
      participantPlaceholder: 'Zugewiesene ID eingeben',
      nameLabel: 'Vollständiger Name',
      namePlaceholder: 'Vor- und Nachname',
      nameHelper: 'Nur für das Einwilligungsprotokoll. Dieser Name erscheint nicht in exportierten Daten.',
      idHelper:
        'Diese anonymisierte Kennung wird der teilnehmenden Person angezeigt und erscheint nur in exportierten Dateien.',
      copyId: 'ID kopieren',
      copySuccess: 'Kopiert!',
      copyFailure: 'Kopieren nicht möglich',
      regenerateId: 'Neue ID erzeugen',
      consentHeading: 'Zusammenfassung der Einwilligung',
      consentParagraphs: [
        'Dieser Prototyp ist Teil einer Studie zur Zeitwahrnehmung über unterschiedliche Medienformate.',
        'Sie erleben drei Medienbedingungen zum selben Thema. Jede dauert drei Minuten und wird von einem kurzen Fragebogen zu Ihren Eindrücken und Ihrer Zeitschätzung begleitet.',
        'Ihr vollständiger Name wird nur zusammen mit dieser Einwilligung gespeichert. Exportierte Daten enthalten ausschließlich die anonymisierte Teilnehmer-ID.',
        'Die Teilnahme ist freiwillig. Über die Funktion „Studie beenden“ können Sie jederzeit aussteigen; nicht exportierte Antworten werden dabei von diesem Gerät entfernt.',
      ],
      consentText:
        'Ich habe die obigen Informationen gelesen und willige in die Teilnahme an diesem Prototyp ein.',
      nameRequired: 'Bitte geben Sie Ihren vollständigen Namen an.',
      consentRequired: 'Die Einwilligung muss bestätigt werden, bevor es weitergeht.',
      signatureLabel: 'Bitte unterschreiben Sie zur Bestätigung Ihrer Einwilligung',
      signatureHelper: 'Mit Maus, Trackpad oder Touch unterschreiben. Bei Bedarf löschen und erneut zeichnen.',
      signatureClear: 'Unterschrift löschen',
      signatureRequired: 'Bitte unterschreiben Sie, bevor Sie fortfahren.',
      stats: '3 Bedingungen · ca. 9 Minuten Medien · 3 Fragebögen',
      startButton: 'Sitzung starten',
      idRequired: 'Die Teilnehmer-ID ist erforderlich.',
    },
    demographics: {
      badge: 'Über Sie',
      title: 'Demografischer Fragebogen',
      intro: 'Bitte geben Sie einige Hintergrundinformationen an. Diese helfen uns, Mediennutzungsmuster zu verstehen.',
      ageLabel: 'Alter',
      agePlaceholder: 'Ihr Alter eingeben',
      ageRequired: 'Alter ist erforderlich (18 oder älter).',
      mediaHabitsHeading: 'Mediennutzungsgewohnheiten',
      mediaHabitsDescription: 'Wie oft nutzen Sie typischerweise die folgenden Medientypen?',
      videoUsageLabel: 'Kurzvideos (YouTube, TikTok, Reels)',
      podcastUsageLabel: 'Audio-Podcasts',
      textUsageLabel: 'Online-Artikel / Blogs',
      videoUsageRequired: 'Bitte wählen Sie, wie oft Sie Kurzvideos schauen.',
      podcastUsageRequired: 'Bitte wählen Sie, wie oft Sie Podcasts hören.',
      textUsageRequired: 'Bitte wählen Sie, wie oft Sie Artikel/Blogs lesen.',
      frequencyOptions: {
        never: 'Nie',
        rarely: 'Selten',
        sometimes: 'Manchmal',
        often: 'Oft',
        daily: 'Täglich',
      },
      caffeineHeading: 'Heutige Koffeinaufnahme',
      caffeineLabel: 'Haben Sie heute Koffein konsumiert (Kaffee, Tee, Energydrinks)?',
      caffeineYes: 'Ja',
      caffeineNo: 'Nein',
      caffeineRequired: 'Bitte geben Sie an, ob Sie heute Koffein konsumiert haben.',
      caffeineAmountLabel: 'Ungefähre Menge',
      caffeineAmountPlaceholder: 'z. B. 2 Tassen Kaffee',
      continueButton: 'Weiter zur Anleitung',
    },
    instructions: {
      badge: 'Anleitung',
      title: 'Ablaufübersicht',
      intro:
        'Sie absolvieren drei Medienerlebnisse zum selben Thema. Video und Audio dauern jeweils genau drei Minuten. Bei der Textbedingung lesen Sie in Ihrem natürlichen Tempo und klicken am Ende auf „Fertig gelesen".',
      points: [
        'Video und Audio starten automatisch ohne Steuerelemente. Bei der Textbedingung lesen Sie in Ihrem eigenen Tempo.',
        'Nach jedem Medienerlebnis beantworten Sie alle Fragen, bevor Sie fortfahren. Jede Eingabe ist verpflichtend.',
        'Vermeiden Sie Uhren oder andere Timer. Im Fragebogen schätzen Sie die Dauer in Minuten und Sekunden.',
        'Die Reihenfolge ist pro Sitzung zufällig (insgesamt 3 Bedingungen).',
        'Die Ergebnisse bleiben auf diesem Gerät. Laden Sie nach dem letzten Fragebogen die CSV-Datei herunter.',
      ],
      readyLabel: 'Bereit?',
      checklist: 'Prüfen Sie Kopfhörer oder Lautsprecher. Bildschirmhelligkeit hoch, Ablenkungen runter.',
      startButton: 'Erste Medienbedingung starten',
    },
    media: {
      participantLabel: 'Teilnehmer {{id}}',
      conditionProgress: 'Bedingung {{current}} von {{total}}',
      focusReminder: 'Das Medium startet sofort. Bitte behalten Sie den Tab im Vordergrund, bis der Fragebogen erscheint.',
      stalledMessage:
        'Falls die Wiedergabe stockt, bleiben Sie auf diesem Bildschirm. Nach drei Minuten wird der Fragebogen automatisch freigeschaltet.',
      errorMessage:
        'Bei der Wiedergabe ist ein Problem aufgetreten. Bitte bleiben Sie hier; der Fragebogen öffnet sich, sobald der Timer endet.',
      audioBadge: 'Podcast-Sitzung',
      audioInnerLabel: 'Audio',
      skipButton: 'Zum Fragebogen springen',
      textReadingNote: 'Lesen Sie in Ihrem natürlichen Tempo. Wenn Sie fertig gelesen haben, klicken Sie auf die Schaltfläche unten.',
      doneReadingButton: 'Fertig gelesen',
      conditionLabels: {
        video: 'Video',
        audio: 'Podcast',
        text: 'Artikel',
      },
    },
    questionnaireScreen: {
      badge: 'Fragebogen nach der Bedingung',
      title: 'Fragebogen zum Medienerlebnis',
      intro: 'Bitte beantworten Sie alle Punkte, bevor Sie fortfahren. Ihre Antworten bleiben lokal, bis Sie die CSV exportieren.',
    },
    questionnaire: {
      timeHeading: 'Zeitschätzung',
      timeDescription: 'Schätzen Sie bitte, wie lange das Medium gedauert hat – in Minuten und Sekunden.',
      minutesLabel: 'Minuten',
      secondsLabel: 'Sekunden',
      minutesPlaceholder: 'mm',
      secondsPlaceholder: 'ss',
      minutesAria: 'Geschätzte Minuten',
      secondsAria: 'Geschätzte Sekunden',
      qualitativeHeading: 'Qualitative Reflexion',
      qualitativeDescription: 'Beschreiben Sie kurz, was Ihnen in dieser Medienbedingung besonders aufgefallen ist.',
      qualitativePlaceholder: 'Gedanken, Gefühle oder Beobachtungen zu diesem Durchgang…',
      qualitativeHelper: 'Bitte mindestens einen Satz schreiben (maximal 2000 Zeichen).',
      submit: 'Antworten abschicken',
      validation: {
        positiveDuration: 'Bitte geben Sie vor dem Fortfahren eine positive Dauer an.',
        secondsRange: 'Sekunden müssen zwischen 0 und 59 liegen.',
        required: 'Diese Bewertung ist erforderlich.',
        feedbackRequired: 'Bitte beschreiben Sie Ihre Eindrücke, bevor Sie fortfahren.',
      },
      likert: {
        confidence: {
          label: 'Wie sicher sind Sie sich bei Ihrer Schätzung?',
          left: 'Gar nicht sicher',
          right: 'Sehr sicher',
        },
        absorption: {
          label: 'Ich war in den Inhalt vertieft.',
          left: 'Stimme überhaupt nicht zu',
          right: 'Stimme voll zu',
        },
        enjoyment: {
          label: 'Ich habe dieses Medienerlebnis genossen.',
          left: 'Stimme überhaupt nicht zu',
          right: 'Stimme voll zu',
        },
        attention: {
          label: 'Ich habe die ganze Zeit aufmerksam zugehört/zugesehen.',
          left: 'Stimme überhaupt nicht zu',
          right: 'Stimme voll zu',
        },
        effort: {
          label: 'Es war anstrengend, beim Inhalt zu bleiben.',
          left: 'Überhaupt nicht',
          right: 'Sehr',
        },
        lostTrackOfTime: {
          label: 'Ich habe das Zeitgefühl verloren.',
          left: 'Trifft gar nicht zu',
          right: 'Trifft sehr zu',
        },
        mindWandering: {
          label: 'Meine Gedanken sind währenddessen abgeschweift.',
          left: 'Nie',
          right: 'Sehr oft',
        },
        arousal: {
          label: 'Ich fühlte mich körperlich aktiviert (energiegeladen).',
          left: 'Niedrige Aktivierung',
          right: 'Hohe Aktivierung',
        },
        familiarity: {
          label: 'Ich kenne mich mit diesem Thema aus.',
          left: 'Gar nicht',
          right: 'Sehr gut',
        },
      },
    },
    result: {
      badge: 'Zusammenfassung',
      title: 'Vielen Dank für Ihre Teilnahme!',
      subtitle: 'Sie haben alle Bedingungen abgeschlossen. Laden Sie die CSV herunter, um die Antworten lokal zu sichern, bevor Sie das Fenster schließen.',
      participantLabel: 'Teilnehmer-ID',
      meanErrorLabel: 'Durchschnittlicher Fehler',
      actualDurationLabel: 'Tatsächliche Dauer pro Aufgabe',
      consentHeading: 'Einwilligungsnachweis',
      consentSignedAt: 'Unterzeichnet am',
      consentParticipantName: 'Name der Teilnehmerin/des Teilnehmers',
      downloadSignature: 'Unterschrift herunterladen',
      signatureAlt: 'Unterschrift der Teilnehmerin/des Teilnehmers',
      missingSignature: 'Für diese Sitzung wurde keine Unterschrift erfasst.',
      qualitativeHeading: 'Qualitative Einblicke',
      qualitativeTitle: 'Kommentare nach Bedingung',
      qualitativeSubtitle: 'Diese Notizen bleiben lokal gespeichert und sind im CSV-Export enthalten.',
      debriefingHeading: 'Studien-Debriefing',
      debriefingParagraphs: [
        'Vielen Dank, dass Sie an dieser Studie zur Medien- und Zeitwahrnehmung teilgenommen haben.',
        'Ziel der Forschung war es zu untersuchen, wie unterschiedliche Medienmodalitäten – Video, Audio-Podcast und Text – Ihre subjektive Zeitwahrnehmung beeinflussen. Wir haben gemessen, ob Unterschiede in Immersion und Engagement zwischen den Medientypen zu systematischen Verzerrungen der wahrgenommenen Dauer führen.',
        'Forschungsergebnisse legen nahe, dass wir bei hoher Immersion oder Beteiligung dazu neigen, die verstrichene Zeit zu unterschätzen. Durch den Vergleich Ihrer Zeitschätzungen, Sicherheitsbewertungen und selbstberichteten Beteiligung über die drei Bedingungen können wir untersuchen, wie das Medienformat die zeitliche Erfahrung prägt.',
        'Ihre Antworten werden lokal auf diesem Gerät gespeichert und können als CSV-Datei heruntergeladen werden. In den exportierten Daten ist außer Ihrer anonymisierten Teilnehmer-ID keine persönliche Kennung enthalten.',
        'Bei Fragen zu dieser Studie wenden Sie sich bitte an das Forschungsteam.',
      ],
      table: {
        condition: 'Bedingung',
        estimate: 'Schätzung (mm:ss)',
        confidence: 'Sicherheit',
        engagement: 'Engagement',
        difference: 'Abweichung',
      },
      newParticipant: 'Neue Teilnehmerin / neuen Teilnehmer starten',
      downloadCsv: 'CSV herunterladen',
      closingReminder: 'Download erledigt? Sie können das Fenster jetzt schließen.',
      secondsSuffix: 'Sek.',
    },
  },
}
