import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/paywall.css';
import API_CONFIG from '../config/api';

const PaywallPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('8-week');
  const [timeLeft, setTimeLeft] = useState({ minutes: 4, seconds: 58 });

  useEffect(() => {
    document.body.classList.add('paywall-page');

    return () => {
      document.body.classList.remove('paywall-page');
    };
  }, []);

  // Таймер обратного отсчета
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const handleBackClick = () => {
    navigate('/results');
  };

  const handleContinueClick = async () => {
    try {
      // Маппинг планов на ID для бэкенда
      const planMapping: { [key: string]: string } = {
        '4-week': 'basic',
        '8-week': 'premium',
        '12-week': 'pro'
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planMapping[selectedPlan]
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Перенаправляем на страницу оплаты Stripe
        window.location.href = data.url;
      } else {
        console.error('Ошибка создания сессии оплаты');
      }
    } catch (error) {
      console.error('Ошибка при создании сессии оплаты:', error);
    }
  };

  const handleSubscriptionClick = async () => {
    try {
      // Маппинг планов на ID для бэкенда
      const planMapping: { [key: string]: string } = {
        '4-week': 'basic',
        '8-week': 'premium',
        '12-week': 'pro'
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/create-subscription-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planMapping[selectedPlan]
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Перенаправляем на страницу оплаты Stripe для подписки
        window.location.href = data.url;
      } else {
        console.error('Ошибка создания сессии подписки');
      }
    } catch (error) {
      console.error('Ошибка при создании сессии подписки:', error);
    }
  };

  return (
    <div className="quiz-container paywall-container">
      {/* Discount Navbar */}
      <div className="discount-navbar">
        <div className="discount-info">
          <div className="discount-text">Discount available</div>
          <div className="countdown">
            <span className="time-number">{formatTime(timeLeft.minutes)}</span>
            <span className="time-separator">:</span>
            <span className="time-number">{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
        <button className="grab-offer-btn">Grab offer</button>
      </div>

      <main className="content-wrapper">
        <div className="paywall-content">
          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="hero-title">Your personalised Age Back plan is ready!</h1>

            <div className="before-after-section">
              <div className="comparison-header">
                <div className="comparison-label">Now</div>
                <div className="comparison-divider"></div>
                <div className="comparison-label">After Program</div>
              </div>
              <div className="before-after-image">
                <img src="/image/paywall-before&after.webp" alt="Before and After Results" />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            <h2 className="section-title">Get visible results in 8 weeks!</h2>

            <div className="offer-alert">
              <div className="alert-icon">
                <img src="/image/timer-icon.svg" alt="Timer" width="24" height="24" />
              </div>
              <span>This offer expires in {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
            </div>

            {/* Pricing Plans */}
            <div className="pricing-plans">
              {/* 4-Week Plan */}
              <div className={`plan-card ${selectedPlan === '4-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('4-week')}>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '4-week' ? 'checked' : ''}`}>
                    {selectedPlan === '4-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">4-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$38.95</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$6.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '4-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.99</div>
                  <div className="price-label">per day</div>
                </div>
              </div>

              {/* 8-Week Plan */}
              <div className={`plan-card ${selectedPlan === '8-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('8-week')}>
                <div className="plan-badge best-for-you">Best for you</div>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '8-week' ? 'checked' : ''}`}>
                    {selectedPlan === '8-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">8-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$38.95</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$15.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '8-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.53</div>
                  <div className="price-label">per day</div>
                </div>
              </div>

              {/* 12-Week Plan */}
              <div className={`plan-card ${selectedPlan === '12-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('12-week')}>
                <div className="plan-badge popular">Popular</div>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '12-week' ? 'checked' : ''}`}>
                    {selectedPlan === '12-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">12-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$66.65</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$25.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '12-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.29</div>
                  <div className="price-label">per day</div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <button className="get-plan-btn" onClick={handleContinueClick}>Get my plan</button>
              <div className="guarantee-text">100% Money back Guarantee. Safe checkout.</div>
            </div>
          </div>
          {/* Security Section */}
          <div className="security-section">
            <div className="security-content">
              <h3 className="security-title">Guaranteed safe checkout</h3>
              <p className="security-text">All transactions are secure and encrypted with SSL/TLS encryption</p>
              <div className="payment-methods">
                <div className="payment-card">
                  <img src="/image/Visa.svg" alt="Visa" />
                </div>
                <div className="payment-card">
                  <img src="/image/Mastercard.svg" alt="Mastercard" />
                </div>
                <div className="payment-card">
                  <img src="/image/American-Express.svg" alt="American Express" />
                </div>
                <div className="payment-card">
                  <img src="/image/Discover.svg" alt="Discover" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="social-proof">
            <div className="social-proof-text">293 people bought our plans in the last 1 hour</div>
            <div className="user-ticker">
              <div className="user-ticker-track">
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">gre***@</div>
                  </div>
                  <div className="user-plan">3-Months Plan</div>
                </div>
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">mar***@</div>
                  </div>
                  <div className="user-plan">8-Week Plan</div>
                </div>
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">ann***@</div>
                  </div>
                  <div className="user-plan">12-Week Plan</div>
                </div>
                {/* Дублируем для бесшовной анимации */}
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">gre***@</div>
                  </div>
                  <div className="user-plan">3-Months Plan</div>
                </div>
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">mar***@</div>
                  </div>
                  <div className="user-plan">8-Week Plan</div>
                </div>
                <div className="user-item">
                  <div className="user-email-mask">
                    <div className="user-email">ann***@</div>
                  </div>
                  <div className="user-plan">12-Week Plan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Science Section */}
          <div className="science-section">
            <h2 className="section-title">Science-backed approach</h2>
            <div className="fact-card">
              <div className="fact-content">
                <h3 className="fact-title">Program Created by Dr. Paula Stein</h3>
                <p className="fact-description">Expert in anti-aging and wellness with over 15 years of experience</p>
              </div>
              <div className="fact-image">
                <img src="/image/dr-stein.webp" alt="Dr. Paula Stein" />
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="benefits-section">
            <h2 className="section-title">Double Your Results with a 15-min workout</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-image">
                  <img src="/image/face&neck.webp" alt="Face Renewal" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">Face Renewal</h3>
                  <p className="benefit-description">Reduces puffiness, smooths facial contours, restores shape</p>
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-image">
                  <img src="/image/strength&bodytone.webp" alt="Body Vitality" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">Body Vitality</h3>
                  <p className="benefit-description">Strengthens muscles, tones body, boosts overall energy</p>
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-image">
                  <img src="/image/joints&flexibility.webp" alt="Mobility & Flexibility" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">Mobility & Flexibility</h3>
                  <p className="benefit-description">Improves joints, enhances flexibility, keeps you active</p>
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-image">
                  <img src="/image/back&posture.webp" alt="Posture Alignment" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">Posture Alignment</h3>
                  <p className="benefit-description">Corrects posture, reduces tension, supports spinal health</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You Get Section */}
          <div className="what-you-get-section">
            <h2 className="section-title">What you get</h2>
            <div className="features-card">
              <div className="feature-item">
                <div className="feature-icon"></div>
                <div className="feature-content">
                  <h3 className="feature-title">Personalized Daily Routines</h3>
                  <p className="feature-description">Step-by-step routines and reminders crafted for your daily habits</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"></div>
                <div className="feature-content">
                  <h3 className="feature-title">Science-Based Program</h3>
                  <p className="feature-description">15-minute exercises to tone, improve posture, and rejuvenate.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"></div>
                <div className="feature-content">
                  <h3 className="feature-title">Pro Tips & Guidance</h3>
                  <p className="feature-description">Expert tips to boost energy and wellness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="testimonials-section">
            <h2 className="section-title">Hear success stories from our users</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">J</div>
                    <span className="user-name">Jessica</span>
                  </div>
                  <div className="rating">
                    <img src="/image/rating.svg" alt="Rating" />
                  </div>
                </div>
                <p className="testimonial-text">
                  “Using Age Back, I've experienced a complete transformation! The app has helped improve my posture, refresh and tone my face, increase flexibility. I feel more energetic and confident. It's a truly great solution for taking care of myself”
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">M</div>
                    <span className="user-name">Maria</span>
                  </div>
                  <div className="rating">
                    <img src="/image/rating.svg" alt="Rating" />
                  </div>
                </div>
                <p className="testimonial-text">
                  "Age Back completely changed my daily routine! After just 6 weeks, I noticed significant improvements in my posture and energy levels. My friends keep asking what I'm doing differently. This app is a game-changer"
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">S</div>
                    <span className="user-name">Sarah</span>
                  </div>
                  <div className="rating">
                    <img src="/image/rating.svg" alt="Rating" />
                  </div>
                </div>
                <p className="testimonial-text">
                  "I was skeptical at first, but Age Back delivered amazing results! My skin looks more radiant, my back pain is gone, and I feel 10 years younger. The personalized approach really works. Highly recommended!"
                </p>
              </div>
            </div>
            <button className="get-plan-btn" onClick={handleContinueClick}>Get my plan</button>
          </div>

          {/* Final CTA Section */}
          <div className="final-cta-section">
            <h2 className="section-title">Get visible results in 8 weeks!</h2>

            <div className="offer-alert">
              <div className="alert-icon">
                <img src="/image/timer-icon.svg" alt="Timer" width="24" height="24" />
              </div>
              <span>This offer expires in {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
            </div>

            {/* Repeat pricing plans */}
            <div className="pricing-plans">
              {/* 4-Week Plan */}
              <div className={`plan-card ${selectedPlan === '4-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('4-week')}>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '4-week' ? 'checked' : ''}`}>
                    {selectedPlan === '4-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">4-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$38.95</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$6.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '4-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.99</div>
                  <div className="price-label">per day</div>
                </div>
              </div>

              {/* 8-Week Plan */}
              <div className={`plan-card ${selectedPlan === '8-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('8-week')}>
                <div className="plan-badge best-for-you">Best for you</div>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '8-week' ? 'checked' : ''}`}>
                    {selectedPlan === '8-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">8-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$38.95</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$15.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '8-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.53</div>
                  <div className="price-label">per day</div>
                </div>
              </div>

              {/* 12-Week Plan */}
              <div className={`plan-card ${selectedPlan === '12-week' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('12-week')}>
                <div className="plan-badge popular">Popular</div>
                <div className="plan-content">
                  <div className={`checkbox ${selectedPlan === '12-week' ? 'checked' : ''}`}>
                    {selectedPlan === '12-week' && (
                      <svg
                        className="checkmark"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3L3.5 5L8 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="plan-info">
                    <div className="plan-name">12-Week plan</div>
                    <div className="plan-price-old">
                      <span className="old-price">$66.65</span>
                      <span className="price-arrow">→</span>
                      <span className="new-price">$25.99</span>
                    </div>
                  </div>
                </div>
                <div className={`plan-pricing ${selectedPlan === '12-week' ? 'highlighted' : ''}`}>
                  <div className="price-per-day">$1.30</div>
                  <div className="price-main">$0.29</div>
                  <div className="price-label">per day</div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <button className="get-plan-btn" onClick={handleContinueClick}>Get my plan</button>
              <div className="guarantee-text">100% Money back Guarantee. Safe checkout.</div>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="guarantee-section">
            <div className="guarantee-card">
              <div className="guarantee-header">
                <h3 className="guarantee-title">100% Money-Back Guarantee</h3>
                <div className="guarantee-badge">
                  <img src="/image/guarantee-badge.svg" alt="Money Back Guarantee" />
                </div>
              </div>
              <p className="guarantee-text">
                We are so sure of our program that we guarantee a full refund within 30 days of purchase if you train with us at least 3 times a week and don't get results.
              </p>
            </div>

            <div className="security-info">
              <div className="security-item">
                <h4 className="security-item-title">Your information is safe</h4>
                <p className="security-item-text">We will not sell or share your personal information for any marketing purposes</p>
              </div>
              <div className="security-item">
                <h4 className="security-item-title">Secure checkout</h4>
                <p className="security-item-text">Your payment information is secure with SSL/TLS encryption</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <div className="contact-text">Need any help?</div>
            <div className="contact-link">Contact us</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaywallPage;