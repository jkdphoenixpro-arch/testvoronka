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


  useEffect(() => {
    mountTimeRef.current = Date.now();
    setIsAnimationReady(false);
    setShouldPlay(false);
    

    return () => {
      setIsAnimationReady(false);
      setShouldPlay(false);
    };
  }, []);


  useEffect(() => {
    if (hasData && !hasError) {
      // Уменьшаем задержки для более быстрого отклика
      const timeout = setTimeout(() => {
        requestAnimationFrame(() => {
          setIsAnimationReady(true);

          // Уменьшаем задержку shouldPlay с 30ms до 5ms
          setTimeout(() => {
            setShouldPlay(true);
          }, 5);
        });
      }, 5); // Уменьшаем базовую задержку с 20ms до 5ms
      
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
