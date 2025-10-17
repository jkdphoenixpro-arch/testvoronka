import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signin.css';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const handleResendPassword = () => {
    navigate('/recover-password');
  };

  return (
    <div className="signin-container">
      {/* Главный контейнер с градиентным фоном */}
      <div className="signin-background">
        {/* Центрированный контент (максимальная ширина 440px) */}
        <div className="signin-content">
          <div className="signin-form-wrapper">
            {/* App Icon */}
            <div className="app-icon-section">
              <div className="app-icon-container">
                <img 
                  src="/image/App-Icon.png" 
                  alt="Age Back" 
                  className="app-icon-image"
                />
              </div>
            </div>

            {/* Login Form */}
            <div className="login-form">
              {/* Title wrapper */}
              <div className="signin-title-wrapper">
                <div className="heading-container">
                  <h2 className="signin-title">Welcome, back to Age Back!</h2>
                </div>
                <p className="signin-subtitle">Check your registration email for your login password</p>
              </div>

              {/* Form */}
              <div className="signin-form">
                {/* Email Input */}
                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="signin-input"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      className="signin-input"
                    />
                  </div>
                </div>

                {/* Sign in Button */}
                <button className="signin-button">
                  <span className="signin-button-text">Sign in</span>
                </button>
              </div>
            </div>

            {/* Policies */}
            <div className="signin-policies">
              <p className="password-help-text">Can't find registration password?</p>
              <div className="resend-container">
                <div className="resend-link" onClick={handleResendPassword}>
                  <span className="resend-text">Resend password</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;