import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * ApproachContent Component
 *
 * Displays what makes our approach different
 */
const ApproachContent = ({ approach }) => {
  if (!approach?.differentiators) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-elx-accent bg-opacity-20 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faStar} className="text-elx-accent text-sm" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            What Makes Us Different
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {approach.differentiators}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApproachContent;
