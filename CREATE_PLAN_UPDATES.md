# Обновления страницы Create Plan

## Выполненные изменения

### 1. ✅ Убран progress-bar
- Страница использует стандартный компонент `Header` как и другие страницы онбординга
- Progress-bar скрыт через CSS (`.create-plan-container .progress-bar { display: none; }`)

### 2. ✅ Добавлена кнопка back-button
- Используется стандартный компонент `Header` с кнопкой "Назад"
- Кнопка размещена в верхнем левом углу
- Использует иконку `arrow_left.svg`
- При клике возвращает на предыдущую страницу

### 3. ✅ Заменен slider-section на изображение
- Удален весь блок со слайдером (slider-track, slider-control, slider-labels)
- Добавлено изображение `age-rewind-high-4-5.webp`
- Изображение отображается между заголовком карточки и info-block

### 4. ✅ Удалены ненужные стили
Удалены следующие CSS классы:
- `.slider-section`
- `.slider-label`
- `.slider-track-wrapper`
- `.slider-track`
- `.slider-fill`
- `.slider-control`
- `.slider-labels`
- `.slider-label-item`
- `.slider-divider`

### 5. ✅ Добавлены новые стили
Добавлены стили для:
- `.create-plan-container .progress-bar { display: none; }` - скрытие progress-bar
- `.rewind-image-wrapper` - обертка для изображения
- `.rewind-image` - само изображение

## Структура Header

Используется стандартный компонент `Header`:

```tsx
<Header 
  onBackClick={handleBackClick}
  showBackButton={true}
/>
```

Компонент Header автоматически отображает:
- Кнопку "Назад" в левом верхнем углу
- Логотип "Age Back" в центре
- Progress-bar (скрыт через CSS для этой страницы)

## Структура блока с изображением

```html
<div className="rewind-potential-card">
  <div className="card-header">
    <div className="header-text">
      <p className="label-text">Age-Rewind potential:</p>
      <h3 className="value-text">{planData.potential}</h3>
    </div>
  </div>

  <div className="rewind-image-wrapper">
    <img src="/image/age-rewind-high-4-5.webp" alt="Age Rewind Potential" className="rewind-image" />
  </div>

  <div className="info-block">
    <div className="info-icon">
      <img src="/image/icon-info-24px.svg" alt="Info" />
    </div>
    <p className="info-text">
      {planData.potentialDescription}
    </p>
  </div>
</div>
```

## Результат
Страница теперь полностью соответствует требованиям:
- ✅ Нет progress-bar
- ✅ Есть кнопка back-button в top-bar
- ✅ Изображение вместо слайдера
- ✅ Чистый CSS без лишних стилей
- ✅ Минимальный код
