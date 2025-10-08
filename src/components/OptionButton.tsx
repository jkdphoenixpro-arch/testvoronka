import React from 'react';
import { QuizOption } from '../data/quizData';

interface OptionButtonProps {
  option: QuizOption;
  selected: boolean;
  onClick: (value: string) => void;
  className?: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({ option, selected, onClick, className = '' }) => {
  return (
    <button 
      className={`single-select-option ${selected ? 'selected' : ''} ${className}`}
      data-value={option.value}
      tabIndex={0}
      onClick={() => onClick(option.value)}
    >
      <span className="option-text">{option.text}</span>
    </button>
  );
};

export default OptionButton;