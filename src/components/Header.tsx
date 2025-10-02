import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboardingProgress } from '../hooks/useOnboardingProgress';

interface HeaderProps {
  progress?: number;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ progress: localProgress, onBackClick, showBackButton = true }) => {
  const location = useLocation();
  const { progress: onboardingProgress, isInOnboarding } = useOnboardingProgress();
  
  const isGoalRoute = location.pathname.startsWith('/goal/');
  const isUserRoute = location.pathname.startsWith('/user/');
  const isLifestyleRoute = location.pathname.startsWith('/lifestyle/');
  const isStatementsRoute = location.pathname.startsWith('/statements/');
  
  const currentStep = location.pathname.split('/').pop();
  const shouldShowArrowLeft = ((isGoalRoute && currentStep !== '1') || isUserRoute || isLifestyleRoute || isStatementsRoute) && showBackButton;
  
  return (
    <header className="top-bar">
      <nav className="navbar">
        {shouldShowArrowLeft ? (
          <button className="back-button goal-back-button" aria-label="Назад" onClick={onBackClick}>
            <img 
              src="/image/arrow_left.svg" 
              alt="Back" 
              width="6" 
              height="12" 
              onError={(e) => {
                console.error('Failed to load arrow_left.svg:', e.currentTarget.src);
              }}
            />
          </button>
        ) : showBackButton ? (
          <button className="back-button" aria-label="Назад" onClick={onBackClick}>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11L1 6L5 1" stroke="#28194B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : null}
        
        <div className="app-icon">
          <span className="app-name">Age Back</span>
        </div>
      </nav>
      
      <div className="progress-bar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${isInOnboarding ? onboardingProgress : (localProgress || 0)}%` }}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;