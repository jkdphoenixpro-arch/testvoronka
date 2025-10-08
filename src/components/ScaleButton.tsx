import React from 'react';

interface ScaleButtonProps {
  value: number;
  selected: boolean;
  onClick: (value: number) => void;
  className?: string;
}

const ScaleButton: React.FC<ScaleButtonProps> = ({ value, selected, onClick, className = '' }) => {
  return (
    <button
      className={`scale-button ${selected ? 'selected' : ''} ${className}`}
      onClick={() => onClick(value)}
      type="button"
    >
      <span className="scale-number">{value}</span>
    </button>
  );
};

export default ScaleButton;