import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import { getPreviousStep } from '../utils/navigationUtils';
import { saveGoalSelection } from '../utils/userSelections';
import OptionButton from './OptionButton';
import MultiOptionButton from './MultiOptionButton';
import ContinueButton from './ContinueButton';
import TestimonialPage from './TestimonialPage';
import ChartPage from './ChartPage';
import SplashPage from './SplashPage';
import { quizPages, QuizPageData } from '../data/quizData';

const QuizPage: React.FC = () => {
  const { pageId, stepId } = useParams<{ pageId?: string; stepId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPageId = stepId ? parseInt(stepId) : pageId ? parseInt(pageId) : 1;
  const pageData: QuizPageData | undefined = quizPages.find(page => page.id === currentPageId);
  

  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (!pageData) return [];
    if (pageData.isMultiSelect) {
      return pageData.options.filter(option => option.selected).map(option => option.value);
    } else {
      const selected = pageData.options.find(option => option.selected);
      return selected ? [selected.value] : [];
    }
  });


  const [shouldAnimate, setShouldAnimate] = useState(false);
  

  const getCurrentPath = () => {
    return stepId ? '/goal' : '';
  };


  useEffect(() => {
    const basePath = getCurrentPath();
    if (basePath === '/goal' && (currentPageId === 2 || currentPageId === 3 || currentPageId === 4)) {
      setShouldAnimate(false);

      setTimeout(() => setShouldAnimate(true), 10);
    }
  }, [currentPageId]);


  useEffect(() => {
    const basePath = getCurrentPath();
    if (basePath === '/goal' && (currentPageId === 2 || currentPageId === 3 || currentPageId === 4)) {
      setShouldAnimate(true);
    }
  }, []);


  useEffect(() => {
    if (pageData && pageData.isSplashPage) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          const basePath = stepId ? '/goal' : '';
          navigate(`${basePath}/2`);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [pageData, navigate, stepId]);

  if (!pageData) {
    const basePath = getCurrentPath();
    navigate(`${basePath}/1`);
    return null;
  }

  const handleOptionClick = (value: string) => {
    if (!pageData) return;
    
    if (pageData.isMultiSelect) {

      setSelectedValues(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        } else {
          return [...prev, value];
        }
      });
    } else {
      setSelectedValues([value]);
      
      // Сохраняем выбор для goal страниц
      const basePath = getCurrentPath();
      if (basePath === '/goal') {
        if (currentPageId === 3) {
          saveGoalSelection('page3', value);
        } else if (currentPageId === 5) {
          saveGoalSelection('page5', value);
        }
      }
      
      if (!pageData.showContinueButton) {
        setTimeout(() => {
          const nextPageId = currentPageId + 1;
          const nextPage = quizPages.find(page => page.id === nextPageId);
          
          if (nextPage) {
            navigate(`${basePath}/${nextPageId}`);
          } else {
            navigate('/user/1');
          }
        }, 500);
      }
    }
  };
  
  const handleContinueClick = () => {
    const nextPageId = currentPageId + 1;
    const nextPage = quizPages.find(page => page.id === nextPageId);
    
    if (nextPage) {
      const basePath = getCurrentPath();
      navigate(`${basePath}/${nextPageId}`);
    } else {

      navigate('/user/1');
    }
  };

  const handleBackClick = () => {
    const prevPageId = currentPageId - 1;
    if (prevPageId >= 1) {
      const basePath = getCurrentPath();
      navigate(`${basePath}/${prevPageId}`);
    } else if (currentPageId === 1 && stepId) {
      // Для первой страницы goal предыдущего этапа нет (это самый первый этап)
      // Можно перенаправить на главную страницу или другое действие
      console.warn('Первая страница goal - предыдущего этапа нет');
    }
  };


  const getContainerClassName = () => {
    const basePath = getCurrentPath();
    let className = 'quiz-container';
    
    if (pageData.showContinueButton) {
      className += ' has-continue-button';
    }
    

    if (basePath === '/goal' && (currentPageId >= 1 && currentPageId <= 7)) {
      className += ` goal-page-${currentPageId}`;
    }
    
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      {!pageData.isSplashPage && (
        <Header 
          onBackClick={handleBackClick}
          showBackButton={currentPageId > 1}
        />
      )}
      
      <main className={`content-wrapper ${shouldAnimate ? 'animate-in' : ''}`}>
        {pageData.isSplashPage ? (
          <SplashPage 
            title={pageData.title}
            subtitle={pageData.subtitle}
          />
        ) : pageData.isTestimonialPage ? (
          <TestimonialPage 
            title={pageData.title}
            subtitle={pageData.subtitle}
          />
        ) : pageData.isChartPage ? (
          <ChartPage 
            title={pageData.title}
            subtitle={pageData.subtitle}
          />
        ) : (
          <>
            <div className={`title-wrapper ${pageData.className === 'page-2' ? 'page-2-title' : ''}`}>
              <div className="heading-container">
                <h2 className="question-title">{pageData.title}</h2>
              </div>
              {pageData.subtitle && (
                <p className="question-subtitle">{pageData.subtitle}</p>
              )}
            </div>

            <div className={`options-wrapper ${
              pageData.className === 'page-2' ? 'page-2-options' : 
              pageData.className === 'page-4' ? 'page-4-options' : 
              ''
            }`}>
              {pageData.options.map((option, index) => {
                const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
                // Добавляем pageId к key чтобы заставить React перемонтировать элементы при смене страницы
                const uniqueKey = `${currentPageId}-${index}`;
                if (pageData.isMultiSelect) {
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
      
      {pageData.showContinueButton && (
        <ContinueButton
          onClick={handleContinueClick}
          disabled={pageData.isTestimonialPage || pageData.isChartPage ? false : selectedValues.length === 0}
        />
      )}
    </div>
  );
};

export default QuizPage;