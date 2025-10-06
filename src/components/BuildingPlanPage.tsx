import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/buildingplan.css';
import FeedbackModal from './FeedbackModal';

interface ProgressStep {
  id: number;
  title: string;
  progressPercent: string;
  completed: boolean;
  progressWidth?: string;
}

const BuildingPlanPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  
  const currentStepId = stepId ? parseInt(stepId) : 1;
  
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: 1,
      title: "Setting up your goals",
      progressPercent: "0%",
      completed: false,
      progressWidth: "0%"
    },
    {
      id: 2,
      title: "Analyzing face & body issues",
      progressPercent: "0%",
      completed: false,
      progressWidth: "0%"
    },
    {
      id: 3,
      title: "Reviewing your routine",
      progressPercent: "0%",
      completed: false,
      progressWidth: "0%"
    },
    {
      id: 4,
      title: "Building your action plan",
      progressPercent: "0%",
      completed: false,
      progressWidth: "0%"
    }
  ]);

  const [currentProgress, setCurrentProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const isPausedRef = useRef(false);
  const continueLoadingRef = useRef<(() => void) | null>(null);
  const continueSecondLoadingRef = useRef<(() => void) | null>(null);


  const animateProgressBar = (stepId: number, targetPercent: number, duration: number = 2500): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        

        const currentPercent = Math.round(targetPercent * progress);
        
        setProgressSteps(prev => prev.map(step => 
          step.id === stepId ? { 
            ...step, 
            progressPercent: `${currentPercent}%`, 
            progressWidth: `${currentPercent}%`,
            completed: progress >= 1 && targetPercent === 100
          } : step
        ));
        
        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else {

          setProgressSteps(prev => prev.map(step => 
            step.id === stepId ? { 
              ...step, 
              progressPercent: `${targetPercent}%`, 
              progressWidth: `${targetPercent}%`,
              completed: targetPercent === 100
            } : step
          ));
          resolve();
        }
      };
      
      requestAnimationFrame(updateProgress);
    });
  };
  

  useEffect(() => {

    const loadProgressBars = async () => {

      await animateProgressBar(1, 100, 2500);
      

      setShowModal(true);
      isPausedRef.current = true;
      

      const continueLoading = () => {

        const loadRemainingSteps = async () => {

          await animateProgressBar(2, 100, 2500);
          

          await animateProgressBar(3, 100, 2500);
          

          setShowSecondModal(true);
          isPausedRef.current = true;
          

          const continueFinalLoading = () => {

            const loadFinalStep = async () => {
              await animateProgressBar(4, 100, 2500);

              navigate('/results');
            };
            loadFinalStep();
          };
          
          continueSecondLoadingRef.current = continueFinalLoading;
        };
        loadRemainingSteps();
      };
      
      continueLoadingRef.current = continueLoading;
    };
    
    loadProgressBars();
  }, []);

  const handleBackClick = () => {
    navigate('/statements/4');
  };
  
  const handleModalYes = () => {
    setShowModal(false);
    isPausedRef.current = false;
    if (continueLoadingRef.current) {
      continueLoadingRef.current();
    }
  };
  
  const handleModalNo = () => {
    setShowModal(false);
    isPausedRef.current = false;
    if (continueLoadingRef.current) {
      continueLoadingRef.current();
    }
  };
  
  const handleSecondModalYes = () => {
    setShowSecondModal(false);
    isPausedRef.current = false;
    if (continueSecondLoadingRef.current) {
      continueSecondLoadingRef.current();
    }
  };
  
  const handleSecondModalNo = () => {
    setShowSecondModal(false);
    isPausedRef.current = false;
    if (continueSecondLoadingRef.current) {
      continueSecondLoadingRef.current();
    }
  };

  return (
    <div className="quiz-container building-plan-container">
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
            <span className="app-name">Age Back</span>
          </div>
        </div>
      </div>
      
      <main className="content-wrapper">
        <div className="building-plan-content">

          <div className="steps-section">

            <div className="building-plan-title-wrapper">
              <div className="heading-container">
                <h1 className="building-plan-title">Building your anti-aging plan...</h1>
              </div>
            </div>


            <div className="steps-container">
              {progressSteps.map((step, index) => {
                const isInactive = step.progressPercent === '0%';
                
                let stepClasses = 'progress-step';
                if (isInactive) {
                  stepClasses += ' inactive';
                }
                
                return (
                  <div key={step.id} className={stepClasses}>
                    <div className="step-header">
                      <div className="step-title">{step.title}</div>
                      <div className="step-progress-percent">{step.progressPercent}</div>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar-background progress-step-${step.id}`}
                        style={{
                          width: step.progressPercent
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="testimonial-section">
            <h2 className="testimonial-title">Trusted by over 500K+ users</h2>
            

            <div className="testimonial-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>


            <div className="buildingplan-testimonial-card">
              <div className="testimonial-content-advanced">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar"><span>J</span></div>
                    <div className="user-details"><span>Jessica</span></div>
                  </div>
                  <div className="rating">
                    <img src="/image/rating.svg" alt="Rating" />
                  </div>
                </div>
                <div className="testimonial-text">
                  <p>“Using Age Back, I’ve experienced a complete transformation! The app has helped improve my posture, refresh and tone my face, increase flexibility. I feel more energetic and confident. It’s a truly great solution for taking care of myself”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FeedbackModal 
        isVisible={showModal}
        onYes={handleModalYes}
        onNo={handleModalNo}
      />
      
      <FeedbackModal 
        isVisible={showSecondModal}
        onYes={handleSecondModalYes}
        onNo={handleSecondModalNo}
      />
    </div>
  );
};

export default BuildingPlanPage;