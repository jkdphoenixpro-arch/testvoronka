import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import { getPreviousStep } from '../utils/navigationUtils';
import ScaleButton from './ScaleButton';

interface StatementData {
  id: number;
  question: string;
  statement: string;
  progress: number;
}

const statementsData: StatementData[] = [
  {
    id: 1,
    question: "Do you relate to the following statement?",
    statement: "The reflection in the mirror affects my mood and my self-esteem",
    progress: 15
  },
  {
    id: 2,
    question: "Do you relate to the following statement?",
    statement: "I tend to compare myself to others and it makes me frustrated",
    progress: 30
  },
  {
    id: 3,
    question: "Do you relate to the following statement?",
    statement: "My appearance may affect my relationships",
    progress: 45
  },
  {
    id: 4,
    question: "Do you relate to the following statement?",
    statement: "I'm afraid that people won't like me if I look older",
    progress: 60
  }
];

const StatementsPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentStepId = stepId ? parseInt(stepId) : 1;
  const statementData = statementsData.find(statement => statement.id === currentStepId);
  
  const [selectedValue, setSelectedValue] = useState<number | null>(null);


  useEffect(() => {
    setSelectedValue(null);
  }, [currentStepId]);

  if (!statementData) {
    navigate('/statements/1');
    return null;
  }

  const handleScaleClick = (value: number) => {
    setSelectedValue(value);
    
    // Автоматический переход после выбора
    setTimeout(() => {
      const nextStepId = currentStepId + 1;
      const nextStatement = statementsData.find(statement => statement.id === nextStepId);
      
      if (nextStatement) {
        navigate(`/statements/${nextStepId}`);
      } else {
        // Переход к следующему разделу после последней страницы
        navigate('/buildingplan/1');
      }
    }, 500); // Небольшая задержка для визуального отклика
  };

  const handleBackClick = () => {
    const prevStepId = currentStepId - 1;
    if (prevStepId >= 1) {
      navigate(`/statements/${prevStepId}`);
    } else {
      // Для первой страницы statements переходим на предыдущую секцию (lifestyle/7)
      const previousStep = getPreviousStep(location.pathname);
      if (previousStep) {
        navigate(previousStep);
      }
    }
  };

  return (
    <div className="statements-container">
      <Header
        onBackClick={handleBackClick}
        showBackButton={true}
      />
      
      <main className="content-wrapper">
        <div className="title-wrapper">
          <p className="statement-question">{statementData.question}</p>
          <div className="heading-container">
            <h2 className="statement-title">"{statementData.statement}"</h2>
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