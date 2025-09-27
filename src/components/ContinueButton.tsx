import React from 'react';

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ 
  onClick, 
  disabled = false, 
  text = "Continue" 
}) => {
  return (
    <div className="bottom-bar">
      <button 
        className={`continue-button ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="button-text">{text}</span>
      </button>
    </div>
  );
};

export default ContinueButton;