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

  // Helper function to navigate to a specific module detail page with state
  const navigateToModule = (slug, options = {}) => {
    const moduleUrl = getModuleUrl(slug);
    const navigationOptions = {
      state: {
        from: location.pathname,
        ...options.state
      },
      replace: options.replace || false,
      ...options
    };
    navigate(moduleUrl, navigationOptions);
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

  // Get current tab from URL with enhanced module detection
  const getCurrentTab = () => {
    // Handle module detail routes (/modules/{slug}) - keep modules tab active
    if (location.pathname.startsWith('/modules/')) {
      return 'modules';
    }
    return pathToTab[location.pathname] || 'introduction';
  };

  // Helper function to validate if a module slug exists
  const isValidModuleSlug = (slug) => {
    try {
      // This would need to import modulesConfig, but to avoid circular dependencies,
      // we'll validate format only here and let components handle existence
      return slug && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
    } catch {
      return false;
    }
  };

  // Helper function to get browser navigation capabilities
  const getNavigationState = () => {
    return {
      canGoBack: window.history && window.history.length > 1,
      canGoForward: false, // Not directly available in browser API
      currentPath: location.pathname,
      hasState: !!location.state,
    };
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
    // Enhanced navigation helpers
    isValidModuleSlug,
    getNavigationState,
    location,
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};
