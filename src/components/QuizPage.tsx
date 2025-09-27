import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
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
  
  const currentPageId = stepId ? parseInt(stepId) : pageId ? parseInt(pageId) : 1;
  const pageData: QuizPageData | undefined = quizPages.find(page => page.id === currentPageId);
  
  // Состояние для хранения выбранных вариантов
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (!pageData) return [];
    if (pageData.isMultiSelect) {
      return pageData.options.filter(option => option.selected).map(option => option.value);
    } else {
      const selected = pageData.options.find(option => option.selected);
      return selected ? [selected.value] : [];
    }
  });
  
  // Получаем текущий путь для корректной навигации
  const getCurrentPath = () => {
    return stepId ? '/goal' : '';
  };

  // Обработка нажатия Enter для splash страницы
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
      // Мультивыбор: добавляем/удаляем значение
      setSelectedValues(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        } else {
          return [...prev, value];
        }
      });
    } else {
      // Одиночный выбор
      setSelectedValues([value]);
      
      // Автоматический переход только для страниц без showContinueButton
      if (!pageData.showContinueButton) {
        setTimeout(() => {
          const nextPageId = currentPageId + 1;
          const nextPage = quizPages.find(page => page.id === nextPageId);
          
          if (nextPage) {
            const basePath = getCurrentPath();
            navigate(`${basePath}/${nextPageId}`);
          } else {
            console.log('Квиз завершен');
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
      console.log('Квиз завершен', selectedValues);
    }
  };

  const handleBackClick = () => {
    const prevPageId = currentPageId - 1;
    if (prevPageId >= 1) {
      const basePath = getCurrentPath();
      navigate(`${basePath}/${prevPageId}`);
    }
  };

  // Формируем className для контейнера
  const getContainerClassName = () => {
    const basePath = getCurrentPath();
    let className = 'quiz-container';
    
    if (pageData.showContinueButton) {
      className += ' has-continue-button';
    }
    
    // Добавляем специфичный класс для goal страниц 2, 3, 5
    if (basePath === '/goal' && (currentPageId === 2 || currentPageId === 3 || currentPageId === 5)) {
      className += ` goal-page-${currentPageId}`;
    }
    
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      {!pageData.isSplashPage && (
        <Header 
          progress={pageData.progress}
          onBackClick={handleBackClick}
          showBackButton={currentPageId > 1}
        />
      )}
      
      <main className="content-wrapper">
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
                if (pageData.isMultiSelect) {
                  return (
                    <MultiOptionButton
                      key={index}
                      option={option}
                      selected={selectedValues.includes(option.value)}
                      onClick={handleOptionClick}
                    />
                  );
                } else {
                  return (
                    <OptionButton
                      key={index}
                      option={option}
                      selected={selectedValues.includes(option.value)}
                      onClick={handleOptionClick}
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
          disabled={pageData.isTestimonialPage ? false : selectedValues.length === 0}
        />
      )}
    </div>
  );
};

export default QuizPage;