import React from 'react';
import { ENV, DEBUG, FEATURES } from '../config/environment';

/**
 * Environment Badge Component
 *
 * Displays a badge indicating the current environment (DEV/PROD)
 * Only visible in development mode or when debug is enabled
 */
const EnvironmentBadge = () => {
  // Don't render if the environment badge feature is disabled
  if (!FEATURES.showEnvironmentBadge) {
    return null;
  }

  // Determine badge styling based on environment
  const badgeStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 9999,
    color: 'white',
    backgroundColor: ENV === 'production' ? '#10b981' : '#f59e0b',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={badgeStyle}>
      {ENV.toUpperCase()}
      {DEBUG && ENV === 'production' && (
        <span style={{ marginLeft: '4px' }}>(DEBUG)</span>
      )}
    </div>
  );
};

export default EnvironmentBadge;
