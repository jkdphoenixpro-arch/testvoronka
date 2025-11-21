import React, { useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { usePreloadedAnimation } from '../hooks/usePreloadedAnimation';

interface TestimonialPageProps {
  title: string;
  subtitle?: string;
}

const TestimonialPage: React.FC<TestimonialPageProps> = ({ title, subtitle }) => {
  const lottieRef = useRef<any>(null);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const { animationData, isReady, shouldPlay } = usePreloadedAnimation('testimonials');


  const handleAnimationComplete = () => {
    // Оставляем анимацию на последнем кадре после завершения
    if (lottieRef.current) {
      // Анимация автоматически остается на последнем кадре
    }
  };


  const handleLottieReady = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
    }
    // Убираем setTimeout для мгновенной готовности
    setIsLottieReady(true);
  };


  React.useEffect(() => {
    if (lottieRef.current && isLottieReady && shouldPlay) {
      // Гарантируем, что анимация начинается с первого кадра
      lottieRef.current.goToAndStop(0, true);
      // Убираем setTimeout для мгновенного запуска
      requestAnimationFrame(() => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      });
    }
  }, [isLottieReady, shouldPlay]);

  return (
    <div className="testimonial-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title" dangerouslySetInnerHTML={{ __html: title || '' }} />
        </div>
        {subtitle && (
          <p className="question-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />
        )}
      </div>

      <div className="testimonial-section">
        <div className="image-container" style={{ position: 'relative' }}>

          {/* Статичное изображение скрыто - показываем только анимацию */}

          {isReady && animationData && shouldPlay && (
            <div
              style={{
                width: '100%',
                height: '100%',
                opacity: isLottieReady ? 1 : 0,
                transition: 'opacity 0.1s ease-in-out',
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

        <div className="rating-section">
          <div className="stars-rating">
            <img src="/image/rating.svg" alt="5 stars rating" />
          </div>
          <div className="testimonial-content-text">
            <p>4.8 Rating | 17.2K 5-star reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;