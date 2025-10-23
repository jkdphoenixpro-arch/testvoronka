export const isAuthenticated = (): boolean => {
  try {
    const user = localStorage.getItem('user');
    return user !== null && user !== 'undefined';
  } catch (error) {
    return false;
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};