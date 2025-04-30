import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard, faInfoCircle, 
  faGears, faCheckCircle, faLayerGroup,
  faGraduationCap, faUserTie, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { getDiscountLabel } from '../utils/iconUtils';
import calculatorConfig from '../config/calculatorConfig.json';

const ServiceParameters = ({ 
  serviceParameters, 
  paymentOption, 
  togglePaymentOption, 
  parameters, 
  updateParameter,
  productionCapacity
}) => {
  // Define default essential business parameters if none provided
  const defaultParameters = [
    {
      id: 'trainingSession',
      label: 'Training Sessions',
      description: 'Comprehensive onboarding and knowledge transfer sessions for your team',
      icon: faGraduationCap
    },
    {
      id: 'accountConcierge',
      label: 'Account Concierge',
      description: 'Dedicated account manager for personalized service and strategic guidance',
      icon: faUserTie
    },
    {
      id: 'premiumSLA',
      label: 'Premium SLA',
      description: 'Enhanced response times and service level guarantees for business-critical operations',
      icon: faShieldAlt
    }
  ];
  
  // Safety check: if serviceParameters is undefined or null, provide default parameters
  const serviceParams = serviceParameters?.length ? serviceParameters : defaultParameters;
  
  // Helper function to calculate the EVC cost based on parameter type and current production capacity
  const calculateEvcCost = (param) => {
    if (!param.evcCost) return null;
    
    const { type, value } = param.evcCost;
    
    if (type === 'absolute') {
      return value;
    } else if (type === 'relative') {
      // Get the weeklyEVCs from the selected production capacity
      const weeklyEVCs = calculatorConfig.productionCapacity[productionCapacity]?.weeklyEVCs || 0;
      // Calculate relative value and round up to nearest integer
      return Math.ceil((weeklyEVCs * value) / 100);
    }
    
    return null;
  };
  
  // Helper function to format the EVC cost display text
  const formatEvcCost = (param) => {
    if (!param.evcCost) return '';
    
    const cost = calculateEvcCost(param);
    if (cost === null) return '';
    
    if (param.evcCost.type === 'absolute') {
      return `${cost} EVC/week`;
    } else {
      return `${cost} EVC/week (${param.evcCost.value}%)`;
    }
  };
  
  return (
    <div className="elx-card p-6 mb-6">
      <h2 className="elx-section-heading text-2xl mb-4">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Service Parameters
      </h2>
      
      <p className="text-gray-700 mb-6">
        This is where you tailor your transformation experience to your unique business needs. Think of these options as customization levers that enhance your results in specific ways. From premium data access to dedicated support, each choice represents a strategic investment in your transformation success.
      </p>
      
      <div className="space-y-6">
        {/* Payment Option */}
        <div>
          <label className="block text-elx-primary font-medium mb-2">
            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
            Payment Option
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(calculatorConfig.evcBase.paymentOptions).map(([option, details]) => (
              <button
                key={option}
                onClick={() => togglePaymentOption(option)}
                className={`elx-btn px-4 py-2 transition-all duration-200 border ${
                  paymentOption === option
                    ? 'elx-btn-accent shadow-md border-elx-accent'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-elx-accent-light'
                }`}
              >
                {option === 'prepaid' ? 'Reserved' : details.name}
                {getDiscountLabel(details.priceModifier)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            {paymentOption === 'prepaid' 
              ? 'Reserved option allocates capacity in advance for greater efficiency and cost savings'
              : 'Standard monthly billing with no long-term commitment'}
          </p>
        </div>
        
        {/* Custom Service Parameters */}
        <div>
          <label className="block text-elx-primary font-medium mb-2">
            <FontAwesomeIcon icon={faGears} className="mr-2" />
            Additional Parameters
          </label>
          <div className="space-y-3">
            {serviceParams.map((param) => (
              <div key={param.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-medium text-elx-primary">
                    {param.icon && <FontAwesomeIcon icon={param.icon} className="mr-2 text-elx-accent-light" />}
                    {param.label}
                  </span>
                  <p className="text-xs text-gray-500">{param.description}</p>
                  {param.evcCost && (
                    <p className="text-xs text-elx-evc font-medium mt-1">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      Cost: {formatEvcCost(param)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => updateParameter(param.id, !parameters[param.id])}
                  className={`elx-btn px-4 py-2 transition-all duration-200 border min-w-[120px] w-[120px] flex items-center justify-center ${
                    parameters[param.id]
                      ? 'elx-btn-accent shadow-sm border-elx-accent'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-elx-accent-light'
                  }`}
                >
                  {parameters[param.id] ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      <span>Enabled</span>
                    </>
                  ) : <span>Disabled</span>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceParameters;