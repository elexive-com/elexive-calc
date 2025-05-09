/**
 * PDF Icon Utilities
 * 
 * This file contains utility functions for handling icons in PDF rendering.
 * Since React-PDF doesn't support Font Awesome icons directly, we use:
 * 1. PNG image references for high-quality icons that work reliably in PDFs
 * 2. Unicode symbols as a fallback that will render consistently across different PDF viewers
 */

/**
 * Returns the path to the module type icon
 * @param {string} type - The module type (insightPrimer or integratedExecution)
 * @param {boolean} useImage - Whether to use PNG images (true) or Unicode fallbacks (false)
 * @returns {string} Either a path to a PNG icon or a Unicode symbol
 */
export const getModuleTypeIcon = (type, useImage = true) => {
  if (useImage) {
    // Using window.location.origin ensures we have an absolute URL that works in the PDF
    return `${window.location.origin}/layer-group-solid-512.png`;
  }
  // Fallback to Unicode symbols
  return type === 'insightPrimer' ? '💡' : '⚙️';
};

/**
 * Returns the path to the pillar icon
 * @param {string} pillar - The pillar name
 * @returns {string} Path to a PNG icon
 */
export const getPillarIcon = (pillar) => {
  // Return paths to your PNG icons
  switch(pillar.toLowerCase()) {
    case 'transformation': return '/layer-group-solid-512.png';
    case 'strategy': return '/layer-group-solid-512.png'; 
    case 'technology': return '/layer-group-solid-512.png';
    case 'discovery': return '/layer-group-solid-512.png';
    case 'catalyst': return '/layer-group-solid-512.png';
    default: return '/layer-group-solid-512.png';
  }
};

/**
 * Returns the path to the engagement model icon
 * @param {string} model - The engagement model name
 * @param {boolean} useImage - Whether to use PNG images (true) or Unicode fallbacks (false)
 * @returns {string} Either a path to a PNG icon or a Unicode symbol
 */
export const getEngagementModelIcon = (model, useImage = true) => {
  if (useImage) {
    // Using window.location.origin ensures we have an absolute URL that works in the PDF
    return `${window.location.origin}/layer-group-solid-512.png`;
  }
  
  // Fallback to Unicode symbols
  switch(model.toLowerCase()) {
    case 'insight primer': return '💡';
    case 'integrated execution': return '⚙️';
    default: return '📊';
  }
};
