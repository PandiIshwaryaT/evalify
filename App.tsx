import React, { useState, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerifierPage from './pages/VerifierPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import MainLayout from './components/MainLayout';
import { AuthContext } from './contexts/AuthContext';
import { User } from './types';
import { addNotification } from './services/geminiService';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('evalify_user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = useCallback((userData: User) => {
    localStorage.setItem('evalify_user', JSON.stringify(userData));
    addNotification({ type: 'info', message: 'Login successful. Welcome back!' });
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('evalify_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(currentUser => {
      if (currentUser) {
        const newUser = { ...currentUser, ...updatedData };
        localStorage.setItem('evalify_user', JSON.stringify(newUser));
        return newUser;
      }
      return null;
    });
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout, updateUser }), [user, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route 
            path="/*"
            element={
              user ? (
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<VerifierPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}

export default App;