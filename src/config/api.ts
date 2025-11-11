const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://voronka-backend-production.up.railway.app'
};

export default API_CONFIG;