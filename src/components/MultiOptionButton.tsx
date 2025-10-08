import React from 'react';
import { QuizOption } from '../data/quizData';
import IconPlaceholder from './IconPlaceholder';

interface MultiOptionButtonProps {
  option: QuizOption;
  selected: boolean;
  onClick: (value: string) => void;
  className?: string;
}

const MultiOptionButton: React.FC<MultiOptionButtonProps> = ({ option, selected, onClick, className = '' }) => {
  return (
    <button 
      className={`multi-select-option ${selected ? 'selected' : ''} ${className}`}
      data-value={option.value}
      tabIndex={0}
      onClick={() => onClick(option.value)}
    >
      <div className="image-area">
        {option.icon && (
          <IconPlaceholder iconType={option.icon} />
        )}
      </div>
      
      <span className="option-text">{option.text}</span>
      
      <div className="option-controls">
        <div className={`checkbox ${selected ? 'checked' : ''}`}>
          {selected && (
            <svg 
              className="checkmark" 
              width="9" 
              height="6" 
              viewBox="0 0 9 6" 
              fill="none"
            >
              <path 
                d="M1 3L3.5 5L8 1" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default MultiOptionButton;