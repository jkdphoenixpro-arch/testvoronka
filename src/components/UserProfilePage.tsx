import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profilePage.css';
import API_CONFIG from '../config/api';

interface UserData {
  name: string;
  email: string;
  goals: string[];
  issueAreas: string[];
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate('/routine');
  };

  useEffect(() => {
    document.documentElement.classList.add('profile-page');
    document.body.classList.add('profile-page');
    loadUserData();
    
    return () => {
      document.documentElement.classList.remove('profile-page');
      document.body.classList.remove('profile-page');
    };
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        navigate('/signin');
        return;
      }

      const user = JSON.parse(savedUser);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/profile/${user.email}`);
      const data = await response.json();

      if (data.success) {
        setUserData({
          name: data.user.name,
          email: data.user.email,
          goals: data.user.goals || [],
          issueAreas: data.user.issueAreas || []
        });
      } else {
        console.error('Ошибка загрузки данных пользователя:', data.message);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-quiz-container">
      <div className="profile-background">
        
        <div className="top-bar">
          <div className="navbar">
            <button className="back-button goal-back-button" aria-label="Назад" onClick={handleBackClick}>
              <img 
                src="/image/arrow_left.svg" 
                alt="Back" 
                width="6" 
                height="12" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('width', '6');
                  svg.setAttribute('height', '12');
                  svg.setAttribute('viewBox', '0 0 6 12');
                  svg.innerHTML = '<path d="M5 11L1 6L5 1" stroke="#28194B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
                  e.currentTarget.parentNode?.appendChild(svg);
                }}
              />
            </button>
            <div className="app-icon">
              <img src="/image/rewind-icon-24px.svg" alt="" className="app-rewind-icon" />
              <span className="app-name">Profile</span>
            </div>
          </div>
        </div>

        <main className="content-wrapper">
          <div className="profile-content">
          
          <div className="profile-user-profile-section">
            <div className="profile-user-main-profile">
              <img 
                src="/image/main-user-profile.svg" 
                alt="User Profile" 
                className="profile-user-main-profile-image"
              />
            </div>
            
            <div className="profile-user-details">
              <div className="profile-user-name-section">
                <h2 className="profile-user-name">{userData?.name || 'Loading...'}</h2>
                <div className="profile-user-pro-badge">
                  <span className="profile-user-pro-text">Pro account</span>
                  <div className="profile-user-crown-icon">
                    <img 
                      src="/image/crown.svg" 
                      alt="Crown" 
                      className="profile-user-crown-image"
                    />
                  </div>
                </div>
              </div>
              <p className="profile-user-email">{userData?.email || 'Loading...'}</p>
            </div>
          </div>

          <div className="profile-user-goals-section">
            <div className="profile-user-section-header">
              <div className="profile-user-section-icon">
                <img 
                  src="/image/person-goal.svg" 
                  alt="Goal" 
                  className="profile-user-section-icon-image"
                />
              </div>
              <h3 className="profile-user-section-title">Goal</h3>
            </div>
            
            <div className="profile-user-tags-wrapper">
              {loading ? (
                <div className="profile-user-tag">
                  <span className="profile-user-tag-text">Loading...</span>
                </div>
              ) : userData?.goals && userData.goals.length > 0 ? (
                userData.goals.map((goal, index) => (
                  <div key={index} className="profile-user-tag">
                    <span className="profile-user-tag-text">{goal}</span>
                  </div>
                ))
              ) : (
                <div className="profile-user-tag">
                  <span className="profile-user-tag-text">No goals selected</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-user-issues-section">
            <div className="profile-user-section-header">
              <div className="profile-user-section-icon">
                <img 
                  src="/image/person-issue.svg" 
                  alt="Issue" 
                  className="profile-user-section-icon-image"
                />
              </div>
              <h3 className="profile-user-section-title">Issue areas</h3>
            </div>
            
            <div className="profile-user-tags-wrapper profile-user-tags-multiple">
              {loading ? (
                <div className="profile-user-tag">
                  <span className="profile-user-tag-text">Loading...</span>
                </div>
              ) : userData?.issueAreas && userData.issueAreas.length > 0 ? (
                userData.issueAreas.map((issue, index) => (
                  <div key={index} className="profile-user-tag">
                    <span className="profile-user-tag-text">{issue}</span>
                  </div>
                ))
              ) : (
                <div className="profile-user-tag">
                  <span className="profile-user-tag-text">No issues selected</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-user-info-section">
            <div className="profile-user-section-header">
              <div className="profile-user-section-icon">
                <img 
                  src="/image/info.svg" 
                  alt="Info" 
                  className="profile-user-section-icon-image"
                />
              </div>
              <h3 className="profile-user-section-title">Info</h3>
            </div>
            
            <div className="profile-user-info-list">
              <div className="profile-user-info-item">
                <span className="profile-user-info-text">Get help</span>
                <div className="profile-user-info-arrow">
                  <img src="/image/arrow_left.svg" alt="Arrow" className="profile-user-info-arrow-image" />
                </div>
              </div>
              
              <div className="profile-user-info-item">
                <span className="profile-user-info-text">Privacy Policy</span>
                <div className="profile-user-info-arrow">
                  <img src="/image/arrow_left.svg" alt="Arrow" className="profile-user-info-arrow-image" />
                </div>
              </div>
              
              <div className="profile-user-info-item profile-user-info-item-last">
                <span className="profile-user-info-text">Terms of use</span>
                <div className="profile-user-info-arrow">
                  <img src="/image/arrow_left.svg" alt="Arrow" className="profile-user-info-arrow-image" />
                </div>
              </div>
            </div>
          </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;