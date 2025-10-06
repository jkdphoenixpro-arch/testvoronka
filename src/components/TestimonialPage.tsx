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
    if (lottieRef.current) {
      lottieRef.current.pause();
    }
  };


  const handleLottieReady = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
    }
    setIsLottieReady(true);
  };


  React.useEffect(() => {
    if (lottieRef.current && isLottieReady && shouldPlay) {
      lottieRef.current.goToAndStop(0, true);
      setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      }, 50);
    }
  }, [isLottieReady, shouldPlay]);

  return (
    <div className="testimonial-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title">{title}</h2>
        </div>
        {subtitle && (
          <p className="question-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="testimonial-section">
        <div className="image-container" style={{ position: 'relative' }}>

          <img 
            src="/image/testimonials.webp" 
            alt="Testimonials" 
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