import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faLightbulb,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

/**
 * BusinessChallengeContent Component
 *
 * Displays business challenge, opportunity, and market context
 */
const BusinessChallengeContent = ({ challenge }) => {
  if (!challenge) return null;

  return (
    <div className="space-y-6">
      {challenge.problem && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-600 text-sm"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
            <p className="text-gray-700 leading-relaxed">{challenge.problem}</p>
          </div>
        </div>
      )}

      {challenge.opportunity && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faLightbulb}
              className="text-yellow-600 text-sm"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              The Opportunity
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {challenge.opportunity}
            </p>
          </div>
        </div>
      )}

      {challenge.marketContext && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-blue-600 text-sm"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Market Context</h4>
            <p className="text-gray-700 leading-relaxed">
              {challenge.marketContext}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessChallengeContent;
