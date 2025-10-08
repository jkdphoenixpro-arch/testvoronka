import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { getPreviousStep } from '../utils/navigationUtils';
import { saveIssueAreaSelections } from '../utils/userSelections';
import '../styles/user.css';
import '../styles/testimonial.css';


interface TestimonialItem {
  percentage: string;
  description: string;
}


interface UserStep {
  title: string;
  subtitle: string;
  optionNames: string[];
  initialSelected: number[];
  progress: number;
  stepClass: string;
  isTestimonial?: boolean;
  testimonials?: TestimonialItem[];
}


const userSteps: Record<number, UserStep> = {
  1: {
    title: "Your face shows your story. Which areas concern you most?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Wrinkles', 'Jowls', 'Double chin',
      'Puffiness', 'Drooping eyelids', 'Dark circles', 
      'Skin elasticity', 'Nasolabial folds', 'Crow’s feet',
      'Redness', 'Venus rings'
    ],
    initialSelected: [],
    progress: 15,
    stepClass: 'user-step-1'
  },
  2: {
    title: "Your body deserves attention. Where do you feel changes or tension?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Neck hump', 'Belly', 'Back',
      'Posture', 'Slouching', 'Legs',
      'Shoulders', 'Muscle weakness', 'Thighs / buttocks',
      'Pelvis', 'Core strength'
    ],
    initialSelected: [],
    progress: 25,
    stepClass: 'user-step-2'
  },
  3: {
    title: "Move freely. Where do you notice stiffness or limited flexibility?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Neck stiffness', 'Shoulder mobility', 'Back flexibility',
      'Hips', 'Knees', 'Ankles', 'Stiffness',
      'Coordination', 'Weak flexibility', 'Joint pain',
      'Core stability'
    ],
    initialSelected: [],
    progress: 30,
    stepClass: 'user-step-3'
  },
  4: {
    title: "You're not alone! Most people notice the same areas first.",
    subtitle: "The good news? With the right approach, these zones respond faster than you think.",
    optionNames: [],
    initialSelected: [],
    progress: 35,
    stepClass: 'user-step-4',
    isTestimonial: true,
    testimonials: [
      { percentage: "78%", description: "reported visible posture improvement" },
      { percentage: "65%", description: "noticed reduced puffiness" },
      { percentage: "72%", description: "experienced higher energy levels" },
      { percentage: "81%", description: "felt less stiffness and greater flexibility" }
    ]
  },
  5: {
    title: "Listen to your body. How often does it signal discomfort?",
    subtitle: "",
    optionNames: [
      'Never, I feel comfortable',
      'Rarely, minor discomfort',
      'Sometimes, occasional aches',
      'Often, noticeable pain',
      'Constantly, frequent discomfort'
    ],
    initialSelected: [],
    progress: 40,
    stepClass: 'user-step-5'
  },
  6: {
    title: "Which best describes your typical energy level?",
    subtitle: "",
    optionNames: [
      'Barely have energy to get through the day',
      'Often feel drained or fatigued',
      'Energy varies during the day',
      'Generally energetic and productive',
      'Full of vitality and motivation'
    ],
    initialSelected: [],
    progress: 45,
    stepClass: 'user-step-6'
  },
  7: {
    title: "Real User Stories and science-backed results: slower aging in 8 weeks",
    subtitle: "",
    optionNames: [],
    initialSelected: [],
    progress: 50,
    stepClass: 'user-step-7',
    isTestimonial: true,
    testimonials: [
      {
        percentage: "",
        description: "“Using Age Back, I've experienced a complete transformation! The app has helped improve my posture, refresh and tone my face. I feel more energetic and confident. Great solution for taking care of myself”"
      }
    ]
  }
};


export default function UserPage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentStepId = parseInt(stepId || '1');
  const currentStep = userSteps[currentStepId as keyof typeof userSteps] || userSteps[1];
  
  const [selectedOptions, setSelectedOptions] = useState<number[]>(currentStep.initialSelected);




  useEffect(() => {
    setSelectedOptions(currentStep.initialSelected);
  }, [currentStepId, currentStep.initialSelected]);

  const handleOptionClick = (index: number) => {
    if (currentStepId === 5 || currentStepId === 6) {

      setSelectedOptions([index]);
      setTimeout(() => {
        goNext();
      }, 300);
      return;
    }

    setSelectedOptions(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : prev.length < 3
        ? [...prev, index]
        : prev;
      
      // Сохраняем выборы для user/1, user/2, user/3
      if (currentStepId >= 1 && currentStepId <= 3) {
        const selectedNames = newSelection.map(i => currentStep.optionNames[i]);
        const pageKey = `user${currentStepId}` as 'user1' | 'user2' | 'user3';
        saveIssueAreaSelections(pageKey, selectedNames);
      }
      
      return newSelection;
    });
  };

  const handleBackClick = () => {
    if (currentStepId === 1) {
      // Для первой страницы user переходим на предыдущую секцию (goal/7)
      const previousStep = getPreviousStep(location.pathname);
      if (previousStep) {
        navigate(previousStep);
      }
      return;
    }
    
    // Для остальных страниц в секции - обычный переход на предыдущую страницу в секции
    navigate(`/user/${currentStepId - 1}`);
  };

  const goNext = () => {
    if (currentStepId === 1) {
      navigate('/user/2');
    } else if (currentStepId === 2) {
      navigate('/user/3');
    } else if (currentStepId === 3) {
      navigate('/user/4');
    } else if (currentStepId === 4) {
      navigate('/user/5');
    } else if (currentStepId === 5) {
      navigate('/user/6');
    } else if (currentStepId === 6) {
      navigate('/user/7');
    } else if (currentStepId === 7) {

      navigate('/lifestyle/1');
    } else {
      navigate('/user/1');
    }
  };


  const getContainerClassName = () => {
    let className = 'quiz-container user-container';
    

    if (currentStepId === 5 || currentStepId === 6) {
      className += ` user-step-${currentStepId}`;
    } else {
      className += ` ${currentStep.stepClass}`;
    }
    
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      <Header 
        onBackClick={handleBackClick}
        showBackButton={true}
      />
      
      <main className="content-wrapper">
        <div className="title-wrapper">
          <div className="heading-container">
            <h2 className="question-title">{currentStep.title}</h2>
          </div>
          <p className="question-subtitle">{currentStep.subtitle}</p>
        </div>

        {currentStep.isTestimonial ? (
          currentStepId === 7 ? (
            <div className="user-step-7-testimonial">
              <div className="testimonial-card-advanced">
                <div className="testimonial-image">
                  <img src="/image/before&after.webp" alt="Before and after results" />
                </div>
                <div className="testimonial-content-advanced">
                  <div className="testimonial-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        <span>J</span>
                      </div>
                      <div className="user-details">
                        <span>Jessica, 32 y.o</span>
                      </div>
                    </div>
                    <div className="rating">
                      <img src="/image/rating.svg" alt="5 stars rating" />
                    </div>
                  </div>
                  <div className="testimonial-text">
                    <p>{currentStep.testimonials?.[0]?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="testimonials-wrapper">
              <div className="testimonials-grid">
                {currentStep.testimonials?.map((item, index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-percentage">{item.percentage}</div>
                    <div className="testimonial-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : currentStepId === 5 || currentStepId === 6 ? (
          <div className="options-wrapper">
            {currentStep.optionNames.map((name, index) => {
              const isSelected = selectedOptions.includes(index);
              const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
              const uniqueKey = `${currentStepId}-${index}`;
              return (
                <button 
                  key={uniqueKey}
                  className={`single-select-option ${isSelected ? 'selected' : ''} ${animationClass}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-text">{name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="options-wrapper user-options">
            <div className="options-grid">
              {currentStep.optionNames.map((name, index) => {
              const isSelected = selectedOptions.includes(index);
              

              const widthClasses = {
                1: [
                  'pill-w98', 'pill-w76', 'pill-w122',
                  'pill-w103', 'pill-w158', 'pill-w120',
                  'pill-w135', 'pill-w151', 'pill-w116',
                  'pill-w98', 'pill-w120'
                ],
                2: [
                  'pill-w119', 'pill-w69', 'pill-w70',
                  'pill-w90', 'pill-w108', 'pill-w69',
                  'pill-w109', 'pill-w166', 'pill-w162',
                  'pill-w76', 'pill-w135'
                ],
                3: [
                  'pill-w140', 'pill-w163', 'pill-w139',
                  'pill-w67', 'pill-w80', 'pill-w83',
                  'pill-w99', 'pill-w129', 'pill-w144',
                  'pill-w105', 'pill-w130'
                ]
              };
              
              const widthClass = widthClasses[currentStepId as keyof typeof widthClasses]?.[index] || 'pill-w120';
              const animationClass = `animated-option delay-${Math.min(index + 1, 15)}`;
              const uniqueKey = `${currentStepId}-${index}`;
              
              return (
                <button 
                  key={uniqueKey}
                  className={`pill ${widthClass} ${isSelected ? 'pill-primary' : ''} ${animationClass}`}
                  onClick={() => handleOptionClick(index)}
                >
                  {name}
                </button>
              );
              })}
            </div>
          </div>
        )}
      </main>
      
      {(currentStepId === 4 || currentStepId === 7 || (currentStepId <= 3)) && (
        <div className="continue-button-wrapper">
          <button 
            className={`continue-button ${
              currentStepId <= 3 && selectedOptions.length < 3 ? 'disabled' : ''
            }`} 
            onClick={currentStepId <= 3 && selectedOptions.length < 3 ? undefined : goNext}
            disabled={currentStepId <= 3 && selectedOptions.length < 3}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}