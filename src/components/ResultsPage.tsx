import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContinueButton from './ContinueButton';
import '../styles/results.css';
import { getPreviousStep } from '../utils/navigationUtils';
import { getSelectedGoals, getSelectedIssueAreas } from '../utils/userSelections';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Состояние для выборов пользователя
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedIssueAreas, setSelectedIssueAreas] = useState<string[]>([]);

  useEffect(() => {
    document.body.classList.add('results-page');
    
    // Загружаем выборы пользователя
    setSelectedGoals(getSelectedGoals());
    setSelectedIssueAreas(getSelectedIssueAreas());
    

    return () => {
      document.body.classList.remove('results-page');
    };
  }, []);

  const handleBackClick = () => {
    const previousStep = getPreviousStep(location.pathname);
    if (previousStep) {
      navigate(previousStep);
    } else {
      // Fallback на buildingplan/1 если предыдущий этап не найден
      navigate('/buildingplan/1');
    }
  };

  const handleContinueClick = () => {
    navigate('/enteremail');
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
            <img src="/image/rewind-icon-24px.svg" alt="" className="app-rewind-icon" />
            <span className="app-name">Age Back</span>
          </div>
        </div>
      </div>
      
      <main className="content-wrapper">
        <div className="results-content">

          <div className="results-header">
            <div className="heading-container">
              <h1 className="results-title">100% Personalized Anti-Age Program is Ready!</h1>
            </div>
            <div className="results-description">
              <p>Tailored to target your face, body, posture, flexibility, and energy levels</p>
            </div>
          </div>


          <div className="results-sections">

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
                <p className="goal-text">
                  {selectedGoals.length > 0 
                    ? selectedGoals.join(', ')
                    : 'Slow down aging, Moving freely'
                  }
                </p>
              </div>
            </div>


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
                <p className="issue-text">
                  {selectedIssueAreas.length > 0 
                    ? selectedIssueAreas.join(', ')
                    : 'Drooping eyelids, Dark circles, Skin elasticity, Back, Slouching, Legs, Neck stiffness, Knees, Joint pain'
                  }
                </p>
              </div>
            </div>


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
              

              <div className="improvements-chart">
                <img 
                  src="/image/results-8w.webp" 
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


      <ContinueButton onClick={handleContinueClick} />
    </div>
  );
};

export default ResultsPage;