import { useAnimations } from '../contexts/AnimationContext';
import { useEffect, useState, useRef } from 'react';

export const usePreloadedAnimation = (animationName: string) => {
  const { animations, isLoading } = useAnimations();
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const mountTimeRef = useRef<number>(0);
  
  const animationData = animations[animationName];
  const hasData = !isLoading && animationData !== undefined && animationData !== null;
  const hasError = !isLoading && animationData === null;

  // Запоминаем время монтирования компонента
  useEffect(() => {
    mountTimeRef.current = Date.now();
    setIsAnimationReady(false);
    setShouldPlay(false);
    
    // Очистка при размонтировании
    return () => {
      setIsAnimationReady(false);
      setShouldPlay(false);
    };
  }, []);

  // Добавляем небольшую задержку для плавного появления анимации
  useEffect(() => {
    if (hasData && !hasError) {
      // Используем requestAnimationFrame для синхронизации с браузером
      const timeout = setTimeout(() => {
        requestAnimationFrame(() => {
          setIsAnimationReady(true);
          // Запускаем анимацию только после готовности
          setTimeout(() => {
            setShouldPlay(true);
          }, 100);
        });
      }, 50); // Минимальная задержка для предотвращения рывков
      
      return () => clearTimeout(timeout);
    } else {
      setIsAnimationReady(false);
      setShouldPlay(false);
    }
  }, [hasData, hasError]);
  
  return {
    animationData,
    isReady: isAnimationReady,
    shouldPlay,
    hasError,
    mountTime: mountTimeRef.current
  };
};

export default usePreloadedAnimation;
