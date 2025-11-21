import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { saveIssueAreaSelections, saveChallengeSelections } from '../utils/userSelections';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { getStepByRoute, getNextStep, getPreviousStepByRoute } from '../config/onboardingConfig';
import MultiOptionButton from './MultiOptionButton';
import IconPlaceholder from './IconPlaceholder';
import ChartPage from './ChartPage';
import '../styles/user.css';
import '../styles/testimonial.css';


// Данные шагов user берутся из централизованного конфига (src/config/onboardingConfig.ts)


export default function UserPage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = `/user/${stepId || '1'}`;
  
  // Получаем конфигурацию текущей страницы из централизованного конфига
  const stepConfig = getStepByRoute(currentPath);
  
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Предзагрузка изображений следующего шага из конфига
  useImagePreloader(stepConfig?.imagesToPreload || []);




  useEffect(() => {
    setSelectedOptions([]);
  }, [stepId]);

  const handleOptionClick = (index: number) => {
    if (!stepConfig) return;
    
    // Автопереход для single-select страниц
    if (stepConfig.autoNavigate) {
      setSelectedOptions([index]);
      setTimeout(() => {
        goNext();
      }, stepConfig.autoNavigateDelay || 300);
      return;
    }

    // Multi-select для pill-страниц и новых multi-select страниц
    setSelectedOptions(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : prev.length < (stepConfig.maxSelections || 3)
        ? [...prev, index]
        : prev;
      
      // Сохраняем выборы если указан saveKey в конфиге
      if (stepConfig.saveKey && stepConfig.options) {
        const selectedValues = newSelection.map(i => stepConfig.options![i].value);
        
        // Для новых страниц user/new1, user/new3, user/new5
        if (stepConfig.id === 'user-new1' || stepConfig.id === 'user-new3' || stepConfig.id === 'user-new5') {
          const pageKey = stepConfig.id === 'user-new1' ? 'userNew1' : 
                         stepConfig.id === 'user-new3' ? 'userNew3' : 'userNew5';
          saveChallengeSelections(pageKey, selectedValues);
        } else {
          // Для старых страниц user/1, user/2, user/3
          const selectedNames = newSelection.map(i => stepConfig.options![i].text);
          const pageKey = stepConfig.saveKey as 'user1' | 'user2' | 'user3';
          saveIssueAreaSelections(pageKey, selectedNames);
        }
      }
      
      return newSelection;
    });
  };

  const handleBackClick = () => {
    const prevStep = getPreviousStepByRoute(currentPath);
    if (prevStep) {
      navigate(prevStep.route);
    }
  };

  const goNext = () => {
    if (!stepConfig) return;
    const next = getNextStep(stepConfig.id);
    if (next) {
      navigate(next.route);
    }
  };


  const getContainerClassName = () => {
    let className = 'quiz-container user-container';
    if (stepConfig?.stepClass) {
      className += ` ${stepConfig.stepClass}`;
    } else if (stepId === '5' || stepId === '6') {
      className += ` user-step-${stepId}`;
    }
    // Добавляем legacy класс для multi-select страниц
    if (stepConfig?.legacyClassName) {
      className += ` ${stepConfig.legacyClassName}`;
    }
    return className;
  };

  if (!stepConfig) {
    navigate('/user/1');
    return null;
  }

  return (
    <div className={getContainerClassName()}>
      <Header 
        onBackClick={handleBackClick}
        showBackButton={!!getPreviousStepByRoute(currentPath)}
      />
      
      <main className="content-wrapper">
        {stepConfig.pageType === 'chart' ? (
          <ChartPage 
            title={stepConfig.title || ''}
            subtitle={stepConfig.subtitle}
            chartImage={stepConfig.chartImage}
            infoText={stepConfig.infoText}
            infoIcon={stepConfig.infoIcon}
            testimonials={stepConfig.testimonials}
          />
        ) : (
          <>
            <div className="title-wrapper">
              <div className="heading-container">
                <h2 className="question-title" dangerouslySetInnerHTML={{ __html: stepConfig.title || '' }} />
              </div>
              {stepConfig.subtitle && (
                <p className="question-subtitle" dangerouslySetInnerHTML={{ __html: stepConfig.subtitle }} />
              )}
            </div>

            {stepConfig.pageType === 'testimonial-with-logos' ? (
          <>
            <div className="doctor-card">
              <img src={stepConfig.imageSrc} alt="Doctor" className="doctor-image" />
              <div className="doctor-testimonial">
                <div className="doctor-quote">
                  {stepConfig.testimonials?.[0]?.description}
                </div>
                <div className="doctor-info">
                  <div className="doctor-name">{stepConfig.testimonials?.[0]?.author}</div>
                  <div className="doctor-title">{stepConfig.testimonials?.[0]?.age}</div>
                </div>
              </div>
            </div>
            <div className="logos-block">
              <div className="logos-title">{stepConfig.bottomText}</div>
              <div className="logos-container">
                <div className="logo-item">
                  <img src="/image/GSR.svg" alt="GSR" />
                </div>
                <div className="logo-item">
                  <img src="/image/GSR.svg" alt="GSR" />
                </div>
                <div className="logo-item">
                  <img src="/image/GSR.svg" alt="GSR" />
                </div>
                <div className="logo-item">
                  <img src="/image/GSR.svg" alt="GSR" />
                </div>
                <div className="logo-item">
                  <img src="/image/GSR.svg" alt="GSR" />
                </div>
              </div>
            </div>
          </>
        ) : stepConfig.pageType === 'testimonial-advanced' ? (
          <div className="user-step-7-testimonial">
            <div className="testimonial-card-advanced">
              <div className="testimonial-image">
                <img src={stepConfig.imageSrc} alt="Before and after results" />
              </div>
              <div className="testimonial-content-advanced">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      <span>{stepConfig.testimonials?.[0]?.author?.charAt(0) || 'J'}</span>
                    </div>
                    <div className="user-details">
                      <span>{stepConfig.testimonials?.[0]?.author}, {stepConfig.testimonials?.[0]?.age}</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-text">
                  <p>{stepConfig.testimonials?.[0]?.description}</p>
                </div>
                <div className="rating">
                  <img src={stepConfig.testimonials?.[0]?.rating || '/image/rating.svg'} alt="5 stars rating" />
                </div>
              </div>
            </div>
          </div>
        ) : stepConfig.pageType === 'testimonial-grid' ? (
          <>
            <div className="testimonials-wrapper">
              <div className="testimonials-grid">
                {stepConfig.testimonials?.map((item, index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-percentage">{item.percentage}</div>
                    <div className="testimonial-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
            {stepConfig.bottomText && (
              <div className="testimonials-bottom-text">{stepConfig.bottomText}</div>
            )}
          </>
        ) : stepConfig.pageType === 'multi-select' ? (
          <div className="options-wrapper page-4-options">
            {stepConfig.options?.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
              const uniqueKey = `${stepId}-${index}`;
              return (
                <button 
                  key={uniqueKey}
                  className={`multi-select-option ${isSelected ? 'selected' : ''} ${animationClass}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <div className="image-area">
                    {option.icon && <IconPlaceholder iconType={option.icon} />}
                  </div>
                  <span className="option-text">{option.text}</span>
                  <div className="option-controls">
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && (
                        <svg className="checkmark" width="9" height="6" viewBox="0 0 9 6" fill="none">
                          <path d="M1 3L3.5 5L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : stepConfig.pageType === 'single-select' ? (
          <div className="options-wrapper">
            {stepConfig.options?.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
              const uniqueKey = `${stepId}-${index}`;
              return (
                <button 
                  key={uniqueKey}
                  className={`single-select-option ${isSelected ? 'selected' : ''} ${animationClass}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-text">{option.text}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="options-wrapper user-options">
            <div className="options-grid">
              {stepConfig.options?.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const widthClass = option.width || 'pill-w120';
              const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
              const uniqueKey = `${stepId}-${index}`;
              return (
                <button 
                  key={uniqueKey}
                  className={`pill ${widthClass} ${isSelected ? 'pill-primary' : ''} ${animationClass}`}
                  onClick={() => handleOptionClick(index)}
                >
                  {option.text}
                </button>
              );
              })}
            </div>
          </div>
        )}
          </>
        )}
      </main>
      
      {stepConfig.showContinueButton && (
        <div className="continue-button-wrapper">
          <button 
            className={`continue-button ${
              (stepConfig.pageType === 'multi-pill' || stepConfig.pageType === 'multi-select') && selectedOptions.length === 0 ? 'disabled' : ''
            }`} 
            onClick={(stepConfig.pageType === 'multi-pill' || stepConfig.pageType === 'multi-select') && selectedOptions.length === 0 ? undefined : goNext}
            disabled={(stepConfig.pageType === 'multi-pill' || stepConfig.pageType === 'multi-select') && selectedOptions.length === 0}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
