// Helper functions for extracting colors from CSS variables and handling color logic
// for PDF generation. This centralizes all color-related code to avoid hardcoding
// hex values throughout the PDF rendering components.
import { debugLog } from '../../config/environment';

/**
 * Extracts a CSS variable value from the document root
 * @param {string} varName - CSS variable name (e.g., '--elexive-primary')
 * @param {string} fallback - Fallback color to use if the variable isn't found
 * @return {string} - The color value
 */
export const getColorFromCssVar = (varName, fallback = '#000000') => {
  // For react-pdf, we need a fallback approach since it runs in a different context
  // where document may not be available
  try {
    if (typeof document !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      const value = styles.getPropertyValue(varName).trim();
      if (value) return value;
    }
  } catch (err) {
    debugLog('Error accessing document for CSS variable:', err);
  }
  
  // Fallback to hardcoded values if document is not available
  const cssVarMap = {
    '--elexive-primary': '#2E2266',
    '--elexive-secondary': '#FFBE59',
    '--elexive-accent': '#D99000'
  };
  
  return cssVarMap[varName] || fallback;
};

/**
 * Gets the color for a specific pillar
 * @param {string} pillarName - Name of the pillar (e.g., 'Transformation')
 * @return {string} - The color value for the pillar
 */
export const getPillarColor = (pillarName) => {
  const pillarColorMap = {
    'Transformation': '#D99000', // Amber/gold
    'Strategy': '#C85A30',      // Orange/rust
    'Technology': '#1F776D',    // Teal
    'Discovery': '#2E2266'      // Deep purple (primary)
  };
  return pillarColorMap[pillarName] || '#2E2266';
};

/**
 * Gets style information for a variant type
 * @param {string} variantType - Type of variant (e.g., 'Insight Primer')
 * @return {Object} - Style information for the variant
 */
export const getVariantStyles = (variantType) => {
  if (variantType === 'Insight Primer') {
    return {
      headerBg: '#EBF8FF',
      headerBorder: '#BEE3F8',
      iconBg: '#3182CE',
      titleColor: '#2C5282',
      icon: '💡'
    };
  }
  return {
    // Integrated Execution
    headerBg: '#F0FFF4',
    headerBorder: '#C6F6D5',
    iconBg: '#38A169',
    titleColor: '#276749',
    icon: '🚀'
  };
};