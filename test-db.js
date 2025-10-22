const connectDB = require('./src/config/database');
const User = require('./src/models/User');

async function testConnection() {
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Проверяем количество документов в коллекции users
    const userCount = await User.countDocuments();
    console.log(`Количество пользователей в коллекции: ${userCount}`);
    
    // Получаем информацию о коллекции
    const collections = await User.db.db.listCollections().toArray();
    console.log('Доступные коллекции:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    console.log('✅ Подключение к MongoDB успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    // Закрываем подключение
    process.exit(0);
  }
}

testConnection();