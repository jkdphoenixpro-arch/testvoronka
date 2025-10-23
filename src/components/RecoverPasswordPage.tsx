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
      <div className="recover-password-background">
        <div className="recover-password-content">
          <div className="recover-password-form-wrapper">
            <div className="recover-app-icon-section">
              <div className="recover-app-icon-container">
                <img 
                  src="/image/App-Icon.png" 
                  alt="Age Back" 
                  className="recover-app-icon-image"
                />
              </div>
            </div>

            <div className="recover-login-form">
              <div className="recover-title-wrapper">
                <div className="recover-heading-container">
                  <h2 className="recover-title">Resend password</h2>
                </div>
                <p className="recover-subtitle">Enter your sign-up email. We will send you your password</p>
              </div>

              <div className="recover-form-container">
                <div className="recover-form">
                  <div className="recover-input-container">
                    <div className="recover-input-wrapper">
                      <input
                        type="email"
                        placeholder="E-mail"
                        className="recover-input"
                      />
                    </div>
                  </div>

                  <button className="recover-button">
                    <span className="recover-button-text">Send password</span>
                  </button>
                </div>
              </div>
            </div>

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