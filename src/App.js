import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentsPage from './pages/AssessmentsPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentNotesPage from './pages/AssessmentNotesPage';

// Components
import RequireAuth from './components/RequireAuth';
import AssignAssessmentModal from './components/AssignAssessmentModal';

// Context
import { AuthProvider } from './utils/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

// Constants
import { ROUTES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ModalProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route 
                path={ROUTES.DASHBOARD} 
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path={ROUTES.ASSESSMENTS} 
                element={
                  <RequireAuth>
                    <AssessmentsPage />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path={ROUTES.USERS} 
                element={
                  <RequireAuth>
                    <UsersPage />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path={ROUTES.PROFILE} 
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                } 
              />
              
              <Route 
                path={ROUTES.ASSESSMENT_NOTES} 
                element={
                  <RequireAuth>
                    <AssessmentNotesPage />
                  </RequireAuth>
                } 
              />
              
              {/* Redirect to login or dashboard depending on auth status */}
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              
              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
            <AssignAssessmentModal />
          </Router>
        </ModalProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
