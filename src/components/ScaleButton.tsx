import React from 'react';

interface ScaleButtonProps {
  value: number;
  selected: boolean;
  onClick: (value: number) => void;
}

const ScaleButton: React.FC<ScaleButtonProps> = ({ value, selected, onClick }) => {
  return (
    <button
      className={`scale-button ${selected ? 'selected' : ''}`}
      onClick={() => onClick(value)}
      type="button"
    >
      <span className="scale-number">{value}</span>
    </button>
  );
};

export default ScaleButton;