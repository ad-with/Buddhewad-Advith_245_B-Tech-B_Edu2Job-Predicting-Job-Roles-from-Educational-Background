# Edu2Job – AI Career Intelligence System 🚀

**Edu2Job** is a premium AI-powered career analytics and prediction platform designed to bridge the gap between education and employment. It leverages advanced data visualization and machine learning-inspired analytics to help users predict career paths, analyze skill gaps, and navigate their professional journey with confidence.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=Edu2Job+AI+Dashboard+Interface)

## ✨ Core Features

- **🎯 AI Job Prediction:** Predict your most suitable career roles based on education, technical skills, and experience level.
- **📊 Analytics Dashboard:** A comprehensive overview of career match scores, estimated salaries, and demand growth trends.
- **📝 Resume Analyzer:** Deep-dive analysis of resumes to ensure alignment with target job descriptions.
- **🔍 Skill Gap Analysis:** Identify specific technical and soft skills needed to reach your target role.
- **📈 Job Market Trends:** Real-time visualization of industry demand and emerging career paths.
- **🗺️ Career Roadmap:** Step-by-step guidance on how to progress from your current state to your dream job.
- **🔐 Secure Authentication:** session-persisted authentication system to protect user data and career profiles.

## 🛠️ Technology Stack

### Frontend
- **React (v18):** Core framework for a dynamic, component-based UI.
- **Vite:** Next-generation frontend tooling for blazing-fast development.
- **React Router DOM (v6):** Robust client-side routing and protected navigation logic.
- **Lucide React:** Beautiful, consistent iconography for a premium feel.
- **Recharts:** High-performance charting library for data visualizations.

### Styling & UI
- **Vanilla CSS:** Custom-engineered design system featuring:
  - **Glassmorphism:** Modern, translucent UI elements.
  - **Dynamic Gradients:** Vibrant, professional color palettes.
  - **Micro-animations:** Subtle hover effects and transitions for enhanced engagement.
  - **Responsive Design:** Fully optimized for all screen sizes.

### State Management
- **React Context API:** Global state management for authentication and user sessions.
- **LocalStorage Persistence:** Ensures authentication persists across page refreshes.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/edu2job.git
   cd edu2job
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```text
src/
├── components/     # Reusable UI components (Sidebar, TopNav, Layout)
├── context/        # Global state (AuthContext)
├── pages/          # Individual page views (Dashboard, Prediction, etc.)
├── assets/         # Images and static resources
├── index.css       # Global design system and variables
└── App.jsx         # Main application routing and core logic
```

## 🔮 Future Improvements

- [ ] **LLM Integration:** Connect to OpenAI/Gemini APIs for real-time, personalized career coaching.
- [ ] **Full-Stack Implementation:** Integrate with a Node.js/Python backend and PostgreSQL for persistent user profiles.
- [ ] **Job Scraper API:** Pull real-time job listings directly from LinkedIn, Indeed, and Glassdoor.
- [ ] **Course Recommendations:** Intelligent mapping of skill gaps to specific courses on Coursera/Udemy.
- [ ] **PDF Reports:** Export career predictions and resume analysis results as professional PDF documents.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---


