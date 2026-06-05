export const SUPPORTING_TOOLS = [
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'Postman', 'Figma', 'Power BI', 'Tableau', 'Jira', 'Confluence', 'Webpack', 'Vite',
  'npm', 'yarn', 'TensorFlow', 'PyTorch', 'Jenkins', 'Terraform', 'Ansible', 'AutoCAD',
  'Civil 3D', 'STAAD Pro', 'MS Project', 'Revit', 'ETABS', 'SAP2000', 'MongoDB', 'Redis',
  'Linux', 'Bash', 'Networking', 'Jupyter'
];

export const OPTIONAL_SKILLS = [
  'Deep Learning', 'NLP', 'System Design', 'CI/CD', 'Microservices', 'GraphQL',
  'WebSockets', 'Agile/Scrum', 'React Native', 'Flutter', 'Cloud Computing',
  'Machine Learning', 'Data Warehousing', 'ETL processes', 'A/B Testing'
];

export const isSupportingTool = (skill) => SUPPORTING_TOOLS.some(t => t.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(t.toLowerCase()));
export const isOptionalSkill = (skill) => OPTIONAL_SKILLS.some(o => o.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(o.toLowerCase()));

export const SKILLS_DATA = {
  "Software Engineer": [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Rust", 
    "HTML5", "CSS3", "React", "Node.js",
    "Data Structures", "Algorithms", "System Design", "Object-Oriented Programming (OOP)",
    "REST APIs", "Microservices", "Design Patterns", "Test-Driven Development (TDD)", "Agile/Scrum",
    "Git", "SQL", "MongoDB", "Docker", "Kubernetes", "AWS", "CI/CD"
  ],
  "Frontend Developer": [
    "HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Angular", "TypeScript",
    "Responsive Design", "DOM Manipulation", "Web Performance", "Cross-Browser Compatibility",
    "State Management", "Redux", "Tailwind CSS", "Bootstrap", "Webpack", "Vite", "Figma", "Git", "Web Accessibility (a11y)"
  ],
  "Backend Developer": [
    "Python", "Java", "Node.js", "Go", "C#", "Ruby", "PHP", "JavaScript", "TypeScript",
    "HTML5", "CSS3", "React",
    "Server-Side Logic", "API Design", "Data Modeling", "Database Management", 
    "SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Authentication/Authorization",
    "System Architecture", "Query Optimization", "Docker", "REST APIs", "GraphQL", "Linux", "Git", "Unit Testing"
  ],
  "DevOps Engineer": [
    "Linux", "Bash", "Shell Scripting", "Networking", "System Architecture", "CI/CD",
    "Infrastructure as Code (IaC)", "Automation", "Cloud Computing", "System Monitoring",
    "Docker", "Kubernetes", "Jenkins", "GitLab CI", "Terraform", "Ansible", "AWS", "Azure", "Google Cloud",
    "Prometheus", "Grafana", "Git", "Python scripting", "Go"
  ],
  "Data Scientist": [
    "Python", "R", "Machine Learning", "Deep Learning", "Statistics", "Data Preprocessing",
    "Predictive Modeling", "Feature Engineering", "Mathematics", "Probability", "NLP",
    "Computer Vision", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "SQL", "Jupyter",
    "Tableau", "Power BI"
  ],
  "Data Analyst": [
    "Data Visualization", "Data Cleaning", "Statistical Analysis", "Reporting",
    "Exploratory Data Analysis (EDA)", "Analytical Thinking", "Communication", "A/B Testing",
    "Business Intelligence", "SQL", "Excel", "Tableau", "Power BI", "Python", "R",
    "Pandas", "Matplotlib", "Google Analytics", "Metabase"
  ],
  "UX Designer": [
    "UX Research", "Interaction Design", "Wireframing", "Prototyping", "Usability Testing",
    "Information Architecture", "User Personas", "Journey Mapping", "Visual Design",
    "Accessibility Guidelines (WCAG)", "Figma", "Adobe XD", "Sketch", "InVision", "Miro",
    "Zeplin", "HTML5", "CSS3", "Hotjar"
  ],
  "Product Manager": [
    "Product Strategy", "Agile", "Scrum", "Requirements Gathering", "Market Research",
    "Roadmapping", "Stakeholder Management", "User Story Creation", "Leadership",
    "Data-Driven Decision Making", "Financial Modeling", "Jira", "Confluence", "Trello",
    "Google Analytics", "Mixpanel", "Amplitude", "A/B Testing"
  ],
  "Civil Engineer": [
    "Structural Analysis", "Fluid Mechanics", "Geotechnical Engineering", "Construction Management",
    "Project Estimation", "Material Science", "Surveying", "Structural Principles",
    "AutoCAD", "Civil 3D", "STAAD Pro", "Revit", "MS Project", "GIS software"
  ],
  "Site Engineer": [
    "Construction Supervision", "Quality Control", "Site Safety Management", "Blueprint Reading",
    "Resource Allocation", "Project Execution", "Material Testing", "AutoCAD", "MS Project",
    "Procore", "PlanGrid", "Total Station (Instrumentation)", "Primavera P6"
  ],
  "Structural Engineer": [
    "Structural Analysis", "Load Calculation", "Material Behavior (Steel)", "Material Behavior (Concrete)",
    "Seismic Design", "Code Compliance", "Building Codes", "Earthquake Engineering",
    "Mechanics of Materials", "STAAD Pro", "ETABS", "SAP2000", "SAFE", "AutoCAD", "Revit", "Tekla Structures"
  ],
  "Construction Manager": [
    "Project Management", "Budgeting & Cost Control", "Contract Administration",
    "Risk Management", "Resource Scheduling", "Project Planning",
    "Primavera P6", "MS Project", "Procore", "Bluebeam Revu", "Buildertrend", "Excel"
  ],
  "AI Engineer": [
    "Python", "Machine Learning", "Deep Learning", "TensorFlow", 
    "PyTorch", "NLP", "Computer Vision", "Cloud Computing", 
    "Git", "Docker", "REST APIs"
  ],
  "Cloud Architect": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", 
    "CI/CD", "Linux", "Networking", "System Architecture", 
    "Security", "Python"
  ],
  "Full Stack Developer": [
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", 
    "Node.js", "Express.js", "MongoDB", "SQL", "HTML", 
    "CSS", "Tailwind CSS", "Git"
  ],
  "Research Scientist": [
    "Research Skills", "Data Analysis", "Scientific Writing", 
    "Lab Techniques", "Critical Thinking", "Statistics", "Experimental Design"
  ],
  "Chemist": [
    "Organic Chemistry", "Analytical Skills", "Lab Techniques", 
    "Chemical Safety", "Molecular Modeling", "Inorganic Chemistry", "Spectroscopy"
  ],
  "Astrophysicist": [
    "Physics concepts", "Mathematics", "Data Analysis", "MATLAB", 
    "Python", "Numerical Modeling", "Observational Techniques"
  ],
  "Quality Analyst": [
    "Analytical Skills", "Quality Control", "Standard Operating Procedures", 
    "Documentation", "Attention to Detail", "Safety Compliance"
  ],
  "Research Associate": [
    "Research Skills", "Data Collection", "Literature Review", 
    "Scientific Writing", "Project Coordination", "Lab Support"
  ],
  "Lecturer": [
    "Public Speaking", "Curriculum Development", "Mentoring", 
    "Subject Matter Expertise", "Research", "Academic Assessment"
  ],
  "Financial Analyst": [
    "Financial Modeling", "Excel", "Data Analysis", "Accounting", 
    "Risk Management", "Reporting", "Econometrics"
  ],
  "Business Consultant": [
    "Strategic Planning", "Leadership", "Business Analysis", 
    "Project Management", "Problem Solving", "Professional Presentation"
  ],
  "HR Manager": [
    "Recruitment", "Employee Relations", "Performance Management", 
    "Conflict Resolution", "HR Policy", "Leadership"
  ],
  "default": [
    "Problem Solving", "Communication", "Team Collaboration", 
    "Project Management", "Git", "Basic Programming"
  ]
};

export const getRequiredSkillsForRole = (role) => {
  if (!role) return SKILLS_DATA["default"];
  
  // Try exact match first
  if (SKILLS_DATA[role]) return SKILLS_DATA[role];
  
  // Try partial match
  const matchKey = Object.keys(SKILLS_DATA).find(k => 
    role.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(role.toLowerCase())
  );
  
  return matchKey ? SKILLS_DATA[matchKey] : SKILLS_DATA["default"];
};
