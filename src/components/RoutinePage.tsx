import React, { useState } from 'react';
import '../styles/routine.css';

const RoutinePage: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]); // Первый урок уже выполнен

  const toggleLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

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
          
          <div className="routine-user-profile">
            <div className="routine-profile-circle">
              <img 
                src="/image/user-profile.png" 
                alt="Profile" 
                className="routine-profile-image"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="routine-content">
          
          {/* Title wrapper */}
          <div className="routine-title-wrapper">
            <div className="routine-title-section">
              <h1 className="routine-main-title">Hi, Sara! Your Age Back routine is ready!</h1>
            </div>
            <div className="routine-description">
              <p className="routine-description-text">15-min focus: Reduce belly tension & boost posture</p>
            </div>
          </div>

          {/* Content wrapper */}
          <div className="routine-content-wrapper">
            
            {/* Lesson 1 - Completed */}
            <div className="routine-lesson">
              <div className="routine-lesson-image">
                <img src="/image/body-posture.png" alt="Body & Posture" className="routine-lesson-img" />
              </div>
              <div className="routine-lesson-details">
                <div className="routine-lesson-wrapper">
                  <p className="routine-lesson-category">Body & Posture</p>
                  <div className="routine-lesson-title">
                    <h3 className="routine-lesson-name">5-Minute Flow for Daily Rejuvenation</h3>
                  </div>
                </div>
                <div className="routine-lesson-duration">
                  <div className="routine-duration-icon">
                    <img src="/image/Subtract.svg" alt="Duration" className="routine-duration-img" />
                  </div>
                  <span className="routine-duration-label">5 min</span>
                </div>
              </div>
              <div 
                className={`routine-checkbox ${completedLessons.includes(0) ? 'routine-checked' : ''}`}
                onClick={() => toggleLessonComplete(0)}
              >
                {completedLessons.includes(0) && (
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                    <path d="M1 3L3.5 5L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Tip of the day */}
            <div className="routine-tip-day">
              <div className="routine-tip-content">
                <p className="routine-tip-title">Tip of the day</p>
                <div className="routine-tip-text-wrapper">
                  <h4 className="routine-tip-text">Stay consistent: even 15 minutes daily brings lasting change.</h4>
                </div>
              </div>
              <div className="routine-tip-icon">
                <div className="routine-tip-icon-circle">
                  <img src="/image/TipOfTheDay.png" alt="Tip" className="routine-tip-icon-img" />
                </div>
              </div>
            </div>

            {/* Lesson 2 - Not completed */}
            <div className="routine-lesson">
              <div className="routine-lesson-image">
                <img src="/image/belly-waist.png" alt="Belly & Waist" className="routine-lesson-img" />
              </div>
              <div className="routine-lesson-details">
                <div className="routine-lesson-wrapper">
                  <p className="routine-lesson-category">Belly & Waist</p>
                  <div className="routine-lesson-title">
                    <h3 className="routine-lesson-name">5-Minute Activation for a Younger Waistline</h3>
                  </div>
                </div>
                <div className="routine-lesson-duration">
                  <div className="routine-duration-icon">
                    <img src="/image/Subtract.svg" alt="Duration" className="routine-duration-img" />
                  </div>
                  <span className="routine-duration-label">5 min</span>
                </div>
              </div>
              <div 
                className={`routine-checkbox ${completedLessons.includes(1) ? 'routine-checked' : ''}`}
                onClick={() => toggleLessonComplete(1)}
              >
                {completedLessons.includes(1) && (
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                    <path d="M1 3L3.5 5L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Lesson 3 - Not completed */}
            <div className="routine-lesson">
              <div className="routine-lesson-image">
                <img src="/image/face-neck.png" alt="Face & Neck" className="routine-lesson-img" />
              </div>
              <div className="routine-lesson-details">
                <div className="routine-lesson-wrapper">
                  <p className="routine-lesson-category">Face & Neck</p>
                  <div className="routine-lesson-title">
                    <h3 className="routine-lesson-name">Get rid of swellness: 5 min massage technique</h3>
                  </div>
                </div>
                <div className="routine-lesson-duration">
                  <div className="routine-duration-icon">
                    <img src="/image/Subtract.svg" alt="Duration" className="routine-duration-img" />
                  </div>
                  <span className="routine-duration-label">5 min</span>
                </div>
              </div>
              <div 
                className={`routine-checkbox ${completedLessons.includes(2) ? 'routine-checked' : ''}`}
                onClick={() => toggleLessonComplete(2)}
              >
                {completedLessons.includes(2) && (
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                    <path d="M1 3L3.5 5L8 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutinePage;