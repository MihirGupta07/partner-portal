import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  // Use a ref to store the callbacks array to avoid re-renders
  const callbacksRef = useRef([]);

  const openAssignModal = useCallback(() => {
    setIsAssignModalOpen(true);
  }, []);

  const closeAssignModal = useCallback(() => {
    setIsAssignModalOpen(false);
  }, []);

  const registerAssessmentCallback = useCallback((callback) => {
    // Add the callback if it's not already in the array
    if (callback && !callbacksRef.current.includes(callback)) {
      callbacksRef.current.push(callback);
    }
    
    // Return a function to unregister the callback when component unmounts
    return () => {
      callbacksRef.current = callbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const triggerAssessmentCallbacks = useCallback(() => {
    // Call all registered callbacks
    callbacksRef.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error executing assessment callback:', error);
      }
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isAssignModalOpen,
        openAssignModal,
        closeAssignModal,
        registerAssessmentCallback,
        triggerAssessmentCallbacks
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 