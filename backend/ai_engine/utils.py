import numpy as np
import pandas as pd
import json
import re
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer

# Standardized Grade Mapping
GRADE_MAPPING = {
    'A+': 6, 'O': 6, 'S': 6,
    'A': 5,
    'A-': 4,
    'B+': 3,
    'B': 2,
    'C': 1,
    'D': 0.5,
    '': 0
}

def grade_to_numeric(grade):
    """Converts letter grades to numeric scores."""
    return GRADE_MAPPING.get(grade.upper(), 0)

# Mission-Critical Subject Synergy Matrix
# Maps subjects to target roles for static bonuses
SYNERGY_MATRIX = {
    "Data Structures and Algorithms": ["Software Engineer", "Backend Developer", "Data Scientist", "System Architect"],
    "Operating Systems": ["DevOps Engineer", "System Architect", "Backend Developer"],
    "Database Management Systems (DBMS)": ["Backend Developer", "Data Engineer", "Database Administrator"],
    "Machine Learning": ["Data Scientist", "AI Engineer", "Machine Learning Engineer"],
    "Deep Learning": ["Data Scientist", "AI Engineer", "Machine Learning Engineer"],
    "Neural Networks": ["AI Engineer", "Machine Learning Engineer"],
    "Natural Language Processing": ["AI Engineer", "Data Scientist"],
    "Software Engineering": ["Software Engineer", "Product Manager", "QA Engineer"],
    "Object Oriented Programming": ["Software Engineer", "Backend Developer", "Frontend Developer"],
    "Web Development": ["Frontend Developer", "Full Stack Developer", "UX Designer"],
    "Statistics": ["Data Scientist", "Data Analyst", "Economist", "Research Analyst"],
    "Linear Algebra": ["Data Scientist", "AI Engineer", "Machine Learning Engineer"],
    "Financial Management": ["Financial Analyst", "Accountant", "Finance Manager"],
    "Marketing Management": ["Marketing Specialist", "Brand Specialist", "Product Manager"],
    "HR Management": ["HR Manager", "Talent Acquisition Specialist"],
    "AutoCAD": ["Civil Engineer", "Site Engineer", "Structural Engineer", "Mechanical Engineer"],
    "STAAD Pro": ["Civil Engineer", "Structural Engineer"],
    "Thermodynamics": ["Mechanical Engineer"],
    "Classical Mechanics": ["Research Scientist", "Lecturer"],
}

def get_internship_score(duration_months):
    """Applies logarithmic scaling to internship duration."""
    return np.log1p(float(duration_months))

def parse_core_subjects(subjects_str):
    """Parses 'Subject:Grade,Subject:Grade' strings into numeric features."""
    if not subjects_str or not isinstance(subjects_str, str):
        return {}
    
    pairs = subjects_str.split(',')
    parsed = {}
    for pair in pairs:
        if ':' in pair:
            name, grade = pair.split(':', 1)
            parsed[name.strip()] = grade_to_numeric(grade.strip())
    return parsed

def parse_projects(projects_json):
    """Parses projects JSON/string to extract domain and skills."""
    if not projects_json:
        return []
    try:
        if isinstance(projects_json, str):
            # Try parsing as JSON first, then as comma-separated if it fails
            if projects_json.startswith('['):
                return json.loads(projects_json)
            else:
                # Fallback for simple string: "Project Name: Skill1, Skill2; Project2: Skill3"
                projects = []
                for p in projects_json.split(';'):
                    if ':' in p:
                        title, skills = p.split(':', 1)
                        projects.append({
                            "title": title.strip(),
                            "skillsApplied": [s.strip() for s in skills.split(',')]
                        })
                return projects
    except:
        return []
    return projects_json if isinstance(projects_json, list) else []
SPECIALIZATION_MAPPING = {
    'Computer Science': {
        'subjects': ["Data Structures and Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Web Development", "Compiler Design"],
        'skills': ['Python', 'Java', 'C++', 'System Design', 'Git']
    },
    'Artificial Intelligence': {
        'subjects': ["Machine Learning", "Deep Learning", "Neural Networks", "NLP", "Statistics", "Linear Algebra"],
        'skills': ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis']
    },
    'Data Science': {
        'subjects': ["Statistics", "Linear Algebra", "Data Mining", "Machine Learning", "Big Data Analytics"],
        'skills': ['Python', 'SQL', 'R', 'Tableau', 'Power BI']
    },
    'Information Technology': {
        'subjects': ["Computer Networks", "Cyber Security", "Database Management Systems", "Web Technologies", "Cloud Computing"],
        'skills': ['Network Administration', 'Linux', 'AWS', 'SQL']
    },
    'Civil Engineering': {
        'subjects': ["Structural Analysis", "Geotechnical Engineering", "Construction Management", "AutoCAD", "STAAD Pro"],
        'skills': ['Project Management', 'Estimation', 'Site Supervision']
    },
    'Mechanical Engineering': {
        'subjects': ["Thermodynamics", "Fluid Mechanics", "Solid Mechanics", "CAD/CAM", "Ansys"],
        'skills': ['SolidWorks', 'MATLAB', 'Manufacturing']
    },
    'Finance': {
        'subjects': ["Financial Management", "Investment Analysis", "Corporate Finance", "Accounting", "Risk Management"],
        'skills': ['Financial Modeling', 'Excel', 'Tally', 'GST']
    },
    'Marketing': {
        'subjects': ["Marketing Management", "Consumer Behavior", "Digital Marketing", "Market Research", "Brand Management"],
        'skills': ['SEO', 'Content Strategy', 'Google Analytics', 'Social Media']
    },
    'Human Resources': {
        'subjects': ["HR Management", "Labor Laws", "Performance Management", "Training and Development"],
        'skills': ['Recruiting', 'Employee Relations', 'Communication']
    },
    'Economics': {
        'subjects': ["Microeconomics", "Macroeconomics", "Econometrics", "Public Finance", "Statistics"],
        'skills': ['Data Analysis', 'Stata', 'Economic Research']
    }
}

ROLE_TO_DOMAIN = {
    "Data Scientist": "AI/Data",
    "Machine Learning Engineer": "AI/Data",
    "AI Engineer": "AI/Data",
    "Software Engineer": "Tech",
    "Backend Developer": "Tech",
    "Frontend Developer": "Tech",
    "Full Stack Developer": "Tech",
    "DevOps Engineer": "Tech",
    "UX Designer": "Design",
    "Product Manager": "Management",
    "Civil Engineer": "Civil",
    "Site Engineer": "Civil",
    "Structural Engineer": "Civil",
    "Construction Manager": "Civil",
    "Mechanical Engineer": "Mechanical",
    "Accountant": "Finance",
    "Financial Analyst": "Finance",
    "Economist": "Research",
    "Research Analyst": "Research",
    "Teaching Professional": "Education",
    "Data Analyst": "AI/Data",
    "Marketing Specialist": "Marketing",
    "Business Analyst": "Management",
    "HR Manager": "HR"
}

def get_domain_subjects(domain):
    """Returns a list of subjects key to a domain."""
    relevant = []
    for sub, roles in SYNERGY_MATRIX.items():
        if any(ROLE_TO_DOMAIN.get(role) == domain for role in roles):
            relevant.append(sub)
    return relevant
class JobFeatureTransformer(BaseEstimator, TransformerMixin):
    """
    Extracts multi-modal features from structured text columns.
    """
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        X_out = pd.DataFrame(index=X.index)
        
        # 1. Subject Grades (Average)
        def get_avg_grade(s):
            parsed = parse_core_subjects(s)
            return np.mean(list(parsed.values())) if parsed else 0
        X_out['avg_subject_grade'] = X['core_subjects'].apply(get_avg_grade)
        
        # 2. Internship Duration (Log Scaled)
        def get_int_duration(s):
            if not s or not isinstance(s, str): return 0
            # Matches digits in strings like "3 months", "2 months", "6"
            durations = re.findall(r'(\d+)', s.lower())
            total = sum(int(d) for d in durations)
            return get_internship_score(total)
        
        X_out['log_internship_duration'] = X['internships'].apply(get_int_duration)
        
        # 3. Project Count
        X_out['project_count'] = X['projects'].apply(lambda x: len(x.split(';')) if x else 0)
        
        # 4. Compiled Text (for CountVectorizer)
        def compile_text(row):
            # Combine subject names, skills, and project titles into a single text blob
            subs = " ".join([p.split(':')[0] for p in row['core_subjects'].split(',') if ':' in p])
            projs = row['projects'] or ""
            skills = row['skills'] or ""
            return f"{subs} {projs} {skills}".lower()
        
        X_out['compiled_text'] = X.apply(compile_text, axis=1)
        
        return X_out

class FullFeaturePipeline(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.jt = JobFeatureTransformer()
        self.scaler = StandardScaler()
        self.onehot = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        self.vectorizer = CountVectorizer(binary=False, min_df=2)
        self.feature_names_ = None
        
    def fit(self, X, y=None):
        custom = self.jt.transform(X)
        self.scaler.fit(pd.concat([
            X[['academic_score', 'marks_10th', 'marks_12th', 'experience_years']],
            custom[['avg_subject_grade', 'log_internship_duration', 'project_count']]
        ], axis=1))
        self.onehot.fit(X[['degree', 'specialization']])
        self.vectorizer.fit(custom['compiled_text'])
        
        # Derive feature names
        num_names = ['academic_score', 'marks_10th', 'marks_12th', 'experience_years', 'avg_subject_grade', 'log_internship_duration', 'project_count']
        cat_names = self.onehot.get_feature_names_out(['degree', 'specialization']).tolist()
        text_names = [f"word_{w}" for w in self.vectorizer.get_feature_names_out()]
        self.feature_names_ = num_names + cat_names + text_names
        
        return self
        
    def transform(self, X):
        custom = self.jt.transform(X)
        num_feats = self.scaler.transform(pd.concat([
            X[['academic_score', 'marks_10th', 'marks_12th', 'experience_years']],
            custom[['avg_subject_grade', 'log_internship_duration', 'project_count']]
        ], axis=1))
        cat_feats = self.onehot.transform(X[['degree', 'specialization']])
        text_feats = self.vectorizer.transform(custom['compiled_text']).toarray()
        
        return np.hstack([num_feats, cat_feats, text_feats])
