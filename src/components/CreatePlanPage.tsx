import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import ContinueButton from './ContinueButton';
import { getAllChallenges, getAgeGroup, getMotivation } from '../utils/userSelections';
import { getPreviousStep } from '../utils/navigationUtils';
import '../styles/create-plan.css';

interface CreatePlanData {
  profileType: string;
  potential: string;
  potentialYears: string;
  potentialDescription: string;
  age: string;
  rewindGoal: string;
  rejuvenationType: string;
  motivation: string;
  challenges: string[];
}

const CreatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [challenges, setChallenges] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string>('30s');
  const [motivation, setMotivation] = useState<string>('Feel confident');

  useEffect(() => {
    // Загружаем выбранные challenges, возрастную группу и motivation из localStorage
    const savedChallenges = getAllChallenges();
    const savedAgeGroup = getAgeGroup();
    const savedMotivation = getMotivation();
    setChallenges(savedChallenges);
    setAgeGroup(savedAgeGroup);
    setMotivation(savedMotivation);
  }, []);

  // Функция для получения данных в зависимости от возрастной группы
  const getAgeGroupData = (age: string) => {
    switch (age) {
      case '20s':
        return {
          profileType: 'Early Balancer',
          rewindImage: '/image/age-rewind-high-2-3.webp',
          rejuvenationType: 'Early Balancer',
          infoText: 'Your body is highly adaptive — restoring balance quickly keeps you at your natural peak.'
        };
      case '30s':
        return {
          profileType: 'Rhythm Restorer',
          rewindImage: '/image/age-rewind-high-4-5.webp',
          rejuvenationType: 'Rhythm Restorer',
          infoText: 'Your potential is strong — consistent recovery restores your daily rhythm and energy flow.'
        };
      case '40s':
        return {
          profileType: 'Youth Recharger',
          rewindImage: '/image/age-rewind-extreme.webp',
          rejuvenationType: 'Youth Recharger',
          infoText: 'Your body responds fast to recovery — regain tone, energy, and posture with small daily actions.'
        };
      case '50s':
        return {
          profileType: 'Vitality Rebuilder',
          rewindImage: '/image/age-rewind-extreme.webp',
          rejuvenationType: 'Vitality Rebuilder',
          infoText: 'Your resilience is powerful — restoring flow and mobility awakens deep vitality.'
        };
      case '60s':
        return {
          profileType: 'Flow Reviver',
          rewindImage: '/image/age-rewind-extreme.webp',
          rejuvenationType: 'Flow Reviver',
          infoText: 'Your resilience is powerful — restoring flow and mobility awakens deep vitality.'
        };
      default:
        return {
          profileType: 'Rhythm Restorer',
          rewindImage: '/image/age-rewind-high-4-5.webp',
          rejuvenationType: 'Rhythm Restorer',
          infoText: 'Your potential is strong — consistent recovery restores your daily rhythm and energy flow.'
        };
    }
  };

  const ageGroupData = getAgeGroupData(ageGroup);

  // Данные можно получать из localStorage или props
  const planData: CreatePlanData = {
    profileType: ageGroupData.profileType,
    potential: 'High',
    potentialYears: '4-5 years',
    potentialDescription: ageGroupData.infoText,
    age: ageGroup,
    rewindGoal: '2-3 years',
    rejuvenationType: ageGroupData.rejuvenationType,
    motivation: motivation,
    challenges: challenges.length > 0 ? challenges : [
      'Drooping eyelids',
      'Dark circles',
      'Skin elasticity',
      'Back',
      'Slouching',
      'Legs',
      'Neck stiffness',
      'Knees',
      'Joint pain'
    ]
  };

  const handleBackClick = () => {
    const previousStep = getPreviousStep(location.pathname);
    if (previousStep) {
      navigate(previousStep);
    } else {
      navigate('/enteremail');
    }
  };

  const handleContinueClick = () => {
    // Переход на следующую страницу
    navigate('/buildingplan/1');
  };

  return (
    <div className="quiz-container create-plan-container">
      <Header
        onBackClick={handleBackClick}
        showBackButton={true}
      />

      <main className="content-wrapper">
        <div className="title-wrapper">
          <div className="heading-container">
            <h2 className="question-title">Your Age-rewind profile: <span className="profile-type-highlight">{planData.profileType}</span></h2>
          </div>
        </div>

        <div className="create-plan-content">
          {/* Age-Rewind Potential Block */}
          <div className="rewind-potential-card">
            <div className="card-header">
              <div className="header-text">
                <p className="label-text">Age-Rewind potential:</p>
              </div>
            </div>

            <div className="rewind-image-wrapper">
              <img src={ageGroupData.rewindImage} alt="Age Rewind Potential" className="rewind-image" />
              <h3 className="value-text">{planData.potential}</h3>
            </div>

            <div className="info-block">
              <div className="info-icon">
                <img src="/image/icon-info-24px.svg" alt="Info" />
              </div>
              <p className="info-text">
                {planData.potentialDescription}
              </p>
            </div>
          </div>

          {/* Summary Block */}
          <div className="summary-card">
            <div className="summary-row">
              <div className="summary-item">
                <div className="summary-icon">
                  <img src="/image/user-icon-24px.svg" alt="User" />
                </div>
                <div className="summary-content">
                  <p className="summary-label">Age</p>
                  <p className="summary-value">{planData.age}</p>
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-icon">
                  <img src="/image/rewind-icon-24px.svg" alt="Rewind" />
                </div>
                <div className="summary-content">
                  <p className="summary-label">Rewind Goal</p>
                  <p className="summary-value">{planData.rewindGoal}</p>
                </div>
              </div>
            </div>
            <div className="summary-row">
              <div className="summary-item">
                <div className="summary-icon">
                  <img src="/image/clock-icon-24px.svg" alt="Clock" />
                </div>
                <div className="summary-content">
                  <p className="summary-label">Rejuvenation Type</p>
                  <p className="summary-value">{planData.rejuvenationType}</p>
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-icon">
                  <img src="/image/flash-icon-24px.svg" alt="Flash" />
                </div>
                <div className="summary-content">
                  <p className="summary-label">Motivation</p>
                  <p className="summary-value">{planData.motivation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Challenges Block */}
          <div className="challenges-card">
            <div className="challenges-header">
              <div className="challenges-icon">
                <img src="/image/lamp-icon-24px.svg" alt="Lamp" />
              </div>
              <div className="challenges-content">
                <p className="challenges-label">Challenges</p>
                <div className="challenges-tags">
                  {planData.challenges.map((challenge, index) => (
                    <span key={index} className="challenge-tag">
                      {challenge}{index < planData.challenges.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ContinueButton
        onClick={handleContinueClick}
        text="Create action plan"
      />
    </div>
  );
};

export default CreatePlanPage;
