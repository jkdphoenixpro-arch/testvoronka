import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import UserPage from './components/UserPage';
import LifestylePage from './components/LifestylePage';
import StatementsPage from './components/StatementsPage';
import BuildingPlanPage from './components/BuildingPlanPage';
import ResultsPage from './components/ResultsPage';
import EnterEmailPage from './components/EnterEmailPage';
import PaywallPage from './components/PaywallPage';
import SuccessPage from './components/SuccessPage';
import SignInPage from './components/SignInPage';
import RecoverPasswordPage from './components/RecoverPasswordPage';
import RoutinePage from './components/RoutinePage';
import LessonPage from './components/LessonPage';
import UserProfilePage from './components/UserProfilePage';
import AdminPage from './components/AdminPage';
import TestMailPage from './components/TestMailPage';
import CreatePlanPage from './components/CreatePlanPage';
import ReadyPlanPage from './components/ReadyPlanPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimationProvider } from './contexts/AnimationContext';
import './styles/main.css';
import './styles/statements.css';

function App() {
  return (
    <AnimationProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/goal/1" replace />} />
            <Route path="/goal/:stepId" element={<QuizPage />} />
            <Route path="/user/:stepId" element={<UserPage />} />
            <Route path="/lifestyle/:stepId" element={<LifestylePage />} />
            <Route path="/statements/:stepId" element={<StatementsPage />} />
            <Route path="/buildingplan/:stepId" element={<BuildingPlanPage />} />
            <Route path="/ready-plan" element={<ReadyPlanPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/create-plan" element={<CreatePlanPage />} />
            <Route path="/enteremail" element={<EnterEmailPage />} />
            <Route path="/paywall" element={<PaywallPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/recover-password" element={<RecoverPasswordPage />} />
            <Route path="/routine" element={
              <ProtectedRoute>
                <RoutinePage />
              </ProtectedRoute>
            } />
            <Route path="/lesson/:lessonId" element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/testmail" element={<TestMailPage />} />
            {/* Старые маршруты для совместимости */}
            <Route path="/:pageId" element={<QuizPage />} />
          </Routes>
        </div>
      </Router>
    </AnimationProvider>
  );
}

export default App;
