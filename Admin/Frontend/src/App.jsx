import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { authAPI, sessionUtils } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    console.log('🔍 Checking for existing session...');
    
    if (sessionUtils.isSessionValid()) {
      const savedUser = sessionUtils.getCurrentUser();
      console.log('✅ Valid session found:', {
        user: savedUser?.name,
        email: savedUser?.email,
        loginTime: savedUser?.loginTime,
        sessionData: savedUser
      });
      
      if (savedUser) {
        setUser(savedUser);
        console.log('🚀 User restored from session, redirecting to dashboard');
      } else {
        console.log('❌ Session data corrupted, clearing session');
        sessionUtils.clearSession();
      }
    } else {
      console.log('❌ No valid session found, user needs to login');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('🔐 Login successful! Processing user data...');
    console.log('📋 User Data:', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      id: userData.id,
      loginTime: userData.loginTime,
      fullData: userData
    });
    
    // Store user in state (this will trigger redirect)
    setUser(userData);
    
    // Store in session storage
    sessionStorage.setItem('mangrove_admin_user', JSON.stringify(userData));
    console.log('💾 Session stored in sessionStorage');
    
    // Log session storage contents
    console.log('🗄️ Current sessionStorage contents:', {
      user: sessionStorage.getItem('mangrove_admin_user'),
      token: sessionStorage.getItem('mangrove_session_token')
    });
    
    console.log('🚀 Redirecting to dashboard...');
  };

  const handleLogout = async () => {
    console.log('🚪 Logout initiated...');
    
    try {
      // Call the logout API to clear server-side session
      console.log('📡 Calling logout API...');
      const result = await authAPI.adminLogout();
      console.log('✅ Logout API response:', result);
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and storage
      console.log('🧹 Clearing session data...');
      setUser(null);
      sessionUtils.clearSession();
      console.log('✅ Logout complete, redirecting to login');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Mangrove Watch...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
