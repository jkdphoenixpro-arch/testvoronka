import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signin.css';
import API_CONFIG from '../config/api';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/routine');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendPassword = () => {
    navigate('/recover-password');
  };

  return (
    <div className="signin-container">
      <div className="signin-background">
        <div className="signin-content">
          <div className="signin-form-wrapper">
            <div className="app-icon-section">
              <div className="app-icon-container">
                <img 
                  src="/image/App-Icon.png" 
                  alt="Age Back" 
                  className="app-icon-image"
                />
              </div>
            </div>

            <div className="login-form">
              <div className="signin-title-wrapper">
                <div className="heading-container">
                  <h2 className="signin-title">Welcome, back to Age Back!</h2>
                </div>
              </div>

              <form className="signin-form" onSubmit={handleSignIn}>
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
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="signin-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      data-lpignore="true"
                      required
                    />
                  </div>
                </div>

                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      className="signin-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      data-lpignore="true"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="signin-button" disabled={loading}>
                  <span className="signin-button-text">
                    {loading ? 'Signing in...' : 'Sign in'}
                  </span>
                </button>
              </form>
            </div>

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