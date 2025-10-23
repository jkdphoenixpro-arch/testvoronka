import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/enteremail.css';
import { getPreviousStep } from '../utils/navigationUtils';
import { getSelectedGoals, getSelectedIssueAreas } from '../utils/userSelections';
import API_CONFIG from '../config/api';

const EnterEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('enteremail-page');
    
    return () => {
      document.body.classList.remove('enteremail-page');
    };
  }, []);

  const handleBackClick = () => {
    const previousStep = getPreviousStep(location.pathname);
    if (previousStep) {
      navigate(previousStep);
    } else {
      navigate('/results');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const selectedGoals = getSelectedGoals();
      const selectedIssueAreas = getSelectedIssueAreas();
      
      const userData = {
        ...formData,
        goals: selectedGoals,
        issueAreas: selectedIssueAreas
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/create-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('leadUserEmail', data.user.email);
        console.log('Lead created:', data.user);
        navigate('/paywall');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="quiz-container enteremail-container">
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
        <div className="enteremail-content">
          <div className="header-container">
            <div className="heading-container">
              <h1 className="page-title">Enter your email to get your personal AgeBack plan</h1>
            </div>
            <div className="description-container">
              <p className="page-description">We ensure that the results are saved in your account</p>
            </div>
          </div>

          <form className="enteremail-form" onSubmit={handleSubmit}>
            <div className="form-container">
              {error && (
                <div style={{
                  color: '#DC2626',
                  backgroundColor: '#FEE2E2',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Создание аккаунта...' : 'Submit'}
              </button>
            </div>
          </form>

          <div className="policies-section">
            <div className="security-text">
              <div className="security-line">Your information is 100% secure.</div>
              <div className="security-line">Age Back not share your personal information with third parties.</div>
            </div>
            <div className="policies-links">
              <a href="#" className="policy-link">Terms of use</a>
              <a href="#" className="policy-link">Privacy Policy</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnterEmailPage;