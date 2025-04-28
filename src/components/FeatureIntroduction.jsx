import React from 'react';

/**
 * A reusable CEO-friendly introduction component
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the introduction
 * @param {string|React.ReactNode} props.description - The description text or component
 * @param {string|React.ReactNode} props.additionalInfo - Additional information (optional)
 */
const FeatureIntroduction = ({ 
  title, 
  description, 
  additionalInfo,
}) => {
  return (
    <div className="elx-feature-intro mb-8 relative overflow-hidden">
      {/* Background with stronger primary color */}
      <div className="absolute inset-0 bg-elx-primary opacity-80"></div>
      
      {/* Main background with stronger contrast */}
      <div className="absolute inset-0 bg-[#EEF2F6] opacity-95"></div>
      
      {/* Decorative accents */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-elx-primary"></div>
      
      {/* Content container with increased padding for prominence */}
      <div className="relative p-6 sm:p-7">
        <div>
          <div className="flex-1">
            {/* Title with larger text and stronger styling */}
            <div className="relative pb-1 mb-3">
              <h3 className="font-bold text-elx-primary text-xl">
                {title}
              </h3>
              <span className="absolute -bottom-1 left-0 w-24 h-1.5 bg-elx-accent"></span>
            </div>
            
            {/* Description with better contrast */}
            {typeof description === 'string' ? (
              <p className="text-elx-primary text-sm mb-3 leading-relaxed font-medium">
                {description}
              </p>
            ) : (
              description
            )}
            
            {/* Additional info with enhanced styling */}
            {additionalInfo && typeof additionalInfo === 'string' ? (
              <div className="mt-4 pt-3 bg-white bg-opacity-70 p-3 rounded-lg border-l-4 border-elx-accent">
                <p className="text-elx-primary text-sm font-medium">
                  {additionalInfo}
                </p>
              </div>
            ) : (
              additionalInfo
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureIntroduction;