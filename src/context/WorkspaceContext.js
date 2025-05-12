import React, { createContext, useContext } from 'react';
import { useAuth } from '../utils/AuthContext';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const { 
    partnerDetails, 
    selectedPartnerIndex, 
    currentPartner,
    changePartner 
  } = useAuth();

  return (
    <WorkspaceContext.Provider
      value={{
        partnerDetails,
        selectedPartnerIndex,
        currentWorkspace: currentPartner,
        changeWorkspace: changePartner
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}; 