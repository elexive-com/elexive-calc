import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faCheckCircle,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

/**
 * ImplementationContent Component
 *
 * Displays implementation phases and key milestones
 */
const ImplementationContent = ({ implementation }) => {
  if (!implementation) return null;

  return (
    <div className="space-y-6">
      {implementation.phases && implementation.phases.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-elx-primary mr-2"
            />
            Implementation Phases
          </h4>
          <div className="space-y-4">
            {implementation.phases.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-elx-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {phase.name}
                      </h5>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {phase.duration}
                      </span>
                    </div>
                    {phase.activities && phase.activities.length > 0 && (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {phase.activities.map((activity, actIndex) => (
                          <li
                            key={actIndex}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {index < implementation.phases.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {implementation.keyMilestones &&
        implementation.keyMilestones.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-600 mr-2"
              />
              Key Milestones
            </h4>
            <ul className="space-y-3">
              {implementation.keyMilestones.map((milestone, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-green-600 mt-1 text-sm"
                  />
                  <span className="text-gray-700">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export default ImplementationContent;
