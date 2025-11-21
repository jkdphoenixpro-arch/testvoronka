/**
 * @deprecated Этот файл устарел. Карта предзагрузки теперь генерируется
 * автоматически из src/config/onboardingConfig.ts
 * 
 * Конфигурация изображений для предзагрузки на шаг вперёд
 * Ключ - текущий путь, значение - изображения следующего шага
 */

import { getImagePreloadMap as getMapFromConfig } from './onboardingConfig';

export const IMAGE_PRELOAD_MAP: Record<string, string[]> = getMapFromConfig();

/**
 * Получить список изображений для предзагрузки на основе текущего пути
 * @param currentPath - текущий путь (например, '/goal/1', '/user/3')
 * @returns массив путей к изображениям для предзагрузки
 */
export const getImagesToPreload = (currentPath: string): string[] => {
  return IMAGE_PRELOAD_MAP[currentPath] || [];
};
