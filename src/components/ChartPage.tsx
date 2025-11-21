import React, { useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { usePreloadedAnimation } from '../hooks/usePreloadedAnimation';

interface TestimonialItem {
  description: string;
  author?: string;
  age?: string;
  rating?: string;
}

interface ChartPageProps {
  title: string;
  subtitle?: string;
  chartImage?: string;
  infoText?: string;
  infoIcon?: string;
  testimonials?: TestimonialItem[];
}

const ChartPage: React.FC<ChartPageProps> = ({ title, subtitle, chartImage, infoText, infoIcon, testimonials }) => {
  const lottieRef = useRef<any>(null);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const { animationData, isReady, shouldPlay } = usePreloadedAnimation('chart');


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
    <div className="chart-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title" dangerouslySetInnerHTML={{ __html: title || '' }} />
        </div>
        {subtitle && (
          <p className="question-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />
        )}
      </div>

      <div className="chart-section">
        <div className="chart-block">
          <div className="chart-image" style={{ position: 'relative' }}>

            {/* Если есть chartImage - показываем статичное изображение */}
            {chartImage && (
              <img 
                src={chartImage} 
                alt="Chart" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}

            {/* Иначе показываем Lottie анимацию */}
            {!chartImage && isReady && animationData && shouldPlay && (
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
        </div>

        <div className="info-block">
          {testimonials && testimonials.length > 0 ? (
            <div className="testimonial-content-advanced">
              <div className="testimonial-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <span>{testimonials[0]?.author?.charAt(0) || 'J'}</span>
                  </div>
                  <div className="user-details">
                    <span>{testimonials[0]?.author}, {testimonials[0]?.age}</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-text">
                <p>{testimonials[0]?.description}</p>
              </div>
              <div className="rating">
                <img src={testimonials[0]?.rating || '/image/rating.svg'} alt="5 stars rating" />
              </div>
            </div>
          ) : (
            <>
              <div className="info-icon">
                <img src={infoIcon || "/image/znak.svg"} alt="Info icon" />
              </div>
              <div className="info-text">
                <p dangerouslySetInnerHTML={{ 
                  __html: infoText || "Data based on self-reported results from Age Back users, showing improvements in energy, posture, and skin tone" 
                }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartPage;