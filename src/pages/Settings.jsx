import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
    const { user, token, logout } = useAuth();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/user/predictions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch prediction history');
                }
                
                const data = await response.json();
                setPredictions(data.predictions || []);
            } catch (err) {
                console.error('Error fetching predictions:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPredictions();
        }
    }, [token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getConfidenceColorClass = (score) => {
        if (score >= 80) return 'confidence-high';
        if (score >= 60) return 'confidence-medium';
        return 'confidence-low';
    };

    return (
        <div className="settings-page fade-in">
            <div className="settings-background-glow" />
            
            <header className="settings-header">
                <h1 className="gradient-text">Settings</h1>
                <p className="subtitle">Manage your account and review your career journey</p>
            </header>

            <div className="settings-grid">
                {/* Profile Section */}
                <section className="settings-section">
                    <h2 className="section-title">Profile</h2>
                    <div className="glass-card profile-card">
                        <div className="profile-hero">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar">
                                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="online-indicator" />
                            </div>
                            <div className="profile-details">
                                <h3 className="username">{user?.full_name || 'User'}</h3>
                                <p className="user-email">{user?.email || 'N/A'}</p>
                                <div className="user-badge-pill">
                                    <span className="pill-pulse" />
                                    Active Student
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Predictions History */}
                <section className="settings-section">
                    <h2 className="section-title">Prediction Records</h2>
                    <div className="predictions-container">
                        {loading ? (
                            <div className="state-display">
                                <div className="loading-spinner" />
                                <p>Fetching your records...</p>
                            </div>
                        ) : error ? (
                            <div className="state-display error">
                                <span className="state-icon">⚠️</span>
                                <p>{error}</p>
                            </div>
                        ) : predictions.length === 0 ? (
                            <div className="state-display empty">
                                <span className="state-icon">📊</span>
                                <p>No records yet. Start a prediction to see it here!</p>
                            </div>
                        ) : (
                            <div className="prediction-grid">
                                {predictions.slice(0, 5).map((record, index) => (
                                    <div key={record._id || index} className="glass-card prediction-card">
                                        <div className="prediction-info">
                                            <h4 className="prediction-role">{record.predicted_role}</h4>
                                            <p className="prediction-date">{formatDate(record.created_at)}</p>
                                        </div>
                                        <div className={`prediction-score-badge ${getConfidenceColorClass(record.confidence_score)}`}>
                                            <span className="score-num">{record.confidence_score}%</span>
                                            <span className="score-desc">Match</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Account Actions */}
                <section className="settings-section logout-section">
                    <h2 className="section-title">Security</h2>
                    <div className="glass-card action-card">
                        <div className="action-content">
                            <h3>Session</h3>
                            <p>Logout of your current active session</p>
                        </div>
                        <button className="logout-btn-premium" onClick={logout}>
                            Sign Out
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
