import React, { useState, useEffect, useRef } from 'react';
import useCalculator from './hooks/useCalculator';
import CalculatorIntroduction from './components/CalculatorIntroduction';
import OnboardingQuiz from './components/OnboardingQuiz';
import ModuleSelector from './components/ModuleSelector';
import ResourceAllocationSelector from './components/ResourceAllocationSelector';
import ProductionCapacitySelector from './components/ProductionCapacitySelector';
import ServiceParameters from './components/ServiceParameters';
import SummarySidebar from './components/SummarySidebar';
import ModuleExplorer from './components/ModuleExplorer';
import EvcExplainer from './components/EvcExplainer';
import { useTabContext } from './contexts/TabContext';

const CalculatorApp = () => {
  const calculator = useCalculator();
  const { activeTab, setActiveTab } = useTabContext();
  const [isEvcModalOpen, setIsEvcModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Track current step
  const [expandedSteps, setExpandedSteps] = useState({
    1: true, // First step is expanded by default
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  // Refs for scrolling to steps
  const stepRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null)
  };
  
  const handleGetStarted = () => {
    setActiveTab('calculator');
  };

  const openEvcExplainer = () => {
    setIsEvcModalOpen(true);
  };
  
  // Listen for the custom event from SummarySidebar
  useEffect(() => {
    const handleOpenEvcExplainer = () => {
      setIsEvcModalOpen(true);
    };
    
    window.addEventListener('open-evc-explainer', handleOpenEvcExplainer);
    
    return () => {
      window.removeEventListener('open-evc-explainer', handleOpenEvcExplainer);
    };
  }, []);

  // Initialize calculator to reset state only on first load - using a ref to track initialization
  const isInitialMount = useRef(true);
  useEffect(() => {
    // Only reset on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!calculator.intent) {
        calculator.resetCalculator();
      }
    }
  }, [calculator]); // Add calculator as dependency to fix ESLint warning
  
  // Effect to expand the active step when activeStep changes
  useEffect(() => {
    if (activeStep > 0) {
      setExpandedSteps(prev => ({
        ...prev,
        [activeStep]: true
      }));
    }
  }, [activeStep]); // Only depend on activeStep
  
  // Effect to detect when presets are applied and ensure only the first step remains expanded
  // Using useRef to prevent infinite loops
  const prevIntent = useRef(calculator.intent);
  useEffect(() => {
    // Only run when intent actually changes to avoid infinite loops
    if (prevIntent.current !== calculator.intent) {
      prevIntent.current = calculator.intent;
      
      // Check if a preset has been selected (intent is set)
      if (calculator.intent && calculator.intent !== 'Full Custom') {
        console.log("Preset detected, collapsing all steps except the first one");
        
        // Keep only the first step expanded when a preset is selected
        setExpandedSteps({
          1: true,  // Keep first step (intent/preset selection) expanded
          2: false, // Collapse delivery speed
          3: false, // Collapse resource strategy
          4: false, // Collapse modules
          5: false  // Collapse parameters
        });
      }
    }
  }, [calculator.intent]); // Only depend on intent
  
  // Function to toggle a step's expanded state
  const toggleStep = (stepNumber) => {
    const newExpandedSteps = {...expandedSteps};
    newExpandedSteps[stepNumber] = !expandedSteps[stepNumber];
    setExpandedSteps(newExpandedSteps);
    
    // If expanding the step, scroll to it
    if (!expandedSteps[stepNumber] && stepRefs[stepNumber]?.current) {
      setTimeout(() => {
        const headerRect = stepRefs[stepNumber].current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const absoluteTop = headerRect.top + scrollTop;
        const topOffset = 20; // Adjust this value as needed
        
        window.scrollTo({
          top: absoluteTop - topOffset,
          behavior: 'smooth'
        });
      }, 150);
    }
    
    // If we're expanding a step and it's the current active step,
    // automatically move to the next step in the sequence
    if (!expandedSteps[stepNumber] && stepNumber === activeStep) {
      setActiveStep(stepNumber + 1);
    }
  };
  
  // Function to check if a step is complete
  const isStepComplete = (stepNumber) => {
    switch(stepNumber) {
      case 1: 
        return calculator.intent !== '';
      case 2:
        return calculator.productionCapacity > 0;
      case 3:
        return calculator.resourceAllocation !== '';
      case 4:
        return calculator.selectedModules.length > 0;
      case 5:
        return calculator.paymentOption !== '';
      default:
        return false;
    }
  };
  
  // Reset handler with expanded state management
  const handleResetCalculator = () => {
    calculator.resetCalculator();
    setActiveStep(1);
    setExpandedSteps({
      1: true,
      2: false,
      3: false,
      4: false,
      5: false
    });
  };
  
  // Helper function to render a collapsible step
  const renderStep = (stepNumber, title, children) => {
    const isExpanded = expandedSteps[stepNumber];
    const isComplete = isStepComplete(stepNumber);
    const isActive = activeStep === stepNumber;
    
    return (
      <div 
        className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        id={`step-container-${stepNumber}`}
      >
        {/* Header */}
        <div 
          ref={stepRefs[stepNumber]}
          className={`flex items-center justify-between p-4 cursor-pointer ${
            isExpanded 
              ? 'bg-blue-50 border-b border-blue-100' 
              : 'bg-gray-50 border-b border-gray-100'
          }`}
          onClick={() => toggleStep(stepNumber)}
        >
          <div className="flex items-center">
            {/* Step Number or Check Mark */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
              isComplete 
                ? 'bg-green-500 text-white' 
                : isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-700'
            }`}>
              {isComplete ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            
            {/* Title */}
            <h3 className={`font-medium ${
              isComplete 
                ? 'text-green-800' 
                : isActive
                  ? 'text-blue-800'
                  : 'text-gray-700'
            }`}>
              {title}
            </h3>
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div style={{ display: isExpanded ? 'block' : 'none' }} className="p-4">
          {children}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full mx-0 px-0 py-0 elx-main-content">
      {activeTab === 'introduction' ? (
        <CalculatorIntroduction onGetStarted={handleGetStarted} />
      ) : (
        <>
          {activeTab === 'calculator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
              {/* Left Column - Sequential Steps with Collapsible Sections */}
              <div className="lg:col-span-2">
                {/* Step 1: Business Intent */}
                {renderStep(
                  1,
                  "Define Your Business Intent",
                  <OnboardingQuiz 
                    intent={calculator.intent}
                    handleIntentSelect={calculator.handleIntentSelect}
                    resetCalculator={handleResetCalculator}
                    openEvcExplainer={openEvcExplainer}
                  />
                )}
                
                {/* Step 2: Delivery Speed */}
                {renderStep(
                  2,
                  "Select Your Delivery Speed",
                  <ProductionCapacitySelector 
                    productionCapacity={calculator.productionCapacity}
                    setProductionCapacity={calculator.setProductionCapacity}
                    recommendedCapacity={calculator.recommendedCapacity}
                  />
                )}
                
                {/* Step 3: Resource Strategy */}
                {renderStep(
                  3,
                  "Optimize Your Resource Strategy",
                  <ResourceAllocationSelector 
                    resourceAllocation={calculator.resourceAllocation}
                    setResourceAllocation={calculator.setResourceAllocation}
                    productionCapacity={calculator.productionCapacity}
                  />
                )}
                
                {/* Step 4: Module Selection */}
                {renderStep(
                  4,
                  "Select Your Transformation Modules",
                  <ModuleSelector 
                    modules={calculator.modules}
                    selectedModules={calculator.selectedModules}
                    toggleModule={calculator.toggleModule}
                    activePillar={calculator.activePillar}
                    setActivePillar={calculator.setActivePillar}
                    selectedVariants={calculator.selectedVariants}
                    setSelectedVariants={calculator.setSelectedVariants}
                  />
                )}
                
                {/* Step 5: Payment & Parameters */}
                {renderStep(
                  5,
                  "Configure Your Service Parameters",
                  <ServiceParameters 
                    serviceParameters={calculator.serviceParameters}
                    paymentOption={calculator.paymentOption}
                    togglePaymentOption={calculator.togglePaymentOption}
                    parameters={calculator.parameters}
                    updateParameter={calculator.updateParameter}
                    productionCapacity={calculator.productionCapacity}
                  />
                )}
              </div>
              
              {/* Right Column - Summary Sidebar */}
              <div className="lg:block">
                <SummarySidebar 
                  calculator={calculator}
                  currentStep={activeStep}
                />
              </div>
            </div>
          ) : (
            <ModuleExplorer />
          )}
        </>
      )}
      
      {/* EVC Explainer Modal */}
      <EvcExplainer
        isOpen={isEvcModalOpen}
        onClose={() => setIsEvcModalOpen(false)}
        weeklyProductionCapacity={calculator.weeklyProductionCapacity}
        monthlyOutputValue={calculator.monthlyOutputValue}
        selectedAllocationStrategy={calculator.resourceAllocation}
      />
    </div>
  );
};

export default CalculatorApp;