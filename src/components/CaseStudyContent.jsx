import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faExclamationCircle,
  faLightbulb,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

/**
 * CaseStudyContent Component
 *
 * Displays client success story with challenge, solution, and results
 */
const CaseStudyContent = ({ caseStudy }) => {
  if (!caseStudy) return null;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200">
      <div className="space-y-6">
        {caseStudy.clientType && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-gray-600 text-sm"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Client Profile
              </h4>
              <p className="text-gray-700">{caseStudy.clientType}</p>
            </div>
          </div>
        )}

        {caseStudy.challenge && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-red-600 text-sm"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                The Challenge
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
          </div>
        )}

        {caseStudy.solution && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faLightbulb}
                className="text-blue-600 text-sm"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Our Solution</h4>
              <p className="text-gray-700 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </div>
        )}

        {caseStudy.results && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-green-600 text-sm"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Results Achieved
              </h4>
              <p className="text-gray-700 leading-relaxed font-medium">
                {caseStudy.results}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudyContent;
