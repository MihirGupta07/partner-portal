import React, { createContext, useState, useContext, useEffect } from 'react';
import { API } from './constants';
import { authService } from './apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [partnerDetails, setPartnerDetails] = useState([]);
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Get the currently selected partner
  const currentPartner = partnerDetails[selectedPartnerIndex] || null;

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedToken = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    const storedPartnerDetails = localStorage.getItem('partnerDetails');
    const storedPartnerIndex = localStorage.getItem('selectedPartnerIndex');

    if (storedAuth === 'true' && storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      
      if (storedPartnerDetails) {
        const partners = JSON.parse(storedPartnerDetails);
        setPartnerDetails(partners);
        
        // Set selected partner index (default to 0 if not found)
        if (storedPartnerIndex !== null) {
          const index = parseInt(storedPartnerIndex, 10);
          setSelectedPartnerIndex(isNaN(index) ? 0 : index);
        }
      }
    }
    setLoading(false);
  }, []);

  // Change the selected partner
  const changePartner = (index) => {
    if (index >= 0 && index < partnerDetails.length) {
      setSelectedPartnerIndex(index);
      localStorage.setItem('selectedPartnerIndex', index.toString());
    }
  };

  // Login function - uses the API service to authenticate
  const login = async (identifier, password) => {
    try {
      const response = await authService.login(identifier, password);
      if (response.success && response.data) {
        const { accessToken: token, partnerDetails: partners, ...user } = response.data;
        
        // Set authentication state
        setIsAuthenticated(true);
        setToken(token);
        
        // Store user data
        setUserData(user);
        
        // Store partner details
        const partnerList = partners || [user]; // If no partnerDetails, create array with single partner
        setPartnerDetails(partnerList);
        
        // Default to first partner
        setSelectedPartnerIndex(0);
        
        // Store in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('partnerDetails', JSON.stringify(partnerList));
        localStorage.setItem('selectedPartnerIndex', '0');
        
        return { success: true };
      } else if (response.accessToken) {
        // fallback for different API response structure
        const { accessToken: token, partnerDetails: partners, ...user } = response;
        
        setIsAuthenticated(true);
        setToken(token);
        
        // Store user data
        setUserData(user);
        
        // Store partner details
        const partnerList = partners || [user]; // If no partnerDetails, create array with single partner
        setPartnerDetails(partnerList);
        
        // Default to first partner
        setSelectedPartnerIndex(0);
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('partnerDetails', JSON.stringify(partnerList));
        localStorage.setItem('selectedPartnerIndex', '0');
        
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setPartnerDetails([]);
    setSelectedPartnerIndex(0);
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('partnerDetails');
    localStorage.removeItem('selectedPartnerIndex');
  };

  // Reset password function (would need to be implemented with actual API)
  const resetPassword = async (email) => {
    // This would call an actual password reset API endpoint
    // For now, we'll just simulate success
    return { success: true, message: 'Password reset instructions sent to your email' };
  };

  // Set new password function (would need to be implemented with actual API)
  const setNewPassword = async (token, newPassword) => {
    // This would call an actual set new password API endpoint
    // For now, we'll just simulate success
    return { success: true, message: 'Password has been updated successfully' };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated,
        userData,
        partnerDetails,
        currentPartner,
        selectedPartnerIndex,
        changePartner,
        token,
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