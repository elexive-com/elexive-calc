import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, faChartBar, faCoins, 
  faCreditCard, faRocket, faBullseye,
  faPuzzlePiece, faCalculator, faSlidersH,
  faCheckCircle, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const PricingSummary = ({ 
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
  resourceAllocation
}) => {
  // Get selected modules with their EVC ranges for display
  const selectedModuleDetails = modules
    .filter(module => selectedModules.includes(module.name))
    .map(module => ({
      name: module.name,
      evcRange: {
        min: module.variants[0].evcValue,
        max: module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue
      }
    }));
    
  // Get payment option details
  const paymentDetails = evcBase.paymentOptions[paymentOption];
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-4">
        <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--elexive-accent)] mr-2" />
        Your Custom Solution
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-lg mb-2">
          <span className="font-medium">Weekly Price:</span>
          <span className="font-bold text-[var(--elexive-primary)]">€{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span><FontAwesomeIcon icon={faChartBar} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Weekly EVCs:</span>
          <span>{monthlyEvcs} EVCs</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span><FontAwesomeIcon icon={faCoins} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Price per EVC:</span>
          <span>€{evcPricePerUnit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span><FontAwesomeIcon icon={faCreditCard} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Payment Option:</span>
          <span>{paymentDetails.name}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span><FontAwesomeIcon icon={faRocket} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Delivery Speed:</span>
          <span>{deliverySpeed}</span>
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
            <div key={module.name} className="text-sm bg-[#FFF6E8] p-3 rounded border border-[var(--elexive-accent)] border-opacity-20">
              <div className="font-medium text-[var(--elexive-primary)]">{module.name}</div>
              <div className="text-xs text-gray-600 mt-1">EVC Range: {module.evcRange.min}-{module.evcRange.max}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 bg-[#ECE9F3] p-3 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--elexive-primary)]">
            <FontAwesomeIcon icon={faCalculator} className="mr-1" />
            EVC Calculation
          </h4>
          <div className="text-xs text-gray-600 mt-1">
            <p>Base EVC from modules: {selectedModuleDetails.reduce((sum, module) => sum + (module.evcRange.min + module.evcRange.max)/2, 0).toFixed(1)} EVCs</p>
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
          onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
          className="px-6 py-3 bg-[var(--elexive-secondary)] text-white rounded-lg font-medium hover:bg-[var(--elexive-secondary)] hover:opacity-90 transition-colors shadow-md"
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Request Detailed Proposal
        </button>
      </div>
    </div>
  );
};

export default PricingSummary;