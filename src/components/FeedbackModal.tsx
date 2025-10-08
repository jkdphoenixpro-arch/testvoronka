import React from 'react';

interface FeedbackModalProps {
  isVisible: boolean;
  onYes: () => void;
  onNo: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, onYes, onNo }) => {
  if (!isVisible) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="modal-title-wrapper">
          <h2 className="modal-title">Are you a morning lark or night owl?</h2>
        </div>
        <div className="modal-button-wrapper">
          <button className="modal-option-button" onClick={onYes}>
            <span>Morning lark</span>
          </button>
          <button className="modal-option-button" onClick={onNo}>
            <span>Night owl</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;