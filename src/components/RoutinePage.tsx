import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import '../styles/routine.css';
import API_CONFIG from '../config/api';

const RoutinePage: React.FC = () => {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]); // Первый урок уже выполнен
  const [viewedLessons, setViewedLessons] = useState<{[key: number]: boolean}>({});
  const { lessons, loading, error } = useLessons();

  // Загружаем данные о просмотренных уроках
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/profile/${userData.email}`);
          const data = await response.json();
          
          if (data.success && data.user.viewedLessons) {
            setViewedLessons(data.user.viewedLessons);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  // В будущем состояние будет управляться через бекенд
  
  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  if (loading) {
    return (
      <div className="routine-container">
        <div className="routine-background">
          <div className="routine-loading">Загрузка уроков...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="routine-container">
        <div className="routine-background">
          <div className="routine-error">Ошибка загрузки уроков</div>
        </div>
      </div>
    );
  }
  
  const lessonArray = Object.values(lessons);

  return (
    <div className="routine-container">
      {/* Градиентный фон */}
      <div className="routine-background">
        
        {/* Top bar */}
        <div className="routine-top-bar">
          <div className="routine-app-logo">
            <div className="routine-logo-frame">
              <img 
                src="/image/App-Icon.png" 
                alt="Age Back" 
                className="routine-logo-image"
              />
            </div>
          </div>
          
          <div className="routine-user-profile" onClick={handleProfileClick}>
            <img 
              src="/image/user-profile.svg" 
              alt="Profile" 
              className="routine-profile-image"
            />
          </div>
        </div>

        {/* Content */}
        <div className="routine-content">
          
          {/* Title wrapper */}
          <div className="routine-title-wrapper">
            <div className="routine-title-section">
              <h1 className="routine-greeting">Hi, Sara!</h1>
              <h2 className="routine-main-title">Your Age Back routine is ready!</h2>
            </div>
            <div className="routine-description">
              <p className="routine-focus-title">15-min focus:</p>
              <p className="routine-description-text">Reduce belly tension & boost posture</p>
            </div>
          </div>

          {/* Content wrapper */}
          <div className="routine-content-wrapper">
            
            {/* Динамическое отображение уроков */}
            {lessonArray.map((lesson, index) => (
              <React.Fragment key={lesson.id}>
                <div className="routine-lesson" onClick={() => handleLessonClick(lesson.id)}>
                  <div className="routine-lesson-image">
                    <img src={lesson.thumbnailUrl} alt={lesson.category} className="routine-lesson-img" />
                  </div>
                  <div className="routine-lesson-details">
                    <div className="routine-lesson-wrapper">
                      <p className="routine-lesson-category">{lesson.category}</p>
                      <div className="routine-lesson-title">
                        <h3 className="routine-lesson-name">{lesson.title}</h3>
                      </div>
                    </div>
                    <div className="routine-lesson-duration">
                      <div className="routine-duration-icon">
                        <img src="/image/Subtract.svg" alt="Duration" className="routine-duration-img" />
                      </div>
                      <span className="routine-duration-label">{lesson.duration}</span>
                    </div>
                  </div>
                  <div 
                    className={`routine-checkbox ${viewedLessons[lesson.id] ? 'routine-checked' : ''}`}
                  >
                    {viewedLessons[lesson.id] && (
                      <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                        <path d="M1 3L3.5 5L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Tip of the day после первого урока */}
                {index === 0 && (
                  <div className="routine-tip-day">
                    <div className="routine-tip-content">
                      <p className="routine-tip-title">Tip of the day</p>
                      <div className="routine-tip-text-wrapper">
                        <h4 className="routine-tip-text">Stay consistent: even 15 minutes daily brings lasting change.</h4>
                      </div>
                    </div>
                    <div className="routine-tip-icon">
                      <img src="/image/tip-of-the-day.svg" alt="Tip" className="routine-tip-icon-img" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}


          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutinePage;