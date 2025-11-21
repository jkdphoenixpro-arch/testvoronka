import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContinueButton from './ContinueButton';
import '../styles/ready-plan.css';

const ReadyPlanPage: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        // Получаем имя пользователя из localStorage
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setUserName(savedName);
        }
    }, []);

    const handleBackClick = () => {
        navigate('/buildingplan/1');
    };

    const handleContinueClick = () => {
        navigate('/paywall');
    };

    return (
        <div className="quiz-container ready-plan-container">
            <div className="top-bar">
                <div className="navbar">
                    <button className="back-button goal-back-button" aria-label="Назад" onClick={handleBackClick}>
                        <img
                            src="/image/arrow_left.svg"
                            alt="Back"
                            width="6"
                            height="12"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                svg.setAttribute('width', '6');
                                svg.setAttribute('height', '12');
                                svg.setAttribute('viewBox', '0 0 6 12');
                                svg.innerHTML = '<path d="M5 11L1 6L5 1" stroke="#28194B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
                                e.currentTarget.parentNode?.appendChild(svg);
                            }}
                        />
                    </button>
                    <div className="app-icon">
                        <img src="/image/rewind-icon-24px.svg" alt="" className="app-rewind-icon" />
                        <span className="app-name">Age Back</span>
                    </div>
                </div>
            </div>

            <main className="content-wrapper">
                <div className="title-wrapper">
                    <div className="heading-container">
                        <h2 className="question-title">
                            {userName},<br />Your personal Age-Rewind plan is<br />ready!
                        </h2>
                    </div>
                    <p className="question-subtitle">
                        Your program will target recovery, alignment, and glow restoration.
                    </p>
                </div>

                <div className="chart-container">
                    <img src="/image/progress-rate.webp" alt="Progress rate chart" className="chart-image" />
                </div>
            </main>

            <ContinueButton onClick={handleContinueClick} />
        </div>
    );
};

export default ReadyPlanPage;
