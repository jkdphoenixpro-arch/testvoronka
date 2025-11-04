const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://d5ca4cd0a7ae92c6c526546233462ba7.loophole.site'
};

export default API_CONFIG;