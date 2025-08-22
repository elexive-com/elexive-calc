import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faInfoCircle,
  faGears,
  faCheckCircle,
  faGraduationCap,
  faUserTie,
  faShieldAlt,
  faArrowRight,
  faLock,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const ServiceParameters = ({
  paymentOption,
  togglePaymentOption,
  parameters,
  updateParameter,
  productionCapacity,
}) => {
  // Get service parameters directly from config file instead of using defaultParameters
  const serviceParams = calculatorConfig.serviceParameters || [];

  // Helper function to calculate the EVC cost based on parameter type and current production capacity
  const calculateEvcCost = param => {
    if (!param.evcCost) return null;

    const { type, value } = param.evcCost;

    if (type === 'absolute') {
      return value;
    } else if (type === 'relative') {
      // Get the weeklyEVCs from the selected production capacity
      const weeklyEVCs =
        calculatorConfig.productionCapacity[productionCapacity]?.weeklyEVCs ||
        0;
      // Calculate relative value and round up to nearest integer
      return Math.ceil((weeklyEVCs * value) / 100);
    }

    return null;
  };

  // Helper function to get the appropriate icon for a parameter
  const getParameterIcon = param => {
    // Map known parameter IDs to specific icons
    const iconMap = {
      trainingSession: faGraduationCap,
      accountConcierge: faUserTie,
      premiumSLA: faShieldAlt,
    };

    // Return the mapped icon or default to faStar
    return iconMap[param.id] || faStar;
  };

  return (
    <div className="elx-card p-6 mb-6">
      <p className="text-gray-600 mb-8 max-w-3xl">
        These options allow you to customize your transformation experience to
        your unique business needs. Each parameter enhances specific aspects of
        your engagement to maximize value.
      </p>

      <div className="space-y-10">
        {/* Payment Option - Redesigned with clean UI */}
        <div>
          <h3 className="text-elx-primary font-medium mb-4 flex items-center">
            <div className="bg-elx-accent bg-opacity-10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-elx-accent"
              />
            </div>
            <span>Payment Option</span>
          </h3>

          <p className="text-gray-600 mb-5 max-w-3xl">
            Choose how you want to purchase your transformation capacity.
            Reserved capacity offers a discount for upfront commitment, while
            Pay-as-you-go provides maximum flexibility with standard pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(calculatorConfig.evcBase.paymentOptions).map(
              ([option, details]) => {
                const isSelected = paymentOption === option;
                const discount =
                  option === 'prepaid'
                    ? ((1 - details.priceModifier) * 100).toFixed(0)
                    : null;

                return (
                  <div
                    key={option}
                    onClick={() => togglePaymentOption(option)}
                    className={`flex flex-col rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 ${
                      isSelected
                        ? 'shadow-md scale-[1.02]'
                        : 'shadow-sm hover:shadow hover:scale-[1.01]'
                    }`}
                    style={{
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: isSelected
                        ? 'var(--elexive-accent)'
                        : '#e5e7eb',
                    }}
                  >
                    <div
                      className="px-4 py-3 flex items-center w-full"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--elexive-accent)'
                          : 'var(--elexive-primary)',
                        color: 'white',
                      }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center mr-2"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <FontAwesomeIcon
                          icon={option === 'prepaid' ? faLock : faCreditCard}
                          className="text-white"
                        />
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <h3 className="font-bold text-white text-sm">
                          {option === 'prepaid' ? 'Reserved' : details.name}
                        </h3>

                        {discount && (
                          <span className="bg-white bg-opacity-20 rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
                            {discount}% discount
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col h-full">
                      <p className="text-sm text-gray-600 mb-4 flex-grow">
                        {option === 'prepaid'
                          ? 'Lock in capacity at a lower price point with predictable budgeting. Ensures your strategic initiatives never face resource constraints while reducing overall transformation costs by 10%.'
                          : 'Maintain maximum financial flexibility with no upfront commitment. Ideal for uncertain transformation timelines or when allocating budget across multiple competing priorities.'}
                      </p>

                      <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {isSelected ? (
                            <span className="text-amber-600">Selected</span>
                          ) : (
                            <span className="text-elx-primary-light">
                              Select option
                            </span>
                          )}
                        </span>
                        {isSelected ? (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-amber-600"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-elx-primary-light"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Custom Service Parameters - Clean, modern card design */}
        <div>
          <h3 className="text-elx-primary font-medium mb-4 flex items-center">
            <div className="bg-elx-accent bg-opacity-10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faGears} className="text-elx-accent" />
            </div>
            <span>Add-ons and options</span>
          </h3>

          <p className="text-gray-600 mb-5 max-w-3xl">
            Enhance your transformation experience with these strategic add-ons.
            Each option represents a specialized capability that can accelerate
            results, provide deeper expertise, or ensure premium service levels
            based on your specific business priorities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceParams.map(param => {
              const evcCost = calculateEvcCost(param);
              const isEnabled = parameters[param.id];

              return (
                <div
                  key={param.id}
                  onClick={() => updateParameter(param.id, !isEnabled)}
                  className={`flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isEnabled
                      ? 'shadow-md'
                      : 'shadow-sm hover:shadow hover:scale-[1.01]'
                  }`}
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isEnabled
                      ? 'var(--elexive-accent)'
                      : '#e5e7eb',
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center w-full"
                    style={{
                      backgroundColor: isEnabled
                        ? 'var(--elexive-accent)'
                        : 'var(--elexive-primary)',
                      color: 'white',
                    }}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center mr-2"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <FontAwesomeIcon
                        icon={getParameterIcon(param)}
                        className="text-white"
                      />
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <h3 className="font-bold text-white text-sm">
                        {param.label}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col h-full">
                    {param.evcCost && (
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium text-gray-600">
                          Weekly
                        </span>
                        <span className="flex items-center">
                          {param.evcCost.type === 'relative' ? (
                            <span className="mr-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                              {param.evcCost.value}% of capacity
                            </span>
                          ) : (
                            <span className="mr-2 text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                              Fixed cost
                            </span>
                          )}
                          <span className="elx-evc-label">{evcCost} EVC</span>
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-3 flex-grow">
                      {param.description}
                    </p>

                    {param.valueProposition && (
                      <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-xs text-blue-800">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="mr-1.5"
                          />
                          <strong>Business Value:</strong>{' '}
                          {param.valueProposition}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-medium">
                        {isEnabled ? (
                          <span className="text-amber-600">Selected</span>
                        ) : (
                          <span className="text-elx-primary">
                            Select option
                          </span>
                        )}
                      </span>
                      {isEnabled ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-amber-500"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-elx-primary"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceParameters;
