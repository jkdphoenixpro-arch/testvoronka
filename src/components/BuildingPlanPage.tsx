import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { getImagesToPreload } from '../config/imagePreloadConfig';
import '../styles/buildingplan.css';
import FeedbackModal from './FeedbackModal';
import { getPreviousStep } from '../utils/navigationUtils';

interface ProgressStep {
  id: number;
  title: string;
  progressPercent: string;
  completed: boolean;
  progressWidth?: string;
}

interface TestimonialData {
  id: number;
  name: string;
  avatar: string;
  text: string;
}

// Данные для testimonials
const testimonialsData: TestimonialData[] = [
  {
    id: 1,
    name: "Jessica",
    avatar: "J",
    text: "“Using Age Back, I've experienced a complete transformation! The app has helped improve my posture, refresh and tone my face, increase flexibility. I feel more energetic and confident. It's a truly great solution for taking care of myself”"
  },
  {
    id: 2,
    name: "Michael",
    avatar: "M", 
    text: "Age Back completely changed my daily routine! After just 6 weeks, I noticed significant improvements in my posture and energy levels. My friends keep asking what I'm doing differently. This app is a game-changer"
  },
  {
    id: 3,
    name: "Sarah",
    avatar: "S",
    text: "I was skeptical at first, but Age Back delivered amazing results! My skin looks more radiant, my back pain is gone, and I feel 10 years younger. The personalized approach really works. Highly recommended!"
  }
];

const BuildingPlanPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [activeTestimonialId, setActiveTestimonialId] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isPausedRef = useRef(false);
  const continueLoadingRef = useRef<(() => void) | null>(null);
  const continueSecondLoadingRef = useRef<(() => void) | null>(null);
  const testimonialTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Предзагрузка изображений следующего шага (results)
  const currentPath = `/buildingplan/${currentStepId}`;
  const imagesToPreload = getImagesToPreload(currentPath);
  useImagePreloader(imagesToPreload);


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

  // Автоматическая смена отзывов каждые 3 секунды
  useEffect(() => {
    const startTestimonialRotation = () => {
      testimonialTimerRef.current = setInterval(() => {
        setIsTransitioning(true);
        
        setTimeout(() => {
          setActiveTestimonialId(prev => {
            const nextId = prev >= testimonialsData.length ? 1 : prev + 1;
            return nextId;
          });
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 150);
        }, 150);
      }, 3000); // Смена каждые 3 секунды
    };

    startTestimonialRotation();

    // Очищаем таймер при размонтировании компонента
    return () => {
      if (testimonialTimerRef.current) {
        clearInterval(testimonialTimerRef.current);
      }
    };
  }, []);

  const handleBackClick = () => {
    const previousStep = getPreviousStep(location.pathname);
    if (previousStep) {
      navigate(previousStep);
    } else {
      // Fallback на последний этап statements если предыдущий этап не найден
      navigate('/statements/4');
    }
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
  
  // Функция для плавного переключения testimonial
  const handleDotClick = (testimonialId: number) => {
    if (testimonialId !== activeTestimonialId && !isTransitioning) {
      // Останавливаем автоматическую смену
      if (testimonialTimerRef.current) {
        clearInterval(testimonialTimerRef.current);
      }
      
      setIsTransitioning(true);
      
      // Начало fade out анимации
      setTimeout(() => {
        setActiveTestimonialId(testimonialId);
        
        // Конец fade in анимации
        setTimeout(() => {
          setIsTransitioning(false);
          
          // Перезапускаем автоматическую смену через 3 секунды после завершения анимации
          testimonialTimerRef.current = setInterval(() => {
            setIsTransitioning(true);
            
            setTimeout(() => {
              setActiveTestimonialId(prev => {
                const nextId = prev >= testimonialsData.length ? 1 : prev + 1;
                return nextId;
              });
              
              setTimeout(() => {
                setIsTransitioning(false);
              }, 150);
            }, 150);
          }, 3000);
        }, 150);
      }, 150);
    }
  };
  
  // Получаем активный testimonial
  const activeTestimonial = testimonialsData.find(t => t.id === activeTestimonialId) || testimonialsData[0];

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
                <h3 className="building-plan-title">Building your anti-aging plan...</h3>
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
              {testimonialsData.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className={`dot ${activeTestimonialId === testimonial.id ? 'active' : ''}`}
                  onClick={() => handleDotClick(testimonial.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View testimonial from ${testimonial.name}`}
                />
              ))}
            </div>


            <div className="buildingplan-testimonial-card">
              <div className={`testimonial-content-advanced ${isTransitioning ? 'transitioning' : ''}`}>
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar"><span>{activeTestimonial.avatar}</span></div>
                    <div className="user-details"><span>{activeTestimonial.name}</span></div>
                  </div>
                  <div className="rating">
                    <img src="/image/rating.svg" alt="Rating" />
                  </div>
                </div>
                <div className="testimonial-text">
                  <p>{activeTestimonial.text}</p>
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