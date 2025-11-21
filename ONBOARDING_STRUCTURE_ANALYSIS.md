# Анализ структуры онбординга - Возможности реорганизации страниц

## Оглавление
1. [Текущая архитектура онбординга](#текущая-архитектура-онбординга)
2. [Система конфигурации страниц](#система-конфигурации-страниц)
3. [Связанные системы](#связанные-системы)
4. [Типы страниц и их переиспользование](#типы-страниц-и-их-переиспользование)
5. [Возможность реорганизации](#возможность-реорганизации)
6. [План миграции](#план-миграции)

---

## Текущая архитектура онбординга

### Общая структура флоу
Онбординг состоит из 4 основных секций с фиксированной последовательностью:

```
/goal/:stepId      → 7 страниц (goal/1 - goal/7)
    ↓
/user/:stepId      → 7 страниц (user/1 - user/7)
    ↓
/lifestyle/:stepId → 7 страниц (lifestyle/1 - lifestyle/7)
    ↓
/statements/:stepId → 4 страницы (statements/1 - statements/4)
    ↓
/buildingplan/1
    ↓
/results
    ↓
/enteremail
    ↓
/paywall
```

**Всего:** 29 этапов онбординга

### Маршрутизация (App.tsx)
```typescript
// Основные маршруты зашиты жестко:
<Route path="/" element={<Navigate to="/goal/1" replace />} />
<Route path="/goal/:stepId" element={<QuizPage />} />
<Route path="/user/:stepId" element={<UserPage />} />
<Route path="/lifestyle/:stepId" element={<LifestylePage />} />
<Route path="/statements/:stepId" element={<StatementsPage />} />
<Route path="/buildingplan/:stepId" element={<BuildingPlanPage />} />
<Route path="/results" element={<ResultsPage />} />
<Route path="/enteremail" element={<EnterEmailPage />} />
<Route path="/paywall" element={<PaywallPage />} />
```

**Проблема:** Маршруты жестко привязаны к конкретным компонентам.

---

## Система конфигурации страниц

### 1. QuizPage (Goal секция)

**Файл данных:** `src/data/quizData.ts`

```typescript
export interface QuizPageData {
  id: number;           // Номер шага в секции
  title: string;
  subtitle?: string;
  options: QuizOption[];
  progress: number;     // Не используется (берется из useOnboardingProgress)
  className?: string;
  isMultiSelect?: boolean;
  showContinueButton?: boolean;
  isTestimonialPage?: boolean;
  isChartPage?: boolean;
  isSplashPage?: boolean;
}

export const quizPages: QuizPageData[] = [
  { id: 1, isSplashPage: true, ... },
  { id: 2, options: [...], ... },
  // ... всего 7 страниц
];
```

**Компонент:** `src/components/QuizPage.tsx`
- Читает данные из `quizPages` по `id`
- Рендерит разные типы страниц:
  - `SplashPage` (splash экран)
  - `TestimonialPage` (отзывы)
  - `ChartPage` (графики)
  - Стандартные страницы с опциями

**Навигация:**
```typescript
// Жестко зашитая логика перехода:
const nextPageId = currentPageId + 1;
if (nextPage) {
  navigate(`/goal/${nextPageId}`);
} else {
  navigate('/user/1'); // Фиксированный переход на user секцию
}
```

### 2. UserPage (User секция)

**Файл данных:** Внутри компонента `src/components/UserPage.tsx`

```typescript
interface UserStep {
  title: string;
  subtitle: string;
  optionNames: string[];
  initialSelected: number[];
  progress: number;
  stepClass: string;
  isTestimonial?: boolean;
  testimonials?: TestimonialItem[];
}

const userSteps: Record<number, UserStep> = {
  1: { ... },
  2: { ... },
  // ... всего 7 шагов
};
```

**Типы страниц в User:**
- Шаги 1-3: Multi-select с pill-кнопками
- Шаг 4: Testimonial с grid статистики
- Шаги 5-6: Single-select с auto-переходом
- Шаг 7: Testimonial с before/after изображением

**Навигация:**
```typescript
// Жестко зашитая функция goNext():
if (currentStepId === 7) {
  navigate('/lifestyle/1'); // Фиксированный переход
}
```

### 3. LifestylePage (Lifestyle секция)

**Файл данных:** Внутри компонента `src/components/LifestylePage.tsx`

```typescript
interface LifestyleStep {
  title: string;
  subtitle?: string;
  optionNames?: string[];
  initialSelected: number[];
  progress: number;
  stepClass: string;
  isInfoStep?: boolean;
  description?: string;
  imageSrc?: string;
  infoText?: string;
  isChartStep?: boolean;
}

const lifestyleSteps: Record<number, LifestyleStep> = {
  1: { ... },
  // ... всего 7 шагов
};
```

**Типы страниц в Lifestyle:**
- Шаги 1-3, 5-6: Single-select с auto-переходом
- Шаг 4: Info страница с изображением
- Шаг 7: Chart страница с Lottie анимацией

**Навигация:**
```typescript
// Жестко зашитая функция goNext():
if (currentStepId === 7) {
  navigate('/statements/1'); // Фиксированный переход
}
```

### 4. StatementsPage (Statements секция)

**Файл данных:** Внутри компонента `src/components/StatementsPage.tsx`

```typescript
interface StatementData {
  id: number;
  question: string;
  statement: string;
  progress: number;
}

const statementsData: StatementData[] = [
  { id: 1, ... },
  // ... всего 4 шага
];
```

**Тип:** Scale-выбор от 1 до 5

**Навигация:**
```typescript
// Автопереход после выбора
if (!nextStatement) {
  navigate('/buildingplan/1'); // Фиксированный переход
}
```

---

## Связанные системы

### 1. Система предзагрузки изображений

**Файл:** `src/config/imagePreloadConfig.ts`

```typescript
export const IMAGE_PRELOAD_MAP: Record<string, string[]> = {
  '/goal/1': [],
  '/goal/6': ['/image/rating.svg', '/image/znak.svg'],
  '/user/7': ['/image/approach.webp'],
  // ... для каждого пути указаны изображения следующего шага
};
```

**Хук:** `src/hooks/useImagePreloader.ts`

**Использование в каждом компоненте:**
```typescript
const currentPath = `/goal/${currentStepId}`;
const imagesToPreload = getImagesToPreload(currentPath);
useImagePreloader(imagesToPreload);
```

**⚠️ ВАЖНО:** При изменении порядка страниц нужно обновить карту предзагрузки!

### 2. Система прогресс-бара

**Файл:** `src/hooks/useOnboardingProgress.ts`

```typescript
const ONBOARDING_STEPS = [
  { route: '/goal/1', step: 1 },
  { route: '/goal/2', step: 2 },
  // ... всего 25 маппингов
];
```

**Логика расчета прогресса:**
- Первые 6 этапов: 0% → 30%
- Оставшиеся 19 этапов: 30% → 99%

**⚠️ ВАЖНО:** При изменении порядка нужно переиндексировать все шаги!

### 3. Система навигации

**Файл:** `src/utils/navigationUtils.ts`

```typescript
const ONBOARDING_STEPS = [
  'goal/1', 'goal/2', ..., 'goal/7',
  'user/1', ..., 'user/7',
  'lifestyle/1', ..., 'lifestyle/7',
  'statements/1', ..., 'statements/4',
  'buildingplan/1',
  'results',
  'enteremail',
  'paywall'
];
```

**Функции:**
- `getPreviousStep(currentPath)` - используется кнопкой Назад
- `getNextStep(currentPath)` - не используется активно
- `isValidOnboardingStep(path)` - валидация
- `getStepIndex(path)` - индекс в общем флоу

**⚠️ ВАЖНО:** При реорганизации нужно обновить массив!

### 4. Система стилей

**CSS файлы привязаны к специфичным страницам:**

#### main.css
```css
.goal-page-1 { /* специфичные стили */ }
.goal-page-2 { /* специфичные стили */ }
/* ... до goal-page-7 */
```

#### user.css
```css
.user-step-1 { /* специфичные стили */ }
.user-step-2 { /* специфичные стили */ }
/* ... до user-step-7 */
```

#### lifestyle.css
```css
.lifestyle-step-1 { /* специфичные стили */ }
/* ... до lifestyle-step-7 */
```

**Классы применяются динамически:**
```typescript
// QuizPage.tsx
className += ` goal-page-${currentPageId}`;

// UserPage.tsx
className += ` user-step-${currentStepId}`;
```

**⚠️ ВАЖНО:** Стили привязаны к номерам шагов, не к типам страниц!

### 5. Система сохранения выборов пользователя

**Файл:** `src/utils/userSelections.ts`

Сохраняет выборы пользователя для конкретных страниц:
- `page3`, `page5` (goal секция)
- `user1`, `user2`, `user3` (user секция)

**⚠️ ВАЖНО:** При изменении порядка логика сохранения может сломаться!

---

## Типы страниц и их переиспользование

### Классификация по типу контента:

#### 1. **Splash Screen**
- **Где:** goal/1
- **Особенности:** Топ-бар без прогресса, кнопка Continue с Enter
- **Можно переиспользовать:** ✅ Да

#### 2. **Single-select с автопереходом**
- **Где:** goal/2, goal/3, goal/5, user/5, user/6, lifestyle/1-3, lifestyle/5-6
- **Особенности:** Клик → задержка 300-500ms → переход
- **Можно переиспользовать:** ✅ Да (универсальная логика)

#### 3. **Multi-select с Continue кнопкой**
- **Где:** goal/4
- **Особенности:** Чекбоксы с иконками, выбор до 3 опций
- **Можно переиспользовать:** ✅ Да

#### 4. **Multi-select с Pill-кнопками (до 3)**
- **Где:** user/1, user/2, user/3
- **Особенности:** Кнопки с фиксированной шириной, grid layout
- **Можно переиспользовать:** ⚠️ Условно (нужно переносить widthClasses)

#### 5. **Testimonial с Grid статистики**
- **Где:** goal/6, user/4
- **Особенности:** Grid из карточек с процентами
- **Можно переиспользовать:** ✅ Да

#### 6. **Testimonial с Before/After**
- **Где:** user/7
- **Особенности:** Изображение + отзыв с рейтингом
- **Можно переиспользовать:** ✅ Да (нужно изображение)

#### 7. **Chart с иконкой**
- **Где:** goal/7
- **Особенности:** rating.svg и znak.svg
- **Можно переиспользовать:** ✅ Да

#### 8. **Info страница с изображением**
- **Где:** lifestyle/4
- **Особенности:** Описание + изображение + Continue
- **Можно переиспользовать:** ✅ Да

#### 9. **Chart с Lottie анимацией**
- **Где:** lifestyle/7
- **Особенности:** Предзагрузка анимации + info блок
- **Можно переиспользовать:** ✅ Да (нужна анимация)

#### 10. **Scale выбор (1-5)**
- **Где:** statements/1-4
- **Особенности:** ScaleButton компонент
- **Можно переиспользовать:** ✅ Да

---

## Возможность реорганизации

### ✅ **ВЫВОД: ДА, можно реорганизовать страницы с нуля**

### Необходимые изменения для полной гибкости:

#### 1. **Централизованная конфигурация онбординга**

Создать единый конфигурационный файл:

```typescript
// src/config/onboardingConfig.ts

export interface OnboardingStep {
  // Идентификация
  id: string;                    // 'step-1', 'step-2', etc.
  route: string;                 // '/onboarding/1'
  
  // Навигация
  nextStep?: string;             // id следующего шага
  previousStep?: string;         // id предыдущего шага
  
  // Тип и компонент
  pageType: 'splash' | 'single-select' | 'multi-select' | 
            'testimonial-grid' | 'testimonial-advanced' | 
            'chart' | 'info' | 'scale' | 'building-plan';
  
  // Контент
  title: string;
  subtitle?: string;
  description?: string;
  
  // Опции для выбора
  options?: Array<{
    value: string;
    text: string;
    icon?: string;
    width?: string;  // для pill кнопок
  }>;
  
  // Настройки поведения
  isMultiSelect?: boolean;
  maxSelections?: number;
  autoNavigate?: boolean;
  autoNavigateDelay?: number;
  showContinueButton?: boolean;
  
  // Ресурсы
  images?: string[];             // изображения для этой страницы
  imagesToPreload?: string[];    // изображения для предзагрузки
  animation?: string;            // имя анимации
  
  // Данные для testimonial
  testimonials?: Array<{
    percentage?: string;
    description: string;
    author?: string;
    rating?: number;
    beforeAfterImage?: string;
  }>;
  
  // Данные для chart
  chartImage?: string;
  infoText?: string;
  
  // Стили
  customClassName?: string;
  
  // Сохранение данных
  saveKey?: string;              // ключ для сохранения выбора
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'step-1',
    route: '/onboarding/1',
    pageType: 'splash',
    title: 'Turn back time!...',
    subtitle: 'Discover a science-based method...',
    nextStep: 'step-2',
    showContinueButton: true,
  },
  {
    id: 'step-2',
    route: '/onboarding/2',
    pageType: 'single-select',
    title: 'How old do you feel right now?',
    subtitle: 'Sometimes your body tells...',
    options: [
      { value: '18-25', text: 'Much younger (−10 yrs)' },
      // ...
    ],
    autoNavigate: true,
    autoNavigateDelay: 500,
    nextStep: 'step-3',
    previousStep: 'step-1',
  },
  // ... все остальные страницы
];

// Helper функции
export const getStepById = (id: string) => 
  onboardingSteps.find(step => step.id === id);

export const getStepByRoute = (route: string) => 
  onboardingSteps.find(step => step.route === route);

export const getNextStep = (currentId: string) => {
  const current = getStepById(currentId);
  return current?.nextStep ? getStepById(current.nextStep) : null;
};

export const getPreviousStep = (currentId: string) => {
  const current = getStepById(currentId);
  return current?.previousStep ? getStepById(current.previousStep) : null;
};

export const getAllRoutes = () => 
  onboardingSteps.map(step => step.route);

export const getStepIndex = (id: string) => 
  onboardingSteps.findIndex(step => step.id === id);

export const getTotalSteps = () => onboardingSteps.length;
```

#### 2. **Универсальный компонент страницы**

Создать единый компонент, который рендерит любой тип:

```typescript
// src/components/OnboardingPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStepByRoute, getNextStep, getPreviousStep } from '../config/onboardingConfig';
import { useImagePreloader } from '../hooks/useImagePreloader';
import Header from './Header';
import SplashPage from './SplashPage';
import TestimonialPage from './TestimonialPage';
import ChartPage from './ChartPage';
// ... другие компоненты

const OnboardingPage: React.FC = () => {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  
  const currentRoute = `/onboarding/${stepNumber}`;
  const stepConfig = getStepByRoute(currentRoute);
  
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  // Предзагрузка изображений
  useImagePreloader(stepConfig?.imagesToPreload || []);
  
  if (!stepConfig) {
    navigate('/onboarding/1');
    return null;
  }
  
  const handleNext = () => {
    const next = getNextStep(stepConfig.id);
    if (next) {
      navigate(next.route);
    }
  };
  
  const handleBack = () => {
    const prev = getPreviousStep(stepConfig.id);
    if (prev) {
      navigate(prev.route);
    }
  };
  
  // Рендер по типу страницы
  const renderContent = () => {
    switch (stepConfig.pageType) {
      case 'splash':
        return <SplashPage {...stepConfig} />;
      case 'testimonial-grid':
        return <TestimonialPage {...stepConfig} />;
      case 'chart':
        return <ChartPage {...stepConfig} />;
      // ... другие типы
      default:
        return <div>Unknown page type</div>;
    }
  };
  
  return (
    <div className={`onboarding-container ${stepConfig.customClassName || ''}`}>
      {stepConfig.pageType !== 'splash' && (
        <Header 
          onBackClick={handleBack}
          showBackButton={!!getPreviousStep(stepConfig.id)}
        />
      )}
      <main className="content-wrapper">
        {renderContent()}
      </main>
      {stepConfig.showContinueButton && (
        <ContinueButton onClick={handleNext} />
      )}
    </div>
  );
};

export default OnboardingPage;
```

#### 3. **Обновление маршрутизации**

```typescript
// src/App.tsx

import { onboardingSteps } from './config/onboardingConfig';

function App() {
  return (
    <AnimationProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding/1" replace />} />
            <Route path="/onboarding/:stepNumber" element={<OnboardingPage />} />
            {/* Остальные маршруты (после онбординга) */}
          </Routes>
        </div>
      </Router>
    </AnimationProvider>
  );
}
```

#### 4. **Миграция стилей**

Вместо привязки к номерам шагов использовать классы по типу:

```css
/* styles/onboarding.css */

/* По типу страницы */
.onboarding-splash { /* ... */ }
.onboarding-single-select { /* ... */ }
.onboarding-multi-select { /* ... */ }
.onboarding-testimonial-grid { /* ... */ }
.onboarding-chart { /* ... */ }

/* Кастомные модификаторы через customClassName */
.custom-wide-pills .pill { width: 160px; }
```

#### 5. **Обновление системы прогресса**

```typescript
// src/hooks/useOnboardingProgress.ts

import { getStepByRoute, getStepIndex, getTotalSteps } from '../config/onboardingConfig';

export const useOnboardingProgress = () => {
  const location = useLocation();
  const stepConfig = getStepByRoute(location.pathname);
  
  if (!stepConfig) {
    return { progress: 0, currentStep: 0, totalSteps: 0, isInOnboarding: false };
  }
  
  const currentIndex = getStepIndex(stepConfig.id);
  const total = getTotalSteps();
  
  // Та же логика расчета прогресса
  let progress = 0;
  if (currentIndex <= 5) {
    progress = Math.round(((currentIndex + 1) / 6) * 30);
  } else {
    const remaining = currentIndex - 5;
    const remainingTotal = total - 6;
    progress = 30 + Math.round((remaining / remainingTotal) * 69);
  }
  
  return {
    progress,
    currentStep: currentIndex + 1,
    totalSteps: total,
    isInOnboarding: true
  };
};
```

---

## План миграции

### Этап 1: Подготовка
1. ✅ Создать резервную копию проекта
2. ✅ Создать новую ветку для миграции
3. ✅ Создать файл `src/config/onboardingConfig.ts`
4. ✅ Перенести все данные из `quizData.ts`, `UserPage.tsx`, `LifestylePage.tsx`, `StatementsPage.tsx` в единую конфигурацию

### Этап 2: Рефакторинг компонентов
1. ✅ Создать `OnboardingPage.tsx` - универсальный компонент
2. ✅ Переработать все типовые компоненты (`SplashPage`, `TestimonialPage`, и т.д.) для работы с конфигурацией
3. ✅ Обновить `Header.tsx` для работы с новой системой

### Этап 3: Обновление систем
1. ✅ Обновить `useOnboardingProgress.ts`
2. ✅ Обновить `navigationUtils.ts` (или удалить, если не нужен)
3. ✅ Обновить `imagePreloadConfig.ts` - генерировать автоматически из конфигурации
4. ✅ Обновить `userSelections.ts` - использовать `saveKey` из конфигурации

### Этап 4: Миграция стилей
1. ✅ Создать `onboarding.css` с типовыми стилями
2. ✅ Перенести специфичные стили с номерных классов на типовые
3. ✅ Создать модификаторы для кастомных случаев

### Этап 5: Обновление маршрутизации
1. ✅ Обновить `App.tsx`
2. ✅ Добавить редиректы со старых маршрутов (если нужна обратная совместимость)

### Этап 6: Тестирование
1. ✅ Проверить все переходы
2. ✅ Проверить предзагрузку изображений
3. ✅ Проверить сохранение выборов
4. ✅ Проверить прогресс-бар
5. ✅ Проверить стили на мобильной и десктопной версиях

### Этап 7: Финализация
1. ✅ Удалить старые компоненты (QuizPage, UserPage, LifestylePage, StatementsPage)
2. ✅ Удалить старые конфигурационные файлы
3. ✅ Обновить документацию (WARP.md)

---

## Как использовать новую систему

### Пример 1: Изменить порядок страниц

```typescript
// Просто переставить объекты в массиве onboardingSteps
// и обновить nextStep/previousStep

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'step-1',
    nextStep: 'step-5',  // Теперь первый шаг ведет на пятый
    // ...
  },
  // ...
];
```

### Пример 2: Добавить новую страницу, похожую на существующую

```typescript
// Скопировать конфигурацию похожей страницы и изменить контент

{
  id: 'new-step-1',
  route: '/onboarding/42',
  pageType: 'single-select',  // Используем существующий тип
  title: 'Новый вопрос',
  options: [
    { value: 'opt1', text: 'Новая опция 1' },
    // ...
  ],
  autoNavigate: true,
  nextStep: 'new-step-2',
  previousStep: 'step-15',
  // Система сама применит правильный компонент и стили
}
```

### Пример 3: Создать альтернативный флоу

```typescript
// Можно создать разветвление на основе условий

const getNextStepByCondition = (currentId: string, userChoice: string) => {
  if (currentId === 'step-5' && userChoice === 'advanced') {
    return 'step-advanced-1';
  }
  return getNextStep(currentId);
};
```

---

## Риски и ограничения

### ⚠️ Потенциальные проблемы:

1. **Pill-кнопки с фиксированной шириной**
   - Сейчас ширины захардкожены для каждого шага
   - Решение: Добавить `width` в конфигурацию опций

2. **Специфичные стили для отдельных страниц**
   - Некоторые страницы имеют уникальную верстку
   - Решение: Использовать `customClassName` и модификаторы

3. **Анимации**
   - Предзагрузка анимаций через AnimationContext
   - Решение: Добавить `animation` поле в конфигурацию

4. **Сохранение выборов пользователя**
   - Сейчас привязано к конкретным страницам (page3, user1)
   - Решение: Использовать `saveKey` из конфигурации

5. **Обратная совместимость**
   - Старые URL могут быть сохранены у пользователей
   - Решение: Добавить редиректы со старых маршрутов

### ✅ Преимущества новой системы:

1. **Полная гибкость** - можно менять порядок без правки кода
2. **Переиспользование** - типы страниц используются многократно
3. **Централизация** - вся конфигурация в одном месте
4. **Масштабируемость** - легко добавлять новые страницы
5. **Поддерживаемость** - изменения в одном месте
6. **Тестируемость** - легко создать тестовые флоу

---

## Текущее состояние: МОЖНО ЛИ СЕЙЧАС МЕНЯТЬ ПОРЯДОК?

### ❌ **НЕТ, без рефакторинга нельзя:**

**Причины:**
1. Навигация захардкожена в каждом компоненте
2. Стили привязаны к номерам шагов
3. Предзагрузка изображений привязана к путям
4. Прогресс-бар ожидает фиксированный порядок
5. Сохранение данных привязано к конкретным страницам

### ✅ **ДА, после миграции можно:**

После внедрения централизованной конфигурации вы сможете:
- Менять порядок страниц редактированием одного массива
- Переиспользовать типы страниц
- Добавлять новые страницы без изменения кода компонентов
- Создавать альтернативные флоу

---

## Рекомендации

### Для быстрого старта:

1. **Минимальный рефакторинг** (1-2 дня):
   - Только централизовать конфигурацию страниц
   - Оставить существующие компоненты
   - Обновить навигацию для использования конфигурации

2. **Полный рефакторинг** (3-5 дней):
   - Реализовать все предложенные изменения
   - Создать универсальный компонент
   - Мигрировать стили
   - Полное тестирование

### Приоритет изменений:

1. ⭐⭐⭐ **Критично**: `onboardingConfig.ts` - централизация данных
2. ⭐⭐⭐ **Критично**: Обновление навигации
3. ⭐⭐ **Важно**: Миграция стилей
4. ⭐⭐ **Важно**: Универсальный компонент
5. ⭐ **Желательно**: Удаление старого кода

---

## Заключение

**Ваш проект имеет хорошую основу для реорганизации:**
- ✅ Единая HTML-структура
- ✅ Переиспользуемые UI-компоненты
- ✅ Система типов страниц
- ✅ Система предзагрузки

**Основная проблема:**
- ❌ Распределенная логика навигации
- ❌ Привязка стилей к номерам шагов
- ❌ Жестко зашитые зависимости

**Решение:**
Централизованная конфигурация с явным описанием связей между страницами позволит свободно реорганизовывать флоу онбординга без изменения кода компонентов.

**Время реализации:** 3-5 дней для полной миграции или 1-2 дня для минимального рефакторинга.
