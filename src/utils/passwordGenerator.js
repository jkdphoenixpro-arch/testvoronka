/**
 * Генерирует случайный пароль для пользователя
 * @param {number} length - длина пароля (по умолчанию 8)
 * @returns {string} - сгенерированный пароль
 */
const generatePassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

module.exports = { generatePassword };