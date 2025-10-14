import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faTools, faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * ApproachContent Component
 *
 * Displays methodology, framework, and differentiators
 */
const ApproachContent = ({ approach }) => {
  if (!approach) return null;

  return (
    <div className="space-y-6">
      {approach.methodology && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCogs} className="text-green-600 text-sm" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Our Methodology
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {approach.methodology}
            </p>
          </div>
        </div>
      )}

      {approach.framework && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faTools}
              className="text-purple-600 text-sm"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Framework & Tools
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {approach.framework}
            </p>
          </div>
        </div>
      )}

      {approach.differentiators && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-elx-accent bg-opacity-20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faStar}
              className="text-elx-accent text-sm"
            />
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
      )}
    </div>
  );
};

export default ApproachContent;
