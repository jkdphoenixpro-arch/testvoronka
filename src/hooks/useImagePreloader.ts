import { useEffect, useRef } from 'react';

/**
 * Хук для предзагрузки изображений следующих шагов онбординга
 * @param images - массив путей к изображениям для предзагрузки
 */
export const useImagePreloader = (images: string[]) => {
  const loadedImagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!images || images.length === 0) return;

    // Загружаем только те изображения, которые ещё не загружены
    const imagesToLoad = images.filter(src => !loadedImagesRef.current.has(src));
    
    if (imagesToLoad.length === 0) return;

    const preloadedImages: HTMLImageElement[] = [];

    imagesToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
      loadedImagesRef.current.add(src);
    });

    // Очистка не требуется, браузер кэширует изображения
    return () => {
      preloadedImages.length = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join(',')]); // Используем строковое представление для сравнения
};

export default useImagePreloader;
