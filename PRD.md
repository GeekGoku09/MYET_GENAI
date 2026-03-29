# Product Requirements Document (PRD): My ET

**Version**: 1.0  
**Status**: Initial Release  
**Owner**: Product Team

---

## 1. Executive Summary
**My ET** is an AI-native business intelligence platform that transforms the traditional news consumption experience into a personalized, agentic intelligence feed. By leveraging LLMs (Claude 3.5 Sonnet) and a custom ranking engine, it delivers high-signal, low-noise business news tailored to a professional's specific role, industry, and portfolio.

---

## 2. Problem Statement
Modern business professionals suffer from **information overload**. Traditional news apps provide a "one-size-fits-all" feed, forcing users to manually filter through hundreds of irrelevant stories to find the few that impact their specific professional context. This results in:
- **Decision Fatigue**: Too much noise, too little signal.
- **Missed Opportunities**: Critical market or policy shifts buried in the feed.
- **Time Inefficiency**: Spending 45+ minutes daily just to stay "informed."

---

## 3. Target Audience
1.  **Investors/Fund Managers**: Need real-time alerts on portfolio companies and macro trends.
2.  **Founders/Executives**: Need to track competitors, industry shifts, and regulatory changes.
3.  **Policy Analysts**: Need deep synthesis of government decisions and global trade.
4.  **Business Students/Journalists**: Need a structured way to follow complex market narratives.

---

## 4. Key Features & Requirements

### 4.1. Intelligent Onboarding
- **Requirement**: Capture user professional context (Role, Industries, Geography, Watchlist).
- **Goal**: Establish the "Intelligence Baseline" for the personalization engine.

### 4.2. Agentic News Pipeline
- **Requirement**: A multi-stage processing flow:
    - **Ingestion**: Aggregate news from multiple ET verticals.
    - **Extraction**: Identify entities (TCS, RBI, etc.) and sentiment (Bullish/Bearish).
    - **Ranking**: Score articles based on user profile + engagement.
    - **Synthesis**: Generate a coherent daily briefing.
- **Goal**: Automate the "Time-to-Insight" journey.

### 4.3. Personalized AI Briefing
- **Requirement**: Deliver a synthesized summary of the top 3-5 stories.
- **Options**: Support multiple formats (Narrative, Data-first, Bullet summary).
- **Vernacular Support**: Support English, Hindi, Marathi, and Gujarati.
- **Goal**: Provide a "3-minute morning update" that replaces 30 minutes of scrolling.

### 4.4. Engagement-Driven Feed
- **Requirement**: A news feed that re-ranks articles in real-time based on user clicks and saves.
- **Goal**: Continuous improvement of signal-to-noise ratio.

### 4.5. Intelligence Assistant (AI Chat)
- **Requirement**: A conversational interface to ask deep-dive questions about the news.
- **Context**: The assistant must be "aware" of the current news cycle and the user's profile.
- **Goal**: Move from "reading news" to "querying intelligence."

---

## 5. User Flow
1.  **Landing**: User completes onboarding (Role, Industries, Watchlist).
2.  **Briefing**: User lands on the "Briefing" page. The Agentic Pipeline runs (visualized via status indicators).
3.  **Synthesis**: User reads the AI-generated briefing in their preferred language/format.
4.  **Deep Dive**: User clicks an article or asks the Intelligence Assistant a follow-up question.
5.  **Refinement**: User saves an article; the feed immediately re-ranks to prioritize similar signals.

---

## 6. Technical Requirements
- **Frontend**: React 18 (Vite), Tailwind CSS, Framer Motion.
- **AI Integration**: Claude 3.5 Sonnet API for synthesis and extraction.
- **State Management**: React Hooks (useState, useMemo) for real-time re-ranking.
- **Data Viz**: Recharts for market indices and sentiment tracking.

---

## 7. Success Metrics (KPIs)
- **Signal Accuracy**: % of articles in the top 5 that the user finds "Highly Relevant."
- **Time-to-Insight**: Average time spent before the user takes an "action" (Save, Share, or Chat).
- **Retention**: Daily Active Users (DAU) for the morning briefing.
- **Vernacular Adoption**: % of briefings generated in non-English languages.

---

## 8. Future Roadmap
- **V1.1**: Real-time portfolio syncing via broker APIs.
- **V1.2**: "Connected Dots" graph visualization showing how global events impact local stocks.
- **V2.0**: Collaborative "Intelligence Rooms" for teams to share synthesized briefings.
