import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { getStepByRoute, getNextStep, getPreviousStepByRoute } from '../config/onboardingConfig';
import ScaleButton from './ScaleButton';

interface StatementData {
  id: number;
  question: string;
  statement: string;
  progress: number;
}

// Данные steps statements берутся из централизованного конфига (src/config/onboardingConfig.ts)

const StatementsPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentStepId = stepId ? parseInt(stepId) : 1;
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const currentPath = `/statements/${currentStepId}`;
  const stepConfig = getStepByRoute(currentPath);

  // Предзагрузка изображений следующего шага из конфига
  useImagePreloader(stepConfig?.imagesToPreload || []);

  useEffect(() => {
    setSelectedValue(null);
  }, [currentStepId]);

  if (!stepConfig) {
    navigate('/statements/1');
    return null;
  }

  const handleScaleClick = (value: number) => {
    setSelectedValue(value);
    setTimeout(() => {
      if (!stepConfig) return;
      const next = getNextStep(stepConfig.id);
      if (next) {
        navigate(next.route);
      }
    }, 500);
  };

  const handleBackClick = () => {
    const prev = getPreviousStepByRoute(currentPath);
    if (prev) {
      navigate(prev.route);
    }
  };

  return (
    <div className="statements-container">
      <Header
        onBackClick={handleBackClick}
        showBackButton={!!getPreviousStepByRoute(currentPath)}
      />
      
      <main className="content-wrapper">
        <div className="title-wrapper">
          <p className="statement-question">{stepConfig.question}</p>
          <div className="heading-container">
            <h2 className="statement-title">"{stepConfig.statement}"</h2>
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
                  selected={selectedValue === value}
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
      </main>
    </div>
  );
};

export default StatementsPage;