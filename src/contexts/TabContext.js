import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for the tab state
export const TabContext = createContext();

// Custom hook to use the tab context
export const useTabContext = () => useContext(TabContext);

// Provider component for TabContext
export const TabProvider = ({ children }) => {
  // Initialize tab based on current URL path
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const pathToTab = {
        '/': 'introduction',
        '/calculator': 'calculator',
        '/modules': 'modules',
      };
      return pathToTab[path] || 'introduction';
    }
    return 'introduction';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Listen to browser navigation events (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pathToTab = {
        '/': 'introduction',
        '/calculator': 'calculator',
        '/modules': 'modules',
      };
      const newTab = pathToTab[path] || 'introduction';
      setActiveTab(newTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};
