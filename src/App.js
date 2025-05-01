import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentsPage from './pages/AssessmentsPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';

// Components
import RequireAuth from './components/RequireAuth';

// Context
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/assessments" 
            element={
              <RequireAuth>
                <AssessmentsPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <RequireAuth>
                <UsersPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } 
          />
          
          {/* Redirect to login or dashboard depending on auth status */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
