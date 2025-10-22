const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const mongoose = require('mongoose');
require('dotenv').config();

// Подключение к MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB подключён: ${conn.connection.host}`);
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

// Модель пользователя
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['lead', 'customer'],
    default: 'lead'
  },
  goals: {
    type: [String],
    default: []
  },
  issueAreas: {
    type: [String], 
    default: []
  },
  viewedLessons: {
    type: Object,
    default: {}
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

// Генерация пароля
const generatePassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Подключение к базе данных
connectDB();

const app = express();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
    origin: true, // Разрешить запросы с любого домена
    credentials: true, // Разрешить отправку cookies и авторизационных заголовков
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Тарифные планы с Price ID из Stripe
const PLANS = {
    basic: {
        name: 'Базовый план (4-Week)',
        priceId: process.env.STRIPE_BASIC_PRICE_ID, // добавьте в .env
        fallbackPrice: 699, // $6.99 в центах (минимум 50 центов)
        currency: 'usd'
    },
    premium: {
        name: 'Премиум план (8-Week)',
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID, // добавьте в .env
        fallbackPrice: 1599, // $15.99 в центах
        currency: 'usd'
    },
    pro: {
        name: 'Про план (12-Week)',
        priceId: process.env.STRIPE_PRO_PRICE_ID, // добавьте в .env
        fallbackPrice: 2599, // $25.99 в центах
        currency: 'usd'
    }
};

// Создание сессии оплаты
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { planId } = req.body;
        console.log('Получен запрос на создание сессии для плана:', planId);

        if (!PLANS[planId]) {
            console.log('Неверный план:', planId);
            return res.status(400).json({ error: 'Invalid pricing plan' });
        }

        const plan = PLANS[planId];
        console.log('Выбранный план:', plan);

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/paywall`,
        };

        // Используем Price ID если есть, иначе создаем цену на лету
        if (plan.priceId && plan.priceId.startsWith('price_')) {
            console.log('Используем Price ID:', plan.priceId);
            sessionConfig.line_items = [
                {
                    price: plan.priceId,
                    quantity: 1,
                }
            ];
        } else {
            console.log('Создаем цену на лету, fallback price:', plan.fallbackPrice);
            sessionConfig.line_items = [
                {
                    price_data: {
                        currency: plan.currency,
                        product_data: {
                            name: plan.name,
                        },
                        unit_amount: plan.fallbackPrice,
                    },
                    quantity: 1,
                }
            ];
        }

        console.log('Конфигурация сессии:', JSON.stringify(sessionConfig, null, 2));
        const session = await stripeInstance.checkout.sessions.create(sessionConfig);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Ошибка создания сессии:', error);
        console.error('Детали ошибки:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Проверка статуса платежа
app.get('/payment-status/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session.payment_status,
            customerEmail: session.customer_details?.email,
            amountTotal: session.amount_total
        });
    } catch (error) {
        console.error('Ошибка получения статуса:', error);
        res.status(500).json({ error: 'Failed to retrieve payment status' });
    }
});

// Создание подписки (альтернативный endpoint)
app.post('/create-subscription-session', async (req, res) => {
    try {
        console.log('=== СОЗДАНИЕ ПОДПИСКИ ===');
        console.log('Тело запроса:', req.body);
        
        const { planId } = req.body;
        console.log('Plan ID:', planId);

        if (!PLANS[planId]) {
            console.log('❌ Неверный план:', planId);
            return res.status(400).json({ error: 'Invalid pricing plan' });
        }

        const plan = PLANS[planId];
        console.log('✅ Выбранный план:', plan);

        // Для подписок создаем recurring цену
        const sessionConfig = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: plan.currency,
                        product_data: {
                            name: plan.name,
                        },
                        unit_amount: plan.fallbackPrice,
                        recurring: {
                            interval: 'month', // ежемесячная подписка
                        },
                    },
                    quantity: 1,
                }
            ],
            mode: 'subscription', // режим подписки
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/paywall`,
        };

        console.log('Создание сессии подписки...');
        const session = await stripeInstance.checkout.sessions.create(sessionConfig);
        console.log('✅ Сессия подписки создана:', session.id);

        res.json({ url: session.url });
    } catch (error) {
        console.error('❌ Ошибка создания сессии подписки:', error);
        console.error('Сообщение:', error.message);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
});

// Данные уроков
const LESSONS = {
    1: {
        id: 1,
        category: 'Body & Posture',
        title: '5-Minute Flow for Daily Rejuvenation',
        duration: '5 min',
        videoUrl: '/image/videoplayback.mp4',
        thumbnailUrl: '/image/body-posture.png',
        videoPreview: '/image/Lesson1.png',
        description: 'Refresh your body in just 5 minutes! Gentle exercises to improve posture, loosen your back, and boost daily energy.',
        tipTitle: 'Remember',
        tipText: 'Take deep breaths with each movement to relax your muscles and maximize posture benefits.'
    },
    2: {
        id: 2,
        category: 'Belly & Waist',
        title: '5-Minute Activation for a Younger Waistline',
        duration: '5 min',
        videoUrl: '/image/videoplayback3.mp4',
        thumbnailUrl: '/image/belly-waist.png',
        videoPreview: '/image/Lesson1.png',
        description: 'Targeted exercises to strengthen your core, reduce belly tension, and improve waistline definition in just 5 minutes.',
        tipTitle: 'Remember',
        tipText: 'Focus on controlled movements and engage your core throughout each exercise for maximum effectiveness.'
    },
    3: {
        id: 3,
        category: 'Face & Neck',
        title: 'Get rid of swellness: 5 min massage technique',
        duration: '5 min',
        videoUrl: '/image/videoplayback2.mp4',
        thumbnailUrl: '/image/face-neck.png',
        videoPreview: '/image/Lesson1.png',
        description: 'Gentle massage techniques to reduce facial swelling, improve circulation, and restore natural glow to your skin.',
        tipTitle: 'Remember',
        tipText: 'Apply gentle pressure and use upward motions to boost circulation and achieve the best anti-aging results.'
    }
};

// Получение данных конкретного урока
app.get('/lesson/:id', (req, res) => {
    const lessonId = parseInt(req.params.id);
    const lesson = LESSONS[lessonId];
    
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
});

// Получение списка всех уроков
app.get('/lessons', (req, res) => {
    res.json(LESSONS);
});

// Получение списка доступных планов
app.get('/plans', (req, res) => {
    res.json(PLANS);
});

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
    const { name, email, goals, issueAreas } = req.body;
    
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
      goals: goals || [],
      issueAreas: issueAreas || [],
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
    const { email, sessionId } = req.body;
    
    // Проверяем наличие данных
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'User email is required' 
      });
    }
    
    // Находим пользователя по email
    const user = await User.findOne({ email: email.toLowerCase() });
    
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
    // Инициализируем просмотренные уроки (все непросмотренные)
    user.viewedLessons = {
      1: false,
      2: false,
      3: false
    };
    
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

// API для обработки успешной оплаты с email из localStorage
app.post('/api/payment/success', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Находим пользователя по email
    const user = await User.findOne({ email: email.toLowerCase() });
    
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
        message: 'User already has customer role' 
      });
    }
    
    // Генерируем пароль
    const password = generatePassword(10);
    
    // Обновляем пользователя
    user.role = 'customer';
    user.password = password;
    user.isEmailVerified = true;
    // Инициализируем просмотренные уроки (все непросмотренные)
    user.viewedLessons = {
      1: false,
      2: false,
      3: false
    };
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Password generated and user updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      password: password
    });
    
  } catch (error) {
    console.error('Ошибка обработки оплаты:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// API для обновления статуса просмотренного урока
app.post('/api/users/mark-lesson-viewed', async (req, res) => {
  try {
    const { email, lessonId } = req.body;
    
    // Проверяем наличие данных
    if (!email || !lessonId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and lesson ID are required' 
      });
    }
    
    // Находим пользователя по email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Проверяем, что пользователь имеет роль customer
    if (user.role !== 'customer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access is allowed only for customers' 
      });
    }
    
    // Обновляем статус урока
    user.viewedLessons[lessonId] = true;
    user.markModified('viewedLessons'); // Обязательно для Object типа
    
    await user.save();
    
    res.json({
      success: true,
      message: `Lesson ${lessonId} marked as viewed`,
      viewedLessons: user.viewedLessons
    });
    
  } catch (error) {
    console.error('Ошибка обновления статуса урока:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// API для получения данных пользователя
app.get('/api/users/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Находим пользователя по email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        goals: user.goals || [],
        issueAreas: user.issueAreas || [],
        viewedLessons: user.viewedLessons || {}
      }
    });
    
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});