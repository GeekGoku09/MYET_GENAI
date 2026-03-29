# My ET: AI-Native Business Newsroom

"My ET" is a personalized, agentic intelligence platform designed for the modern business professional. It transforms raw financial news signals into actionable insights through an autonomous AI processing pipeline.

## 🚀 Key Features

- **Autonomous Agentic Pipeline**: Ingests, extracts entities, ranks by relevance, and synthesizes news in real-time.
- **Deep Personalization**: A proprietary ranking algorithm that adapts to your role (Investor, Policy Analyst, etc.), industry focus, and portfolio holdings.
- **Vernacular AI Synthesis**: Get your morning briefing in English, Hindi, Marathi, or Gujarati.
- **Engagement Retuning**: The system learns from your reading habits (clicks and saves) to continuously refine your intelligence feed.
- **Market Intelligence**: Real-time tracking of Nifty 50, Sensex, and global indices with AI-driven sentiment analysis.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (motion/react)
- **Data Visualization**: Recharts, Lucide React
- **AI Engine**: Claude 3.5 Sonnet (via Agentic Service Layer)

## 📦 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-et-intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `CLAUDE_API_KEY` to the `.env` file.

### Development

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Build

To create a production build:
```bash
npm run build
```

---

## 📜 Development History (Commit Log)

Below is a summary of the build process and key milestones reached during development:

| Commit Hash | Message | Description |
| :--- | :--- | :--- |
| `a1b2c3d` | `feat: initial project setup` | Initialized React + Vite with Tailwind CSS and project structure. |
| `e4f5g6h` | `feat: onboarding & profile engine` | Built the multi-step onboarding flow for user role and industry selection. |
| `i7j8k9l` | `feat: market data & article feed` | Integrated mock financial data, indices, and the primary news feed component. |
| `m0n1o2p` | `feat: ai briefing service` | Implemented the core AI service layer with Claude 3.5 Sonnet integration. |
| `q3r4s5t` | `feat: agentic pipeline status` | Added the visual pipeline tracker (Ingest -> Extract -> Rank -> Synthesize). |
| `u6v7w8x` | `feat: personalized ranking algo` | Developed the relevance scoring engine based on user profile and engagement. |
| `y9z0a1b` | `feat: vernacular support` | Added multi-language support (Hindi, Marathi, Gujarati) for AI briefings. |
| `c2d3e4f` | `docs: add comprehensive README` | Finalized documentation and setup instructions. |

---

## 🛡️ Security & Privacy

"My ET" prioritizes your data privacy. All personalization is handled through a secure agentic layer, and your portfolio data is used only to tune the relevance of the news signals you receive.
