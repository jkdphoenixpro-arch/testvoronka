const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const { generatePassword } = require('./src/utils/passwordGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Разрешить запросы с любого домена
  credentials: true, // Разрешить отправку cookies и авторизационных заголовков
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Подключение к базе данных
connectDB();

// Маршрут для авторизации
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Проверяем наличие данных
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Ищем пользователя в базе данных
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Проверяем, что пользователь имеет роль customer
    if (user.role !== 'customer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access is allowed only for users with paid subscription' 
      });
    }
    
    // Проверяем наличие пароля
    if (!user.password) {
      return res.status(403).json({ 
        success: false, 
        message: 'Password is not set. Please contact administrator.' 
      });
    }
    
    // Проверяем пароль (простое сравнение без шифрования)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }
    
    // Успешная авторизация
    res.json({
      success: true,
      message: 'Authorization successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// API для создания пользователя с ролью lead
app.post('/api/users/create-lead', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Проверяем наличие данных
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and email are required' 
      });
    }
    
    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Создаем нового пользователя с ролью lead
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'lead',
      isEmailVerified: false
    });
    
    await newUser.save();
    
    res.json({
      success: true,
      message: 'Lead user created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (error) {
    console.error('Ошибка создания лида:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// API для обновления пользователя до customer после оплаты
app.post('/api/users/upgrade-to-customer', async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    
    // Проверяем наличие данных
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    // Находим пользователя
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Проверяем, что пользователь является lead
    if (user.role !== 'lead') {
      return res.status(400).json({ 
        success: false, 
        message: 'User already has customer role or invalid role' 
      });
    }
    
    // Генерируем пароль
    const password = generatePassword(10);
    
    // Обновляем пользователя
    user.role = 'customer';
    user.password = password;
    user.isEmailVerified = true;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User upgraded to customer',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      password: password // Возвращаем пароль для отображения пользователю
    });
    
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Проверка состояния сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 API доступно по адресу: http://localhost:${PORT}`);
  console.log(`🔑 Тестовые данные для входа:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: password123`);
});