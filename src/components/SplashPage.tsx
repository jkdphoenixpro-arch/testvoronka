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
    const duration = 4700;

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
              <h1 className="splash-title" dangerouslySetInnerHTML={{ __html: title || '' }}></h1>
            </div>
            {subtitle && (
              <p className="splash-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />
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
          <div className="botton-section"></div>
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