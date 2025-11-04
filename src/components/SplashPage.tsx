import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface SplashPageProps {
  title: string;
  subtitle?: string;
}

const SplashPage: React.FC<SplashPageProps> = ({ title, subtitle }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { stepId } = useParams<{ stepId?: string }>();
  

  const isGoalRoute = location.pathname === '/goal/1';

  useEffect(() => {
    const startTime = Date.now();
    const duration = 470000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {

        setTimeout(() => {
          const basePath = stepId ? '/goal' : '';
          navigate(`${basePath}/2`);
        }, 500);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [navigate, stepId]);
  return (
    <>
      <div className="splash-content">
        <div className="content-wrapper">
          <div className="title-wrapper">
            <div className="heading-container">
              <h1 className="splash-title">{title}</h1>
            </div>
            {subtitle && (
              <p className="splash-subtitle">{subtitle}</p>
            )}
          </div>

          <div className="splash-image">
            <img 
              src="/image/start_image.webp" 
              alt="Age Back app preview"
              onError={(e) => {
                console.error('Failed to load image:', e.currentTarget.src);
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.display = 'block';
              }}
            />
          </div>

          <div className="award-section">
            {isGoalRoute ? (
              <img 
                src="/image/award.svg" 
                alt="Award"
                onError={(e) => {
                  console.error('Failed to load award image:', e.currentTarget.src);
                }}
              />
            ) : (
              <>
                <div className="award-icon award-icon-left">
                  <img 
                    src="/image/first_ico_left.svg" 
                    alt="Award left"
                    onError={(e) => {
                      console.error('Failed to load left icon:', e.currentTarget.src);
                    }}
                  />
                </div>
                <div className="award-text">
                  <div className="award-title">#1</div>
                  <div className="award-subtitle">Anti-aging apps</div>
                </div>
                <div className="award-icon award-icon-right">
                  <img 
                    src="/image/first_ico_right.svg" 
                    alt="Award right"
                    onError={(e) => {
                      console.error('Failed to load right icon:', e.currentTarget.src);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="splash-bottom">
        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              <div className="progress-percentage">{Math.round(progress)}%</div>
            </div>
          </div>
          <div className="loading-text">Loading the quiz</div>
        </div>
      </div>
    </>
  );
};

export default SplashPage;