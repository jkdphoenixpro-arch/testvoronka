import React, { useState, useEffect } from 'react';
import '../styles/lessonCompleteModal.css';
import API_CONFIG from '../config/api';

interface LessonCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
}

const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({ isOpen, onClose, lessonId }) => {
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    if (isOpen) {
      loadUserViewedLessons();
    }
  }, [isOpen]);

  const loadUserViewedLessons = async () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/profile/${userData.email}`);
        const data = await response.json();
        
        if (data.success && data.user.viewedLessons) {
          // Подсчитываем количество просмотренных уроков + текущий
          const viewedCount = Object.values(data.user.viewedLessons).filter(viewed => viewed === true).length;
          const totalCount = viewedCount + 1; // +1 за текущий урок
          setCompletedLessonsCount(totalCount);
          
          // Определяем содержимое модального окна
          updateModalContent(totalCount);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных о просмотренных уроках:', error);
    }
  };

  const updateModalContent = (count: number) => {
    switch (count) {
      case 1:
        setModalContent({
          title: 'Great start!',
          message: "You've completed 1 of 3 sessions today. Your back already feels lighter— keep the flow going!"
        });
        break;
      case 2:
        setModalContent({
          title: 'Almost there!',
          message: '2 of 3 sessions done. Every move is building strength and balance—just one more to go.'
        });
        break;
      case 3:
        setModalContent({
          title: 'Daily win!',
          message: "You've completed all 3 sessions. Stand tall, breathe deep, and carry this energy into your day."
        });
        break;
      default:
        setModalContent({
          title: 'Great start!',
          message: "You've completed 1 of 3 sessions today. Your back already feels lighter— keep the flow going!"
        });
    }
  };

  if (!isOpen) return null;

  const handleClose = async () => {
    try {
      // Получаем email текущего пользователя из localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        
        // Отмечаем урок как просмотренный
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/mark-lesson-viewed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            lessonId: lessonId
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          console.log(`Урок ${lessonId} отмечен как просмотренный`);
        } else {
          console.error('Ошибка обновления статуса урока:', data.message);
        }
      }
    } catch (error) {
      console.error('Ошибка при отметке урока:', error);
    }
    
    // Закрываем модальное окно
    onClose();
  };

  return (
    <div className="lesson-modal-overlay">
      <div className="lesson-modal">
        <div className="lesson-modal-content">
          {/* User Profile Icon */}
          <div className="lesson-modal-profile">
            <div className="lesson-modal-profile-circle">
              <img 
                src="/image/user-profile-great.svg" 
                alt="Great job" 
                className="lesson-modal-profile-icon"
              />
            </div>
          </div>

          {/* Title and Message */}
          <div className="lesson-modal-title-wrapper">
            <div className="lesson-modal-heading">
              <h2 className="lesson-modal-title">{modalContent.title}</h2>
            </div>
            <p className="lesson-modal-message">
              {modalContent.message}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button className="lesson-modal-close-button" onClick={handleClose}>
          <span className="lesson-modal-close-text">Close</span>
        </button>
      </div>
    </div>
  );
};

export default LessonCompleteModal;