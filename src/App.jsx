import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import JobPrediction from './pages/JobPrediction'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import JobMarketTrends from './pages/JobMarketTrends'
import CareerRoadmap from './pages/CareerRoadmap'
import Courses from './pages/Courses'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'

import { AuthProvider, useAuth } from './context/AuthContext'
import { PredictionProvider } from './context/PredictionContext'
import ProtectedRoute from './components/ProtectedRoute'

import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserAnalytics from './pages/admin/AdminUserAnalytics'
import AdminPredictions from './pages/admin/AdminPredictions'
import AdminTrendsPage from './pages/admin/AdminTrendsPage'
import AdminLayout from './components/AdminLayout'
import AdminProtectedRoute from './components/AdminProtectedRoute'

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route cleanly separate from Layout */}
        <Route path="/" element={<Home />} />

        {/* Standalone Auth */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:id" element={<AdminUserAnalytics />} />
                  <Route path="predictions" element={<AdminPredictions />} />
                  <Route path="trends" element={<AdminTrendsPage />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />

        {/* Protected Dashboard Routes (Simulated) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PredictionProvider>
                <Layout />
              </PredictionProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="job-prediction" element={<JobPrediction />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="skill-gap" element={<SkillGapAnalysis />} />
          <Route path="trends" element={<JobMarketTrends />} />
          <Route path="career-roadmap" element={<CareerRoadmap />} />
          <Route path="courses" element={<Courses />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
