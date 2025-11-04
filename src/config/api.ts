const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://9b3543ad7bbdf99f3e72e36435e3fd79.loophole.site'
};

export default API_CONFIG;