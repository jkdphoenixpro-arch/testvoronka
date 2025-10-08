import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/profiling.css';
import '../styles/testimonial.css';

interface TestimonialItem {
  percentage: string;
  description: string;
}

interface ProfilingStep {
  title: string;
  subtitle: string;
  optionNames: string[];
  initialSelected: number[];
  progress: number;
  stepClass: string;
  isTestimonial?: boolean;
  testimonials?: TestimonialItem[];
}

const profilingSteps: Record<number, ProfilingStep> = {
  1: {
    title: "Your face shows your story. Which areas concern you most?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Forehead', 'Eyes', 'Wrinkles',
      'Elasticity', 'Age spots', 'Acne scars', 
      'Under eye', 'Dark circles', 'Puffiness',
      'Freckles', 'Rosacea'
    ],
    initialSelected: [4, 5, 6],
    progress: 15,
    stepClass: 'profiling-step-1'
  },
  2: {
    title: "Your body deserves attention. Where do you feel changes or tension?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Shoulders', 'Neck', 'Back',
      'Posture', 'Lower back', 'Knees',
      'Hips', 'Joint stiffness', 'Mobility',
      'Energy', 'Overall tension'
    ],
    initialSelected: [2, 4, 5],
    progress: 25,
    stepClass: 'profiling-step-2'
  },
  3: {
    title: "Move freely. Where do you notice stiffness or limited flexibility?",
    subtitle: "Select up to 3 options",
    optionNames: [
      'Whole body', 'Lower extremities', 'Muscle tension',
      'Hip', 'Knees', 'Ankles', 'Shoulders',
      'Neck', 'Spinal mobility', 'Joint stiffness',
      'Overall flexibility'
    ],
    initialSelected: [0, 4, 9],
    progress: 30,
    stepClass: 'profiling-step-3'
  },
  4: {
    title: "You're not alone! Most people notice the same areas first.",
    subtitle: "The good news? With the right approach, these zones respond faster than you think.",
    optionNames: [],
    initialSelected: [],
    progress: 35,
    stepClass: 'profiling-step-4',
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
      'Daily - constant signals I can\'t ignore',
      'Several times a week',
      'Once a week or less',
      'Rarely - only during intense activity',
      'Never - I feel great most of the time'
    ],
    initialSelected: [],
    progress: 40,
    stepClass: 'profiling-step-5'
  },
  6: {
    title: "Which best describes your typical energy level?",
    subtitle: "",
    optionNames: [
      'High energy all day, rarely need breaks',
      'Good energy most of the day with occasional dips',
      'Moderate energy, need regular breaks',
      'Low energy, often feel tired or drained',
      'Very low energy, struggle to get through the day'
    ],
    initialSelected: [],
    progress: 45,
    stepClass: 'profiling-step-6'
  },
  7: {
    title: "Real User Stories and science-backed results: slower aging in 8 weeks",
    subtitle: "",
    optionNames: [],
    initialSelected: [],
    progress: 50,
    stepClass: 'profiling-step-7',
    isTestimonial: true,
    testimonials: [
      {
        percentage: "",
        description: "“Using Age Back, I've experienced a complete transformation! The app has helped improve my posture, refresh and tone my face. I feel more energetic and confident. Great solution for taking care of myself”"
      }
    ]
  }
};

export default function ProfilingPage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const currentStepId = parseInt(stepId || '1');
  const currentStep = profilingSteps[currentStepId as keyof typeof profilingSteps] || profilingSteps[1];
  
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
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < 3) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleBackClick = () => {
    if (currentStepId === 1) {
      return;
    }
    navigate(-1);
  };

  const goNext = () => {
    if (currentStepId === 1) {
      navigate('/profiling/2');
    } else if (currentStepId === 2) {
      navigate('/profiling/3');
    } else if (currentStepId === 3) {
      navigate('/profiling/4');
    } else if (currentStepId === 4) {
      navigate('/profiling/5');
    } else if (currentStepId === 5) {
      navigate('/profiling/6');
    } else if (currentStepId === 6) {
      navigate('/profiling/7');
    } else if (currentStepId === 7) {
      return;
    } else {
      navigate('/profiling/1');
    }
  };

  const getContainerClassName = () => {
    let className = 'quiz-container profiling-container';
    
    if (currentStepId === 5 || currentStepId === 6) {
      className += ` profiling-step-${currentStepId}`;
    } else {
      className += ` ${currentStep.stepClass}`;
    }
    
    return className;
  };

  return (
    <div className={getContainerClassName()}>
      <Header 
        progress={currentStep.progress}
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
            <div className="profiling-step-7-testimonial">
              <div className="testimonial-card-advanced">
                <div className="testimonial-image testimonial-image-mirrored">
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
              const uniqueKey = `${currentStepId}-${index}`;
              return (
                <button 
                  key={uniqueKey}
                  className={`single-select-option ${isSelected ? 'selected' : ''} animated-option delay-${Math.min(index + 1, 15)}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-text">{name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="options-wrapper profiling-options">
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
              const uniqueKey = `${currentStepId}-${index}`;
              
              return (
                <button 
                  key={uniqueKey}
                  className={`pill ${widthClass} ${isSelected ? 'pill-primary' : ''} animated-option delay-${Math.min(index + 1, 15)}`}
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
      
      {(currentStepId === 4 || currentStepId === 7 || (currentStepId <= 3 && selectedOptions.length > 0)) && (
        <div className="continue-button-wrapper">
          <button className="continue-button" onClick={goNext}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
