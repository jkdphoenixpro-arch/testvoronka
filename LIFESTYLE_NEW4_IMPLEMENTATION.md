# Реалізація сторінки lifestyle/new4

## Що було зроблено

Створено нову сторінку `lifestyle/new4` з графіком прогресу та блоком експерта відповідно до макету Figma.

## Зміни в файлах

### 1. src/config/onboardingConfig.ts
- Додано конфігурацію для сторінки `lifestyle-new4`
- Оновлено навігацію: `lifestyle-new3` → `lifestyle-new4` → `lifestyle-1`
- Тип сторінки: `chart` з додатковими testimonials

### 2. src/components/LifestylePage.tsx
- Додано спеціальну логіку рендерингу для `currentStepId === 'new4'`
- Реалізовано два блоки:
  - **Chart Container**: графік прогресу з легендою
  - **Expert Card**: картка з цитатою експерта та фото

### 3. src/styles/lifestyle.css
- Додано стилі для `.lifestyle-step-new4`
- Стилі для графіка прогресу (chart-container, chart-header, chart-legend)
- Стилі для картки експерта (expert-card, expert-quote, expert-image)
- Адаптивні стилі для мобільних пристроїв

## Структура сторінки

```
lifestyle/new4
├── Title wrapper
│   ├── Heading: "Users like you notice visible results within 12 weeks"
│   └── Subtitle: "With just 15 minutes a day..."
├── Chart Container (білий блок з тінню)
│   ├── Header
│   │   ├── Title: "Progress rate"
│   │   └── Legend: Before / After
│   └── Chart Image: /image/progress-rate.webp
└── Expert Card (фіолетовий фон)
    ├── Quote: "How we rest and recover..."
    ├── Expert Info
    │   ├── Name: "Nora Klein, PhD"
    │   └── Title: "Clinical Director at Age Back"
    └── Expert Image: /image/doctor.webp (з градієнтним свіченням)
```

## Використані зображення

- `/image/progress-rate.webp` - графік прогресу
- `/image/doctor.webp` - фото експерта

## Особливості реалізації

1. **Окремі стилі**: Блок експерта створено з окремими стилями (не використовуючи стилі з user/new8), як було вказано в завданні
2. **Pixel-perfect**: Верстка відповідає макету Figma
3. **Адаптивність**: Єдина HTML-структура для мобільної та десктопної версій
4. **Мінімальний код**: Реалізовано тільки необхідну функціональність

## Тестування

Відкрийте в браузері: `http://localhost:3000/lifestyle/new4`

Або пройдіть онбординг до цієї сторінки через: `lifestyle/new3` → `lifestyle/new4`
