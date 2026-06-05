const API_BASE_URL = 'http://localhost:8000/api/v1';

// Private helper to handle authenticated requests
const authenticatedFetch = async (url, options = {}) => {
  const isAdminRoute = url.startsWith('/admin');
  const token = isAdminRoute 
    ? (localStorage.getItem('admin_access_token') || localStorage.getItem('access_token')) 
    : localStorage.getItem('access_token');
  
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  // If body is NOT FormData, set JSON content type
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Network response was not ok' }));
    let errorMsg = errData.detail || 'API request failed';
    if (Array.isArray(errData.detail)) {
      errorMsg = errData.detail.map((e) => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join(', ');
    }
    throw new Error(errorMsg);
  }

  return response.json();
};

export const authService = {
  async login(credentials) {
    // FastAPI's OAuth2PasswordRequestForm expects data in form-urlencoded format
    // and uses 'username' instead of 'email'
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    return authenticatedFetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
  },
  async signup(userData) {
    return authenticatedFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
};

export const aiService = {
  // Predictive AI
  async predictJob(data) {
    return authenticatedFetch('/predict/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generative AI: Resume Analyzer
  async analyzeResume(data) {
    return authenticatedFetch('/genai/resume-analyzer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generative AI: Resume NLP Extraction
  async extractResumeFeatures(data) {
    const isFormData = data instanceof FormData;
    return authenticatedFetch('/genai/resume-extract', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Generative AI: Career Roadmap
  async generateRoadmap(data) {
    return authenticatedFetch('/genai/career-roadmap', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generative AI: Simulate Resume Improvements
  async simulateImprovements(data) {
    return authenticatedFetch('/genai/simulate-improvements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generative AI: Project Recommendations
  async getProjectRecommendations(data) {
    return authenticatedFetch('/genai/project-recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generative AI: Skill Gap Analysis
  async analyzeSkillGap(data) {
    return authenticatedFetch('/genai/skill-gap-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

export const adminService = {
  async login(credentials) {
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    return authenticatedFetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
  },
  
  async getDashboardStats() {
    return authenticatedFetch('/admin/dashboard-stats', { method: 'GET' });
  },

  async getRoleAnalytics() {
    return authenticatedFetch('/admin/analytics/roles', { method: 'GET' });
  },

  async getPredictionGrowth() {
    return authenticatedFetch('/admin/analytics/growth', { method: 'GET' });
  },

  async getRolesAnalytics() {
    return authenticatedFetch('/admin/roles-analytics', { method: 'GET' });
  },

  async getSkillsAnalytics() {
    return authenticatedFetch('/admin/skills-analytics', { method: 'GET' });
  },

  async getCareerTrends() {
    return authenticatedFetch('/admin/career-trends', { method: 'GET' });
  },

  async getUsersList(page = 1, limit = 10) {
    return authenticatedFetch(`/admin/users?page=${page}&limit=${limit}`, { method: 'GET' });
  },

  async getUserDetails(userId) {
    return authenticatedFetch(`/admin/users/${userId}`, { method: 'GET' });
  },

  async getAiInsights() {
    return authenticatedFetch('/admin/ai-insights', { method: 'GET' });
  },

  async getPredictions(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString();
    return authenticatedFetch(`/admin/predictions${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  async getTrendsAnalytics() {
    return authenticatedFetch('/admin/trends', { method: 'GET' });
  }
};

export const userService = {
  async getLatestPrediction() {
    return authenticatedFetch('/user/latest-prediction', { method: 'GET' });
  }
};




