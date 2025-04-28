import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSlidersH, faCreditCard, faInfoCircle, 
  faGears, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { getDiscountLabel } from '../utils/iconUtils';
import calculatorConfig from '../config/calculatorConfig.json';

const ServiceParameters = ({ 
  serviceParameters, 
  paymentOption, 
  togglePaymentOption, 
  parameters, 
  updateParameter 
}) => {
  // Safety check: if serviceParameters is undefined or null, provide an empty array as fallback
  const serviceParams = serviceParameters || [];
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-elx-primary mb-4">
        <FontAwesomeIcon icon={faSlidersH} className="text-elx-accent mr-2" />
        Service Parameters
      </h2>
      
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
                className={`px-4 py-2 rounded-lg transition-all duration-200 border ${
                  paymentOption === option
                    ? 'bg-elx-accent text-elx-primary shadow-md border-elx-accent'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-elx-accent-light'
                }`}
              >
                {details.name}
                {getDiscountLabel(details.priceModifier)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            {paymentOption === 'prepaid' 
              ? 'Prepaid option offers a discount on the standard rate'
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
                <div>
                  <span className="font-medium text-elx-primary">{param.label}</span>
                  <p className="text-xs text-gray-500">{param.description}</p>
                </div>
                <button
                  onClick={() => updateParameter(param.id, !parameters[param.id])}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 border min-w-[120px] w-[120px] flex items-center justify-center ${
                    parameters[param.id]
                      ? 'bg-elx-accent text-elx-primary shadow-sm border-elx-accent'
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