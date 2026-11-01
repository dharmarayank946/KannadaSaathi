# ಕನ್ನಡಸಾಥಿ — KannadaSaathi
### Real-Time Kannada Life Assistant
**Tagline:** ನೋಡು • ಮಾತನಾಡು • ತಿಳಿದುಕೋ • ಪರಿಹರಿಸು (See • Speak • Understand • Solve)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: v18+](https://img.shields.io/badge/node-v18%2B-blue.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-v8.3.4-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)

---

## 1. Project Overview & Vision

**KannadaSaathi** is a Kannada-first digital life assistant designed to empower citizens, students, farmers, and small business owners in Karnataka to understand their surroundings, communicate naturally in their native language, access verified real-time public information, and solve practical everyday problems.

Rather than being a generic English-first chatbot wrapped in translation, KannadaSaathi is engineered from the ground up to unify **four core life capabilities** into an interconnected, responsive web experience:

1. **ನೋಡು — See (Multimodal Image Understanding & Live Camera):**
   - Upload or capture photographs of college circulars, BESCOM utility bills, administrative notices, signboards, or agricultural crop diseases.
   - Generates structured Kannada breakdowns: (1) what the image contains, (2) extracted text, (3) crucial deadlines or monetary amounts, (4) suggested next steps, and (5) verified uncertainties.
2. **ಮಾತನಾಡು — Speak (Kannada Voice Assistant):**
   - Natural Kannada voice recognition (`kn-IN`) with permission handling and pre-send transcript editing.
   - Fluent conversational responses in simple, natural Kannada.
   - Text-to-speech voice playback with audio controls (Listen/Stop) and strict fallbacks that never play an unrelated language when native Kannada voices are absent.
3. **ತಿಳಿದುಕೋ — Explore (Current Information Explorer):**
   - Real-time weather data for Karnataka districts via Open-Meteo API (free, zero-key, reliable) with optional voluntary GPS geocoding.
   - Curated, verified citizen data channels covering Karnataka guarantees (Gruha Jyothi, Shakti scheme), APMC mandi market rates, SSP post-metric scholarships, and 112/108/1902 helplines.
   - Strict anti-hallucination policy separating verified facts from plain-language explanations with source URLs and ISO retrieval timestamps.
4. **ಪರಿಹರಿಸು — Solve (Action Plans, Interactive Checklists & Smart Reminders):**
   - Generates bilingual, step-by-step action plans (scholarships, exam revision, small business MSME, hackathons, government applications).
   - Interactive checklist with visual progress bar (`X/Y completed (%)`), in-place editing, and reset confirmation.
   - Smart reminders with date/time validation, browser notification permission checks, and in-app chime fallbacks.

---

## 2. System Architecture & Tech Stack

```
                        ┌─────────────────────────────────────────────────────┐
                        │              KannadaSaathi Frontend                 │
                        │           (React 19 + Vite + Vanilla CSS)           │
                        └───────┬──────────────────────┬───────────────┬──────┘
                                │                      │               │
                     User Voice / Web Speech    Camera / Upload    LocalStorage
                     (SpeechRecognition kn-IN)  (JPEG/PNG/WebP)  (Tasks/Reminders)
                                │                      │               │
                                └──────────────┬───────┴───────────────┘
                                               │ HTTP / REST
                                               ▼
                        ┌─────────────────────────────────────────────────────┐
                        │               Express.js Backend API                │
                        │             (Node.js v18+, Port 5000)               │
                        └───────┬──────────────────────┬───────────────┬──────┘
                                │                      │               │
                     /api/chat & /api/action-plan   /api/weather   /api/analyze-image
                                │                      │               │
                 ┌──────────────┴───────┐              │               ▼
                 │ Google Generative AI │              │      Multer (5MB limit)
                 │  (Gemini 1.5 Flash)  │              │               │
                 │   [Optional Secret]  │              │               ▼
                 └──────────────┬───────┘              │       Multimodal Vision
                                │ Fallback             │     (Or Verified Demos)
                                ▼                      │
                    Curated Knowledge Library          ▼
                    (SSP, APMC, Seva Sindhu)     Open-Meteo API
                                                (Live Weather)
```

### Technology Highlights
- **Frontend:** React 19, Vite, Vanilla CSS Design System with CSS Custom Properties.
- **Typography:** `Noto Sans Kannada` (native Kannada readability) + `Plus Jakarta Sans`.
- **Branding:** Karnataka Flag Pure Yellow (`#FFFF00`), Pure Red (`#FF0000`), Pure White Background (`#FFFFFF`), and High-Contrast Black Headings (`#000000`). Outer emblem shape is the verified Karnataka State map silhouette with centered Goddess Bhuvaneshwari.
- **Backend:** Node.js, Express.js, Multer (multipart image validation), CORS.
- **APIs & Data:** Open-Meteo (zero-cost weather), Google Gemini 1.5 Flash (optional server-side API key for live multimodal reasoning).

---

## 3. Project Directory Structure

```
KannadaSaathi/
├── .gitignore                   # Excludes node_modules, dist, and .env
├── package.json                 # Monorepo task scripts
├── README.md                    # Complete setup, testing, and demo documentation
│
├── client/                      # Frontend Application
│   ├── public/
│   │   ├── favicon.svg          # Favicon with simplified temple emblem
│   │   └── logo/
│   │       ├── kannadasaathi-logo.svg # Verified 1000x1000 Karnataka emblem
│   │       └── karnataka-outline.svg  # Verified Survey of India state boundary
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Brand emblem, status indicator, language mode toggle
│   │   │   ├── PillarTabs.jsx   # 4 core action cards (See, Speak, Explore, Solve)
│   │   │   ├── CameraPanel.jsx  # Image upload, camera capture, 5-part vision analysis
│   │   │   ├── VoicePanel.jsx   # Speech recognition, editable transcripts, audio TTS
│   │   │   ├── ExplorePanel.jsx # Live weather, city selector, verified citizen sources
│   │   │   ├── SolvePanel.jsx   # Action plans, interactive checklist, smart reminders
│   │   │   ├── HistoryModal.jsx # Activity audit trail
│   │   │   └── SettingsModal.jsx# Speed rate and privacy controls
│   │   ├── data/
│   │   │   └── sampleImages.js  # Verified sample images & Karnataka district coordinates
│   │   ├── App.jsx              # Orchestrator, onboarding chips, cross-pillar state
│   │   └── index.css            # Karnataka flag color design system & responsive layout
│   ├── index.html               # Semantic HTML5, Noto Sans Kannada font imports
│   ├── package.json
│   └── vite.config.js
│
└── server/                      # Backend API Server
    ├── .env.example             # Clean template without secrets
    ├── .gitignore               # Excludes server-specific .env and node_modules
    ├── index.js                 # Express endpoints (/api/health, /api/analyze-image,
    │                            #   /api/chat, /api/weather, /api/current-info, /api/action-plan)
    ├── package.json
    ├── test-action-plan.js      # Unit tests for Action Plan Generator
    ├── test-current-info.js     # Tests for Open-Meteo & verified government channels
    ├── test-image-analysis.js   # Multimodal image analysis validation
    ├── test-voice-chat.js       # Voice assistant conversational tests
    └── test-step7-workflows.js  # Complete cross-pillar integration test suite
```

---

## 4. Quick Start & Local Run Instructions

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm (v9 or higher)

### Step 1: Install Dependencies
```bash
# From project root:
cd server && npm install
cd ../client && npm install
```

### Step 2: Environment Configuration
Copy the template in `server/`:
```bash
cp server/.env.example server/.env
```

`server/.env` contents:
```env
PORT=5000
NODE_ENV=development
# Optional: Get free API key from https://aistudio.google.com/app/apikey
# If left empty, KannadaSaathi runs seamlessly in labeled Demo Mode without errors
GEMINI_API_KEY=
```

### Step 3: Run the Application
In separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Alternatively, from the project root:
```bash
npm run dev:server   # Terminal 1
npm run dev:client   # Terminal 2
```

Open your browser at `http://localhost:5173`.

---

## 5. Automated Test Suites & Verification Results

All 5 automated test suites pass with **100% success rate (Exit Code 0)**:

To execute the test suites:
```bash
cd server
node test-step7-workflows.js    # Comprehensive Step 7 & 8 integration
node test-action-plan.js        # Action Plan Generator tests
node test-current-info.js       # Real-time weather and verified channels
node test-image-analysis.js     # Multimodal vision verification
node test-voice-chat.js         # Conversational voice and TTS policies
```

### Actual Test Results Summary:

| Test Suite | Scenarios Tested | Result |
| :--- | :--- | :--- |
| **test-step7-workflows.js** | 1. Fluent Kannada action plan generation<br>2. English bilingual plan counterpart<br>3. Plan-to-checklist conversion (5 tasks)<br>4. Step completion & progress tracking (40%)<br>5. Reminder lifecycle & date/time validation<br>6. Non-fabrication browser notification policy<br>7. Pre-existing endpoint regression (weather, chat, info) | **7/7 PASS (100%)** |
| **test-action-plan.js** | Scholarship, Exam prep, Small business, Hackathons, Government schemes, Custom queries, Empty query validation (HTTP 400). | **7/7 PASS (100%)** |
| **test-current-info.js** | Open-Meteo weather with manual city ("Mysuru"), official scheme facts (Gruha Jyothi, KSAMB APMC, SSP, 112/108 helplines), unverified query rejection without fake news, empty validation. | **6/6 PASS (100%)** |
| **test-image-analysis.js** | Unconfigured API setup guide, filetype validation, empty payload, 3 evaluation image types (College circular, BESCOM bill, plant disease). | **4/4 PASS (100%)** |
| **test-voice-chat.js** | Normal conversation, slow dictation, agriculture queries, pre-send transcript editing, empty input handling, speech synthesis policy. | **6/6 PASS (100%)** |

### Production Build Verification:
```bash
cd client && npm run build
```
Output:
```
✓ 1931 modules transformed.
dist/index.html                   1.32 kB │ gzip:   0.71 kB
dist/assets/index-D9Mg1Hh9.css   22.43 kB │ gzip:   4.75 kB
dist/assets/index-CNx5wtXA.js   365.43 kB │ gzip: 101.06 kB
✓ built in 360ms with zero errors.
```

---

## 6. Manual Testing Verification Matrix

| # | User Scenario | Actions to Perform | Observed & Verified Behavior |
| :--- | :--- | :--- | :--- |
| 1 | **Ask in Kannada** | Open "ಮಾತನಾಡು" tab -> enter "ನಮಸ್ಕಾರ, ಬೆಂಗಳೂರಿನಲ್ಲಿ ಇಂದು ಸಂಜೆ ಮಳೆ ಬರುತ್ತದೆಯೇ?" -> Send. | Receives culturally natural Kannada response with temperature context and advice. |
| 2 | **Upload & Analyze Image** | Open "ನೋಡು" tab -> click instant sample "ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಸುತ್ತೋಲೆ" -> click "ವಿಶ್ಲೇಷಿಸಿ". | Returns 5-part Kannada breakdown: summary, extracted text, deadline ("28 ನವೆಂಬರ್ 2026"), fee ("₹1,850"), and next steps. |
| 3 | **Voice Input & Spoken Audio** | Click microphone button -> speak or use sample chip -> click "ಆಲಿಸಿ" speaker. | Editable transcript shown; TTS audio plays in Kannada. "ನಿಲ್ಲಿಸಿ" button stops speech immediately. |
| 4 | **Current Information Explorer** | Open "ತಿಳಿದುಕೋ" tab -> select "ಮೈಸೂರು" -> click "ಶಕ್ತಿ ಯೋಜನೆ ಬಸ್ ಪ್ರಯಾಣ ಮಾಹಿತಿ". | Live weather coordinates and temperature fetched from Open-Meteo; verified Shakti scheme rules with source URL and timestamp. |
| 5 | **Action Plan & Checklist** | Open "ಪರಿಹರಿಸು" tab -> click "ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ" -> click "ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗೆ ಪರಿವರ್ತಿಸಿ". | Plan generates with docs, steps, and warnings; converts into 5 checklist tasks; checking items updates progress bar. |
| 6 | **Create & Manage Reminder** | Open "ನೆನಪೋಲೆಗಳು" -> title "ಕಾಲೇಜು ಶುಲ್ಕ ಪಾವತಿ", pick date/time -> click "ನೆನಪಿಸು". | Added to upcoming reminders list; "ಪರೀಕ್ಷಿಸಿ" button triggers test chime banner and browser notification. |
| 7 | **Error & Permission Handling** | Test empty inputs, denied mic permissions, or unknown search queries. | Displays Kannada guidance and honest unverified notifications without crashing or inventing fake facts. |

---

## 7. Deployment Readiness & Production Recommendations

### Architecture Overview
KannadaSaathi features a decoupled architecture:
1. **Frontend:** Static Single Page Application (SPA) compiled via Vite into `client/dist`.
2. **Backend:** Stateless Express.js REST API in `server/index.js`.

### Recommended Hosting Options:

#### Option A: Unified Hosting (Single Container / Monolith)
- **Platform:** Render, Railway, AWS App Runner, or DigitalOcean App Platform.
- **Configuration:** Express serves `client/dist` as static assets:
  ```bash
  npm run build:client
  npm run start:server
  ```
- **Cost:** Free tier available on Render / Railway. ₹0 cost to run with Demo Mode and Open-Meteo.

#### Option B: Decoupled Hosting (Recommended for Global Edge Delivery)
- **Frontend (Vercel / Netlify / Cloudflare Pages):**
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Env variables: `VITE_API_BASE_URL=https://your-backend-api.onrender.com`
- **Backend (Render / Railway / Fly.io):**
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `node index.js`
  - Env variables: `PORT=5000`, `GEMINI_API_KEY=your_key`

---

## 8. Hackathon Demonstration Guide (2–3 Minutes)

### Pitch Overview
- **Name:** KannadaSaathi (ಕನ್ನಡಸಾಥಿ)
- **Tagline:** ನೋಡು • ಮಾತನಾಡು • ತಿಳಿದುಕೋ • ಪರಿಹರಿಸು (See • Speak • Understand • Solve)
- **The Problem:** 65+ million Kannada speakers encounter everyday administrative circulars, utility bills, scholarships, and agricultural advisories written in complex bureaucratic language or English. Standard AI chatbots only provide generic chat responses and hallucinate state government schemes.
- **The Solution:** A unified multimodal life assistant that sees physical documents, converses in spoken Kannada, verifies real-time public data from authentic portals, and generates actionable checklists with deadline reminders.

### 2.5-Minute Demonstration Script:

| Timestamp | Phase | What to Show & Say |
| :--- | :--- | :--- |
| **0:00 - 0:30** | **Introduction** | Present the hero screen and emblem. Point out the onboarding chips. *"Welcome to KannadaSaathi, a Kannada-first life assistant built for real Karnataka problems."* |
| **0:30 - 1:00** | **Pillar 1: ನೋಡು (See)** | Click "ಸುತ್ತೋಲೆ ಸ್ಕ್ಯಾನ್" onboarding chip. Show instant sample "ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಸುತ್ತೋಲೆ". Point out the 5-part Kannada breakdown with the exact ₹1,850 fee and Nov 28 deadline. Click **"ಕ್ರಿಯಾ ಯೋಜನೆ ರಚಿಸಿ"** to demonstrate cross-pillar bridge. |
| **1:00 - 1:30** | **Pillar 2: ಮಾತನಾಡು (Speak)** | Switch to "ಮಾತನಾಡು". Click sample prompt *"ರೈತರಿಗೆ ಕೃಷಿ ಇಲಾಖೆಯ ಸಬ್ಸಿಡಿ ಮತ್ತು ಬೆಳೆ ಪರಿಹಾರ ಯೋಜನೆಗಳ ವಿವರ ತಿಳಿಸಿ"*. Click **"ಆಲಿಸಿ"** to demonstrate spoken Kannada audio. |
| **1:30 - 2:00** | **Pillar 3: ತಿಳಿದುಕೋ (Explore)** | Switch to "ತಿಳಿದುಕೋ". Select **"ಮೈಸೂರು"** to fetch live temperature and weather from Open-Meteo. Click **"ಗೃಹ ಜ್ಯೋತಿ 200 ಯೂನಿಟ್"** to highlight verified facts vs Kannada explanation with source URL attribution. |
| **2:00 - 2:30** | **Pillar 4: ಪರಿಹರಿಸು (Solve)** | Switch to "ಪರಿಹರಿಸು". Show the generated 5-step Action Plan with document requirements and warnings. Toggle **"English"** to show bilingual flexibility. Click **"ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗೆ ಪರಿವರ್ತಿಸಿ"**; check off two steps to showcase the live progress bar and reminder test chime. |

### Recommended Screenshots to Capture for Submission:
1. `01_hero_dashboard.png`: Hero banner with verified Karnataka emblem, onboarding chips, and 4 pillar cards.
2. `02_see_document_analysis.png`: Split-screen showing college circular and 5-part Kannada breakdown.
3. `03_speak_voice_assistant.png`: Kannada voice chat with audio playback and editable transcript.
4. `04_explore_realtime_weather.png`: Live Open-Meteo weather report for Mysuru with official Gruha Jyothi facts.
5. `05_solve_action_plan_bilingual.png`: Action Plan Generator with required documents, warnings, and bilingual toggle.
6. `06_solve_interactive_checklist.png`: Progress bar (`40% completed`), strike-through tasks, and smart reminders.

---

## 9. Known Limitations & Future Roadmap

1. **Browser Speech Recognition:** Chrome and Edge support native `kn-IN` speech recognition. On browsers lacking native Kannada speech recognition, KannadaSaathi provides an editable text box so users are never blocked.
2. **Push Notifications When App is Closed:** System notifications rely on standard Web Notifications while the browser is open. Future versions will integrate Service Worker Push API and Progressive Web App (PWA) manifest.
3. **Mandi Market APIs:** Agricultural market rates currently query verified KSAMB baseline reports. Future work will connect direct WebSocket feeds to the e-NAM Karnataka portal.
