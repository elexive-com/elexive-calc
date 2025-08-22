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
    introduction: '/',
    calculator: '/calculator',
    modules: '/modules',
    journey: '/journey',
  };

  // Map URL paths to tab names
  const pathToTab = {
    '/': 'introduction',
    '/calculator': 'calculator',
    '/modules': 'modules',
    '/journey': 'journey',
  };

  // Function to navigate to a specific tab/route
  const navigateToTab = tab => {
    const path = tabToPath[tab];
    if (path) {
      navigate(path);
    }
  };

  // Function to navigate to a specific path
  const navigateToPath = path => {
    navigate(path);
  };

  // Helper function to generate module detail URL from slug
  const getModuleUrl = slug => {
    return `/modules/${slug}`;
  };

  // Helper function to navigate to a specific module detail page
  const navigateToModule = slug => {
    const moduleUrl = getModuleUrl(slug);
    navigate(moduleUrl);
  };

  // Helper function to check if current route is a module detail page
  const isModuleDetailRoute = () => {
    return (
      location.pathname.startsWith('/modules/') &&
      location.pathname !== '/modules'
    );
  };

  // Helper function to extract module slug from current URL
  const getCurrentModuleSlug = () => {
    if (isModuleDetailRoute()) {
      return location.pathname.replace('/modules/', '');
    }
    return null;
  };

  // Get current tab from URL
  const getCurrentTab = () => {
    // Handle module detail routes (/modules/{slug}) - keep modules tab active
    if (location.pathname.startsWith('/modules/')) {
      return 'modules';
    }
    return pathToTab[location.pathname] || 'introduction';
  };

  const contextValue = {
    currentPath: location.pathname,
    getCurrentTab,
    navigateToTab,
    navigateToPath,
    pathToTab,
    tabToPath,
    // Module-specific helper functions
    getModuleUrl,
    navigateToModule,
    isModuleDetailRoute,
    getCurrentModuleSlug,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};
