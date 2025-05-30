// Helper functions for PDF generation processes like creating temporary elements
// and cleaning up DOM elements.

/**
 * Creates a temporary div for rendering PDF content off-screen
 * @param {number} width - Width of the div in pixels
 * @param {number} height - Height of the div in pixels (optional)
 * @return {HTMLElement} - The created div element
 */
export const createTemporaryDiv = (width = 794, height = null) => {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.width = `${width}px`;
  if (height) {
    div.style.height = `${height}px`;
  }
  div.style.backgroundColor = 'white';
  document.body.appendChild(div);
  return div;
};

/**
 * Formats a number with thousand separators and optional decimal places
 * @param {number} num - The number to format
 * @param {number} decimalPlaces - Number of decimal places to display (default: 0)
 * @return {string} - The formatted number as a string
 */
export const formatNumberWithDecimals = (num, decimalPlaces = 0) => {
  if (num === undefined || num === null) return '0';
  
  // Format with the specified number of decimal places
  const fixedNum = Number(num).toFixed(decimalPlaces);
  
  // Split into integer and decimal parts
  const parts = fixedNum.split('.');
  
  // Add thousand separators to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join back with decimal part if it exists
  return parts.length > 1 ? parts.join('.') : parts[0];
};

/**
 * Sets HTML content for a temporary div
 * @param {HTMLElement} div - The div to populate with content
 * @param {string} htmlContent - The HTML content to set
 * @return {Promise} - Promise that resolves when images are loaded
 */
export const setDivContent = (div, htmlContent) => {
  if (!div) return Promise.resolve();
  
  // Set content using innerHTML
  div.innerHTML = htmlContent;
  
  // Process any images to ensure they are loaded
  const images = div.querySelectorAll('img');
  if (images.length > 0) {
    // Return a promise that resolves when all images are loaded
    return Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to prevent hanging
      });
    }));
  }
  
  return Promise.resolve();
};

/**
 * Removes a temporary element from the DOM
 * @param {HTMLElement} element - The element to remove
 */
export const cleanupElement = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// Base64 placeholder images for PDF components
// These can be replaced with actual images when needed
export const PLACEHOLDER_IMAGES = {
  LOGO: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  MODULE_ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  GENERIC_ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};