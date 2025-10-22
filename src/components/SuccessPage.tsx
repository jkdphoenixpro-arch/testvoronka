import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/success.css';
import API_CONFIG from '../config/api';

interface PaymentStatus {
  status: string;
  customerEmail?: string;
  amountTotal?: number;
}

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (sessionId) {
        try {
          // Проверяем статус оплаты
          const statusResponse = await fetch(`${API_CONFIG.BASE_URL}/payment-status/${sessionId}`);
          const statusData = await statusResponse.json();
          setPaymentStatus(statusData);
          
          // Если оплата успешна, обновляем пользователя
          if (statusData.status === 'paid') {
            const leadEmail = localStorage.getItem('leadUserEmail');
            
            if (leadEmail) {
              const upgradeResponse = await fetch(`${API_CONFIG.BASE_URL}/api/payment/success`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: leadEmail }),
              });
              
              const upgradeData = await upgradeResponse.json();
              
              if (upgradeData.success) {
                setUserPassword(upgradeData.password);
                // Очищаем localStorage после успешного обновления
                localStorage.removeItem('leadUserEmail');
                console.log('Пользователь обновлён до customer, пароль:', upgradeData.password);
              } else {
                console.error('Ошибка обновления пользователя:', upgradeData.message);
              }
            }
          }
          
        } catch (error) {
          console.error('Ошибка обработки успешной оплаты:', error);
        }
      }
      
      setLoading(false);
    };
    
    processPaymentSuccess();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="loading">Checking payment status...</div>
        </div>
      </div>
    );
  }

  if (!sessionId || !paymentStatus) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="error">
            <h2>Error</h2>
            <p>Unable to find payment information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        {paymentStatus.status === 'paid' ? (
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your payment has been processed.</p>
            {paymentStatus.customerEmail && (
              <p>Receipt sent to: {paymentStatus.customerEmail}</p>
            )}
            {paymentStatus.amountTotal && (
              <p>Amount: ${(paymentStatus.amountTotal / 100).toFixed(2)}</p>
            )}
            {userPassword && (
              <div style={{
                backgroundColor: '#F0F9FF',
                border: '1px solid #0EA5E9',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#0EA5E9', marginBottom: '8px' }}>Ваш пароль для входа:</h3>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  fontFamily: 'monospace',
                  color: '#1E40AF',
                  letterSpacing: '2px'
                }}>
                  {userPassword}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                  Обязательно сохраните этот пароль!
                </p>
              </div>
            )}
            <button 
              className="continue-btn"
              onClick={() => window.location.href = '/signin'}
            >
              Continue to Login
            </button>
          </div>
        ) : (
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h1>Payment Issue</h1>
            <p>Payment was not completed. Please try again.</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.href = '/paywall'}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;