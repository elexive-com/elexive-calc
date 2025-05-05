// Simplified PDF renderer that works reliably with React 18
import React from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import modulesConfig from '../config/modulesConfig.json';
import ModuleCoverPage from './components/ModuleCoverPage';
import ModuleContentPage from './components/ModuleContentPage';
import { debugLog } from '../config/environment';

// PDF Document Component
const ModuleDocument = ({ moduleName }) => {
  return (
    <Document>
      <ModuleCoverPage moduleName={moduleName} />
      <ModuleContentPage moduleName={moduleName} />
    </Document>
  );
};

/**
 * Generate PDF for a module
 * @param {string} moduleName - Name of the module to generate PDF for
 * @returns {Promise} - Promise that resolves when PDF is generated
 */
export const generateModulePdf = async (moduleName) => {
  try {
    // Find module data to validate it exists
    const module = modulesConfig.modules.find(m => m.name === moduleName);
    if (!module) {
      console.error(`Module "${moduleName}" not found`);
      return { success: false, error: `Module "${moduleName}" not found` };
    }
    
    debugLog(`Generating PDF for module: ${moduleName}`);
    
    // Create document
    const blob = await pdf(<ModuleDocument moduleName={moduleName} />).toBlob();
    
    // Create filename
    const filename = `elexive-module-${module.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    
    // Save file
    saveAs(blob, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return { 
      success: false, 
      error: error.message || 'PDF generation failed'
    };
  }
};