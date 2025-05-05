import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullseye, faPuzzlePiece,
  faLayerGroup, faArrowRight, faEnvelope,
  faCalendarAlt, faFileAlt, faInfoCircle,
  faCalculator, faCompass, faLightbulb, faBullhorn,
  faGlobe, faCar, faJetFighterUp, faRocket
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import DetailedReportModal from './DetailedReportModal';

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
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Detect screen size on component mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.matchMedia('(min-width: 1024px)').matches);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
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
    selectedVariants = {},
    parameters = {},
    serviceParameters = [],
    weeklyProductionCapacity,
    completionTimeWeeks // Use this directly from calculator object
  } = calculator;

  // Get selected modules with their EVC values
  const selectedModuleDetails = modules
    .filter(module => selectedModules.includes(module.name))
    .map(module => {
      const variantType = selectedVariants[module.name] || 'insightPrimer';
      const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
      const evcValue = module.variants[variantIndex]?.evcValue || module.variants[0].evcValue;
      
      return {
        name: module.name,
        evcValue: evcValue,
        pillar: module.pillar
      };
    });

  // Calculate total EVC sum of all selected modules
  const totalEvcSum = selectedModuleDetails.reduce((sum, module) => sum + module.evcValue, 0);

  // Calculate the absolute EVC overhead for resource allocation
  const overheadPercentage = calculatorConfig.resourceAllocation[resourceAllocation]?.switchingOverhead || 0;
  const absoluteOverheadEvcs = Math.ceil((totalEvcSum * overheadPercentage) / 100);
  
  // Total EVCs needed including overhead
  const totalEvcsWithOverhead = totalEvcSum + absoluteOverheadEvcs;

  // Function to get pillar color based on pillar type
  const getPillarColor = (pillar) => {
    switch(pillar?.toLowerCase()) {
      case 'transformation': return 'rgba(217, 144, 0, 0.9)'; // Darkened amber background
      case 'strategy': return 'rgba(200, 90, 48, 0.9)'; // Darkened orange background
      case 'technology': return 'rgba(31, 119, 109, 0.9)'; // Darkened teal background
      case 'discovery': return 'rgba(46, 34, 102, 0.9)'; // Darkened purple background
      default: return 'rgba(217, 144, 0, 0.9)'; // Default to transformation color
    }
  };
  
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

  // Use the completion time weeks directly from the calculator for consistency
  const estimatedCompletionWeeks = completionTimeWeeks;

  return (
    <>
      <div 
        className="elx-card p-6 sticky"
        style={{
          maxHeight: isLargeScreen ? 'calc(100vh - 3rem)' : 'none', 
          overflowY: isLargeScreen ? 'auto' : 'visible',
          top: '1rem',
          overscrollBehavior: 'contain',
          paddingBottom: '3rem',
          marginBottom: '2rem'
        }}
      >
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
                    <div 
                      key={module.name} 
                      className="flex justify-between items-center py-1.5 px-2.5 rounded-md"
                      style={{ backgroundColor: getPillarColor(module.pillar) }}
                    >
                      <span className="text-white text-xs font-medium flex items-center">
                        <FontAwesomeIcon icon={module.pillar === 'Discovery' ? faCompass : faLayerGroup} 
                          className="mr-2 text-xs text-white" 
                        />
                        {module.name}
                      </span>
                      <span className="bg-rose-50 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-200">
                        {module.evcValue} EVC
                      </span>
                    </div>
                  ))}
                  
                  {/* Total Sum row - only show when more than one module is selected */}
                  {selectedModuleDetails.length > 1 && (
                    <>
                      {/* Divider line above the Total Sum */}
                      <div className="border-t border-gray-300 my-2"></div>
                      
                      <div 
                        className="flex justify-between items-center py-1.5 px-2.5 rounded-md"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} // Dark background to differentiate
                      >
                        <span className="text-white text-xs font-medium flex items-center">
                          <FontAwesomeIcon icon={faCalculator} 
                            className="mr-2 text-xs text-white" 
                          />
                          Modules Sum
                        </span>
                        <span className="bg-rose-100 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-300">
                          {totalEvcSum} EVC
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-elx-primary italic">None selected</p>
            )}
          </Section>
          
          {/* Setup - Combined Production Capacity and Resource Allocation */}
          <Section title="Setup" icon={faLayerGroup}>
            <div className="flex flex-col space-y-3">
              {/* Production Capacity with stronger colors, icon, and EVC value */}
              <div 
                className="rounded-lg p-2.5 flex items-center justify-between"
                style={{ backgroundColor: '#1F76BD' }} // Deeper blue for contrast
              >
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={
                      productionCapacity === "pathfinder" ? faCompass :
                      productionCapacity === "roadster" ? faCar : 
                      productionCapacity === "jetpack" ? faJetFighterUp : 
                      faRocket
                    } 
                    className="text-white mr-2" 
                  />
                  <p className="font-medium text-base text-white">
                    {calculatorConfig.productionCapacity[productionCapacity]?.label || "Not selected"}
                  </p>
                </div>
                <span className="bg-rose-50 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-200">
                  {calculatorConfig.productionCapacity[productionCapacity]?.weeklyEVCs || 0} EVC/week
                </span>
              </div>
              
              {/* Resource Allocation with stronger colors, icon, and absolute overhead EVCs */}
              <div 
                className="rounded-lg p-2.5 flex items-center justify-between"
                style={{ backgroundColor: '#1A7F5A' }} // Deeper green for contrast
              >
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={
                      resourceAllocation === "focused" ? faLightbulb :
                      resourceAllocation === "balanced" ? faBullhorn : 
                      faGlobe
                    } 
                    className="text-white mr-2" 
                  />
                  <p className="font-medium text-base text-white">
                    {calculatorConfig.resourceAllocation[resourceAllocation]?.description || "Not selected"}
                  </p>
                </div>
                <span className="bg-rose-50 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-200">
                  {absoluteOverheadEvcs > 0 ? `+${absoluteOverheadEvcs} EVC` : 'No overhead'}
                </span>
              </div>
            </div>
          </Section>
          
          {/* Custom Parameters - Moved here to be right after Setup */}
          {serviceParameters.filter(param => parameters[param.id]).length > 0 && (
            <Section title="Custom Parameters" icon={faInfoCircle}>
              <div className="space-y-2 text-sm">
                {serviceParameters
                  .filter(param => parameters[param.id])
                  .map(param => (
                    <div key={param.id} className="flex justify-between items-center py-1.5 px-2.5 rounded-md bg-gray-100">
                      <span className="text-elx-primary text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-elx-accent mr-2 inline-block"></span>
                        {param.label}
                      </span>
                      {param.evcCost && (
                        <span className="bg-rose-50 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-200">
                          {param.evcCost.type === 'absolute' 
                            ? `${param.evcCost.value} EVC/week` 
                            : `${calculateEvcCost(param)} EVC/week`}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </Section>
          )}
          
          {/* Estimated Completion Time */}
          <Section title="Estimated Completion" icon={faCalendarAlt}>
            <div className="flex justify-between items-center mt-1 bg-elx-accent-light bg-opacity-30 p-2.5 rounded">
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-elx-primary">{totalEvcsWithOverhead}</p>
                <p className="text-[10px] text-elx-primary mt-0.5 font-medium">Total EVCs needed</p>
              </div>
              <div className="flex items-center px-1">
                <FontAwesomeIcon icon={faArrowRight} className="text-elx-accent" />
              </div>
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-elx-primary">{estimatedCompletionWeeks}</p>
                <p className="text-[10px] text-elx-primary mt-0.5 font-medium">
                  {estimatedCompletionWeeks === 1 ? 'Week' : 'Weeks'} to complete
                </p>
              </div>
            </div>
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
                  <div className="flex justify-between items-center mb-1 text-[11px] text-elx-primary font-medium">
                    <span>Total weekly EVCs:</span>
                    <span className="font-medium">{weeklyProductionCapacity} EVCs</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-elx-primary font-medium">
                    <span>Price per EVC:</span>
                    <span className="font-medium">€{evcPricePerUnit.toFixed(2)}</span>
                  </div>
                  
                  {/* Payment option discount/billing info */}
                  <div className="mt-2 pt-2 border-t border-white border-opacity-50">
                    <div className={`text-[11px] font-medium px-2 py-1 rounded text-center ${
                      paymentOption === 'prepaid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {paymentOption === 'prepaid' 
                        ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% reservation discount`
                        : 'Standard monthly billing'}
                    </div>
                    
                    {/* Volume discount label - only show if a volume discount is applied */}
                    {evcBase.volumeDiscounts.some(({ threshold }) => weeklyProductionCapacity > threshold) && (
                      <div className="mt-2 text-[11px] font-medium px-2 py-1 rounded text-center bg-purple-100 text-purple-800">
                        Volume discount: {calculator.volumeDiscountPercentage.toFixed(1)}% applied
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="elx-btn w-full py-2.5"
                    style={{ backgroundColor: 'var(--elexive-primary)', color: 'white' }}
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Detailed Solution Brief
                  </button>
                  
                  {/* This button should use the global state now */}
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-evc-explainer'))}
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
    </>
  );
};

export default SummarySidebar;