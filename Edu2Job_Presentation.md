---
marp: true
theme: default
class: lead
paginate: true
backgroundColor: #f0f4f8
color: #1e293b
style: |
  section {
    font-family: 'Inter', sans-serif;
  }
  h1 {
    color: #2563eb;
    font-size: 3em;
  }
  h2 {
    color: #1d4ed8;
  }
  .feature-box {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
---

# Edu2Job 🚀
## AI Career Intelligence System

Bridging the gap between education and employment through advanced analytics and machine learning.

---

## 🎯 The Problem

The modern career journey is complex. 
- Students and professionals struggle to identify **target roles** aligned with their skills.
- There's a disconnect between **academic knowledge** and **industry requirements**.
- Lack of clear, actionable **career roadmaps**.

---

## 💡 Our Solution: Edu2Job

A premium AI-powered career analytics platform.

- **Predictive Analytics:** Identifies your most suitable career path.
- **Skill Gap Analysis:** Pinpoints exactly what you need to learn.
- **Market Intelligence:** Provides real-time job demand trends.

---

## ✨ Core Features

<div class="feature-box">

1. **AI Job Prediction:** Matches profiles to roles like Software Engineer, Data Scientist, etc.
2. **Resume Analyzer:** Deep-dives into resumes to check job description alignment.
3. **Career Roadmap:** Step-by-step guidance to reach your dream job.
4. **Job Market Trends:** Real-time visualization of industry demand.
5. **Interactive Dashboard:** Complete overview of match scores, salaries, and growth.

</div>

---

## 🛠️ Technology Stack

**Frontend Layer**
- React (v18) & Vite
- Glassmorphism & Dynamic UI (Vanilla CSS / Tailwind)
- Recharts (Data Visualization)

**Backend Layer**
- Python / FastAPI (High-performance Async API)
- Modular Routing (`auth`, `predict`, `genai`)
- PostgreSQL (via SQLAlchemy)

**AI & ML Layer**
- Scikit-learn (Gradient Boosting Classifier)
- Generative AI (Google Gemini API)

---

## ⚙️ Deep Dive: Backend Infrastructure

**Framework & Design:**
- **FastAPI:** Built for high-speed, asynchronous request handling (ASGI).
- **Modular Routing:** Separated API spaces for `/auth`, `/predict` (ML), and `/genai` (LLMs) keeping the codebase scalable and clean.
- **CORS & Security:** `CORSMiddleware` explicitly scoped to allow secure communication with the React frontend.
- **Data Persistence:** Relational database management using PostgreSQL via `SQLAlchemy` ORM for user profiles and history.

---

## 🧠 Deep Dive: Machine Learning Pipeline

**Model Architecture & Preprocessing:**
- **Algorithm:** Scikit-Learn's `GradientBoostingClassifier` (optimized with `n_estimators=100`, `max_depth=4`) for high precision and to prevent overfitting.
- **Feature Engineering Pipeline:** Uses `ColumnTransformer` to handle diverse data types simultaneously:
  - *Numeric (Scores, Experience):* `StandardScaler` normalizes distributions.
  - *Categorical (Degrees, Specialization):* `OneHotEncoder` handles mapping.
  - *Text (Skills array):* `CountVectorizer` converts skills strings to binary feature matrices.

**Dataset & Training:**
- **Synthetic Balancing:** Trained on an enriched, 5000-record dataset mathematically balanced across 21 diverse career roles ranging from Data Science to Civil Engineering.

---

## 🤖 GenAI Integration

- **Predictive Model:** Gradient Boosting pipeline accurately matches profile vectors to the highest-probability career roles.
- **Feature Engineering:** Binary Count Vectorization for technical skills combined with Categorical Encoding for academic background.
- **Generative AI:** Google Gemini API generates customized narrative summaries, personalized progression strategies, and check-listed actions based on the ML predictions.

---

## 📊 Analytics & Insights UX

- **Enhanced Visualizations:** Job Demand Trends & Programming Skills charts with smooth animations and interactive tooltips.
- **Action Plans:** 2-column layout with animated readiness progress bars and categorized skill tags.
- **Strategic Insights:** Dedicated dashboard footer showing narrative AI summaries and skill-density badges.

---

## 🚀 Architectural Milestones Achieved

1. **Platform Foundation:** Responsive multi-step forms and core FastAPI backend.
2. **Dynamic Content:** Interactive vertical roadmap timelines and Unsplash integration for course imagery.
3. **Intelligence API:** Deployed `/api/v1/predict` and Resume Analyzer endpoints.
4. **Behavioral UX:** Screenshot-accurate dashboard restoration with centered headers and KPI bars.

---

## 🔮 Future Roadmap

- **Live Job Scraper:** Pull real-time listings from LinkedIn, Indeed, and Glassdoor.
- **Intelligent Course Mapping:** Direct API integration with Coursera/Udemy to address skill gaps automatically.
- **PDF Export:** Generate professional, downloadable career forecast reports.
- **Real-time Career Coach:** Interactive LLM-based chatbot for personalized mentoring.

---

# Thank You!
## Any Questions?

*Developed with ❤️ for the future of career intelligence.*
