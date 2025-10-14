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

  const getVariantTheme = variant => {
    if (variant.type === 'Insight Primer') {
      return {
        accent: '#D97706',
        badge: 'Fixed scope • 2–4 weeks',
      };
    }

    if (variant.type === 'Integrated Execution') {
      return {
        accent: '#1D4ED8',
        badge: 'Flexible engagement',
      };
    }

    return {
      accent: '#334155',
      badge: null,
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Engagement Models
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant, index) => {
          const variantTheme = getVariantTheme(variant);

          return (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              {variantTheme.badge && (
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3 inline-flex px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${variantTheme.accent}14`,
                    color: variantTheme.accent,
                  }}
                >
                  {variantTheme.badge}
                </p>
              )}
              <div className="flex items-start space-x-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: `${variantTheme.accent}1a`,
                    color: variantTheme.accent,
                  }}
                >
                  <FontAwesomeIcon
                    icon={getVariantIcon(variant)}
                    className="text-lg"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {variant.type}
                  </h4>

                  <div className="mt-2 mb-3 space-y-1">
                    <span className="text-xl font-semibold text-gray-900">
                      {formatEvcValue(variant)}
                    </span>
                    {variant.isFlexible && (
                      <div className="text-xs text-gray-500">
                        Recommended: {variant.recommendedEvcPerWeek} EVCs/week
                      </div>
                    )}
                  </div>

                  {variant.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {variant.description}
                    </p>
                  )}

                  {variant.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                      <span>{variant.duration}</span>
                    </div>
                  )}

                  {variant.deliverables && variant.deliverables.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        Key Deliverables
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {variant.deliverables.map((deliverable, delIndex) => (
                          <li
                            key={delIndex}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
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
                          Scaling Factors
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {variant.scalingFactors.map((factor, factorIndex) => (
                            <li
                              key={factorIndex}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
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
          );
        })}
      </div>
    </div>
  );
};

export default EngagementModels;
