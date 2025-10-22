/**
 * Проверяет, авторизован ли пользователь
 * @returns true если пользователь авторизован, false в противном случае
 */
export const isAuthenticated = (): boolean => {
  try {
    const user = localStorage.getItem('user');
    return user !== null && user !== 'undefined';
  } catch (error) {
    return false;
  }
};

/**
 * Получает данные авторизованного пользователя
 * @returns объект пользователя или null если не авторизован
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Удаляет данные пользователя (выход из системы)
 */
export const logout = () => {
  localStorage.removeItem('user');
};