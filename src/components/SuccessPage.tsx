import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/success.css';

interface PaymentStatus {
  status: string;
  customerEmail?: string;
  amountTotal?: number;
}

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:3001/payment-status/${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setPaymentStatus(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Ошибка получения статуса:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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
            <button 
              className="continue-btn"
              onClick={() => window.location.href = '/'}
            >
              Continue
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