import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullseye, faPuzzlePiece, faChartBar,
  faLayerGroup, faExchangeAlt, 
  faCreditCard, faArrowRight, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const SummarySidebar = ({ calculator }) => {
  const {
    intent,
    selectedModules,
    resourceAllocation,
    modules,
    monthlyEvcs,
    weeklyProductionCapacity,
    monthlyOutputValue,
    paymentOption,
    evcBase,
    totalPrice,
    evcPricePerUnit
  } = calculator;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-4">
      <h3 className="font-bold text-xl mb-5 text-[var(--elexive-primary)]">Your Configuration</h3>
      
      <div className="space-y-4">
        {/* Intent */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Core Intent
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{intent || "Not selected"}</p>
        </div>
        
        {/* Selected Modules */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Selected Modules
          </h4>
          {selectedModules.length > 0 ? (
            <>
              <p className="font-medium text-base text-[var(--elexive-primary)] mb-2.5">{selectedModules.length} modules</p>
              <div className="space-y-1.5">
                {selectedModules.map(moduleName => {
                  const moduleConfig = modules.find(m => m.name === moduleName);
                  // Get the selected variant type or default to 'insightPrimer'
                  const variantType = calculator.selectedVariants[moduleName] || 'insightPrimer';
                  // Get the appropriate EVC value based on selected variant
                  const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
                  const evcValue = moduleConfig?.variants[variantIndex]?.evcValue || moduleConfig?.variants[0]?.evcValue || 0;
                  
                  return (
                    <div key={moduleName} className="flex justify-between items-center bg-[var(--elexive-accent-light)] bg-opacity-20 py-1.5 px-2.5 rounded">
                      <span className="text-[var(--elexive-primary)] text-xs font-medium">{moduleName}</span>
                      <span className="text-[var(--elexive-evc)] text-[10px] bg-[var(--elexive-evc-light)] px-1.5 py-0.5 rounded-full font-medium">
                        {evcValue} EVC
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--elexive-primary)] italic">None selected</p>
          )}
        </div>
        
        {/* Weekly EVC Amount */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Weekly EVC Amount
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{monthlyEvcs} EVCs</p>
        </div>
        
        {/* Resource Allocation */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Resource Allocation
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{calculatorConfig.resourceAllocation[resourceAllocation].description}</p>
          <span className="inline-block mt-1.5 text-[10px] bg-[var(--elexive-accent-light)] bg-opacity-50 text-[var(--elexive-primary)] px-2 py-0.5 rounded-full font-medium">
            {calculatorConfig.resourceAllocation[resourceAllocation].label}
          </span>
        </div>
        
        {/* EVC Production & Output */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faExchangeAlt} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            EVC Production & Output
          </h4>
          <div className="flex justify-between items-center mt-1 bg-[var(--elexive-accent-light)] bg-opacity-30 p-2.5 rounded">
            <div className="text-center px-1">
              <p className="font-bold text-lg text-[var(--elexive-primary)]">{weeklyProductionCapacity}</p>
              <p className="text-[10px] text-[var(--elexive-primary)] mt-0.5 font-medium">Weekly production</p>
            </div>
            <div className="flex items-center px-1">
              <FontAwesomeIcon icon={faArrowRight} className="text-[var(--elexive-accent)]" />
            </div>
            <div className="text-center px-1">
              <p className="font-bold text-lg text-[var(--elexive-primary)]">{monthlyOutputValue}</p>
              <p className="text-[10px] text-[var(--elexive-primary)] mt-0.5 font-medium">Monthly output</p>
            </div>
          </div>
        </div>
        
        {/* Payment Option */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faCreditCard} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Payment Method
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{evcBase.paymentOptions[paymentOption].name}</p>
          <span className="text-[11px] bg-[var(--elexive-accent-light)] bg-opacity-30 px-2 py-0.5 rounded-full inline-block mt-1.5 font-medium text-[var(--elexive-primary)]">
            {paymentOption === 'prepaid' 
              ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% discount`
              : 'Standard monthly billing'}
          </span>
        </div>
        
        {/* Pricing Summary - Enhanced design with single colors */}
        <div className="mt-5">
          <div className="bg-[var(--elexive-primary)] p-0.5 rounded-xl">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="text-center font-semibold text-base text-[var(--elexive-primary)] mb-3">Pricing Summary</h4>
              
              <div className="bg-[var(--elexive-accent-light)] bg-opacity-50 p-3.5 rounded-lg mb-3.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-[var(--elexive-primary)] font-medium">Weekly Price:</span>
                  <span className="font-bold text-xl text-[var(--elexive-primary)]">€{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[var(--elexive-primary)] font-medium">
                  <span>Price per EVC:</span>
                  <span className="font-medium">€{evcPricePerUnit.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
                className="w-full py-2.5 bg-[var(--elexive-accent)] text-[var(--elexive-primary)] rounded-lg font-medium hover:opacity-90 transition-opacity text-sm shadow-sm"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Request Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySidebar;