const connectDB = require('./src/config/database');
const User = require('./src/models/User');

async function createTestUser() {
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Пользователь с таким email уже существует');
      console.log(`Email: ${existingUser.email}`);
      console.log(`Password: password123`);
    } else {
      // Создаем тестового пользователя
      const testUser = new User({
        email: 'test@example.com',
        password: 'password123', // Простой пароль без шифрования
        name: 'Test User',
        isEmailVerified: true
      });
      
      await testUser.save();
      console.log('✅ Тестовый пользователь создан успешно!');
      console.log(`Email: ${testUser.email}`);
      console.log(`Password: password123`);
      console.log(`Name: ${testUser.name}`);
    }
    
    // Показываем всех пользователей
    const userCount = await User.countDocuments();
    console.log(`\nВсего пользователей в базе: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    process.exit(0);
  }
}

createTestUser();