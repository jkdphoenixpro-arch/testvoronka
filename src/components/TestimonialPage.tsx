import React from 'react';

interface TestimonialPageProps {
  title: string;
  subtitle?: string;
}

const TestimonialPage: React.FC<TestimonialPageProps> = ({ title, subtitle }) => {
  return (
    <div className="testimonial-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title">{title}</h2>
        </div>
        {subtitle && (
          <p className="question-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="testimonial-section">
        <div className="image-container">
          <img src="/image/testimonials.webp" alt="Testimonials" />
        </div>

        <div className="rating-section">
          <div className="stars-rating">
            <img src="/image/rating.svg" alt="5 stars rating" />
          </div>
          <div className="testimonial-content-text">
            <p>4.8 Rating | 17.2K 5-star reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;