const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB подключён: ${conn.connection.host}`);
    
    // Создаем коллекцию users если её нет
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    const usersExists = collections.some(collection => collection.name === 'users');
    
    if (!usersExists) {
      await db.createCollection('users');
      console.log('Коллекция users создана');
    } else {
      console.log('Коллекция users уже существует');
    }
    
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;