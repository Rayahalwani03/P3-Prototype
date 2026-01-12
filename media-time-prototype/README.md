# Media Time Perception Study

A web-based experimental platform for investigating how different media modalities (video, audio, and text) affect individuals' subjective perception of time. This application implements a within-subjects experimental design to examine temporal bias, immersion, and engagement across media formats.

## 📋 Table of Contents

- [Overview](#overview)
- [Research Objectives](#research-objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Data Collection](#data-collection)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This prototype is a research tool designed to study time perception across different media formats. Participants experience three media conditions (short video, audio-only podcast, and text-based content) on the same topic, then estimate the duration and complete questionnaires about their experience. The study examines whether variations in immersion and engagement lead to systematic distortions in perceived duration.

### Research Questions

- **RQ1**: Does subjective time perception differ significantly across different media types when exposure duration is held constant?
- **RQ2**: Do levels of immersion and engagement differ across media modalities?
- **RQ3**: Is temporal bias (overestimation or underestimation of elapsed time) associated with self-reported immersion and engagement measures?

### Hypothesis

**H1**: Media that are more immersive and engaging will make people feel that less time has passed, compared to media that are less immersive.

## ✨ Features

### Participant Experience

- **Multi-stage Flow**: Welcome → Demographics → Instructions → Media Conditions → Questionnaires → Debriefing
- **Randomized Conditions**: Automatic counterbalancing of media condition order
- **Self-paced Text Reading**: Automatic timing for text condition
- **Responsive Design**: Works on desktop and laptop devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Bilingual Support**: English and German translations

### Data Collection

- **Time Estimation**: Participants estimate duration in minutes and seconds
- **Immersion Metrics**: 5-item Likert scale (1-5) measuring absorption and focus
- **Engagement Metrics**: 5-item Likert scale (1-5) measuring mental involvement
- **Confidence Ratings**: Self-reported confidence in time estimates
- **Demographic Data**: Age, media usage habits, caffeine consumption, alertness
- **Local Storage**: All data stored locally until CSV export
- **CSV Export**: Downloadable results with all collected measures

### Technical Features

- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context API for session and settings
- **Routing**: React Router with animated transitions
- **Media Playback**: React Player for video/audio with disabled controls
- **Form Validation**: Comprehensive validation for all inputs
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠 Technology Stack

### Core

- **React 19.2.0** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server

### UI & Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 12.23** - Animation library
- **Headless UI 2.2** - Accessible component primitives

### Routing & Media

- **React Router DOM 7.9** - Client-side routing
- **React Player 3.4** - Media playback component

### Development Tools

- **ESLint 9.39** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
media-time-prototype/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LoadingOverlay.tsx
│   │   ├── MediaPlayer.tsx
│   │   ├── Questionnaire.tsx
│   │   ├── ResultExport.tsx
│   │   ├── SettingsBar.tsx
│   │   └── shared/
│   │       └── Button.tsx
│   ├── context/             # React Context providers
│   │   ├── SessionContext.tsx
│   │   └── SettingsContext.tsx
│   ├── data/                # Static data and content
│   │   ├── mediaContent.ts
│   │   └── translations.ts
│   ├── lib/                 # Utility functions
│   │   ├── array.ts
│   │   ├── csv.ts
│   │   ├── id.ts
│   │   └── storage.ts
│   ├── pages/               # Route components
│   │   ├── WelcomeScreen.tsx
│   │   ├── DemographicQuestionnaireScreen.tsx
│   │   ├── InstructionsScreen.tsx
│   │   ├── MediaScreen.tsx
│   │   ├── QuestionnaireScreen.tsx
│   │   └── SummaryScreen.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── types.ts             # TypeScript type definitions
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection (for media playback)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd media-time-prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### For Researchers

1. **Configure Media Content**
   - Edit `src/data/mediaContent.ts` to add your video, audio, and text content
   - Ensure all three conditions cover the same topic
   - Video and audio should be exactly 3 minutes (180 seconds)

2. **Customize Translations**
   - Update `src/data/translations.ts` for language modifications
   - Add additional languages by extending the `TranslationTree` type

3. **Run the Study**
   - Start the development server or deploy to a hosting service
   - Share the URL with participants
   - Participants complete the study remotely on their devices

4. **Collect Data**
   - Participants download CSV files at the end of their session
   - CSV includes all questionnaire responses and timing data
   - Data is anonymized (participant ID only, no names)

### For Participants

1. **Start the Study**
   - Open the study URL in a web browser
   - Read the welcome screen and instructions carefully
   - Provide informed consent

2. **Complete Demographics**
   - Enter your age
   - Report media usage habits
   - Indicate caffeine consumption and alertness level

3. **Experience Media Conditions**
   - Complete three media sessions (video, audio, text)
   - Order is randomized automatically
   - Focus naturally on the content
   - Do not check the time during sessions

4. **Complete Questionnaires**
   - After each condition, estimate the duration
   - Rate your immersion, engagement, and familiarity
   - Answer all questions before continuing

5. **Export Results**
   - Download the CSV file at the end
   - Share with researchers if requested

## 📊 Data Collection

### Collected Measures

#### Time Perception
- **Perceived Duration**: Participant's estimate in seconds
- **Temporal Bias**: Difference between actual and perceived duration
- **Confidence**: Self-reported confidence in time estimate (1-5 scale)

#### Immersion (5 items, 1-5 scale)
1. I felt absorbed while experiencing the media
2. I became deeply focused on the media
3. I lost awareness of my surroundings
4. I was unaware of things happening around me
5. I lost track of time while experiencing the media

#### Engagement (5 items, 1-5 scale)
1. I found the media engaging
2. I felt mentally involved while experiencing the media
3. The media held my attention
4. I was interested in the media throughout the experience
5. I was motivated to keep paying attention to the media

#### Additional Factors
- **Familiarity**: Familiarity with topic/subject matter (1-5 scale)

#### Demographics
- Age
- Media usage habits (short videos, audio, text)
- Caffeine consumption (yes/no, time since consumption)
- Current alertness level (1-5 scale)

### Data Format

The exported CSV includes:
- Participant ID
- Condition type (video/audio/text)
- Real duration (seconds)
- Estimated duration (seconds)
- All questionnaire responses
- Timestamp for each condition

## 🔧 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React and TypeScript rules
- **Formatting**: Follow existing code style and patterns

### Key Patterns

- **Context API**: Session and settings state management
- **Custom Hooks**: Reusable logic extraction
- **Component Composition**: Shared components for consistency
- **Type Safety**: Comprehensive TypeScript types

### Adding New Features

1. **New Questionnaire Items**
   - Update `QuestionnaireSubmitPayload` interface
   - Add to `Questionnaire` component
   - Update `ConditionResult` type
   - Update CSV export headers

2. **New Languages**
   - Extend `TranslationTree` type
   - Add translations to `translations.ts`
   - Update language selector if needed

3. **New Media Conditions**
   - Add to `MediaCondition` type
   - Update `MEDIA_CONTENT` object
   - Add condition labels to translations

## 🤝 Contributing

This is a research prototype. For contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, descriptive commit messages
- Follow existing code patterns and structure
- Add TypeScript types for all new code
- Test changes thoroughly before submitting
- Update documentation as needed

## 📝 License

This project is developed for research purposes. Please refer to your institution's research guidelines and IRB approval for usage and distribution.

## 📚 References

This study is based on research in time perception and media psychology:

- Block, R. A. (2014). Cognitive models of psychological time. Psychology Press.
- Sanders, J. L., & Cairns, P. (2010). Time perception, immersion and music in videogames. In Proceedings of the 14th international academic MindTrek conference.
- Michailidis, L. (2018). Flow and immersion in video games: The aftermath of a conceptual challenge. Frontiers in Psychology.

## 📧 Contact

For questions about the study or technical issues, please contact the research team.

---

**Note**: This application stores all data locally in the browser. Participants must export their data before closing the browser window. No data is transmitted to external servers.
