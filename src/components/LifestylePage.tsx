import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import { usePreloadedAnimation } from '../hooks/usePreloadedAnimation';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { getStepByRoute, getNextStep, getPreviousStepByRoute } from '../config/onboardingConfig';
import Header from './Header';
import ContinueButton from './ContinueButton';
import ScaleButton from './ScaleButton';
import '../styles/lifestyle.css';
import '../styles/statements.css';

// Данные шагов lifestyle берутся из централизованного конфига (src/config/onboardingConfig.ts)

export default function LifestylePage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentStepId = stepId || '1';
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const lottieRef = useRef<any>(null);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const stepConfig = getStepByRoute(`/lifestyle/${currentStepId}`);
  const { animationData, isReady, shouldPlay } = usePreloadedAnimation('lifestyle');

  // Предзагрузка изображений следующего шага из конфига
  useImagePreloader(stepConfig?.imagesToPreload || []);
  
  useEffect(() => {
    setSelectedOptions([]);
  }, [currentStepId]);


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
    if (lottieRef.current && isLottieReady && shouldPlay && currentStepId === '7') {
      lottieRef.current.goToAndStop(0, true);
      setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      }, 50);
    }
  }, [isLottieReady, shouldPlay, currentStepId]);

  const handleOptionClick = (index: number) => {
    setSelectedOptions([index]);
    setTimeout(() => {
      goNext();
    }, 300);
  };

  const handleScaleClick = (value: number) => {
    setSelectedOptions([value]);
    setTimeout(() => {
      goNext();
    }, 500);
  };

  const handleBackClick = () => {
    const prev = getPreviousStepByRoute(`/lifestyle/${currentStepId}`);
    if (prev) {
      navigate(prev.route);
    }
  };

  const goNext = () => {
    if (stepConfig?.id) {
      const next = getNextStep(stepConfig.id);
      if (next) {
        navigate(next.route);
      } else if (stepConfig.nextStepId) {
        // Если следующий шаг не найден в конфиге, переходим напрямую по маршруту
        navigate(`/${stepConfig.nextStepId}`);
      }
    }
  };

  const getContainerClassName = () => {
    let className = 'quiz-container lifestyle-container';
    className += ` lifestyle-step-${currentStepId}`;
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      <Header 
        onBackClick={handleBackClick}
        showBackButton={true}
      />
      
      <main className="content-wrapper">
        {stepConfig?.pageType === 'scale' ? (
          <>
            <div className="title-wrapper">
              <p className="statement-question">{stepConfig.question}</p>
              <div className="heading-container">
                <h2 className="statement-title">{stepConfig.statement}</h2>
              </div>
            </div>

            <div className="scale-wrapper">
              <div className="scale-options">
                {[1, 2, 3, 4, 5].map((value, index) => {
                  const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
                  const uniqueKey = `${currentStepId}-${value}`;
                  return (
                    <ScaleButton
                      key={uniqueKey}
                      value={value}
                      selected={selectedOptions.includes(value)}
                      onClick={handleScaleClick}
                      className={animationClass}
                    />
                  );
                })}
              </div>
              <div className="scale-labels">
                <span className="scale-label-left">Strongly disagree</span>
                <span className="scale-label-right">Strongly agree</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="title-wrapper">
              <div className="heading-container">
                <h2 className="question-title" dangerouslySetInnerHTML={{ __html: stepConfig?.title || '' }} />
              </div>
              {stepConfig?.subtitle && (
                <p className="question-subtitle" dangerouslySetInnerHTML={{ __html: stepConfig.subtitle }} />
              )}
            </div>

            {stepConfig?.pageType === 'info' || stepConfig?.pageType === 'chart' ? (
              <>
                {stepConfig?.pageType === 'chart' ? (
                  currentStepId === 'new4' ? (
                    <>
                      <div className="chart-container">
                        <img src={stepConfig?.chartImage} alt="Progress rate chart" className="chart-image" />
                      </div>
                      
                      <div className="expert-card">
                        <div className="expert-quote">
                          {stepConfig?.testimonials?.[0]?.description}
                        </div>
                        <div className="expert-footer">
                          <div className="expert-info">
                            <div className="expert-name">{stepConfig?.testimonials?.[0]?.author}</div>
                            <div className="expert-title">{stepConfig?.testimonials?.[0]?.age}</div>
                          </div>
                        </div>
                        <div className="expert-image-wrapper">
                          <img src={stepConfig?.imageSrc} alt="Expert" className="expert-image" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="chart-section">
                      <div className="chart-block">
                        <div className="chart-image">
                          {currentStepId === '7' && isReady && animationData ? (
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
                          ) : (
                            <img src={stepConfig?.imageSrc} alt="Age Back chart" />
                          )}
                        </div>
                      </div>
                      
                      <div className="info-block">
                        <div className="info-icon">
                          <img src="/image/znak.svg" alt="Info icon" />
                        </div>
                        <div className="info-text">
                          <p>{stepConfig?.infoText}</p>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    {stepConfig?.description && (
                      <p className="info-description">{stepConfig?.description}</p>
                    )}
                    {stepConfig?.imageSrc && (
                      <div className="info-image-wrapper">
                        <img src={stepConfig?.imageSrc} alt="Age Back approach" className="info-image" />
                      </div>
                    )}
                    {stepConfig?.infoText && (
                      <p className="info-text">{stepConfig?.infoText}</p>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="options-wrapper">
                {stepConfig?.options?.map((opt, index) => {
                  const isSelected = selectedOptions.includes(index);
                  const uniqueKey = `${currentStepId}-${index}`;
                  
                  return (
                    <button 
                      key={uniqueKey}
                      className={`single-select-option ${isSelected ? 'selected' : ''} animated-option delay-${Math.min(index + 1, 15)}`}
                      onClick={() => handleOptionClick(index)}
                    >
                      <span className="option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      
      {(stepConfig?.pageType === 'info' || stepConfig?.pageType === 'chart') && (
        <ContinueButton onClick={goNext} />
      )}
    </div>
  );
}