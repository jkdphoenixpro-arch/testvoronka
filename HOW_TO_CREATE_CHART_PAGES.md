# Как создавать страницы типа chart с кастомным info-block

## 📋 Общая информация

Страницы типа `chart` могут отображать:
1. **Lottie анимацию** (по умолчанию)
2. **Статичное изображение** (если указан `chartImage`)

Info-block под графиком может иметь два варианта оформления.

---

## 🎨 Два варианта оформления info-block

### Вариант 1: Стандартный (фиолетовый фон)

**Используется на:** goal/7, lifestyle/7 и других стандартных страницах

**Внешний вид:**
- Background: `rgba(77, 54, 138, 0.1)` (светло-фиолетовый)
- Иконка: `/image/znak.svg`
- Размер текста: 14px
- Line-height: 16px (mobile), 20px (desktop)

**Пример в конфиге:**
```typescript
{
  id: 'goal-7',
  route: '/goal/7',
  pageType: 'chart',
  title: 'Turn back time: 25% slower aging with Age Back',
  subtitle: 'While years go by, your body, face, and posture keep their youth',
  showContinueButton: true,
  imagesToPreload: ['/image/before&after.webp', '/image/rating.svg'],
  nextStepId: 'user-1',
  legacyClassName: 'goal-page-7',
}
```

---

### Вариант 2: Альтернативный (белый фон, большой текст)

**Используется на:** goal/new5 и других новых страницах с акцентом на статистику

**Внешний вид:**
- Background: `white`
- Иконка: `/image/info-icon.svg` (выровнена вертикально по центру)
- Размер текста: 16px
- Line-height: 20px
- Chart-block: без `background` и `box-shadow` (прозрачный)

**Пример в конфиге:**
```typescript
{
  id: 'goal-5new',
  route: '/goal/new5',
  pageType: 'chart',
  title: 'Avg. age rewind',
  subtitle: '5.2 years*',
  chartImage: '/image/age-rewind.webp',
  infoText: '*These results are based on self-assessments from more than 10,000 Age Back users over a 3-month period.',
  infoIcon: '/image/info-icon.svg',
  showContinueButton: true,
  imagesToPreload: ['/image/age-rewind.webp', '/image/info-icon.svg'],
  nextStepId: 'goal-6',
  legacyClassName: 'goal-page-new5',
}
```

---

## 🛠️ Как создать новую страницу с альтернативным info-block

### Шаг 1: Добавить страницу в конфиг

Откройте `src/config/onboardingConfig.ts` и добавьте:

```typescript
{
  id: 'goal-XXnew',
  route: '/goal/newXX',
  pageType: 'chart',
  title: 'Ваш заголовок',
  subtitle: 'Ваш подзаголовок',
  chartImage: '/image/ваше-изображение.webp',  // Путь к изображению
  infoText: 'Ваш текст для info-block',
  infoIcon: '/image/info-icon.svg',            // Кастомная иконка
  showContinueButton: true,
  imagesToPreload: ['/image/ваше-изображение.webp', '/image/info-icon.svg'],
  nextStepId: 'следующий-шаг',
  legacyClassName: 'goal-page-newXX',          // Уникальный класс!
}
```

### Шаг 2: Добавить CSS стили

Откройте `src/styles/main.css` и добавьте после существующих стилей для chart:

```css
/* Стили для вашей новой страницы */
.quiz-container.goal-page-newXX .chart-block {
    background: none;
    box-shadow: none;
}

.quiz-container.goal-page-newXX .info-block {
    background: var(--color-white);
    align-items: center;
    gap: 16px !important;
}

.quiz-container.goal-page-newXX .info-icon {
    width: auto;
    align-items: center;
    justify-content: flex-start;
    padding-top: 0;
}

.quiz-container.goal-page-newXX .info-text p {
    font-size: 16px;
    line-height: 20px;
    text-align: left;
}
```

**Замените `goal-page-newXX` на ваш уникальный класс из `legacyClassName`!**

---

## 📝 Формат запроса для создания

### Запрос 1: Со стандартным info-block
```
Создать страницу goal/8 с типом chart,
заголовок "Amazing results",
используется Lottie анимация
```

### Запрос 2: С альтернативным info-block (белый фон)
```
Создать страницу goal/new6 с типом chart,
изображение /image/my-chart.webp,
текст info-block "Your custom text here" с иконкой /image/info-icon.svg,
background белый, текст 16px, иконка по центру,
chart-block без фона и тени
```

---

## ✅ Контрольный чеклист

При создании новой страницы типа chart с альтернативным info-block:

- [ ] Добавлен новый элемент в `onboardingSteps` массив
- [ ] Указан `chartImage` (путь к изображению)
- [ ] Указан `infoText` (текст для info-block)
- [ ] Указан `infoIcon: '/image/info-icon.svg'`
- [ ] Указан уникальный `legacyClassName` (например, `goal-page-new6`)
- [ ] Добавлены все изображения в `imagesToPreload`
- [ ] Добавлены CSS правила в `main.css` для вашего `legacyClassName`:
  - `.chart-block` → `background: none; box-shadow: none;`
  - `.info-block` → `background: var(--color-white); align-items: center; gap: 16px !important;`
  - `.info-icon` → `width: auto; align-items: center; justify-content: flex-start; padding-top: 0;`
  - `.info-text p` → `font-size: 16px; line-height: 20px; text-align: left;`

---

## 🎯 Примеры использования

### Пример 1: Статистика пользователей (альтернативный стиль)
```typescript
{
  id: 'user-stats',
  route: '/user/stats',
  pageType: 'chart',
  title: '95% success rate',
  subtitle: 'Users achieve visible results',
  chartImage: '/image/user-stats.webp',
  infoText: '*Data collected from 50,000+ active users',
  infoIcon: '/image/info-icon.svg',
  showContinueButton: true,
  imagesToPreload: ['/image/user-stats.webp', '/image/info-icon.svg'],
  nextStepId: 'next-page',
  legacyClassName: 'user-stats-page',
}
```

### Пример 2: Научное исследование (стандартный стиль)
```typescript
{
  id: 'science-proof',
  route: '/lifestyle/science',
  pageType: 'chart',
  title: 'Scientifically proven results',
  subtitle: 'Clinical studies show effectiveness',
  // Без chartImage - будет использована Lottie анимация
  showContinueButton: true,
  imagesToPreload: ['/image/rating.svg'],
  nextStepId: 'next-page',
  legacyClassName: 'lifestyle-step-7',
}
```

---

## 🔍 Отличия между вариантами

| Параметр | Стандартный | Альтернативный |
|----------|-------------|----------------|
| Info-block background | `rgba(77, 54, 138, 0.1)` | `white` |
| Chart-block background | `white` | `none` (прозрачный) |
| Chart-block box-shadow | ✅ Есть | ❌ Нет |
| Иконка | `/image/znak.svg` | `/image/info-icon.svg` |
| Иконка выравнивание | `padding-top: 3px` | `center` |
| Размер текста | 14px | 16px |
| Использование | Общие страницы | Страницы со статистикой |

---

## 💡 Рекомендации

1. **Используйте альтернативный стиль** для страниц с акцентом на цифры и статистику (5.2 years, 95%, etc.)
2. **Используйте стандартный стиль** для общих информационных страниц
3. **Всегда указывайте уникальный `legacyClassName`** для новых страниц
4. **Предзагружайте все изображения** через `imagesToPreload`

---

## 📚 См. также

- `HOW_TO_REQUEST_PAGE_TYPES.md` - Все типы страниц
- `ONBOARDING_USAGE_GUIDE.md` - Руководство по использованию конфигурации
- `src/config/onboardingConfig.ts` - Полная конфигурация
- `src/components/ChartPage.tsx` - Компонент для chart страниц
