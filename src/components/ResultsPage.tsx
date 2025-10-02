import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContinueButton from './ContinueButton';
import '../styles/results.css';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();

  // Управление скроллом на уровне body
  useEffect(() => {
    // Добавляем класс к body при монтировании
    document.body.classList.add('results-page');
    
    // Убираем класс при размонтировании
    return () => {
      document.body.classList.remove('results-page');
    };
  }, []);

  const handleBackClick = () => {
    navigate('/buildingplan/1');
  };

  const handleContinueClick = () => {
    // Здесь будет переход на следующую страницу
    console.log('Continue clicked');
  };

  return (
    <div className="quiz-container results-container">
      <div className="top-bar">
        <div className="navbar">
          <button className="back-button goal-back-button" aria-label="Назад" onClick={handleBackClick}>
            <img 
              src="/image/arrow_left.svg" 
              alt="Back" 
              width="6" 
              height="12" 
              onError={(e) => {
                // Fallback SVG если изображение не загружается
                e.currentTarget.style.display = 'none';
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '6');
                svg.setAttribute('height', '12');
                svg.setAttribute('viewBox', '0 0 6 12');
                svg.innerHTML = '<path d="M5 11L1 6L5 1" stroke="#28194B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
                e.currentTarget.parentNode?.appendChild(svg);
              }}
            />
          </button>
          <div className="app-icon">
            <span className="app-name">Age Back</span>
          </div>
        </div>
      </div>
      
      <main className="content-wrapper">
        <div className="results-content">
          {/* Заголовок и описание */}
          <div className="results-header">
            <div className="heading-container">
              <h1 className="results-title">100% Personalized Anti-Age Program is Ready!</h1>
            </div>
            <div className="results-description">
              <p>Tailored to target your face, body, posture, flexibility, and energy levels</p>
            </div>
          </div>

          {/* Основные секции */}
          <div className="results-sections">
            {/* Секция Goal */}
            <div className="result-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <div className="icon-background">
                    <img 
                      src="/image/person-goal.svg" 
                      alt="Goal" 
                      width="16" 
                      height="16"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <span className="card-title">Goal</span>
              </div>
              <div className="goal-tags">
                <div className="goal-tag">Slow down aging</div>
                <div className="goal-tag">Moving freely</div>
              </div>
            </div>

            {/* Секция Issue areas */}
            <div className="result-card issue-areas-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <div className="icon-background">
                    <img 
                      src="/image/person-issue.svg" 
                      alt="Issue areas" 
                      width="16" 
                      height="16"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <span className="card-title">Issue areas</span>
              </div>
              <div className="issue-tags">
                <div className="issue-tag">Drooping eyelids</div>
                <div className="issue-tag">Dark circles</div>
                <div className="issue-tag">Skin elasticity</div>
                <div className="issue-tag">Back</div>
                <div className="issue-tag">Slouching</div>
                <div className="issue-tag">Legs</div>
                <div className="issue-tag">Neck stiffness</div>
                <div className="issue-tag">Knees</div>
                <div className="issue-tag">Joint pain</div>
              </div>
            </div>

            {/* Секция Improvements */}
            <div className="result-card improvements-card">
              <div className="card-header">
                <div className="header-left">
                  <div className="icon-wrapper">
                    <div className="icon-background">
                      <img 
                        src="/image/person-improvement.svg" 
                        alt="Improvements" 
                        width="16" 
                        height="16"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <span className="card-title">Improvements</span>
                </div>
                <span className="time-label">8 weeks</span>
              </div>
              
              {/* Изображение для improvements */}
              <div className="improvements-chart">
                <img 
                  src="/image/chart-placeholder.png" 
                  alt="Improvements Chart" 
                  className="chart-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Кнопка Continue - используем стандартный компонент */}
      <ContinueButton onClick={handleContinueClick} />
    </div>
  );
};

export default ResultsPage;