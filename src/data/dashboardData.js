// src/data/dashboardData.js

export const domainDistribution = [
  { name: 'Machine Learning & AI', value: 350, color: '#06b6d4' },
  { name: 'Frontend Engineering', value: 420, color: '#ec4899' },
  { name: 'Backend Engineering', value: 380, color: '#8b5cf6' },
  { name: 'Cloud & DevOps', value: 250, color: '#3b82f6' },
  { name: 'Product Management', value: 180, color: '#f59e0b' },
  { name: 'UI/UX Design', value: 150, color: '#10b981' },
];

export const roleAnalytics = {
  "Data Scientist": {
    salary: "₹145k",
    growth: "+32%",
    color: "#06b6d4",
    demandTrend: [
      { month: 'Jan', demand: 400 }, { month: 'Feb', demand: 550 },
      { month: 'Mar', demand: 600 }, { month: 'Apr', demand: 750 },
      { month: 'May', demand: 820 }, { month: 'Jun', demand: 1100 },
    ],
    topSkills: [
      { name: 'Python', value: 95 }, { name: 'Machine Learning', value: 92 },
      { name: 'SQL', value: 85 }, { name: 'Pandas', value: 82 }, { name: 'TensorFlow', value: 75 },
    ]
  },
  "Software Engineer": {
    salary: "₹125k",
    growth: "+15%",
    color: "#3b82f6",
    demandTrend: [
      { month: 'Jan', demand: 800 }, { month: 'Feb', demand: 820 },
      { month: 'Mar', demand: 850 }, { month: 'Apr', demand: 900 },
      { month: 'May', demand: 920 }, { month: 'Jun', demand: 980 },
    ],
    topSkills: [
      { name: 'Java', value: 90 }, { name: 'Python', value: 88 },
      { name: 'C++', value: 80 }, { name: 'Data Structures', value: 85 }, { name: 'Agile', value: 70 },
    ]
  },
  "Product Manager": {
    salary: "₹130k",
    growth: "+18%",
    color: "#f59e0b",
    demandTrend: [
      { month: 'Jan', demand: 500 }, { month: 'Feb', demand: 520 },
      { month: 'Mar', demand: 580 }, { month: 'Apr', demand: 610 },
      { month: 'May', demand: 650 }, { month: 'Jun', demand: 720 },
    ],
    topSkills: [
      { name: 'Agile/Scrum', value: 95 }, { name: 'Roadmapping', value: 90 },
      { name: 'Jira', value: 85 }, { name: 'Data Analytics', value: 78 }, { name: 'Stakeholder Mgmt', value: 75 },
    ]
  },
  "UX Designer": {
    salary: "₹105k",
    growth: "+14%",
    color: "#10b981",
    demandTrend: [
      { month: 'Jan', demand: 400 }, { month: 'Feb', demand: 410 },
      { month: 'Mar', demand: 420 }, { month: 'Apr', demand: 460 },
      { month: 'May', demand: 490 }, { month: 'Jun', demand: 530 },
    ],
    topSkills: [
      { name: 'Figma', value: 98 }, { name: 'UI/UX', value: 95 },
      { name: 'Wireframing', value: 88 }, { name: 'Prototyping', value: 85 }, { name: 'User Testing', value: 70 },
    ]
  },
  "DevOps Engineer": {
    salary: "₹140k",
    growth: "+28%",
    color: "#ec4899",
    demandTrend: [
      { month: 'Jan', demand: 600 }, { month: 'Feb', demand: 640 },
      { month: 'Mar', demand: 700 }, { month: 'Apr', demand: 790 },
      { month: 'May', demand: 850 }, { month: 'Jun', demand: 980 },
    ],
    topSkills: [
      { name: 'Docker', value: 95 }, { name: 'Kubernetes', value: 92 },
      { name: 'AWS', value: 90 }, { name: 'CI/CD', value: 88 }, { name: 'Terraform', value: 82 },
    ]
  },
  "Frontend Developer": {
    salary: "₹115k",
    growth: "+20%",
    color: "#06b6d4",
    demandTrend: [
      { month: 'Jan', demand: 700 }, { month: 'Feb', demand: 730 },
      { month: 'Mar', demand: 750 }, { month: 'Apr', demand: 810 },
      { month: 'May', demand: 880 }, { month: 'Jun', demand: 950 },
    ],
    topSkills: [
      { name: 'React', value: 96 }, { name: 'JavaScript', value: 94 },
      { name: 'HTML/CSS', value: 90 }, { name: 'TypeScript', value: 85 }, { name: 'Tailwind', value: 80 },
    ]
  },
  "Backend Developer": {
    salary: "₹135k",
    growth: "+22%",
    color: "#8b5cf6",
    demandTrend: [
      { month: 'Jan', demand: 650 }, { month: 'Feb', demand: 680 },
      { month: 'Mar', demand: 710 }, { month: 'Apr', demand: 780 },
      { month: 'May', demand: 840 }, { month: 'Jun', demand: 920 },
    ],
    topSkills: [
      { name: 'Node.js / Python', value: 94 }, { name: 'SQL/PostgreSQL', value: 92 },
      { name: 'REST APIs', value: 90 }, { name: 'MongoDB', value: 85 }, { name: 'Docker', value: 80 },
    ]
  },
  "Marketing Specialist": {
    salary: "₹85k",
    growth: "+10%",
    color: "#f59e0b",
    demandTrend: [
      { month: 'Jan', demand: 300 }, { month: 'Feb', demand: 310 },
      { month: 'Mar', demand: 330 }, { month: 'Apr', demand: 350 },
      { month: 'May', demand: 370 }, { month: 'Jun', demand: 390 },
    ],
    topSkills: [
      { name: 'Digital Marketing', value: 92 }, { name: 'SEO', value: 88 },
      { name: 'Social Media', value: 85 }, { name: 'Google Analytics', value: 80 }, { name: 'Content Strategy', value: 75 },
    ]
  },
  "HR Manager": {
    salary: "₹95k",
    growth: "+8%",
    color: "#10b981",
    demandTrend: [
      { month: 'Jan', demand: 250 }, { month: 'Feb', demand: 260 },
      { month: 'Mar', demand: 270 }, { month: 'Apr', demand: 290 },
      { month: 'May', demand: 300 }, { month: 'Jun', demand: 320 },
    ],
    topSkills: [
      { name: 'Recruiting', value: 95 }, { name: 'Employee Relations', value: 90 },
      { name: 'Onboarding', value: 85 }, { name: 'Performance Mgmt', value: 82 }, { name: 'Communication', value: 90 },
    ]
  }
};
