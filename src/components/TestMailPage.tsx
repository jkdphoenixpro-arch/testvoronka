import React, { useState } from 'react';
import API_CONFIG from '../config/api';

const TestMailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('Enter email address');
      setIsError(true);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Enter a valid email address');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);
    setGeneratedPassword('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Email sent successfully! Check your inbox.');
        setGeneratedPassword(data.password);
        setIsError(false);
      } else {
        setMessage(`Error: ${data.message}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Server connection error');
      setIsError(true);
      console.error('Send error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '24px'
        }}>
          Email Sending Test
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontWeight: '500'
          }}>
            Email address:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@email.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSendEmail}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '5px',
            backgroundColor: isError ? '#fee' : '#efe',
            border: `1px solid ${isError ? '#fcc' : '#cfc'}`,
            color: isError ? '#c33' : '#363',
            marginBottom: '15px'
          }}>
            {message}
          </div>
        )}

        {generatedPassword && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <strong>Generated password:</strong>
            <div style={{
              fontSize: '18px',
              fontFamily: 'monospace',
              color: '#2c3e50',
              marginTop: '5px',
              padding: '8px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '3px'
            }}>
              {generatedPassword}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default TestMailPage;