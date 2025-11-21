# Страница Create Plan

## Описание
Страница `/create-plan` отображает персонализированный профиль пользователя с результатами онбординга.

## Расположение файлов
- **Компонент**: `src/components/CreatePlanPage.tsx`
- **Стили**: `src/styles/create-plan.css`
- **Маршрут**: `/create-plan`

## Структура страницы

### 1. Заголовок
- Отображает тип профиля пользователя (например, "Rhythm Restorer")

### 2. Age-Rewind Potential Card
- **Потенциал омоложения**: High/Moderate/Low/Extreme
- **Изображение**: Визуализация потенциала (`age-rewind-high-4-5.webp`)
- **Информационный блок**: Описание потенциала пользователя

### 3. Summary Card
Отображает ключевые данные пользователя:
- **Age**: Возраст пользователя (30s, 40s и т.д.)
- **Rewind Goal**: Цель омоложения (2-3 года)
- **Rejuvenation Type**: Тип омоложения (Rhythm Restorer)
- **Motivation**: Мотивация пользователя (Feel confident)

### 4. Challenges Card
Список проблемных зон, выбранных пользователем:
- Drooping eyelids
- Dark circles
- Skin elasticity
- Back, Slouching, Legs
- Neck stiffness, Knees
- Joint pain

## Используемые ресурсы
Все ресурсы находятся в `public/image/`:

### Иконки:
- `arrow_left.svg` - стрелка назад
- `icon-info-24px.svg` - информационная иконка
- `user-icon-24px.svg` - иконка пользователя
- `rewind-icon-24px.svg` - иконка перемотки (в top-bar и summary)
- `clock-icon-24px.svg` - иконка часов
- `flash-icon-24px.svg` - иконка молнии
- `lamp-icon-24px.svg` - иконка лампочки

### Изображения:
- `age-rewind-high-4-5.webp` - визуализация потенциала омоложения

## Стилизация

### Основные классы
- `.create-plan-container` - основной контейнер страницы
- `.top-bar` - верхняя панель с кнопкой назад
- `.rewind-potential-card` - карточка с потенциалом
- `.rewind-image-wrapper` - обертка для изображения
- `.summary-card` - карточка с сводкой
- `.challenges-card` - карточка с проблемами

### Цветовая схема
- Фон: Градиент от `#E0E0FF` до `#F3F3F3`
- Основной текст: `#28194B`
- Вторичный текст: `#504369`
- Акцентный цвет: `#7554CC`
- Белые карточки с тенью: `box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1)`

### Адаптивность
- Максимальная ширина контента: 400px
- Отступы для мобильных устройств: 20px
- Все элементы адаптируются под мобильные экраны

## Интеграция в онбординг

Страница добавлена в конфигурацию онбординга (`src/config/onboardingConfig.ts`):
- **ID**: `create-plan`
- **Предыдущая страница**: `statements-4`
- **Следующая страница**: `buildingplan-1`

## Навигация
- **Кнопка "Назад"**: Возврат на предыдущую страницу
- **Кнопка "Create action plan"**: Переход на страницу `/paywall`

## Данные
Данные страницы хранятся в интерфейсе `CreatePlanData`:
```typescript
interface CreatePlanData {
  profileType: string;
  potential: string;
  potentialYears: string;
  potentialDescription: string;
  age: string;
  rewindGoal: string;
  rejuvenationType: string;
  motivation: string;
  challenges: string[];
}
```

В будущем данные можно получать из:
- localStorage (сохраненные ответы пользователя)
- API (серверные данные)
- Context/Redux (глобальное состояние)

## Pixel-Perfect реализация
Страница создана в соответствии с макетом Figma:
- Точные размеры элементов
- Правильные отступы и gap
- Соответствие цветовой схеме
- Корректные шрифты и размеры текста
