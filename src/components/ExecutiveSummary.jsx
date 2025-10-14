import React from 'react';

/**
 * ExecutiveSummary Component
 *
 * Displays the executive summary and business value - always visible in solution brief
 */
const ExecutiveSummary = ({ module }) => {
  if (!module) return null;

  return (
    <div className="bg-gradient-to-r from-elx-bg to-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
      <div className="max-w-4xl">
        <h2 className="text-xl font-bold text-elx-primary mb-4">
          Executive Summary
        </h2>

        {module.executiveSummary && (
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            {module.executiveSummary}
          </p>
        )}

        {module.businessValue && (
          <div className="bg-white p-4 rounded-md border-l-4 border-elx-accent">
            <h3 className="font-semibold text-elx-primary mb-2">
              Expected Business Value
            </h3>
            <p className="text-gray-700">{module.businessValue}</p>
          </div>
        )}

        {/* Fallback to existing description if no executive summary */}
        {!module.executiveSummary && module.description && (
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            {module.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExecutiveSummary;
