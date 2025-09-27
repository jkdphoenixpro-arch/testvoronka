import React from 'react';

interface ChartPageProps {
  title: string;
  subtitle?: string;
}

const ChartPage: React.FC<ChartPageProps> = ({ title, subtitle }) => {
  return (
    <div className="chart-content">
      <div className="title-wrapper">
        <div className="heading-container">
          <h2 className="question-title">{title}</h2>
        </div>
        {subtitle && (
          <p className="question-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="chart-section">
        <div className="chart-block">
          <div className="chart-image">
            <img src="/image/chart-results.svg" alt="Age Back results chart" />
          </div>
        </div>

        <div className="info-block">
          <div className="info-icon">
            <img src="/image/znak.svg" alt="Info icon" />
          </div>
          <div className="info-text">
            <p>Data based on self-reported results from Age Back users, showing improvements in energy, posture, and skin tone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;