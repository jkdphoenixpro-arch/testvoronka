# Проверка последовательности маршрутов онбординга

## Дата проверки: 20.11.2025

## Ожидаемая последовательность:
```
goal/1 → goal/2 → goal/3 → goal/new4 → goal/new5 → goal/new6 → goal/new7 → goal/new8 → goal/new9 → 
user/new1 → user/new2 → user/new3 → user/new4 → user/new5 → user/new6 → user/new7 → user/new8 → user/new9 → user/new10 → 
lifestyle/new1 → lifestyle/new2 → lifestyle/new3 → lifestyle/new4 → lifestyle/new5 → lifestyle/new6 → lifestyle/7 → lifestyle/new8 → lifestyle/new9 → lifestyle/new10 → 
/enteremail
```

## Фактическая последовательность в конфиге:

### GOAL секция ✅
1. ✅ goal/1 (id: goal-1) → goal-2
2. ✅ goal/2 (id: goal-2) → goal-3
3. ✅ goal/3 (id: goal-3) → goal-4new
4. ✅ goal/new4 (id: goal-4new) → goal-5new
5. ✅ goal/new5 (id: goal-5new) → goal-6new
6. ✅ goal/new6 (id: goal-6new) → goal-7new
7. ✅ goal/new7 (id: goal-7new) → goal-8new
8. ✅ goal/new8 (id: goal-8new) → goal-9new
9. ✅ goal/new9 (id: goal-9new) → user-new1

### USER секция ✅
10. ✅ user/new1 (id: user-new1) → user-new2
11. ✅ user/new2 (id: user-new2) → user-new3
12. ✅ user/new3 (id: user-new3) → user-new4
13. ✅ user/new4 (id: user-new4) → user-new5
14. ✅ user/new5 (id: user-new5) → user-new6
15. ✅ user/new6 (id: user-new6) → user-new7
16. ✅ user/new7 (id: user-new7) → user-new8
17. ✅ user/new8 (id: user-new8) → user-new9
18. ✅ user/new9 (id: user-new9) → user-7
19. ✅ user/new10 (id: user-7, route: /user/new10) → lifestyle-new1

### LIFESTYLE секция ✅
20. ✅ lifestyle/new1 (id: lifestyle-new1) → lifestyle-new2
21. ✅ lifestyle/new2 (id: lifestyle-new2) → lifestyle-new3
22. ✅ lifestyle/new3 (id: lifestyle-new3) → lifestyle-new4
23. ✅ lifestyle/new4 (id: lifestyle-new4) → lifestyle-new5 (ИСПРАВЛЕНО)
24. ✅ lifestyle/new5 (id: lifestyle-new5) → lifestyle-new6
25. ✅ lifestyle/new6 (id: lifestyle-new6) → lifestyle-7 (ИСПРАВЛЕНО)
26. ✅ lifestyle/7 (id: lifestyle-7) → lifestyle-new8
27. ✅ lifestyle/new8 (id: lifestyle-new8) → lifestyle-new9
28. ✅ lifestyle/new9 (id: lifestyle-new9) → lifestyle-new10
29. ✅ lifestyle/new10 (id: lifestyle-new10) → /enteremail (ИСПРАВЛЕНО)

**Примечание:** Старые страницы lifestyle/1-6 и statements/1-4 больше не используются в основном флоу.

### STATEMENTS секция ✅
36. ✅ statements/1 (id: statements-1) → statements-2
37. ✅ statements/2 (id: statements-2) → statements-3
38. ✅ statements/3 (id: statements-3) → statements-4
39. ✅ statements/4 (id: statements-4) → buildingplan-1

### ФИНАЛЬНЫЕ СТРАНИЦЫ ✅
40. ✅ buildingplan/1 → /results (в коде BuildingPlanPage.tsx)
41. ✅ /results → /enteremail (в коде ResultsPage.tsx)

## Проверка кнопки "Назад"

### Реализация в компонентах:

#### QuizPage.tsx ✅
```typescript
const handleBackClick = () => {
  if (!stepConfig) return;
  const prevStep = getPreviousStepByRoute(currentPath);
  if (prevStep) {
    navigate(prevStep.route);
  }
};
```

#### UserPage.tsx ✅
```typescript
const handleBackClick = () => {
  const prevStep = getPreviousStepByRoute(currentPath);
  if (prevStep) {
    navigate(prevStep.route);
  }
};
```

#### LifestylePage.tsx ✅
```typescript
const handleBackClick = () => {
  const prev = getPreviousStepByRoute(`/lifestyle/${currentStepId}`);
  if (prev) {
    navigate(prev.route);
  }
};
```

#### BuildingPlanPage.tsx ✅
```typescript
const handleBackClick = () => {
  const previousStep = getPreviousStep(location.pathname);
  if (previousStep) {
    navigate(previousStep);
  } else {
    navigate('/statements/4'); // Fallback
  }
};
```

#### ResultsPage.tsx ✅
```typescript
const handleBackClick = () => {
  const previousStep = getPreviousStep(location.pathname);
  if (previousStep) {
    navigate(previousStep);
  } else {
    navigate('/buildingplan/1'); // Fallback
  }
};
```

#### EnterEmailPage.tsx ✅
```typescript
const handleBackClick = () => {
  const previousStep = getPreviousStep(location.pathname);
  if (previousStep) {
    navigate(previousStep);
  } else {
    navigate('/results'); // Fallback
  }
};
```

### Функция getPreviousStepByRoute в конфиге ✅
```typescript
export const getPreviousStepByRoute = (currentRoute: string): OnboardingStep | null => {
  const current = getStepByRoute(currentRoute);
  if (!current) return null;
  return getPreviousStepById(current.id);
};

export const getPreviousStepById = (currentId: string): OnboardingStep | null => {
  const currentIndex = onboardingSteps.findIndex(step => step.id === currentId);
  if (currentIndex <= 0) return null;
  return onboardingSteps[currentIndex - 1];
};
```

## Результат проверки

### ✅ Последовательность маршрутов
**СТАТУС: КОРРЕКТНА (после исправлений)**

Все страницы правильно связаны через `nextStepId` в конфигурации. Последовательность полностью соответствует ожидаемой.

**Исправления от 20.11.2025:**
1. ✅ Исправлен `lifestyle/new4` → теперь ведет на `lifestyle-new5` (было `lifestyle-1`)
2. ✅ Исправлена логика навигации в `LifestylePage.tsx` - функция `goNext()` теперь использует `stepConfig.id` вместо `stepConfig.nextStepId`
3. ✅ Исправлен `lifestyle/new6` → теперь ведет на `lifestyle-7` (было `lifestyle-5`)
4. ✅ Исправлен `lifestyle/new10` → теперь ведет на `/enteremail` (было `statements-1`)
5. ✅ Добавлена поддержка прямых маршрутов в `LifestylePage.tsx` для перехода на страницы вне конфига

### ✅ Кнопка "Назад"
**СТАТУС: РАБОТАЕТ КОРРЕКТНО**

Все компоненты используют функцию `getPreviousStepByRoute()` или `getPreviousStep()`, которая:
1. Находит текущий шаг в массиве `onboardingSteps`
2. Возвращает предыдущий элемент массива
3. Навигирует на его `route`

Это гарантирует, что кнопка "Назад" всегда перекидывает на предыдущую страницу в последовательности.

## Замечания

### Старые неиспользуемые страницы в конфиге
В конфиге остались старые страницы, которые не входят в основной флоу:
- `goal-5` (route: /goal/5)
- `goal-6` (route: /goal/6)
- `goal-7` (route: /goal/7)
- `user-1` (route: /user/1)
- `user-2` (route: /user/2)
- `user-3` (route: /user/3)
- `user-5` (route: /user/5)
- `user-6` (route: /user/6)

Эти страницы не влияют на основной флоу, но могут быть удалены для чистоты кода.

## Рекомендации

1. ✅ Последовательность маршрутов соблюдается полностью
2. ✅ Кнопка "Назад" работает корректно на всех страницах
3. 💡 Рекомендуется удалить неиспользуемые старые страницы из конфига для упрощения поддержки
4. ✅ Все компоненты используют централизованную конфигурацию из `onboardingConfig.ts`
