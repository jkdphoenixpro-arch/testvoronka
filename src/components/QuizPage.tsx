import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import { saveGoalSelection, clearUserSelections } from '../utils/userSelections';
import OptionButton from './OptionButton';
import MultiOptionButton from './MultiOptionButton';
import ContinueButton from './ContinueButton';
import TestimonialPage from './TestimonialPage';
import ChartPage from './ChartPage';
import SplashPage from './SplashPage';
import StepsInfoPage from './StepsInfoPage';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { getStepByRoute, getNextStep, getPreviousStepByRoute, OnboardingStep } from '../config/onboardingConfig';

const QuizPage: React.FC = () => {
  const { pageId, stepId } = useParams<{ pageId?: string; stepId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем конфигурацию текущей страницы из централизованного конфига
  const currentPageId = stepId || pageId || '1';
  const currentPath = `/goal/${currentPageId}`;
  const stepConfig = getStepByRoute(currentPath);
  
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Предзагрузка изображений следующего шага из конфига
  useImagePreloader(stepConfig?.imagesToPreload || []);

  const getCurrentPath = () => {
    return stepId ? '/goal' : '';
  };

  useEffect(() => {
    if (stepConfig && stepConfig.pageType === 'splash') {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleContinueClick();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [stepConfig, navigate]);

  // Очищаем все сохраненные выборы при загрузке
  useEffect(() => {
    clearUserSelections();
  }, []);

  // Сбрасываем selectedValues при смене страницы
  useEffect(() => {
    if (!stepConfig) return;
    
    // Всегда сбрасываем выбор при переходе на новую страницу
    setSelectedValues([]);
  }, [currentPageId, stepConfig]);

  // Редирект на первую страницу если конфиг не найден
  useEffect(() => {
    if (!stepConfig) {
      const basePath = getCurrentPath();
      navigate(`${basePath}/1`);
    }
  }, [stepConfig, navigate]);

  if (!stepConfig) {
    return null;
  }

  const handleOptionClick = (value: string) => {
    if (!stepConfig) return;
    
    if (stepConfig.isMultiSelect) {
      setSelectedValues(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        } else {
          return [...prev, value];
        }
      });
    } else {
      setSelectedValues([value]);
      
      // Сохраняем выбор, если указан saveKey в конфиге
      if (stepConfig.saveKey) {
        saveGoalSelection(stepConfig.saveKey, value);
      }
      
      // Автопереход если настроен в конфиге - сразу переходим, не проверяя selectedValues
      if (stepConfig.autoNavigate && !stepConfig.showContinueButton) {
        setTimeout(() => {
          const nextStep = getNextStep(stepConfig.id);
          if (nextStep) {
            navigate(nextStep.route);
          }
        }, stepConfig.autoNavigateDelay || 500);
      }
    }
  };
  
  const handleContinueClick = () => {
    if (!stepConfig) return;
    
    // Проверяем, можно ли продолжить
    const isSpecialPage = stepConfig.pageType === 'testimonial-grid' || 
                          stepConfig.pageType === 'chart' || 
                          stepConfig.pageType === 'splash' ||
                          stepConfig.pageType === 'steps-info';
    if (!isSpecialPage && selectedValues.length === 0) {
      return; // Не продолжаем, если ничего не выбрано
    }
    
    // Получаем следующий шаг из конфига
    const nextStep = getNextStep(stepConfig.id);
    
    if (nextStep) {
      navigate(nextStep.route);
    }
  };

  const handleBackClick = () => {
    if (!stepConfig) return;
    
    // Получаем предыдущий шаг из конфига
    const prevStep = getPreviousStepByRoute(currentPath);
    
    if (prevStep) {
      navigate(prevStep.route);
    }
  };


  const getContainerClassName = () => {
    if (!stepConfig) return 'quiz-container';
    
    let className = 'quiz-container';
    
    if (stepConfig.showContinueButton) {
      className += ' has-continue-button';
    }
    
    // Сохраняем старый класс для совместимости стилей
    if (stepConfig.legacyClassName) {
      className += ` ${stepConfig.legacyClassName}`;
    }
    
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      {stepConfig.pageType !== 'splash' && (
        <Header 
          onBackClick={handleBackClick}
          showBackButton={!!getPreviousStepByRoute(currentPath)}
        />
      )}
      
      {stepConfig.pageType === 'splash' && (
        <div className="top-bar">
          <div className="navbar">
            <div className="app-icon">
              <img src="/image/rewind-icon-24px.svg" alt="" className="app-rewind-icon" />
              <span className="app-name">Age Back</span>
            </div>
          </div>
        </div>
      )}
      
      <main className="content-wrapper">
        {stepConfig.pageType === 'splash' ? (
          <SplashPage 
            title={stepConfig.title || ''}
            subtitle={stepConfig.subtitle}
          />
        ) : stepConfig.pageType === 'testimonial-grid' ? (
          <TestimonialPage 
            title={stepConfig.title || ''}
            subtitle={stepConfig.subtitle}
          />
        ) : stepConfig.pageType === 'chart' ? (
          <ChartPage 
            title={stepConfig.title || ''}
            subtitle={stepConfig.subtitle}
            chartImage={stepConfig.chartImage}
            infoText={stepConfig.infoText}
            infoIcon={stepConfig.infoIcon}
            testimonials={stepConfig.testimonials}
          />
        ) : stepConfig.pageType === 'steps-info' ? (
          <StepsInfoPage 
            title={stepConfig.title || ''}
            steps={stepConfig.steps}
          />
        ) : (
          <>
            <div className={`title-wrapper ${stepConfig.legacyClassName === 'goal-page-2' || stepConfig.legacyClassName === 'goal-page-3' ? 'page-2-title' : ''}`}>
              <div className="heading-container">
                <h2 className="question-title" dangerouslySetInnerHTML={{ __html: stepConfig.title || '' }} />
              </div>
              {stepConfig.subtitle && (
                <p className="question-subtitle" dangerouslySetInnerHTML={{ __html: stepConfig.subtitle }} />
              )}
            </div>

            <div className={`options-wrapper ${
              stepConfig.legacyClassName === 'goal-page-2' || stepConfig.legacyClassName === 'goal-page-3' ? 'page-2-options' : 
              stepConfig.legacyClassName === 'goal-page-4' ? 'page-4-options' : 
              ''
            }`}>
              {stepConfig.options?.map((option, index) => {
                const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
                const uniqueKey = `${currentPageId}-${index}`;
                if (stepConfig.isMultiSelect) {
                  return (
                    <MultiOptionButton
                      key={uniqueKey}
                      option={option}
                      selected={selectedValues.includes(option.value)}
                      onClick={handleOptionClick}
                      className={animationClass}
                    />
                  );
                } else {
                  return (
                    <OptionButton
                      key={uniqueKey}
                      option={option}
                      selected={selectedValues.includes(option.value)}
                      onClick={handleOptionClick}
                      className={animationClass}
                    />
                  );
                }
              })}
            </div>
          </>
        )}
      </main>
      
      {stepConfig.showContinueButton && (
        <ContinueButton
          onClick={handleContinueClick}
          text={stepConfig.pageType === 'steps-info' ? 'Start body scan' : 'Continue'}
          disabled={(() => {
            const isSpecialPage = stepConfig.pageType === 'testimonial-grid' || 
                                  stepConfig.pageType === 'chart' || 
                                  stepConfig.pageType === 'splash' ||
                                  stepConfig.pageType === 'steps-info';
            if (isSpecialPage) {
              return false;
            }
            if (stepConfig.isMultiSelect) {
              return selectedValues.length === 0;
            }
            return selectedValues.length === 0;
          })()}
        />
      )}
    </div>
  );
};

export default QuizPage;