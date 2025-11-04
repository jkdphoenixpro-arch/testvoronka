import { useEffect } from 'react';

/**
 * Хук для предзагрузки изображений следующих шагов онбординга
 * @param images - массив путей к изображениям для предзагрузки
 */
export const useImagePreloader = (images: string[]) => {
  useEffect(() => {
    if (!images || images.length === 0) return;

    const preloadedImages: HTMLImageElement[] = [];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    });

    // Очистка не требуется, браузер кэширует изображения
    return () => {
      preloadedImages.length = 0;
    };
  }, [images]);
};

export default useImagePreloader;
