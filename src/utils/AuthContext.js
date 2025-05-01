import React, { createContext, useState, useContext, useEffect } from 'react';
import { partner } from '../data/dummyPartner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setCurrentPartner(partner);
    }
    setLoading(false);
  }, []);

  // Login function - validates phone and password against dummy partner data
  const login = (phone, password) => {
    if (phone === partner.phone && password === partner.password) {
      setIsAuthenticated(true);
      setCurrentPartner(partner);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPartner(null);
    localStorage.removeItem('isAuthenticated');
  };

  // Reset password function (simulated)
  const resetPassword = (phone, otp) => {
    // In a real implementation, this would verify the OTP against the server
    // For this demo, we'll accept a hardcoded OTP
    if (phone === partner.phone && otp === '123456') {
      return true;
    }
    return false;
  };

  // Set new password function (simulated)
  const setNewPassword = (newPassword) => {
    // In a real implementation, this would update the password on the server
    // For this demo, we'll just simulate success
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        currentPartner, 
        login, 
        logout, 
        resetPassword, 
        setNewPassword,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 