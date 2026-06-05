export const COURSES_DATA = [
  // Python & Data
  { title: "100 Days of Code: The Complete Python Pro Bootcamp", provider: "Udemy", skill: "Python", duration: "60 hours", difficulty: "Beginner", rating: 4.8, description: "Master Python by building 100 projects in 100 days. Excellent for core mechanics." },
  { title: "Python for Everybody Specialization", provider: "Coursera", skill: "Python", duration: "8 months", difficulty: "Beginner", rating: 4.8, description: "University of Michigan's foundational programming course focusing on data structures." },
  { title: "Complete Data Science Bootcamp", provider: "Udemy", skill: "Data Analysis", duration: "32 hours", difficulty: "Beginner", rating: 4.6, description: "Learn mathematics, statistics, and machine learning models for data analysts." },
  { title: "Data Visualization with Tableau", provider: "Coursera", skill: "Tableau", duration: "3 weeks", difficulty: "Intermediate", rating: 4.7, description: "Create interactive dashboards and connect business intelligence." },
  { title: "Exploratory Data Analysis (EDA) Fundamentals", provider: "Udemy", skill: "Exploratory Data Analysis (EDA)", duration: "10 hours", difficulty: "Intermediate", rating: 4.6, description: "Deep dive into statistical visualization and real-world data cleaning." },
  { title: "Advanced Data Science with Python", provider: "Udemy", provider: "Coursera", skill: "Python", duration: "12 hours", difficulty: "Advanced", rating: 4.9, description: "Master advanced data manipulation and statistical modeling with Python." },
  { title: "SQL for Data Science", provider: "Coursera", skill: "SQL", duration: "14 hours", difficulty: "Beginner", rating: 4.7, description: "Learn SQL fundamentals specifically for data analysis and reporting." },

  // JavaScript / Frontend
  { title: "The Complete JavaScript Course 2024", provider: "Udemy", skill: "JavaScript", duration: "68 hours", difficulty: "Beginner", rating: 4.8, description: "Zero to expert JavaScript encompassing modern ES6+ fundamentals." },
  { title: "React - The Complete Guide", provider: "Udemy", skill: "React", duration: "50 hours", difficulty: "Intermediate", rating: 4.7, description: "Dive into Hooks, React Router, Redux, and Next.js." },
  { title: "Understanding TypeScript", provider: "Udemy", skill: "TypeScript", duration: "15 hours", difficulty: "Intermediate", rating: 4.7, description: "Boost your code quality with strict typing for scalable frontend applications." },
  { title: "Advanced React Patterns", provider: "Udemy", skill: "React", duration: "12 hours", difficulty: "Advanced", rating: 4.9, description: "Master reusable components, higher-order components, and performance optimization." },
  { title: "Next.js 14 & React - The Complete Guide", provider: "Udemy", skill: "Next.js", duration: "25 hours", difficulty: "Intermediate", rating: 4.8, description: "Build fullstack applications with Next.js App Router and Server Actions." },
  { title: "Vue.js 3 - The Complete Guide", provider: "Udemy", skill: "Vue.js", duration: "31 hours", difficulty: "Intermediate", rating: 4.7, description: "Master Vue.js and the Composition API for modern web development." },
  { title: "Angular - The Complete Guide", provider: "Udemy", skill: "Angular", duration: "34 hours", difficulty: "Intermediate", rating: 4.6, description: "Learn Angular from scratch to build robust enterprise applications." },

  // Backend & Systems
  { title: "Node.js, Express, MongoDB & More", provider: "Udemy", skill: "Node.js", duration: "42 hours", difficulty: "Intermediate", rating: 4.7, description: "Build fast, highly scalable backend APIs and authentication services." },
  { title: "Grokking the System Design Interview", provider: "Educative", skill: "System Design", duration: "20 hours", difficulty: "Advanced", rating: 4.8, description: "Architect distributed systems to prepare for high-level engineering roles." },
  { title: "Microservices Architecture", provider: "Coursera", skill: "Microservices", duration: "4 weeks", difficulty: "Advanced", rating: 4.7, description: "Design resilient microservices using Docker and container orchestration." },
  { title: "Go: The Complete Developer's Guide", provider: "Udemy", skill: "Go", duration: "22 hours", difficulty: "Intermediate", rating: 4.8, description: "Learn Go from the ground up, including concurrency and systems programming." },
  { title: "Java Programming Masterclass", provider: "Udemy", skill: "Java", duration: "80 hours", difficulty: "Beginner", rating: 4.7, description: "Learn Java for software development, Android, and backend systems." },
  { title: "Spring Boot 3 & Spring Framework 6", provider: "Udemy", skill: "Spring Boot", duration: "35 hours", difficulty: "Intermediate", rating: 4.8, description: "Build enterprise Java applications with Spring Boot and Spring Data JPA." },

  // Database (SQL, NoSQL)
  { title: "The Ultimate MySQL Bootcamp", provider: "Udemy", skill: "SQL", duration: "20 hours", difficulty: "Beginner", rating: 4.7, description: "Go from SQL beginner to querying complex real-world data infrastructures." },
  { title: "MongoDB - The Complete Guide", provider: "Udemy", skill: "MongoDB", duration: "17 hours", difficulty: "Intermediate", rating: 4.6, description: "Master NoSQL database modeling and complex aggregation pipelines." },

  // Cloud, DevOps, & Tools
  { title: "AWS Certified Solutions Architect", provider: "Udemy", skill: "AWS", duration: "27 hours", difficulty: "Intermediate", rating: 4.8, description: "Master cloud infrastructure and pass the industry standard AWS Associate exam." },
  { title: "Docker Mastery: with Kubernetes", provider: "Udemy", skill: "Docker", duration: "21 hours", difficulty: "Beginner", rating: 4.8, description: "Dockerize apps and build highly scalable swarms." },
  { title: "Version Control with Git", provider: "Infosys Springboard", skill: "Git", duration: "10 hours", difficulty: "Beginner", rating: 4.5, description: "Understand industry-standard version control and collaborative branching." },
  { title: "DevOps Culture and Practice", provider: "Coursera", skill: "CI/CD", duration: "4 weeks", difficulty: "Intermediate", rating: 4.8, description: "Build automated deployment pipelines using Jenkins and modern principles." },
  { title: "Kubernetes for Developers", provider: "Udemy", skill: "Kubernetes", duration: "15 hours", difficulty: "Advanced", rating: 4.7, description: "Master container orchestration and service mesh for production environments." },
  { title: "Azure Fundamentals AZ-900", provider: "Udemy", skill: "Azure", duration: "8 hours", difficulty: "Beginner", rating: 4.6, description: "Start your cloud journey with Microsoft Azure certification prep." },

  // AI & Machine Learning
  { title: "Deep Learning Specialization", provider: "Coursera", skill: "Deep Learning", duration: "5 months", difficulty: "Advanced", rating: 4.9, description: "Build and train neural network architectures, led by Andrew Ng." },
  { title: "Natural Language Processing Specialization", provider: "Coursera", skill: "NLP", duration: "4 months", difficulty: "Advanced", rating: 4.7, description: "Design complex linguistic AI models and transformers." },
  { title: "Machine Learning with PyTorch", provider: "Udemy", skill: "Machine Learning", duration: "28 hours", difficulty: "Intermediate", rating: 4.8, description: "Build real-world ML models using the industry's most flexible framework." },

  // Product, UX, & Management
  { title: "Google UX Design Professional Certificate", provider: "Coursera", skill: "UX Research", duration: "6 months", difficulty: "Beginner", rating: 4.8, description: "Learn foundational UX frameworks, wireframing, and user empathy." },
  { title: "Complete Figma Megacourse", provider: "Udemy", skill: "Figma", duration: "18 hours", difficulty: "Intermediate", rating: 4.7, description: "Design stunning UI/UX layouts, interactive prototypes, and atomic design systems." },
  { title: "Become a Product Manager", provider: "Udemy", skill: "Product Strategy", duration: "13 hours", difficulty: "Beginner", rating: 4.6, description: "Learn to manage product lifecycles, user journeys, and cross-functional teams." },
  { title: "Agile Project Management", provider: "Coursera", skill: "Agile", duration: "4 weeks", difficulty: "Intermediate", rating: 4.7, description: "Run sprints, write user stories, and become a certified Scrum practitioner." },

  // Civil & Mechanical Engineering
  { title: "AutoCAD 2024 Masterclass", provider: "Udemy", skill: "AutoCAD", duration: "16 hours", difficulty: "Beginner", rating: 4.7, description: "Master 2D and 3D drafting for architectural and site engineering." },
  { title: "Construction Project Management", provider: "Coursera", skill: "Construction Management", duration: "5 months", difficulty: "Intermediate", rating: 4.8, description: "Learn estimation, scheduling, and risk management with Primavera P6 and MS Project." }
];

export const getRecommendedCourses = (missingSkills, role) => {
  if (!missingSkills || missingSkills.length === 0) {
    // Return diverse, high-value defaults for highly skilled candidates
    return COURSES_DATA.filter(c => c.difficulty === "Advanced" || c.difficulty === "Intermediate").slice(0, 8);
  }

  let matchedCourses = COURSES_DATA.filter(course => 
    missingSkills.some(skill => 
      course.skill.toLowerCase() === skill.toLowerCase() ||
      skill.toLowerCase().includes(course.skill.toLowerCase())
    )
  );

  matchedCourses.sort((a, b) => b.rating - a.rating);

  if (matchedCourses.length > 12) {
    matchedCourses = matchedCourses.slice(0, 12);
  }

  // Fallback to ensuring courses exist for the profile type
  if (matchedCourses.length === 0) {
    return COURSES_DATA.filter(c => c.difficulty === "Beginner").slice(0, 8);
  }

  return matchedCourses;
};

export const getCourseImage = (skill) => {
  const images = {
    'python': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'data analysis': 'https://images.unsplash.com/photo-1551288049-bbbda536ad8a?auto=format&fit=crop&q=80&w=800',
    'tableau': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'exploratory data analysis (eda)': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
    'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800',
    'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    'typescript': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    'next.js': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800',
    'vue.js': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
    'angular': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800',
    'node.js': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    'java': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    'go': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
    'spring boot': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'system design': 'https://images.unsplash.com/photo-1508921334172-b68ed301dc82?auto=format&fit=crop&q=80&w=800',
    'microservices': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    'mongodb': 'https://images.unsplash.com/photo-1558494949-ef8b58b2004d?auto=format&fit=crop&q=80&w=800',
    'aws': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    'azure': 'https://images.unsplash.com/photo-1558494949-ef8b58b2004d?auto=format&fit=crop&q=80&w=800',
    'docker': 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?auto=format&fit=crop&q=80&w=800',
    'kubernetes': 'https://images.unsplash.com/photo-1618401471353-b98aadebc25a?auto=format&fit=crop&q=80&w=800',
    'git': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=800',
    'ci/cd': 'https://images.unsplash.com/photo-1618401471353-b98aadebc25a?auto=format&fit=crop&q=80&w=800',
    'deep learning': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    'machine learning': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
    'nlp': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
    'ux research': 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800',
    'figma': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    'product strategy': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800',
    'agile': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    'autocad': 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800',
    'construction management': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
  };

  const normalizedSkill = skill?.toLowerCase() || '';
  for (const [key, value] of Object.entries(images)) {
    if (normalizedSkill.includes(key)) return value;
  }

  // Fallback
  return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800';
};
