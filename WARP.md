# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Команды, используемые чаще всего

- Установка зависимостей (детерминированно, по package-lock):
  - PowerShell: `npm ci`
- Запуск в режиме разработки:
  - `npm start`
- Сборка для продакшена:
  - `npm run build`
- Тесты (Jest через react-scripts, неинтерактивно):
  - Все тесты без watch: `$env:CI="true"; npm test -- --watchAll=false`
  - Один файл тестов: `$env:CI="true"; npm test -- src/App.test.tsx --watchAll=false`
  - Один тест по имени: `$env:CI="true"; npm test -- -t "<часть_имени_теста>" --watchAll=false`
- Линтинг:
  - Отдельной команды нет. ESLint встроен в `react-scripts` и срабатывает при `npm start`/`npm run build` согласно `eslintConfig` (extends: `react-app`, `react-app/jest`).

Примечание по среде: команды указаны для Windows PowerShell (pwsh). На других ОС переменная окружения `CI` выставляется согласно их синтаксису.

## Архитектура и структура (big picture)

Приложение — React (TypeScript) онбординг с маршрутизацией и несколькими последовательными флоу. Ключевые элементы:

- Точка входа и маршрутизация
  - `src/index.tsx` — монтирование приложения; `React.StrictMode`.
  - `src/App.tsx` — Router и верхнеуровневые маршруты:
    - `/` → редирект на `/goal/1`.
    - Основные сегменты: `/goal/:stepId`, `/user/:stepId`, `/lifestyle/:stepId`, `/statements/:stepId`, `/buildingplan/:stepId`, `/results`.
    - Для обратной совместимости остаётся маршрут `/:pageId` на `QuizPage`.

- Драйвер данных онбординга (флоу Goal)
  - `src/data/quizData.ts` — описывает страницы онбординга (идентификатор, заголовок, опции, прогресс, тип страницы: splash/testimonial/chart, флаги `isMultiSelect`, `showContinueButton`).
  - `src/components/QuizPage.tsx` — единая страница, которая читает `quizPages` и:
    - Управляет выбором (single/multi), автопереходом на следующий шаг при single-select без кнопки Continue.
    - Выводит специализированные подэкраны: Splash (`SplashPage`), Testimonial (`TestimonialPage`), Chart (`ChartPage`).
    - Формирует классы контейнера для анимаций/стилей, чтобы единая DOM-структура обслуживала разные макеты.

- Прогресс и шапка
  - `src/hooks/useOnboardingProgress.ts` — рассчитывает текущий шаг по URL для всех сегментов флоу (goal/user/lifestyle/statements) и возвращает `progress` (0–99%).
  - `src/components/Header.tsx` — навбар + прогресс-бар. Показывает стрелку «Назад» в зависимости от текущего маршрута; берёт прогресс из хука.

- Дополнительные флоу
  - `src/components/UserPage.tsx` — серия шагов с multi-select (первые экраны) и single-select (шаги 5–6), testimonial-экраны, навигация по шагам и автоматический переход.
  - `src/components/LifestylePage.tsx` — single-select шаги, информационные экраны; на шаге 7 используется анимация (см. ниже).
  - `src/components/StatementsPage.tsx` — шкала из 5 значений (`ScaleButton`), переход на `buildingplan` после последнего шага.
  - `src/components/BuildingPlanPage.tsx` — анимированное «построение плана» с последовательным прогрессом по «шагам» и модальными окнами подтверждения, затем переход на `/results`.
  - `src/components/ResultsPage.tsx` — финальный экран программы.

- Анимации
  - `src/contexts/AnimationContext.tsx` — прелоад JSON-анимаций (через `fetch`), хранение в контексте, прогресс загрузки.
  - `src/hooks/usePreloadedAnimation.ts` — хук, который сообщает готовность и момент старта анимации; используется, например, в `LifestylePage` (шаг 7) совместно с `lottie-react`.

- Переиспользуемые UI-компоненты
  - Кнопки выбора: `OptionButton` (single), `MultiOptionButton` (multi, с чекбоксом и иконкой), `ScaleButton` (шкала), `ContinueButton` (фиксированная внизу).
  - Шапка: `Header`.

- Стили и верстка
  - CSS хранится в `src/styles/*.css` и проект рассчитан на pixel-perfect соответствие макету.
  - Важный принцип — единая HTML-структура обслуживает мобильную и десктопную версии; адаптивность достигается через CSS-медиа-запросы и модификаторы классов (без разветвления на отдельные компоненты под устройства).

## Тестирование

- Стек: Jest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) с инициализацией в `src/setupTests.ts`.
- Пример теста: `src/App.test.tsx`.
- Запуск тестов и одиночных кейсов — см. раздел «Команды» выше (всегда используйте неинтерактивные флаги в CI/агентном окружении).

## Важные правила проекта (из пользовательских правил и README)

- Коммуникация: отвечать только на русском языке.
- Архитектура/верстка:
  - Единая DOM-структура для мобильной и десктопной версий.
  - Адаптивность — через CSS медиа-запросы, а не через раздельные компоненты.
  - Фокус на повторном использовании стилей и классов, чистоте и минимально необходимом коде.
- Навигация и запуск (из README): `npm start` — локальный дев-сервер; основные сегменты маршрутов описаны выше.

## Быстрые ссылки на ключевые файлы

- Вход/роутинг: `src/index.tsx`, `src/App.tsx`
- Данные онбординга: `src/data/quizData.ts`
- Прогресс: `src/hooks/useOnboardingProgress.ts`
- Анимации: `src/contexts/AnimationContext.tsx`, `src/hooks/usePreloadedAnimation.ts`
- Базовые страницы флоу: `src/components/QuizPage.tsx`, `UserPage.tsx`, `LifestylePage.tsx`, `StatementsPage.tsx`, `BuildingPlanPage.tsx`, `ResultsPage.tsx`
