import React from 'react';
import NavBar from './NavBar';

// Higher Order Component that wraps components with the navbar
const withNavbar = (WrappedComponent) => {
  const WithNavbarComponent = (props) => {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50">
          <NavBar />
        </div>
        
        {/* Component Content */}
        <div className="flex-grow">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  // Set display name for debugging purposes
  WithNavbarComponent.displayName = `WithNavbar(${getDisplayName(WrappedComponent)})`;
  
  return WithNavbarComponent;
};

// Helper function to get component display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withNavbar; 