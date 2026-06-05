import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Activity, 
  RefreshCw, Eye, User, ArrowUpDown, Target, Sliders, Calendar
} from 'lucide-react';
import './AdminPredictions.css';

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "DevOps Engineer",
  "AI/ML Engineer",
  "Software Engineer"
];

export default function AdminPredictions() {
  const navigate = useNavigate();
  
  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [minConfidence, setMinConfidence] = useState(0);
  const [maxConfidence, setMaxConfidence] = useState(100);
  const [sort, setSort] = useState('latest');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Data & Loading States
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch predictions data
  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        page,
        limit,
        role: selectedRole || undefined,
        min_confidence: minConfidence > 0 ? minConfidence : undefined,
        max_confidence: maxConfidence < 100 ? maxConfidence : undefined,
        search: debouncedSearch || undefined,
        sort
      };
      
      const response = await adminService.getPredictions(filters);
      setPredictions(response.predictions || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err.message || 'Failed to retrieve predictions data from server.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchPredictions();
  }, [page, limit, selectedRole, minConfidence, maxConfidence, sort, debouncedSearch]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('');
    setMinConfidence(0);
    setMaxConfidence(100);
    setSort('latest');
    setPage(1);
  };

  const getConfidenceBadgeColor = (score) => {
    if (score >= 80) return 'conf-badge-green';
    if (score >= 60) return 'conf-badge-blue';
    return 'conf-badge-orange';
  };

  const getInitials = (name) => {
    if (!name || name === 'Anonymous') return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-predictions-page animate-in">
      
      {/* 1. Header Section */}
      <div className="admin-predictions-header">
        <div className="header-title">
          <h2>Prediction Monitoring Center</h2>
          <p className="subtitle">Track and analyze all AI-generated career predictions and match analytics</p>
        </div>
        
        <div className="stats-indicator">
          <div className="total-badge">
            <Activity size={16} className="pulse-icon" />
            <span>{total} Total Predictions</span>
          </div>
          <button className="refresh-btn" onClick={fetchPredictions} disabled={loading} title="Refresh data">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="filters-container glass-card">
        <div className="filters-grid">
          {/* Search bar */}
          <div className="filter-item search-box">
            <label>Search Predictions</label>
            <div className="input-wrapper">
              <Search size={16} className="input-icon" />
              <input 
                type="text" 
                placeholder="User name, email, or role..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Role select */}
          <div className="filter-item">
            <label>Predicted Role</label>
            <div className="input-wrapper">
              <Target size={16} className="input-icon" />
              <select 
                value={selectedRole} 
                onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
              >
                <option value="">All Roles</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort selection */}
          <div className="filter-item">
            <label>Sort By</label>
            <div className="input-wrapper">
              <ArrowUpDown size={16} className="input-icon" />
              <select 
                value={sort} 
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="latest">Latest Created</option>
                <option value="oldest">Oldest Created</option>
                <option value="highest_confidence">Highest Match %</option>
                <option value="lowest_confidence">Lowest Match %</option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          <div className="filter-item reset-btn-container">
            <button className="reset-btn" onClick={handleResetFilters}>
              <Filter size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Sliders in a separate premium section */}
        <div className="range-filters-row">
          <div className="slider-container">
            <div className="slider-header">
              <span>Min Match Confidence: <strong className="text-emerald-400">{minConfidence}%</strong></span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minConfidence} 
              onChange={(e) => { setMinConfidence(Number(e.target.value)); setPage(1); }}
              className="glow-slider"
            />
          </div>

          <div className="slider-container">
            <div className="slider-header">
              <span>Max Match Confidence: <strong className="text-blue-400">{maxConfidence}%</strong></span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={maxConfidence} 
              onChange={(e) => { setMaxConfidence(Number(e.target.value)); setPage(1); }}
              className="glow-slider-blue"
            />
          </div>
        </div>
      </div>

      {/* 3. Predictions Table Section */}
      <div className="table-section-container glass-card">
        {loading ? (
          <div className="table-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-row skeleton-shimmer">
                <div className="skel-user"></div>
                <div className="skel-role"></div>
                <div className="skel-badge"></div>
                <div className="skel-chips"></div>
                <div className="skel-chips"></div>
                <div className="skel-date"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <Sliders size={40} className="error-icon" />
            <h3>Database Synchronization Error</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchPredictions}>
              <RefreshCw size={16} />
              <span>Retry Fetch</span>
            </button>
          </div>
        ) : predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-glow"></div>
            <Target size={48} className="empty-icon" />
            <h3>No predictions found</h3>
            <p>Try broadening your query parameters or resetting filters.</p>
            <button className="reset-btn" onClick={handleResetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Predicted Role</th>
                  <th>Match %</th>
                  <th>Matched Skills</th>
                  <th>Missing Skills</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred._id} className="hover-row">
                    {/* User info */}
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {getInitials(pred.user_name)}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{pred.user_name}</span>
                          <span className="user-email">{pred.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Predicted Role */}
                    <td className="role-cell font-medium">
                      {pred.predicted_role}
                    </td>

                    {/* Confidence Match % */}
                    <td>
                      <span className={`conf-badge ${getConfidenceBadgeColor(pred.confidence_score)}`}>
                        {pred.confidence_score}%
                      </span>
                    </td>

                    {/* Matched Skills */}
                    <td>
                      <div className="skill-chips-container">
                        {pred.matched_skills.length === 0 ? (
                          <span className="no-skills">-</span>
                        ) : (
                          pred.matched_skills.map((skill, idx) => (
                            <span key={idx} className="skill-chip matched-chip">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Missing Skills */}
                    <td>
                      <div className="skill-chips-container">
                        {pred.missing_skills.length === 0 ? (
                          <span className="no-skills font-medium text-emerald-400">None 🎉</span>
                        ) : (
                          pred.missing_skills.map((skill, idx) => (
                            <span key={idx} className="skill-chip missing-chip">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="date-cell">
                      <div className="date-wrapper">
                        <Calendar size={14} />
                        <span>{pred.created_at}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        {pred.user_id ? (
                          <>
                            <button 
                              className="action-btn view-analytics"
                              onClick={() => navigate(`/admin/users/${pred.user_id}`)}
                              title="View user details and analytics"
                            >
                              <Eye size={14} />
                              <span>View Analytics</span>
                            </button>
                          </>
                        ) : (
                          <span className="no-actions">User Deleted</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Pagination */}
      {!loading && predictions.length > 0 && (
        <div className="pagination-bar glass-card">
          <div className="pagination-info">
            <span>Showing {predictions.length} of {total} predictions</span>
            
            <div className="limit-selector">
              <span>Show</span>
              <select value={limit} onChange={handleLimitChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>
          </div>
          
          <div className="pagination-controls">
            <button 
              className="page-nav-btn" 
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Render limited page numbers for cleaner UI
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button 
                      key={pageNum} 
                      className={`page-num-btn ${page === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === page - 2 || 
                  pageNum === page + 2
                ) {
                  return <span key={pageNum} className="ellipsis">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              className="page-nav-btn" 
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
