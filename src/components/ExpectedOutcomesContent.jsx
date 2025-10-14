import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faChartBar,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

/**
 * ExpectedOutcomesContent Component
 *
 * Displays expected outcomes, success metrics, and timeline
 */
const ExpectedOutcomesContent = ({ outcomes }) => {
  if (!outcomes) return null;

  return (
    <div className="space-y-6">
      {outcomes.outcomes && outcomes.outcomes.length > 0 && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faBullseye}
              className="text-green-600 text-sm"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-3">
              Expected Outcomes
            </h4>
            <ul className="space-y-2">
              {outcomes.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {outcomes.metrics && outcomes.metrics.length > 0 && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faChartBar}
              className="text-blue-600 text-sm"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-3">
              Success Metrics
            </h4>
            <ul className="space-y-2">
              {outcomes.metrics.map((metric, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {outcomes.timeline && (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faClock}
              className="text-orange-600 text-sm"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Timeline to Results
            </h4>
            <p className="text-gray-700 leading-relaxed">{outcomes.timeline}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpectedOutcomesContent;
