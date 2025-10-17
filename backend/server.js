const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
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
            return res.status(400).json({ error: 'Неверный тарифный план' });
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
        res.status(500).json({ error: 'Внутренняя ошибка сервера', details: error.message });
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
        res.status(500).json({ error: 'Не удалось получить статус платежа' });
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
            return res.status(400).json({ error: 'Неверный тарифный план' });
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
            error: 'Внутренняя ошибка сервера', 
            details: error.message 
        });
    }
});

// Получение списка доступных планов
app.get('/plans', (req, res) => {
    res.json(PLANS);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});