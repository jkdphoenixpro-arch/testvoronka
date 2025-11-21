# Руководство по работе с конфигурацией онбординга

## 📋 Обзор

Все страницы онбординга теперь управляются из **единого централизованного конфига**: `src/config/onboardingConfig.ts`

## 🎯 Как изменить порядок страниц

### Вариант 1: Переместить страницу внутри секции

Просто измените порядок объектов в массиве `onboardingSteps` и обновите `nextStepId`:

```typescript
// src/config/onboardingConfig.ts

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'goal-1',
    route: '/goal/1',
    // ...
    nextStepId: 'goal-3',  // Теперь goal/1 ведет сразу на goal/3
  },
  {
    id: 'goal-3',           // goal/3 стал вторым
    route: '/goal/3',
    // ...
    nextStepId: 'goal-2',  // Ведет на goal/2
  },
  {
    id: 'goal-2',           // goal/2 стал третьим
    route: '/goal/2',
    // ...
    nextStepId: 'goal-4',
  },
  // ...
];
```

### Вариант 2: Переместить страницу в другую секцию

Измените `route` и `nextStepId`:

```typescript
// Переместили goal/7 в user секцию
{
  id: 'goal-7',
  route: '/user/8',        // Изменили route
  pageType: 'chart',
  title: 'Turn back time: 25% slower aging with Age Back',
  // ...
  nextStepId: 'lifestyle-1',
}
```

### Вариант 3: Добавить новую страницу

Скопируйте конфигурацию похожей страницы и измените контент:

```typescript
{
  id: 'new-testimonial-1',
  route: '/user/8',
  pageType: 'testimonial-grid',  // Используем существующий тип
  title: 'Новый заголовок',
  subtitle: 'Новый подзаголовок',
  testimonials: [
    { percentage: '90%', description: 'Новый отзыв' },
  ],
  showContinueButton: true,
  nextStepId: 'lifestyle-1',
  stepClass: 'user-step-8',
}
```

## 📝 Типы страниц

Все существующие типы страниц (поле `pageType`):

### 1. `splash`
Splash экран с логотипом приложения
- **Где используется:** goal/1
- **Обязательные поля:** `title`, `subtitle`, `showContinueButton`

### 2. `single-select`
Одиночный выбор с автопереходом
- **Где используется:** goal/2, goal/3, goal/5, user/5, user/6, lifestyle/1-3, lifestyle/5-6
- **Обязательные поля:** `title`, `options`, `autoNavigate`, `autoNavigateDelay`
- **Пример:**
```typescript
{
  pageType: 'single-select',
  options: [
    { value: 'opt1', text: 'Вариант 1' },
    { value: 'opt2', text: 'Вариант 2' },
  ],
  autoNavigate: true,
  autoNavigateDelay: 500,
}
```

### 3. `multi-select`
Множественный выбор с иконками и Continue кнопкой
- **Где используется:** goal/4
- **Обязательные поля:** `title`, `options`, `isMultiSelect`, `showContinueButton`
- **Пример:**
```typescript
{
  pageType: 'multi-select',
  isMultiSelect: true,
  options: [
    { value: 'opt1', text: 'Вариант 1', icon: 'icon-name' },
  ],
  showContinueButton: true,
}
```

### 4. `multi-pill`
Множественный выбор с pill-кнопками (до 3 выборов)
- **Где используется:** user/1, user/2, user/3
- **Обязательные поля:** `title`, `subtitle`, `options`, `maxSelections`, `showContinueButton`
- **Пример:**
```typescript
{
  pageType: 'multi-pill',
  maxSelections: 3,
  options: [
    { value: 'Wrinkles', text: 'Wrinkles', width: 'pill-w98' },
    { value: 'Jowls', text: 'Jowls', width: 'pill-w76' },
  ],
  showContinueButton: true,
}
```

### 5. `testimonial-grid`
Сетка отзывов с процентами
- **Где используется:** goal/6, user/4
- **Обязательные поля:** `title`, `subtitle`, `testimonials`, `showContinueButton`
- **Пример:**
```typescript
{
  pageType: 'testimonial-grid',
  testimonials: [
    { percentage: '78%', description: 'reported visible posture improvement' },
    { percentage: '65%', description: 'noticed reduced puffiness' },
  ],
  showContinueButton: true,
}
```

### 6. `testimonial-advanced`
Отзыв с before/after изображением
- **Где используется:** user/7
- **Обязательные поля:** `title`, `imageSrc`, `testimonials`, `showContinueButton`
- **Пример:**
```typescript
{
  pageType: 'testimonial-advanced',
  imageSrc: '/image/before&after.webp',
  testimonials: [
    {
      description: '"Using Age Back..."',
      author: 'Jessica',
      age: '32 y.o',
      rating: '/image/rating.svg'
    }
  ],
  showContinueButton: true,
}
```

### 7. `chart`
График с иконкой или Lottie анимацией
- **Где используется:** goal/7, lifestyle/7
- **Обязательные поля:** `title`, `subtitle`, `showContinueButton`
- **Опциональные:** `chartImage`, `infoText`, `animationName`
- **Пример:**
```typescript
{
  pageType: 'chart',
  chartImage: '/image/chart.svg',
  infoText: 'Data shows...',
  animationName: 'lifestyle',  // Для Lottie
  showContinueButton: true,
}
```

### 8. `info`
Информационная страница с изображением
- **Где используется:** lifestyle/4
- **Обязательные поля:** `title`, `description`, `imageSrc`, `showContinueButton`
- **Пример:**
```typescript
{
  pageType: 'info',
  description: "That's why Age Back...",
  imageSrc: '/image/approach.webp',
  showContinueButton: true,
}
```

### 9. `scale`
Шкала от 1 до 5
- **Где используется:** statements/1-4
- **Обязательные поля:** `question`, `statement`, `autoNavigate`, `autoNavigateDelay`
- **Пример:**
```typescript
{
  pageType: 'scale',
  question: 'Do you relate to the following statement?',
  statement: 'The reflection in the mirror affects my mood',
  autoNavigate: true,
  autoNavigateDelay: 500,
}
```

## 🔧 Важные поля конфигурации

### Навигация
- **`id`** - уникальный идентификатор шага (например, 'goal-1')
- **`route`** - URL путь (например, '/goal/1')
- **`nextStepId`** - ID следующего шага (например, 'goal-2')

### Предзагрузка изображений
- **`imagesToPreload`** - массив путей к изображениям для предзагрузки
```typescript
imagesToPreload: ['/image/rating.svg', '/image/znak.svg']
```

### Сохранение данных
- **`saveKey`** - ключ для сохранения выбора пользователя
```typescript
saveKey: 'page3'  // Сохранит выбор для goal/3
```

### Стили (для совместимости)
- **`legacyClassName`** - старый CSS класс (для goal страниц)
- **`stepClass`** - CSS класс для шага (для user/lifestyle страниц)
```typescript
legacyClassName: 'goal-page-1'  // Применит существующие стили
stepClass: 'user-step-1'
```

## 🎨 Сохранение стилей

Все существующие CSS классы сохранены для совместимости:
- `.goal-page-1` до `.goal-page-7`
- `.user-step-1` до `.user-step-7`
- `.lifestyle-step-1` до `.lifestyle-step-7`

При создании новой страницы:
1. Если стили идентичны существующей странице - используйте тот же `legacyClassName` или `stepClass`
2. Если нужны уникальные стили - создайте новый класс в соответствующем CSS файле

## ✅ Проверка изменений

После изменения конфигурации проверьте:

1. **Переходы между страницами** - кликните Continue/Назад на каждой странице
2. **Прогресс-бар** - убедитесь что он корректно отображается и растет
3. **Предзагрузка** - проверьте что изображения загружаются плавно
4. **Стили** - убедитесь что все страницы выглядят идентично
5. **Сохранение выборов** - проверьте что данные сохраняются корректно

## 🚀 Примеры использования

### Пример 1: Поменять местами goal/2 и goal/3

```typescript
export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'goal-1',
    route: '/goal/1',
    // ...
    nextStepId: 'goal-3',  // Изменили: было 'goal-2'
  },
  {
    id: 'goal-3',          // Поменяли местами с goal-2
    route: '/goal/3',
    // ... (route НЕ меняем, чтобы сохранить URLs)
    nextStepId: 'goal-2',
  },
  {
    id: 'goal-2',
    route: '/goal/2',
    // ...
    nextStepId: 'goal-4',
  },
];
```

### Пример 2: Добавить новую страницу testimonial между user/3 и user/4

```typescript
{
  id: 'user-3',
  route: '/user/3',
  // ...
  nextStepId: 'new-testimonial',  // Изменили: было 'user-4'
},
{
  id: 'new-testimonial',          // Новая страница
  route: '/user/3-5',             // Новый route
  pageType: 'testimonial-grid',
  title: 'Amazing results!',
  subtitle: 'See what others achieved',
  testimonials: [
    { percentage: '95%', description: 'felt amazing' },
  ],
  showContinueButton: true,
  nextStepId: 'user-4',
  stepClass: 'user-step-3-5',
},
{
  id: 'user-4',
  route: '/user/4',
  // ...
}
```

### Пример 3: Использовать существующую страницу как шаблон

Допустим, нужна еще одна страница single-select как lifestyle/1. Копируем конфигурацию:

```typescript
{
  id: 'new-question',
  route: '/lifestyle/8',
  pageType: 'single-select',      // Тот же тип
  title: 'Новый вопрос?',         // Новый контент
  subtitle: '',
  options: [                       // Новые опции
    { value: 'Opt1', text: 'Вариант 1' },
    { value: 'Opt2', text: 'Вариант 2' },
  ],
  autoNavigate: true,
  autoNavigateDelay: 300,
  nextStepId: 'statements-1',
  stepClass: 'lifestyle-step-8',  // Можно использовать существующий класс
}
```

## 📚 Дополнительная информация

- **Полный анализ структуры:** см. `ONBOARDING_STRUCTURE_ANALYSIS.md`
- **Централизованный конфиг:** `src/config/onboardingConfig.ts`
- **Хелпер функции:**
  - `getStepById(id)` - получить шаг по ID
  - `getStepByRoute(route)` - получить шаг по route
  - `getNextStep(id)` - получить следующий шаг
  - `getPreviousStepById(id)` - получить предыдущий шаг
  - `getTotalSteps()` - получить общее количество шагов

## ⚠️ Важные замечания

1. **После изменения порядка** - всегда проверяйте `nextStepId` для всех затронутых шагов
2. **Предзагрузка изображений** - обновляется автоматически из конфига
3. **Прогресс-бар** - пересчитывается автоматически
4. **Старые файлы** - `quizData.ts` больше не используется, данные взяты из `onboardingConfig.ts`
