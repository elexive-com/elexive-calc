import React, { createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Create a context for router integration
export const RouterContext = createContext();

// Custom hook to use the router context
export const useRouterContext = () => useContext(RouterContext);

// Provider component that provides router utilities
export const RouterProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map tab names to URL paths
  const tabToPath = {
    'introduction': '/',
    'calculator': '/calculator',
    'modules': '/modules',
    'journey': '/journey'
  };

  // Map URL paths to tab names
  const pathToTab = {
    '/': 'introduction',
    '/calculator': 'calculator',
    '/modules': 'modules',
    '/journey': 'journey'
  };

  // Function to navigate to a specific tab/route
  const navigateToTab = (tab) => {
    const path = tabToPath[tab];
    if (path) {
      navigate(path);
    }
  };

  // Function to navigate to a specific path
  const navigateToPath = (path) => {
    navigate(path);
  };

  // Get current tab from URL
  const getCurrentTab = () => {
    return pathToTab[location.pathname] || 'introduction';
  };

  const contextValue = {
    currentPath: location.pathname,
    getCurrentTab,
    navigateToTab,
    navigateToPath,
    pathToTab,
    tabToPath
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};
