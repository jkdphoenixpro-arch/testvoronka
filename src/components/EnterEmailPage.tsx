import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/enteremail.css';
import { getPreviousStep } from '../utils/navigationUtils';

const EnterEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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
      // Fallback на results если предыдущий этап не найден
      navigate('/results');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/paywall');
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
      {/* Top Bar */}
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
          {/* Header */}
          <div className="header-container">
            <div className="heading-container">
              <h1 className="page-title">Enter your email to get your personal AgeBack plan</h1>
            </div>
            <div className="description-container">
              <p className="page-description">We ensure that the results are saved in your account</p>
            </div>
          </div>

          {/* Form */}
          <form className="enteremail-form" onSubmit={handleSubmit}>
            <div className="form-container">
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
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>

          {/* Policies */}
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