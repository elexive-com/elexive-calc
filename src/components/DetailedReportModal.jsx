import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, faChartBar, faCoins, 
  faCreditCard, faRocket, faBullseye,
  faPuzzlePiece, faCalculator, faSlidersH,
  faCheckCircle, faEnvelope, faLightbulb, faTools,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const DetailedReportModal = ({ isOpen, onClose, calculator }) => {
  if (!isOpen) return null;

  const { 
    totalPrice,
    monthlyEvcs,
    evcPricePerUnit,
    paymentOption,
    deliverySpeed,
    intent,
    selectedModules,
    modules,
    evcBase,
    parameters,
    serviceParameters,
    resourceAllocation,
    selectedVariants = {}
  } = calculator;

  // Get selected modules with their EVC values based on selected variant
  const selectedModuleDetails = modules
    .filter(module => selectedModules.includes(module.name))
    .map(module => {
      // Default to insightPrimer if no variant is selected
      const variantType = selectedVariants[module.name] || 'insightPrimer';
      const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
      const evcValue = module.variants[variantIndex]?.evcValue || module.variants[0].evcValue;
      
      return {
        name: module.name,
        selectedVariant: variantType,
        evcValue: evcValue,
        evcRange: {
          min: module.variants[0].evcValue,
          max: module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue
        }
      };
    });
    
  // Get payment option details
  const paymentDetails = evcBase.paymentOptions[paymentOption];
  
  // Get variant display name
  const getVariantDisplayName = (variantType) => {
    return variantType === 'insightPrimer' ? 'Insight Primer' : 'Integrated Execution';
  };
  
  // Get variant icon
  const getVariantIcon = (variantType) => {
    return variantType === 'insightPrimer' ? faLightbulb : faTools;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--elexive-primary)]">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--elexive-accent)] mr-2" />
            Detailed Solution Report
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-lg mb-2">
              <span className="font-medium">Weekly Price:</span>
              <span className="font-bold text-[var(--elexive-primary)]">€{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span><FontAwesomeIcon icon={faChartBar} className="text-[var(--elexive-evc)] opacity-80 mr-1" />Weekly EVCs:</span>
              <span className="font-medium text-[var(--elexive-evc)]">{monthlyEvcs} EVCs</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span><FontAwesomeIcon icon={faCoins} className="text-[var(--elexive-evc)] opacity-80 mr-1" />Price per EVC:</span>
              <span className="font-medium text-[var(--elexive-evc)]">€{evcPricePerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span><FontAwesomeIcon icon={faCreditCard} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Payment Option:</span>
              <span>{paymentDetails.name}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span><FontAwesomeIcon icon={faRocket} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Delivery Speed:</span>
              <span>{deliverySpeed || 'Standard'}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span><FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Core Intent:</span>
              <span>{intent}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-[var(--elexive-primary)]">
              <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2" />
              Selected Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedModuleDetails.map((module) => (
                <div key={module.name} className="text-sm bg-[var(--elexive-evc-light)] p-3 rounded border border-[var(--elexive-evc)] border-opacity-20">
                  <div className="font-medium text-[var(--elexive-primary)]">{module.name}</div>
                  <div className="flex items-center text-xs text-gray-700 mt-1">
                    <FontAwesomeIcon icon={getVariantIcon(module.selectedVariant)} className="mr-1 text-[var(--elexive-evc)]" />
                    <span className="font-medium">{getVariantDisplayName(module.selectedVariant)}</span>
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-[var(--elexive-evc)] font-medium">{module.evcValue} EVC</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 bg-[var(--elexive-evc-light)] p-3 rounded-lg">
              <h4 className="text-sm font-medium text-[var(--elexive-primary)]">
                <FontAwesomeIcon icon={faCalculator} className="mr-1 text-[var(--elexive-evc)]" />
                EVC Calculation
              </h4>
              <div className="text-xs text-gray-600 mt-1">
                <p>Base EVC from modules: <span className="text-[var(--elexive-evc)] font-medium">{selectedModuleDetails.reduce((sum, module) => sum + module.evcValue, 0)} EVCs</span></p>
                <p>Resource allocation ({calculatorConfig.resourceAllocation[resourceAllocation].description}): {calculatorConfig.resourceAllocation[resourceAllocation].outputMultiplier}x</p>
                {Object.entries(parameters)
                  .filter(([, enabled]) => enabled)
                  .map(([paramId]) => {
                    const param = serviceParameters.find(p => p.id === paramId);
                    return (
                      <p key={paramId}>
                        {param.label} modifier: {param.modifier}x
                      </p>
                    );
                  })
                }
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-[var(--elexive-primary)]">
              <FontAwesomeIcon icon={faSlidersH} className="text-[var(--elexive-accent)] mr-2" />
              Custom Parameters
            </h3>
            <div className="space-y-1 text-sm">
              {serviceParameters
                .filter(param => parameters[param.id])
                .map(param => (
                  <div key={param.id} className="flex">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[var(--elexive-accent)] mr-2" />
                    <span className="text-[var(--elexive-primary)]">{param.label}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-[#FFF6E8] p-4 rounded-xl mb-8 border border-[var(--elexive-accent)] border-opacity-20">
            <p className="text-sm font-medium text-[var(--elexive-primary)]">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--elexive-accent)] mr-2" />
              Price Breakdown
            </p>
            <p className="text-xs text-[var(--elexive-primary)] opacity-80 mt-1">
              Base price: €{evcBase.basePrice}/EVC × 
              {paymentDetails.priceModifier !== 1 
                ? ` ${paymentDetails.priceModifier} (${paymentDetails.name}) = €${(evcBase.basePrice * paymentDetails.priceModifier).toFixed(2)}/EVC`
                : ` 1.0 (Standard rate) = €${evcBase.basePrice}/EVC`
              }
            </p>
            {monthlyEvcs > 30 && (
              <p className="text-xs text-[var(--elexive-primary)] opacity-80">
                Volume discount: €{evcPricePerUnit.toFixed(2)}/EVC × {monthlyEvcs} EVCs = €{totalPrice.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-[var(--elexive-primary)] opacity-80 mt-2">
              This is a non-binding estimate based on your selections. Contact us for a detailed proposal.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Detailed%20Pricing%20Inquiry&body=I%20would%20like%20to%20request%20a%20detailed%20proposal%20for%20my%20custom%20solution.'}
              className="px-6 py-3 bg-[var(--elexive-secondary)] text-white rounded-lg font-medium hover:bg-[var(--elexive-secondary)] hover:opacity-90 transition-colors shadow-md"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Request Detailed Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReportModal;