import os

css_content = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary-blue: #2563eb;
  --primary-red: #dc2626;
  --primary-orange: #ea580c;
  --primary-indigo: #4f46e5;
  --primary-purple: #8b5cf6;
  
  --bg-color: #f3f4f6;
  --bg-tint: #eff6ff;
  --card-bg: #ffffff;
  
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  
  --border-light: #e5e7eb;
  --border-blue: #3b82f6;
  
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-primary);
  line-height: 1.5;
}

.prediction-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 50%, #e0e7ff 100%);
}

@media (max-width: 1024px) {
  .prediction-container {
    padding: 16px;
  }
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-logo {
  display: inline-flex;
  padding: 12px;
  background: linear-gradient(135deg, var(--primary-red), var(--primary-orange));
  border-radius: 12px;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3);
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .page-title { font-size: 1.5rem; }
}

.stepper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  gap: 8px;
}

.step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--border-light);
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-item.active {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.step-item.completed {
  background: var(--primary-blue);
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
}

.step-line {
  height: 2px;
  width: 48px;
  background: var(--border-light);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.step-line.active {
  background: var(--primary-blue);
}

.main-content-grid {
  display: grid;
  grid-template-columns: 65% calc(35% - 32px);
  gap: 32px;
}

@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
}

.form-card, .result-card, .preview-panel {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--border-light);
}

.form-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-indigo));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
  width: 100%;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  background: #eff6ff;
  font-size: 1rem;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  transform: scale(1.01);
}

/* Base button styles */
button {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

/* Primary actions */
.predict-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-indigo));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 44px;
}

.predict-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

.predict-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.predict-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Special Predict Step 2 Button */
.predict-btn.step2 {
  background: linear-gradient(135deg, var(--primary-red), var(--primary-orange));
}

.predict-btn.step2:hover:not(:disabled) {
  box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3);
}

/* Secondary Button */
.back-btn {
  padding: 8px 16px;
  background: white;
  color: var(--primary-blue);
  border: 2px solid #bfdbfe;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #eff6ff;
  border-color: var(--primary-blue);
}

.back-btn:active {
  transform: scale(0.98);
}

/* Add Buttons */
.add-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--primary-red), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.add-btn.blue-variant {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-indigo));
}

/* Selection Buttons (Chips) */
.skills-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.skill-chip {
  padding: 8px 12px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Tech Skills */
.skill-chip.unselected {
  background: #dbeafe;
  color: #1e40af;
}

.skill-chip.selected {
  background: var(--primary-blue);
  color: white;
  border: 1px solid #1e40af;
  animation: slideInScale 0.2s ease-out;
}

.skill-chip:hover {
  background: #1d4ed8;
  color: white;
  transform: scale(1.05);
}

/* Interest Skills */
.interest-chip.unselected {
  background: #fed7aa;
  color: #92400e;
}

.interest-chip.selected {
  background: var(--primary-orange);
  color: white;
  border: 1px solid #7c2d12;
}

.interest-chip:hover {
  background: #c2410c;
  color: white;
}

/* Remove button on chips */
.remove-chip-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.remove-chip-btn:hover {
  opacity: 0.7;
  transform: scale(1.2);
}

.dynamic-inputs-section {
  background: linear-gradient(135deg, #fef2f2, #fff7ed);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.dynamic-inputs-section.blue {
  background: linear-gradient(135deg, #eff6ff, #e0e7ff);
  border: 2px solid #bfdbfe;
}

.dynamic-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* Sidebar Preview */
.preview-panel {
  background: linear-gradient(135deg, #ffedd5, #ffe4e6);
  border: 2px solid #fecaca;
  position: sticky;
  top: 32px;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-red), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-out;
}

.preview-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.preview-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Animations */
@keyframes slideInScale {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.reveal {
  animation: slideUp 0.4s ease-out forwards;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

.skill-search-wrapper { position: relative; margin-bottom: 16px; }
.skill-search-input-container { position: relative; }
.skill-search-input-container .search-icon { position: absolute; left: 16px; top: 14px; color: var(--text-secondary); }
.skill-search-input { padding-left: 48px; border-color: var(--primary-blue); }
.skill-search-input-container .clear-search { position: absolute; right: 16px; top: 14px; color: var(--text-secondary); cursor: pointer; }

.text-muted { color: var(--text-secondary); font-weight: 400; }

/* Result Page Styles */
.result-card.main-result {
  background: white;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.result-card.main-result::before {
  content: '';
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  z-index: -1;
  border-radius: 14px;
}

.result-header { margin-bottom: 24px; display: flex; align-items: center; gap: 8px;}
.result-header .ai-badge { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--primary-blue); background: #eff6ff; padding: 4px 12px; border-radius: 999px; font-size: 0.875rem;}

.predicted-role {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.confidence-score {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.confidence-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid var(--border-light);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-blue);
  box-shadow: inset 0 0 0 4px #bfdbfe; /* simple fallback for gradient border */
  position: relative;
}

.match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 32px 0;
}

@media (max-width: 768px) {
  .match-grid { grid-template-columns: 1fr; }
}

.match-card {
  padding: 16px;
  border-radius: 12px;
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.match-card.success {
  background: #dcfce7;
  border: 2px solid #86efac;
  color: #166534;
}

.match-card.warning {
  background: #fef3c7;
  border: 2px solid #fcd34d;
  color: #a16207;
}

.match-card h4 {
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.match-skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.match-skill-pill {
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,0.5);
}

.alt-roles-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.alt-role-card {
  padding: 16px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.15s ease;
}

.alt-role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.next-steps-list {
  margin-top: 24px;
}

.next-step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #eff6ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  color: var(--primary-blue);
  font-weight: 500;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-row button {
  flex: 1;
}

.remove-btn { display: inline-flex; align-items: center; font-size: 0.75rem; color: var(--primary-red); background: transparent; border: none; cursor: pointer; }
.remove-btn:hover { text-decoration: underline; }

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-color);
}
::-webkit-scrollbar-thumb {
  background: var(--primary-purple);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}

.toggle-mini {
  background: transparent;
  border: none;
  color: var(--primary-blue);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.toggle-mini:hover { text-decoration: underline; }

/* Custom Ripple Effect class if needed, fallback inside components */
.ripple {
  position: relative;
  overflow: hidden;
}
"""

with open("c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.css", "w", encoding="utf-8") as f:
    f.write(css_content)

print("CSS Written successfully!")
