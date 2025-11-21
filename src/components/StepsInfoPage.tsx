import React from 'react';
import { StepItem } from '../config/onboardingConfig';

interface StepsInfoPageProps {
  title: string;
  steps?: StepItem[];
}

const StepsInfoPage: React.FC<StepsInfoPageProps> = ({ title, steps = [] }) => {
  return (
    <div className="steps-info-content">
      <div className="content-wrapper">
        <div className="title-wrapper">
          <div className="heading-container">
            <h2 className="question-title" dangerouslySetInnerHTML={{ __html: title || '' }} />
          </div>
        </div>

        <div className="steps-list">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-icon">
                  <img src={step.icon} alt={step.title} />
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="connector-dot" />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsInfoPage;
