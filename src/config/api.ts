const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://b2edd5705da5c1f53fc73d96a2914e91.loophole.site'
};

export default API_CONFIG;