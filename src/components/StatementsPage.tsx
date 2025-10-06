import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import ScaleButton from './ScaleButton';
import ContinueButton from './ContinueButton';

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
    question: "I tend to compare myself to others and it makes me frustrated",
    statement: "The reflection in the mirror affects my mood and my self-esteem",
    progress: 30
  },
  {
    id: 3,
    question: "My apperance may affect my relationships",
    statement: "The reflection in the mirror affects my mood and my self-esteem",
    progress: 45
  },
  {
    id: 4,
    question: "I'm afraid that people won't like me if i look older",
    statement: "The reflection in the mirror affects my mood and my self-esteem",
    progress: 60
  }
];

const StatementsPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  
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
  };

  const handleContinueClick = () => {
    const nextStepId = currentStepId + 1;
    const nextStatement = statementsData.find(statement => statement.id === nextStepId);
    
    if (nextStatement) {
      navigate(`/statements/${nextStepId}`);
    } else {

      navigate('/buildingplan/1');
    }
  };

  const handleBackClick = () => {
    const prevStepId = currentStepId - 1;
    if (prevStepId >= 1) {
      navigate(`/statements/${prevStepId}`);
    } else {

      return;
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
            {[1, 2, 3, 4, 5].map((value) => (
              <ScaleButton
                key={value}
                value={value}
                selected={selectedValue === value}
                onClick={handleScaleClick}
              />
            ))}
          </div>
          <div className="scale-labels">
            <span className="scale-label-left">Strongly disagree</span>
            <span className="scale-label-right">Strongly agree</span>
          </div>
        </div>
      </main>

      <ContinueButton
        onClick={handleContinueClick}
        disabled={selectedValue === null}
      />
    </div>
  );
};

export default StatementsPage;