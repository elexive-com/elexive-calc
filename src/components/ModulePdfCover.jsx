import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faRocket } from '@fortawesome/free-solid-svg-icons';

/**
 * ModulePdfCover component
 * 
 * Creates a well-formatted cover page for PDF exports of module details.
 * Features a full-brand background and centered module name in large caps.
 * This is designed to be rendered and captured by html2canvas for PDF generation.
 */
const ModulePdfCover = ({ module, today = new Date() }) => {
  if (!module) return null;
  
  return (
    <div className="module-pdf-cover bg-elx-primary text-white w-full h-full min-h-[842px] absolute inset-0 flex flex-col" style={{ margin: 0, padding: 0 }}>
      {/* Content container with padding */}
      <div className="p-8 flex flex-col h-full">
        {/* Header with logo and date */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <img 
              src="/elexive-logo-text.png" 
              alt="Elexive Consulting" 
              className="h-10 filter brightness-0 invert"
            />
          </div>
          <div className="text-white text-sm opacity-80">
            Generated on {today.toLocaleDateString()}
          </div>
        </div>
        
        {/* Centered module name and info */}
        <div className="flex-grow flex flex-col items-center justify-center text-center px-8">
          
          
          {/* Module name */}
          <h1 className="text-4xl font-bold mb-8 uppercase tracking-wide">
            {module.name}
          </h1>
          
          {/* Module description */}
          <p className="text-lg mb-12 max-w-2xl opacity-90">
            {module.description}
          </p>
          
        
        </div>
      </div>
    </div>
  );
};

export default ModulePdfCover;