<p align="center">
  <img src="https://img.shields.io/badge/UniConnect-Campus%20Network-0058BC?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="UniConnect" />
</p>

<h1 align="center">🎓 UniConnect</h1>

<p align="center">
  <strong>A modern university networking & collaboration platform</strong><br/>
  <em>LinkedIn-style profiles × Discord-style servers — built for campus life</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Web-HTML%2FCSS%2FJS-F7DF1E?style=flat-square&logo=javascript" />
  <img src="https://img.shields.io/badge/Android-Jetpack%20Compose-3DDC84?style=flat-square&logo=android" />
  <img src="https://img.shields.io/badge/Material%203-Design%20System-6750A4?style=flat-square&logo=material-design" />
  <img src="https://img.shields.io/badge/Kotlin-2.0-7F52FF?style=flat-square&logo=kotlin" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
</p>

---

## 📋 Overview

**UniConnect** is a unified campus networking and collaboration web + mobile application designed for students and teachers. It combines:

- 🔗 **LinkedIn-style professional profiles** — academic bios, skills, and achievements
- 💬 **Discord-style community servers** — organized by year, with subject-based channels
- 📱 **Cross-platform** — responsive web SPA + native Android (Jetpack Compose)

> Built with a sleek academic-tech aesthetic: deep blue & white palette, card-based UI, rounded panels, and clean sans-serif typography.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🚀 Role-Based Onboarding** | Step-by-step setup for Students & Faculty with branch/department selection |
| **📰 Campus Feed** | LinkedIn-style posts, announcements, research sharing with likes & comments |
| **🖥️ Servers** | Discord-style server rail with year-based servers, text/voice channels, and real-time chat |
| **💬 Direct Messages** | 1:1 and group messaging with online indicators, read receipts, and message bubbles |
| **📊 Academic Dashboard** | GPA tracking, course grades, degree progress bars, and upcoming deadlines |
| **📅 Events** | Campus events with RSVP, weekly calendar selector, category filters, and gradient cards |
| **👥 Study Groups** | Find or create study groups with member avatars, schedules, and join requests |
| **🆘 Help Requests** | Submit academic help requests with category, urgency, attachments, and visibility options |

---

## 🏗️ Architecture

```
Connect@Git/
├── 🌐 Web Frontend (SPA)
│   ├── index.html              # App shell with sidebar + mobile nav
│   ├── css/styles.css          # Design system (Tailwind utilities + custom)
│   ├── js/
│   │   ├── router.js           # Hash-based SPA router
│   │   ├── app.js              # Navigation controller & page registry
│   │   └── pages/
│   │       ├── onboarding.js   # Role & branch selection wizard
│   │       ├── feed.js         # Campus feed with posts & announcements
│   │       ├── servers.js      # Discord-style server/channel/chat UI
│   │       ├── messages.js     # DM conversations with chat bubbles
│   │       ├── grades.js       # Academic overview & course grades
│   │       ├── events.js       # Campus events with calendar
│   │       ├── groups.js       # Study group discovery & management
│   │       └── help.js         # Help request form
│   │
├── 🤖 Android App (Jetpack Compose)
│   └── android/
│       ├── app/
│       │   ├── build.gradle.kts
│       │   └── src/main/java/com/example/uniconnect/
│       │       ├── MainActivity.kt         # Entry point with edge-to-edge
│       │       ├── Navigation.kt           # Bottom nav + animated routing
│       │       ├── NavigationKeys.kt       # Route constants
│       │       ├── theme/
│       │       │   ├── Color.kt            # Brand palette (blue/white/gray)
│       │       │   ├── Theme.kt            # Material 3 light/dark schemes
│       │       │   └── Type.kt             # Typography scale
│       │       └── ui/
│       │           ├── onboarding/OnboardingScreen.kt
│       │           ├── feed/FeedScreen.kt
│       │           ├── servers/ServersScreen.kt
│       │           ├── messages/MessagesScreen.kt
│       │           ├── grades/GradesScreen.kt
│       │           ├── events/EventsScreen.kt
│       │           ├── groups/GroupsScreen.kt
│       │           └── help/HelpScreen.kt
│       ├── build.gradle.kts
│       ├── settings.gradle.kts
│       └── gradle/
│
└── .gitignore
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#005CBB` | Headers, primary actions |
| **Secondary** | `#0058BC` | Active states, CTAs, badges |
| **Primary Container** | `#002147` | Dark accents, server rail |
| **Surface** | `#FAFAFA` | Card backgrounds |
| **Background** | `#F8F9FF` | Page backgrounds |
| **On Surface** | `#1A1C1E` | Body text |
| **Outline** | `#74777F` | Borders, dividers |
| **Green Online** | `#22C55E` | Online status indicators |
| **Red Notification** | `#EF4444` | Urgent badges |

### Typography

- **Font**: System Sans-Serif (Inter-like)
- **Scale**: Material 3 type scale with 12 roles (Display → Label)
- **Weights**: ExtraBold (display), Bold/SemiBold (headlines), Medium (labels), Normal (body)

---

## 🚀 Getting Started

### Web Frontend

No build step required — just open in a browser:

```bash
# Clone the repo
git clone https://github.com/HoTWinGs06/UNICONNECT.git
cd UNICONNECT

# Open directly (or use any local server)
# Option 1: Direct file open
start index.html

# Option 2: Python server
python -m http.server 8080

# Option 3: VS Code Live Server extension
```

### Android App

Requires **JDK 17** and **Android SDK 36**:

```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Or use the Android CLI tool
android run --project_dir=.
```

#### Prerequisites
- JDK 17 (Eclipse Temurin recommended)
- Android SDK Platform 36
- Gradle 8.x (wrapper included)

---

## 📱 Screenshots

### Onboarding
> Role selection (Student/Faculty) with animated step dots, branch chips, and gradient background

### Campus Feed
> Post composer, announcement cards with accent bars, research posts with like toggles, hashtag chips

### Servers (Discord-style)
> Server rail → Channel list with badges → Chat area with emoji reactions and message input

### Messages
> Conversation list with online indicators → Chat bubbles with read receipts and date dividers

### Grades
> KPI cards (GPA, Credits, Courses), course grade list, degree progress bars, deadline tracker

### Events
> Weekly day selector, category filters, gradient event cards with RSVP buttons

---

## 🛠️ Tech Stack

### Web
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic structure |
| **Tailwind CSS** | Utility-first styling |
| **Vanilla JS (ES Modules)** | Component logic, SPA routing |
| **Material Symbols** | Iconography |
| **Google Fonts (Inter)** | Typography |

### Android
| Technology | Purpose |
|-----------|---------|
| **Kotlin 2.0** | Language |
| **Jetpack Compose** | Declarative UI |
| **Material 3** | Design system & components |
| **Material Icons Extended** | Full icon library |
| **AGP 9** | Android Gradle Plugin |

---

## 🗺️ Roadmap

- [x] **Phase 1**: Web SPA — 8 pages with full UI
- [x] **Phase 2**: Android app — Native Compose screens for all 8 pages
- [ ] **Phase 3**: Backend integration (Firebase / Supabase)
- [ ] **Phase 4**: Real-time messaging (WebSocket / Firestore)
- [ ] **Phase 5**: User authentication (OAuth / Email)
- [ ] **Phase 6**: Push notifications
- [ ] **Phase 7**: Profile pages with connections
- [ ] **Phase 8**: Video meeting integration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for campus communities<br/>
  <strong>UniConnect</strong> — Where academics meet networking
</p>
