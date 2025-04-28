import React, { createContext, useState, useContext } from 'react';

// Create a context for the tab state
export const TabContext = createContext();

// Custom hook to use the tab context
export const useTabContext = () => useContext(TabContext);

// Provider component for TabContext
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('introduction');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};