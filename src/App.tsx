import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import UserPage from './components/UserPage';
import LifestylePage from './components/LifestylePage';
import StatementsPage from './components/StatementsPage';
import './styles/main.css';
import './styles/statements.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/goal/1" replace />} />
          <Route path="/goal/:stepId" element={<QuizPage />} />
          <Route path="/user/:stepId" element={<UserPage />} />
          <Route path="/lifestyle/:stepId" element={<LifestylePage />} />
          <Route path="/statements/:stepId" element={<StatementsPage />} />
          {/* Старые маршруты для совместимости */}
          <Route path="/:pageId" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
