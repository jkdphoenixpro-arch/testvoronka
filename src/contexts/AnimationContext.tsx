import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationContextType {
  animations: Record<string, any>;
  isLoading: boolean;
  loadingProgress: number;
}

const AnimationContext = createContext<AnimationContextType>({
  animations: {},
  isLoading: true,
  loadingProgress: 0
});

// Список всех анимаций в приложении
const ANIMATIONS = [
  { name: 'testimonials', path: '/animate/Testimonials.json' },
  { name: 'lifestyle', path: '/animate/Progress-Care-level.json' },
  { name: 'chart', path: '/animate/Aging-time.json' }
];

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const preloadAnimations = async () => {
      const loadedAnimations: Record<string, any> = {};
      let completed = 0;

      for (const animation of ANIMATIONS) {
        try {
          const response = await fetch(animation.path);
          if (response.ok) {
            const animationData = await response.json();
            loadedAnimations[animation.name] = animationData;
          } else {
            console.warn(`Failed to load animation: ${animation.name}`);
            loadedAnimations[animation.name] = null;
          }
        } catch (error) {
          console.warn(`Error loading animation ${animation.name}:`, error);
          loadedAnimations[animation.name] = null;
        }

        completed++;
        setLoadingProgress((completed / ANIMATIONS.length) * 100);
      }

      setAnimations(loadedAnimations);
      setIsLoading(false);
    };

    preloadAnimations();
  }, []);

  const contextValue: AnimationContextType = {
    animations,
    isLoading,
    loadingProgress
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimations must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationContext;