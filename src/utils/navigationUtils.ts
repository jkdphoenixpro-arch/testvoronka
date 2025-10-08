// Порядок всех этапов в приложении
const ONBOARDING_STEPS = [
  'goal/1', 'goal/2', 'goal/3', 'goal/4', 'goal/5', 'goal/6', 'goal/7',
  'user/1', 'user/2', 'user/3', 'user/4', 'user/5', 'user/6', 'user/7',
  'lifestyle/1', 'lifestyle/2', 'lifestyle/3', 'lifestyle/4', 'lifestyle/5', 'lifestyle/6', 'lifestyle/7',
  'statements/1', 'statements/2', 'statements/3', 'statements/4',
  'buildingplan/1',
  'results',
  'enteremail',
  'paywall'
];

/**
 * Получить предыдущий этап в последовательности онбординга
 * @param currentPath - текущий путь (например, '/goal/3' или 'goal/3')
 * @returns предыдущий путь с ведущим слешем или null если предыдущего нет
 */
export function getPreviousStep(currentPath: string): string | null {
  // Убираем ведущий слеш если есть
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
  
  const currentIndex = ONBOARDING_STEPS.indexOf(cleanPath);
  
  if (currentIndex === -1) {
    console.warn(`Неизвестный этап: ${cleanPath}`);
    return null;
  }
  
  if (currentIndex === 0) {
    // Это первый этап, предыдущего нет
    return null;
  }
  
  const previousStep = ONBOARDING_STEPS[currentIndex - 1];
  return `/${previousStep}`;
}

/**
 * Получить следующий этап в последовательности онбординга
 * @param currentPath - текущий путь (например, '/goal/3' или 'goal/3')
 * @returns следующий путь с ведущим слешем или null если следующего нет
 */
export function getNextStep(currentPath: string): string | null {
  // Убираем ведущий слеш если есть
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
  
  const currentIndex = ONBOARDING_STEPS.indexOf(cleanPath);
  
  if (currentIndex === -1) {
    console.warn(`Неизвестный этап: ${cleanPath}`);
    return null;
  }
  
  if (currentIndex === ONBOARDING_STEPS.length - 1) {
    // Это последний этап, следующего нет
    return null;
  }
  
  const nextStep = ONBOARDING_STEPS[currentIndex + 1];
  return `/${nextStep}`;
}

/**
 * Проверить, является ли указанный путь валидным этапом онбординга
 * @param path - путь для проверки
 * @returns true если путь валиден
 */
export function isValidOnboardingStep(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return ONBOARDING_STEPS.includes(cleanPath);
}

/**
 * Получить индекс этапа в последовательности (начиная с 0)
 * @param path - путь этапа
 * @returns индекс или -1 если не найден
 */
export function getStepIndex(path: string): number {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return ONBOARDING_STEPS.indexOf(cleanPath);
}

/**
 * Получить общий список всех этапов
 * @returns массив всех этапов
 */
export function getAllSteps(): string[] {
  return [...ONBOARDING_STEPS];
}