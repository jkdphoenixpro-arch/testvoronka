import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/recover-password.css';

const RecoverPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="recover-password-container">
      {/* Главный контейнер с градиентным фоном */}
      <div className="recover-password-background">
        {/* Центрированный контент (максимальная ширина 440px) */}
        <div className="recover-password-content">
          <div className="recover-password-form-wrapper">
            {/* App Icon */}
            <div className="recover-app-icon-section">
              <div className="recover-app-icon-container">
                <img 
                  src="/image/App-Icon.png" 
                  alt="Age Back" 
                  className="recover-app-icon-image"
                />
              </div>
            </div>

            {/* Login Form */}
            <div className="recover-login-form">
              {/* Title wrapper */}
              <div className="recover-title-wrapper">
                <div className="recover-heading-container">
                  <h2 className="recover-title">Resend password</h2>
                </div>
                <p className="recover-subtitle">Enter your sign-up email. We will send you your password</p>
              </div>

              {/* Form Container */}
              <div className="recover-form-container">
                <div className="recover-form">
                  {/* Email Input */}
                  <div className="recover-input-container">
                    <div className="recover-input-wrapper">
                      <input
                        type="email"
                        placeholder="E-mail"
                        className="recover-input"
                      />
                    </div>
                  </div>

                  {/* Send password Button */}
                  <button className="recover-button">
                    <span className="recover-button-text">Send password</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="recover-policies">
              <p className="remember-help-text">Remembered your password?</p>
              <div className="recover-signin-container">
                <div className="recover-signin-link" onClick={handleSignIn}>
                  <span className="recover-signin-text">Sign in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;