import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faLightbulb,
  faSliders,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

/**
 * EngagementModels Component
 *
 * Displays module variants as complementary engagement approaches
 */
const EngagementModels = ({ variants, onSelectVariant }) => {
  if (!variants || variants.length === 0) return null;

  const formatEvcValue = variant => {
    if (variant.isFlexible) {
      return `Starting from ${variant.minEvcPerWeek} EVCs/week`;
    }
    return `${variant.evcValue} EVCs`;
  };

  const getVariantIcon = variant => {
    if (variant.type === 'Insight Primer') return faLightbulb;
    if (variant.type === 'Integrated Execution') return faRocket;
    return faSliders;
  };

  const getVariantColor = variant => {
    if (variant.type === 'Insight Primer')
      return 'border-yellow-300 bg-yellow-50';
    if (variant.type === 'Integrated Execution')
      return 'border-blue-300 bg-blue-50';
    return 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-elx-primary mb-6">
        Engagement Models
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border-2 ${getVariantColor(variant)} hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <FontAwesomeIcon
                  icon={getVariantIcon(variant)}
                  className="text-elx-primary text-lg"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {variant.type}
                </h4>

                <div className="mb-3">
                  <span className="text-2xl font-bold text-elx-primary">
                    {formatEvcValue(variant)}
                  </span>
                  {variant.isFlexible && (
                    <div className="text-sm text-gray-600 mt-1">
                      Recommended: {variant.recommendedEvcPerWeek} EVCs/week
                    </div>
                  )}
                </div>

                {variant.description && (
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {variant.description}
                  </p>
                )}

                {variant.duration && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    <span>{variant.duration}</span>
                  </div>
                )}

                {variant.deliverables && variant.deliverables.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Deliverables:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {variant.deliverables.map((deliverable, delIndex) => (
                        <li
                          key={delIndex}
                          className="flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 bg-elx-primary rounded-full"></span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {variant.scalingFactors &&
                  variant.scalingFactors.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Scaling Factors:
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {variant.scalingFactors.map((factor, factorIndex) => (
                          <li
                            key={factorIndex}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {onSelectVariant && (
                  <button
                    onClick={() => onSelectVariant(variant)}
                    className="w-full mt-4 px-4 py-2 bg-elx-primary text-white rounded-md hover:bg-elx-accent transition-colors duration-200 text-sm font-medium"
                  >
                    Select {variant.type}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementModels;
