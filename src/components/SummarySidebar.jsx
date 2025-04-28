import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullseye, faPuzzlePiece,
  faLayerGroup, faArrowRight, faEnvelope,
  faCar, faJetFighterUp, faRocket,
  faCalendarAlt, faChevronDown, faChevronUp,
  faFileAlt, faInfoCircle, faCreditCard,
  faCalculator, faCompass
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import DetailedReportModal from './DetailedReportModal';
import EvcExplainer from './EvcExplainer';

// Replace the ExpandableSection with a static Section component
const Section = ({ title, icon, children }) => {
  return (
    <div className="mb-4">
      <h4 className="text-[13px] uppercase tracking-wide font-medium text-elx-primary mb-2 flex items-center">
        <FontAwesomeIcon icon={icon} className="text-elx-accent mr-2 text-xs" />
        {title}
      </h4>
      {children}
    </div>
  );
};

const SummarySidebar = ({ calculator }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEvcModalOpen, setIsEvcModalOpen] = useState(false);
  
  const {
    intent,
    selectedModules,
    resourceAllocation,
    productionCapacity,
    modules,
    paymentOption,
    evcBase,
    totalPrice,
    evcPricePerUnit,
    completionTimeWeeks,
    totalModuleEvcs,
    selectedVariants = {},
    parameters = {},
    serviceParameters = [],
    weeklyProductionCapacity,
    monthlyOutputValue
  } = calculator;

  // Get the appropriate icon for the selected production capacity
  const getProductionCapacityIcon = (capacityKey) => {
    switch(capacityKey) {
      case 'pathfinder': return faCompass;
      case 'roadster': return faCar;
      case 'jetpack': return faJetFighterUp;
      case 'rocketship': return faRocket;
      default: return faCompass;
    }
  };
  
  // Get selected modules with their EVC values
  const selectedModuleDetails = modules
    .filter(module => selectedModules.includes(module.name))
    .map(module => {
      const variantType = selectedVariants[module.name] || 'insightPrimer';
      const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
      const evcValue = module.variants[variantIndex]?.evcValue || module.variants[0].evcValue;
      
      return {
        name: module.name,
        evcValue: evcValue
      };
    });

  return (
    <>
      <div className="elx-card p-6 h-fit sticky">
        <h3 className="elx-section-heading mb-5">Your Configuration</h3>
        
        <div className="space-y-4">
          {/* Intent - renamed from "Core Intent" to "Ready-Made Solution" */}
          <Section title="Ready-Made Solution" icon={faBullseye}>
            <p className="font-medium text-base text-elx-primary">{intent || "Not selected"}</p>
          </Section>
          
          {/* Selected Modules */}
          <Section title="Selected Modules" icon={faPuzzlePiece}>
            {selectedModules.length > 0 ? (
              <>
                <p className="font-medium text-base text-elx-primary mb-2.5">{selectedModules.length} modules</p>
                <div className="space-y-1.5">
                  {selectedModuleDetails.map(module => (
                    <div key={module.name} className="elx-module-option bg-elx-accent-light bg-opacity-20 py-1.5 px-2.5">
                      <span className="text-elx-primary text-xs font-medium">{module.name}</span>
                      <span className="elx-evc-label">
                        {module.evcValue} EVC
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-elx-primary italic">None selected</p>
            )}
          </Section>
          
          {/* Setup - Combined Production Capacity and Resource Allocation */}
          <Section title="Setup" icon={faLayerGroup}>
            <div className="flex flex-col space-y-3">
              {/* Production Capacity */}
              <div className="rounded-lg border border-blue-400 p-2.5 bg-blue-50">
                <p className="font-medium text-base text-elx-primary">
                  {calculatorConfig.productionCapacity[productionCapacity]?.label || "Not selected"}
                </p>
              </div>
              
              {/* Resource Allocation */}
              <div className="rounded-lg border border-green-400 p-2.5 bg-green-50">
                <p className="font-medium text-base text-elx-primary">
                  {calculatorConfig.resourceAllocation[resourceAllocation]?.description || "Not selected"}
                </p>
              </div>
            </div>
          </Section>
          
          {/* Estimated Completion Time */}
          <Section title="Estimated Completion" icon={faCalendarAlt}>
            <div className="flex justify-between items-center mt-1 bg-elx-accent-light bg-opacity-30 p-2.5 rounded">
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-elx-primary">{totalModuleEvcs}</p>
                <p className="text-[10px] text-elx-primary mt-0.5 font-medium">Total EVCs needed</p>
              </div>
              <div className="flex items-center px-1">
                <FontAwesomeIcon icon={faArrowRight} className="text-elx-accent" />
              </div>
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-elx-primary">{completionTimeWeeks}</p>
                <p className="text-[10px] text-elx-primary mt-0.5 font-medium">
                  {completionTimeWeeks === 1 ? 'Week' : 'Weeks'} to complete
                </p>
              </div>
            </div>
          </Section>
          
          {/* Custom Parameters */}
          {serviceParameters.filter(param => parameters[param.id]).length > 0 && (
            <Section title="Custom Parameters" icon={faInfoCircle}>
              <div className="space-y-1 text-sm">
                {serviceParameters
                  .filter(param => parameters[param.id])
                  .map(param => (
                    <div key={param.id} className="flex items-center py-1">
                      <span className="w-2 h-2 rounded-full bg-elx-accent mr-2"></span>
                      <span className="text-xs text-elx-primary">{param.label}</span>
                    </div>
                  ))}
              </div>
            </Section>
          )}
          
          {/* Payment Option */}
          <Section title="Payment Method" icon={faCreditCard}>
            <p className="font-medium text-base text-elx-primary">{evcBase.paymentOptions[paymentOption].name}</p>
            <span className="elx-badge elx-badge-accent inline-block mt-1.5">
              {paymentOption === 'prepaid' 
                ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% discount`
                : 'Standard monthly billing'}
            </span>
          </Section>
          
          {/* Pricing Summary */}
          <div className="mt-5">
            <div className="bg-elx-primary p-0.5 rounded-xl">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="elx-section-heading text-center text-base mb-3">Pricing Summary</h4>
                
                <div className="bg-elx-accent-light bg-opacity-50 p-3.5 rounded-lg mb-3.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-elx-primary font-medium">Weekly Price:</span>
                    <span className="font-bold text-xl text-elx-primary">€{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-elx-primary font-medium">
                    <span>Price per EVC:</span>
                    <span className="font-medium">€{evcPricePerUnit.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="elx-btn w-full py-2.5"
                    style={{ backgroundColor: 'var(--elexive-primary)', color: 'white' }}
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    View Detailed Report
                  </button>
                  
                  <button
                    onClick={() => setIsEvcModalOpen(true)}
                    className="elx-btn w-full py-2.5 bg-elx-evc text-white"
                  >
                    <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                    Understand EVCs
                  </button>
                  
                  <button
                    onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
                    className="elx-btn elx-btn-accent w-full py-2.5"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Request Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Report Modal */}
      <DetailedReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculator={calculator}
      />
      
      {/* EVC Explainer Modal */}
      <EvcExplainer
        isOpen={isEvcModalOpen}
        onClose={() => setIsEvcModalOpen(false)}
        weeklyProductionCapacity={weeklyProductionCapacity}
        monthlyOutputValue={monthlyOutputValue}
      />
    </>
  );
};

export default SummarySidebar;