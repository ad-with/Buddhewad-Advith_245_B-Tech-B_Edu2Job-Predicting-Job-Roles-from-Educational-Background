import spacy
from spacy.matcher import PhraseMatcher
import re
from datetime import datetime

# Comprehensive industry skill dictionary
SKILLS_LIST = [
    # Programming Languages
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "R", "MATLAB", "Perl", "Scala", "Dart", "Haskell", "Solidity",
    # Web & Frontend
    "HTML", "CSS", "React", "Vue", "Angular", "Next.js", "Tailwind", "Bootstrap", "Redux", "SASS", "LESS", "jQuery", "WebAssembly", "Three.js", "Svelte", "Remix", "Material UI",
    # Backend & Frameworks
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", ".NET Core", "GraphQL", "REST APIs", "Laravel", "Ruby on Rails", "NestJS", "Microservices", "gRPC",
    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB", "Firebase", "Oracle", "MariaDB", "SQLite", "Neo4j", "InfluxDB",
    # Cloud & Infrastructure
    "AWS", "Azure", "GCP", "Google Cloud", "DigitalOcean", "Heroku", "Vercel", "Netlify", "Cloudflare",
    # DevOps & Tools
    "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Ansible", "Puppet", "Chef", "Linux", "Bash", "Shell Scripting", "Prometheus", "Grafana", "ELK Stack", "ArgoCD", "GitHub Actions", "GitLab CI",
    # Data Science & ML
    "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Keras", "NLP", "Computer Vision", "Tableau", "Power BI", "Spark", "Hadoop", "Dask", "OpenCV", "NLTK", "Spacy", "XGBoost", "LightGBM", "Reinforcement Learning",
    # Theory & Software Engineering
    "Algorithms", "Data Structures", "System Design", "Object-Oriented Programming", "OOP", "Design Patterns", "Test Driven Development", "TDD", "Agile", "Scrum", "Jira", "Confluence", "Git", "GitHub", "GitLab", "Bitbucket",
    # Mobile Development
    "React Native", "Flutter", "Ionic", "Xamarin", "Android SDK", "iOS Development", "SwiftUI", "Jetpack Compose",
    # Cybersecurity & Networking
    "Ethical Hacking", "Penetration Testing", "Network Security", "Cryptography", "OWASP", "Wireshark", "Nmap", "Metasploit", "Firewalls", "VPN",
    # Specialized Domains
    "Blockchain", "Smart Contracts", "Web3", "Unity", "Unreal Engine", "Game Development", "Embedded Systems", "IoT", "Robotics", "AR/VR",
    # Management & Soft Skills
    "Product Management", "Project Management", "Technical Leadership", "Agile Coaching", "Business Analysis", "Communication", "Problem Solving", "Teamwork", "Leadership"
]

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
            
        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        skill_patterns = [self.nlp.make_doc(skill) for skill in SKILLS_LIST]
        self.matcher.add("SKILLS", skill_patterns)

    def clean_text(self, text: str) -> str:
        # Standardize whitespace and remove overly complex special characters
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'[^a-zA-Z0-9\s\.\+\#\-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_skills(self, doc) -> list:
        matches = self.matcher(doc)
        extracted = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            matched_text = span.text.lower()
            for true_skill in SKILLS_LIST:
                if true_skill.lower() == matched_text:
                    extracted.add(true_skill)
                    break
        return sorted(list(extracted))

    def extract_education(self, text: str) -> str:
        text_lower = text.lower()
        degrees = {
            "PhD": [r'\bphd\b', r'doctor of philosophy', r'doctorate'],
            "Masters": [r'\bmaster\b', r'\bm\.sc\b', r'\bm\.tech\b', r'\bmba\b', r'\bmca\b', r'\bm\.e\b'],
            "Bachelors": [r'\bbachelor\b', r'\bb\.sc\b', r'\bb\.tech\b', r'\bbca\b', r'\bb\.e\b', r'\bb\.a\b', r'\bb\.com\b'],
            "Diploma": [r'\bdiploma\b', r'\bassociate degree\b']
        }
        
        for degree, patterns in degrees.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return degree
        return "Bachelors"

    def extract_experience(self, text: str) -> int:
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*of\s*experience',
            r'experience\s*:\s*(\d+)\+?\s*years?',
            r'total\s*experience\s*(\d+)',
            r'(\d+)\+?\s*yrs\s*exp'
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, text.lower())
            if match:
                try:
                    return int(match.group(1))
                except: pass

        years = re.findall(r'\b(20\d{2})\b', text)
        if years:
            years = sorted([int(y) for y in years])
            current_year = datetime.now().year
            start_year = years[0]
            if start_year < 1990: start_year = 2020 
            diff = current_year - start_year
            if diff > 4: return min(diff - 4, 20)
            else: return 0

        if re.search(r'\b(fresher|entry level|graduate|intern)\b', text.lower()):
            return 0
        return 1

    def extract_projects(self, text: str) -> list:
        # Split into lines to avoid multi-line capture issues
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        projects = []
        for line in lines:
            # Look for lines starting with keywords or bullets
            if any(line.lower().startswith(k) for k in ["project:", "personal project:", "academic project:", "major project:"]):
                # Extract after colon
                proj = re.sub(r'^(?:project|personal project|academic project|major project)\s*[:\-]\s*', '', line, flags=re.I)
                if len(proj) > 5: projects.append(proj)
            elif re.match(r'^[\u2022\-\*\d\.]+\s*(?:Developed|Built|Created|Implemented)\b', line, re.I):
                proj = re.sub(r'^[\u2022\-\*\d\.]+\s*', '', line)
                if len(proj) > 10: projects.append(proj)

        return sorted(list(set(projects)), key=len, reverse=True)[:5]

    def extract_certifications(self, text: str) -> list:
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        certs = []
        
        cert_keywords = ["Certified", "Certification", "Certificate"]
        providers = ["AWS", "Google Cloud", "Azure", "Cisco", "Microsoft", "Oracle", "IBM", "Coursera", "Udemy", "edX"]
        
        for line in lines:
            if any(k in line for k in cert_keywords):
                if any(p in line for p in providers) or "Certified" in line:
                    # Clean the line
                    clean_cert = re.sub(r'^[\u2022\-\*\d\.]+\s*', '', line)
                    if len(clean_cert) > 5:
                        certs.append(clean_cert)

        return sorted(list(set(certs)), key=len, reverse=True)[:5]

    def calculate_score(self, data: dict) -> int:
        score = 0
        num_skills = len(data['skills'])
        score += min(num_skills * 4, 40)
        
        exp = data['experience_years']
        if exp >= 5: score += 25
        elif exp >= 3: score += 20
        elif exp >= 1: score += 15
        else: score += 5
        
        edu = data['education']
        if edu == "PhD": score += 15
        elif edu == "Masters": score += 12
        elif edu == "Bachelors": score += 10
        else: score += 5
        
        num_extras = len(data['projects']) + len(data['certifications'])
        score += min(num_extras * 5, 20)
        
        return min(score, 100)

    def parse(self, text: str) -> dict:
        skills_doc = self.nlp(self.clean_text(text))
        
        data = {
            "skills": self.extract_skills(skills_doc),
            "education": self.extract_education(text),
            "experience_years": self.extract_experience(text),
            "projects": self.extract_projects(text),
            "certifications": self.extract_certifications(text)
        }
        
        data["score"] = self.calculate_score(data)
        return data

# Singleton instance
resume_parser = ResumeParser()

def extract_resume_features_spacy(resume_text: str) -> dict:
    """Entry point for the backend logic"""
    return resume_parser.parse(resume_text)
