# DESIGN.md — System Architecture & Design Philosophy

## 🎯 Vision
The **Indian Voter Guide** is a mission-critical educational tool designed to bridge the information gap for the Indian electorate. The architecture prioritizes **accessibility, security, and accuracy** while leveraging the **Google Ecosystem** for industrial-grade scalability.

## 🏗 System Architecture

### 1. State Machine Journey
The application implements a strict state-driven user journey to ensure data integrity and user clarity:
- **IDLE**: Welcome screen with Google OAuth trigger.
- **REGISTERED_CHECK**: Optional ECI portal verification.
- **PIN_INPUT**: Localization via 6-digit PIN code.
- **DASHBOARD**: personalized content based on the derived State/UT.

### 2. PIN-to-State Resolution (src/context/VoterContext.jsx)
We utilize a deterministic mapping algorithm based on the first two digits of the Indian Postal Index Number (PIN). This allows for instant, offline-first localization without requiring sensitive GPS data.
- **Mapping Strategy**: `PIN_PREFIX_MAP` in `src/config/constants.js`.
- **Fallbacks**: Default ECI national links if a PIN is invalid or from an unknown region.

### 3. AI Jargon Buster (src/services/geminiApi.js)
Powered by **Google Gemini 3 Flash**, the service uses a specialized system prompt to transform complex legal/ECI terms into 6th-grade level English and Hindi.
- **Model**: `gemini-3-flash`.
- **Infrastructure**: v1 Production Gateway for low-latency streaming.
- **Defensive Design**: Exponential backoff (retry logic) to handle API rate limits.

### 4. Telemetry & Analytics
We use a dual-layer monitoring strategy:
- **Google Analytics (GA4)**: Frontend event tracking (page views, button clicks).
- **BigQuery Analytics**: High-fidelity regional engagement metrics (tracking which states are most active and which terms are most confusing).

---

## 🎨 Design System

### Visual Language
- **Tricolor Palette**: Respectful use of Indian Saffron, White, and Green, tempered with modern slate grays for readability.
- **Typography**: `Inter` for clarity and `Outfit` for display headings.
- **Accessibility**: 
    - Contrast ratio of > 4.5:1.
    - Focus visible states for keyboard navigation.
    - ARIA-live regions for AI streaming responses.

### Component Principles
- **Functional Isolation**: Components like `JargonBuster` and `ElectionTimeline` are decoupled from global layout logic.
- **Micro-interactions**: Subtle `framer-motion` transitions to reduce cognitive load during step changes.

---

## 🔒 Security Architecture

### 1. Data Minimization
- No personally identifiable information (PII) is stored on servers.
- User session data is ephemeral and stored in React State / Browser Memory.

### 2. Hardened Infrastructure
- **Cloud Run**: Stateless, autoscaling containerized deployment.
- **Secret Manager**: Secure injection of API keys and Client IDs.
- **Security Headers**: Strict CSP to prevent XSS and Clickjacking.

---

## 🧪 Quality Assurance

### Testing Strategy
- **Headless Simulation**: Custom mocks for Google Auth and Lucide icons to enable testing in CI environments.
- **End-to-End**: Full journey validation via `vitest`.
- **Regional Logic**: Exhaustive unit testing for PIN-to-State derivation.

*Designed for the Democracy of 1.4 Billion. Jai Hind!*
