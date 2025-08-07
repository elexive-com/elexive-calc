/**
 * Environment Configuration
 *
 * Centralized access to environment variables with sensible defaults.
 * - ENV: Current environment (production, development)
 * - DEBUG: Debug mode flag for additional logging and features
 */

// Get environment or default to development
export const ENV =
  process.env.REACT_APP_ENV ||
  window.env?.VITE_ENV ||
  (window.location.hostname === 'localhost' ? 'development' : 'production');

// Debug mode - true for development, or when explicitly enabled
export const DEBUG =
  process.env.REACT_APP_DEBUG === 'true' ||
  window.env?.VITE_DEBUG === 'true' ||
  ENV === 'development';

// Check if we're in production environment
export const isProduction = ENV === 'production';

/**
 * Debug logging function
 * Only logs when DEBUG is true
 *
 * @param {...any} args - Arguments to log
 */
export const debugLog = (...args) => {
  if (DEBUG) {
    console.log(`[${ENV.toUpperCase()}]`, ...args);
  }
};

/**
 * Feature flag utility
 * Enable/disable features based on environment
 */
export const FEATURES = {
  // Features always enabled in development, configurable in production
  showDebugInfo: DEBUG,
  detailedLogging: DEBUG,

  // Features always enabled in production, configurable in development
  analytics: isProduction,

  // Always show environment badge in non-production environments
  showEnvironmentBadge: !isProduction || DEBUG,
};
