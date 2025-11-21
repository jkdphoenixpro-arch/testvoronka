# Обновление компонента Header для страницы Create Plan

## Проблема
Страница `/create-plan` не отображала кнопку back-button с изображением `arrow_left.svg`, как на других страницах онбординга (например, goal/2).

## Решение
Добавлена проверка маршрута `/create-plan` в логику компонента Header.

## Изменения в src/components/Header.tsx

### Было:
```typescript
const isGoalRoute = location.pathname.startsWith('/goal/');
const isUserRoute = location.pathname.startsWith('/user/');
const isLifestyleRoute = location.pathname.startsWith('/lifestyle/');
const isStatementsRoute = location.pathname.startsWith('/statements/');

const currentStep = location.pathname.split('/').pop();
const shouldShowArrowLeft = ((isGoalRoute && currentStep !== '1') || isUserRoute || isLifestyleRoute || isStatementsRoute) && showBackButton;
```

### Стало:
```typescript
const isGoalRoute = location.pathname.startsWith('/goal/');
const isUserRoute = location.pathname.startsWith('/user/');
const isLifestyleRoute = location.pathname.startsWith('/lifestyle/');
const isStatementsRoute = location.pathname.startsWith('/statements/');
const isCreatePlanRoute = location.pathname === '/create-plan';

const currentStep = location.pathname.split('/').pop();
const shouldShowArrowLeft = ((isGoalRoute && currentStep !== '1') || isUserRoute || isLifestyleRoute || isStatementsRoute || isCreatePlanRoute) && showBackButton;
```

## Результат
Теперь на странице `/create-plan` отображается:
- ✅ Кнопка back-button с изображением `arrow_left.svg`
- ✅ Класс `goal-back-button` для правильной стилизации
- ✅ Такой же внешний вид, как на странице goal/2

## Логика отображения кнопки в Header

Header имеет два варианта кнопки "Назад":

### Вариант 1: С изображением (для основных страниц онбординга)
```tsx
<button className="back-button goal-back-button" onClick={handleBackClick}>
  <img src="/image/arrow_left.svg" alt="Back" width="6" height="12" />
</button>
```
Используется для:
- goal/2, goal/3, goal/4, ... (кроме goal/1)
- user/*
- lifestyle/*
- statements/*
- **create-plan** ← добавлено

### Вариант 2: С SVG иконкой (для других страниц)
```tsx
<button className="back-button" onClick={handleBackClick}>
  <svg width="6" height="12" viewBox="0 0 6 12">
    <path d="M5 11L1 6L5 1" stroke="#28194B" strokeWidth="2"/>
  </svg>
</button>
```
Используется для остальных страниц, где `showBackButton={true}`

## Проверка
Страница `/create-plan` теперь полностью соответствует дизайну других страниц онбординга.
