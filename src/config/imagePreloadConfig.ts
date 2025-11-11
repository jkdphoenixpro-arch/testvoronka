/**
 * Конфигурация изображений для предзагрузки на шаг вперёд
 * Ключ - текущий путь, значение - изображения следующего шага
 */
export const IMAGE_PRELOAD_MAP: Record<string, string[]> = {
  // Goal steps (goal/1 - goal/7)
  '/goal/1': [],
  '/goal/2': [],
  '/goal/3': [],
  '/goal/4': [],
  '/goal/5': [],
  '/goal/6': ['/image/rating.svg', '/image/znak.svg'], // следующий шаг goal/7 использует rating.svg и znak.svg
  '/goal/7': ['/image/before&after.webp', '/image/rating.svg'], // следующий шаг user/1

  // User steps (user/1 - user/7)
  '/user/1': [],
  '/user/2': [],
  '/user/3': [],
  '/user/4': [],
  '/user/5': [],
  '/user/6': ['/image/before&after.webp', '/image/rating.svg'], // следующий шаг user/7
  '/user/7': ['/image/approach.webp'], // следующий шаг lifestyle/1

  // Lifestyle steps (lifestyle/1 - lifestyle/7)
  '/lifestyle/1': [],
  '/lifestyle/2': [],
  '/lifestyle/3': ['/image/approach.webp'], // следующий шаг lifestyle/4
  '/lifestyle/4': [],
  '/lifestyle/5': [],
  '/lifestyle/6': ['/image/chart-withwithout.svg', '/image/znak.svg'], // следующий шаг lifestyle/7
  '/lifestyle/7': [], // следующий шаг statements/1 не имеет изображений

  // Statements steps (statements/1 - statements/4)
  '/statements/1': [],
  '/statements/2': [],
  '/statements/3': [],
  '/statements/4': ['/image/rating.svg'], // следующий шаг buildingplan/1

  // BuildingPlan step
  '/buildingplan/1': ['/image/results-8w.webp', '/image/person-goal.svg', '/image/person-issue.svg', '/image/person-improvement.svg'] // следующий шаг results
};

/**
 * Получить список изображений для предзагрузки на основе текущего пути
 * @param currentPath - текущий путь (например, '/goal/1', '/user/3')
 * @returns массив путей к изображениям для предзагрузки
 */
export const getImagesToPreload = (currentPath: string): string[] => {
  return IMAGE_PRELOAD_MAP[currentPath] || [];
};
