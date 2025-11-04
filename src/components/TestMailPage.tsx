import React, { useState } from 'react';

const TestMailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('Введите email адрес');
      setIsError(true);
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Введите корректный email адрес');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);
    setGeneratedPassword('');

    try {
      const response = await fetch('http://localhost:3001/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Письмо успешно отправлено! Проверьте почту.');
        setGeneratedPassword(data.password);
        setIsError(false);
      } else {
        setMessage(`Ошибка: ${data.message}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Ошибка соединения с сервером');
      setIsError(true);
      console.error('Ошибка отправки:', error);
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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '24px'
        }}>
          Тест отправки писем
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontWeight: '500'
          }}>
            Email адрес:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
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
          {loading ? 'Отправляется...' : 'Отправить письмо'}
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
            <strong>Сгенерированный пароль:</strong>
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

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Инструкция:</strong>
          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Введите email адрес</li>
            <li>Нажмите "Отправить письмо"</li>
            <li>Проверьте почту (включая спам)</li>
            <li>Сравните пароль из письма с показанным выше</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestMailPage;