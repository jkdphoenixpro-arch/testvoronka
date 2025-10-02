import React, { useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { usePreloadedAnimation } from '../hooks/usePreloadedAnimation';

interface ChartPageProps {
  title: string;
  subtitle?: string;
}

const ChartPage: React.FC<ChartPageProps> = ({ title, subtitle }) => {
  const lottieRef = useRef<any>(null);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const { animationData, isReady, shouldPlay } = usePreloadedAnimation('chart');

  // Обработчик завершения анимации
  const handleAnimationComplete = () => {
    if (lottieRef.current) {
      // Останавливаем анимацию на последнем кадре
      lottieRef.current.pause();
    }
  };

  // Обработчик готовности Lottie
  const handleLottieReady = () => {
    if (lottieRef.current) {
      // Сбрасываем анимацию на первый кадр
      lottieRef.current.goToAndStop(0, true);
    }
    setIsLottieReady(true);
  };

  // Управление воспроизведением анимации
  React.useEffect(() => {
    if (lottieRef.current && isLottieReady && shouldPlay) {
      // Сбрасываем на начало и запускаем
      lottieRef.current.goToAndStop(0, true);
      setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      }, 50); // Небольшая задержка для стабильности
    }
  }, [isLottieReady, shouldPlay]);

  return (
    <div className="chart-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title">{title}</h2>
        </div>
        {subtitle && (
          <p className="question-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="chart-section">
        <div className="chart-block">
          <div className="chart-image" style={{ position: 'relative' }}>
            {/* Fallback изображение - всегда показываем как основу */}
            <img 
              src="/image/chart-results.svg" 
              alt="Age Back results chart" 
              style={{
                width: '100%',
                height: '100%',
                opacity: (isReady && animationData && isLottieReady) ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            {/* Lottie анимация */}
            {isReady && animationData && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: isLottieReady ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                <Lottie 
                  animationData={animationData}
                  loop={false}
                  autoplay={false}
                  onComplete={handleAnimationComplete}
                  onDOMLoaded={handleLottieReady}
                  lottieRef={lottieRef}
                  style={{ width: '100%', height: '100%' }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="info-block">
          <div className="info-icon">
            <img src="/image/znak.svg" alt="Info icon" />
          </div>
          <div className="info-text">
            <p>Data based on self-reported results from Age Back users, showing improvements in energy, posture, and skin tone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;