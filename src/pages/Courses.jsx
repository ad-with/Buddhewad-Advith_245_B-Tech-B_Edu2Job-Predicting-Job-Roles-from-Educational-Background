import { BookOpen, Star, Play, Clock, ExternalLink, Code2 } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { getRecommendedCourses, getCourseImage } from '../data/coursesData';
import { Link, useLocation } from 'react-router-dom';
import './Courses.css';

export default function Courses() {
  const { predictionData } = usePrediction();
  const predictedRole = predictionData?.role || 'Software Engineer';
  const missingSkills = predictionData?.missingSkills || [];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSkill = queryParams.get("skill");

  let recommendedCourses = getRecommendedCourses(missingSkills, predictedRole);

  if (selectedSkill) {
    recommendedCourses = recommendedCourses.filter(course =>
      course.skill.toLowerCase().includes(selectedSkill.toLowerCase())
    );
  }

    const PROVIDER_URLS = {
      'Udemy': 'https://www.udemy.com',
      'Coursera': 'https://www.coursera.org',
      'Educative': 'https://www.educative.io',
      'Infosys Springboard': 'https://infyspringboard.onwingspan.com'
    };

    const handleStartLearning = (provider) => {
      const url = PROVIDER_URLS[provider] || 'https://www.google.com/search?q=' + encodeURIComponent(provider + ' courses');
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="courses-container">
        <header className="page-header">
          <h1 className="page-title">
            {selectedSkill ? `Courses for ${selectedSkill}` : "Recommended Courses"}
          </h1>
          <p className="page-subtitle">
            {selectedSkill 
              ? `Specialized learning path focused on mastering ${selectedSkill}.`
              : missingSkills.length > 0 
                ? `Curated learning paths specifically targeted to fill your skill gaps for a ${predictedRole} role.`
                : `Explore top-tier educational resources to level up your career.`}
          </p>
        </header>

        {predictionData && missingSkills.length > 0 && (
          <div className="target-skills-panel glass-panel">
            <h3 className="target-skills-title">Targeted Skill Gaps:</h3>
            <div className="target-skills-list">
              {missingSkills.map(skill => (
                <span key={skill} className="target-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(!predictionData) && (
          <div className="target-skills-panel glass-panel" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>You haven't generated a career prediction yet. We are showing some general top-rated courses.</p>
            <Link to="/job-prediction" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>Get a personalized learning path &rarr;</Link>
          </div>
        )}

        <div className="courses-grid">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((course, idx) => (
              <div key={idx} className="course-card glass-panel reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="course-image-container">
                  <img 
                    src={getCourseImage(course.skill)} 
                    alt={course.title} 
                    className="course-card-img"
                  />
                  <div className="course-difficulty-badge">{course.difficulty}</div>
                </div>
                
                <div className="course-content">
                  <div className="course-provider">{course.provider}</div>
                  <h3 className="course-title" title={course.title}>{course.title}</h3>
                  
                  <div className="course-skill-tag mb-2">
                    <Code2 size={12} /> {course.skill}
                  </div>
                  {course.description && <p className="text-sm text-slate-500 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>}

                  <div className="course-meta">
                    <span className="meta-item" title="Duration"><Clock size={14} /> {course.duration}</span>
                    <span className="meta-item rating" title="Rating"><Star size={14} fill="currentColor" /> {course.rating}</span>
                  </div>
                  
                  <button 
                    className="course-action-btn mt-auto"
                    onClick={() => handleStartLearning(course.provider)}
                  >
                    <Play size={16} /> Start Learning <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            ))
          ) : (
          <div className="no-results-panel glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <div className="mb-4" style={{ opacity: 0.5 }}><BookOpen size={48} /></div>
            <h3 className="text-xl font-bold mb-2">Internal courses for "{selectedSkill}" coming soon</h3>
            <p className="text-slate-500 mb-6">We couldn't find a direct match in our current library, but you can explore related {predictedRole} paths.</p>
            <Link 
              to="/dashboard/courses" 
              className="text-indigo-600 font-bold hover:underline"
            >
              View all recommended courses &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
