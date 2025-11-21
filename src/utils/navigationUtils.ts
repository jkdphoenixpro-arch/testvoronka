/**
 * @deprecated Используйте функции из src/config/onboardingConfig.ts вместо этого файла
 * Этот файл оставлен для обратной совместимости
 */

import { 
  getPreviousStepByRoute as getPreviousStepByRouteFromConfig,
  getAllRoutes,
  isValidOnboardingStep as isValidFromConfig,
  getStepIndexByRoute as getStepIndexByRouteFromConfig
} from '../config/onboardingConfig';

export function getPreviousStep(currentPath: string): string | null {
  const prev = getPreviousStepByRouteFromConfig(currentPath);
  return prev ? prev.route : null;
}

export function getNextStep(currentPath: string): string | null {
  // Эта функция устарела, используйте getNextStep из onboardingConfig.ts
  console.warn('Используйте getNextStep из src/config/onboardingConfig.ts');
  return null;
}

export function isValidOnboardingStep(path: string): boolean {
  return isValidFromConfig(path);
}

export function getStepIndex(path: string): number {
  return getStepIndexByRouteFromConfig(path);
}

export function getAllSteps(): string[] {
  return getAllRoutes();
}
