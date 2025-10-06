import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { usePreloadedAnimation } from '../hooks/usePreloadedAnimation';
import Header from './Header';
import ContinueButton from './ContinueButton';
import '../styles/lifestyle.css';

interface LifestyleStep {
  title: string;
  subtitle?: string;
  optionNames?: string[];
  initialSelected: number[];
  progress: number;
  stepClass: string;
  isInfoStep?: boolean;
  description?: string;
  imageSrc?: string;
  infoText?: string;
  isChartStep?: boolean;
}

const lifestyleSteps: Record<number, LifestyleStep> = {
  1: {
    title: "How much activity do you have in your life?",
    subtitle: "",
    optionNames: [
      'Almost none',
      'Mostly sitting, occasional walks',
      'Light workouts or short walks',
      'Regular sports',
      'Very active lifestyle'
    ],
    initialSelected: [],
    progress: 15,
    stepClass: 'lifestyle-step-1'
  },
  2: {
    title: "How does your nutrition usually look?",
    subtitle: "",
    optionNames: [
      'Lots of fast food and sweets',
      'More snacking than proper meals',
      'Sometimes try to eat healthy',
      'Generally balanced',
      'Very careful about nutrition'
    ],
    initialSelected: [],
    progress: 20,
    stepClass: 'lifestyle-step-2'
  },
  3: {
    title: "How about water? How much do you usually drink?",
    subtitle: "",
    optionNames: [
      'Almost none',
      'Less than 1 liter',
      'About 1–1.5 liters',
      'About 2 liters',
      'More than 2 liters'
    ],
    initialSelected: [],
    progress: 25,
    stepClass: 'lifestyle-step-3'
  },
  4: {
    title: "Aging isn't just about years — it's about habits",
    subtitle: "",
    description: "That's why Age Back takes a whole-body approach. By working on posture, flexibility, skin, sleep, and stress, we help you feel and look younger from every angle.",
    imageSrc: "/image/approach.webp",
    initialSelected: [],
    progress: 30,
    stepClass: 'lifestyle-step-4',
    isInfoStep: true
  },
  5: {
    title: "Sleep is the main source of youth. How's yours?",
    subtitle: "",
    optionNames: [
      'Sleep very poorly',
      'Often sleep badly',
      'Varies',
      'Generally sleep well',
      'Sleep deeply and peacefully'
    ],
    initialSelected: [],
    progress: 35,
    stepClass: 'lifestyle-step-5'
  },
  6: {
    title: "How often does stress affect your mood or health?",
    subtitle: "",
    optionNames: [
      'Constantly',
      'Often',
      'Sometimes',
      'Rarely',
      'Almost never'
    ],
    initialSelected: [],
    progress: 40,
    stepClass: 'lifestyle-step-6'
  },
  7: {
    title: "Your lifestyle shapes your aging speed",
    subtitle: "With Age Back, even small shifts in daily habits add up to lasting youth.",
    imageSrc: "/image/chart-withwithout.svg",
    infoText: "Data shows that users who improved their daily routines with Age Back reported faster progress toward rejuvenation.",
    initialSelected: [],
    progress: 45,
    stepClass: 'lifestyle-step-7',
    isInfoStep: true,
    isChartStep: true
  }
};

export default function LifestylePage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const currentStepId = parseInt(stepId || '1');
  const currentStep = lifestyleSteps[currentStepId as keyof typeof lifestyleSteps] || lifestyleSteps[1];
  
  const [selectedOptions, setSelectedOptions] = useState<number[]>(currentStep.initialSelected);
  const lottieRef = useRef<any>(null);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const { animationData, isReady, shouldPlay } = usePreloadedAnimation('lifestyle');
  
  useEffect(() => {
    setSelectedOptions(currentStep.initialSelected);
  }, [currentStep.initialSelected]);


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
    if (lottieRef.current && isLottieReady && shouldPlay && currentStepId === 7) {
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

  const handleBackClick = () => {
    if (currentStepId === 1) {
      return;
    }
    navigate(-1);
  };

  const goNext = () => {
    if (currentStepId === 1) {
      navigate('/lifestyle/2');
    } else if (currentStepId === 2) {
      navigate('/lifestyle/3');
    } else if (currentStepId === 3) {
      navigate('/lifestyle/4');
    } else if (currentStepId === 4) {
      navigate('/lifestyle/5');
    } else if (currentStepId === 5) {
      navigate('/lifestyle/6');
    } else if (currentStepId === 6) {
      navigate('/lifestyle/7');
    } else if (currentStepId === 7) {

      navigate('/statements/1');
    } else {
      navigate('/lifestyle/1');
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
        <div className="title-wrapper">
          <div className="heading-container">
            <h2 className="question-title">{currentStep.title}</h2>
          </div>
          {currentStep.subtitle && (
            <p className="question-subtitle">{currentStep.subtitle}</p>
          )}
        </div>

        {currentStep.isInfoStep ? (
          <>
            {currentStep.isChartStep ? (
              <div className="chart-section">
                <div className="chart-block">
                  <div className="chart-image">
                    {currentStepId === 7 && isReady && animationData ? (
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

                      <img src={currentStep.imageSrc} alt="Age Back chart" />
                    )}
                  </div>
                </div>
                
                <div className="info-block">
                  <div className="info-icon">
                    <img src="/image/znak.svg" alt="Info icon" />
                  </div>
                  <div className="info-text">
                    <p>{currentStep.infoText}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {currentStep.description && (
                  <p className="info-description">{currentStep.description}</p>
                )}
                {currentStep.imageSrc && (
                  <div className="info-image-wrapper">
                    <img src={currentStep.imageSrc} alt="Age Back approach" className="info-image" />
                  </div>
                )}
                {currentStep.infoText && (
                  <p className="info-text">{currentStep.infoText}</p>
                )}
              </>
            )}
          </>
        ) : (
          <div className="options-wrapper">
            {currentStep.optionNames?.map((name, index) => {
              const isSelected = selectedOptions.includes(index);
              
              return (
                <button 
                  key={index}
                  className={`single-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-text">{name}</span>
                </button>
              );
            })}
          </div>
        )}


      </main>
      
      {currentStep.isInfoStep && (
        <ContinueButton onClick={goNext} />
      )}
    </div>
  );
}