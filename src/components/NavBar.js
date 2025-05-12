import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { Avatar, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ROUTES, ANIMATION } from '../utils/constants';

const NavBar = () => {
  const { userData, logout } = useAuth();
  const { partnerDetails, selectedPartnerIndex, changeWorkspace, currentWorkspace } = useWorkspace();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const workspaceDropdownRef = useRef(null);

  // Define navigation links
  const navLinks = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-1" /> },
    { to: ROUTES.ASSESSMENTS, label: 'Assessments', icon: <AssignmentIcon className="w-5 h-5 mr-1" /> },
    { to: ROUTES.USERS, label: 'Users', icon: <PeopleIcon className="w-5 h-5 mr-1" /> },
    { to: ROUTES.PROFILE, label: 'Profile', icon: <SettingsIcon className="w-5 h-5 mr-1" /> }
  ];

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  // Mobile menu toggle
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setWorkspaceDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasMultipleWorkspaces = partnerDetails && partnerDetails.length > 1;

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand as Workspace Dropdown */}
          <div className="flex-shrink-0" ref={workspaceDropdownRef}>
            <button 
              onClick={() => hasMultipleWorkspaces && setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className={`flex items-center focus:outline-none ${hasMultipleWorkspaces ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
            >
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-2">
                <span className="text-lg font-bold text-indigo-600">
                  {currentWorkspace?.name?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">
                  {currentWorkspace?.name || 'Partner Portal'}
                </span>
                {hasMultipleWorkspaces && (
                  <KeyboardArrowDownIcon className="ml-1 h-5 w-5 text-indigo-100" />
                )}
              </div>
            </button>
            
            {/* Workspace Dropdown Menu */}
            {workspaceDropdownOpen && hasMultipleWorkspaces && (
              <div className={`absolute mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${ANIMATION.FADE_IN}`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    Select Workspace
                  </p>
                </div>
                {partnerDetails.map((partner, index) => (
                  <button
                    key={partner.id || index}
                    onClick={() => {
                      changeWorkspace(index);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className={`w-full text-left block px-4 py-2 text-sm ${
                      index === selectedPartnerIndex 
                        ? 'bg-indigo-50 text-indigo-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors duration-150`}
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-md bg-indigo-100 flex items-center justify-center mr-2">
                        <span className="text-sm font-medium text-indigo-600">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                      <span>{partner.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300 ease-in-out relative ${
                    isActive(link.to)
                      ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:transition-all after:duration-300 after:ease-in-out'
                      : 'text-indigo-100 hover:text-white hover:bg-indigo-600/20'
                  }`}
                >
                  <span className={`flex items-center transform transition-transform duration-300 ${isActive(link.to) ? 'scale-105' : ''}`}>
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {/* User dropdown */}
              <div className="ml-3 relative" ref={dropdownRef}>
                <IconButton
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="bg-indigo-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white p-1"
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="h-8 w-8 bg-indigo-600 border-2 border-indigo-400">
                    {userData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </Avatar>
                </IconButton>
                
                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${ANIMATION.FADE_IN}`}>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userData?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData?.email}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <IconButton
              className="text-indigo-200 hover:text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              onClick={toggleMobileMenu}
              size="large"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <MenuIcon className="block h-6 w-6 text-white" />
              ) : (
                <CloseIcon className="block h-6 w-6 text-white" />
              )}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className={`md:hidden bg-indigo-800 ${ANIMATION.SLIDE_DOWN}`}>
        

          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium relative transition-all duration-300 ${
                  isActive(link.to)
                    ? 'text-white  after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-white after:transition-all after:duration-300'
                    : 'text-indigo-100 hover:text-white hover:bg-indigo-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={`flex items-center transform transition-transform duration-300 ${isActive(link.to) ? 'scale-105 font-bold' : ''}`}>
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 bg-indigo-600 border-2 border-indigo-400">
                  {userData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{userData?.name}</div>
                <div className="text-sm font-medium text-indigo-300">{userData?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-700 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 