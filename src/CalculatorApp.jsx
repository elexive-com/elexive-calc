import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCalculator from './hooks/useCalculator';
import CalculatorIntroduction from './components/CalculatorIntroduction';
import OnboardingQuiz from './components/OnboardingQuiz';
import ModuleSelector from './components/ModuleSelector';
import ResourceAllocationSelector from './components/ResourceAllocationSelector';
import ProductionCapacitySelector from './components/ProductionCapacitySelector';
import ServiceParameters from './components/ServiceParameters';
import SummarySidebar from './components/SummarySidebar';
import ModuleExplorer from './components/ModuleExplorer';
import JourneyPlanner from './components/JourneyPlanner';
import EvcExplainer from './components/EvcExplainer';
import ModuleDetails from './components/ModuleDetails';
import {
  faLightbulb,
  faCompass,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { useTabContext } from './contexts/TabContext';
import { useRouterContext } from './contexts/RouterContext';
import { debugLog } from './config/environment';
import { generateModulePdf } from './pdf';
import modulesConfig from './config/modulesConfig.json';

const CalculatorApp = () => {
  const calculator = useCalculator();
  const { activeTab, setActiveTab } = useTabContext();
  const { navigateToTab } = useRouterContext();
  const navigate = useNavigate();
  const [isEvcModalOpen, setIsEvcModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Track current step
  const [expandedSteps, setExpandedSteps] = useState({
    1: true, // First step is expanded by default
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // State for module detail view
  const [selectedModule, setSelectedModule] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Create refs outside of useMemo to comply with React Hooks rules
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  // Refs for scrolling to steps - associate the refs created above
  const stepRefs = useMemo(
    () => ({
      1: step1Ref,
      2: step2Ref,
      3: step3Ref,
      4: step4Ref,
      5: step5Ref,
    }),
    []
  ); // Empty dependency array ensures stepRefs is created only once

  const handleGetStarted = () => {
    setActiveTab('calculator');
    navigateToTab('calculator');
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

  // Listen for the custom event to expand next step
  useEffect(() => {
    const handleExpandNextStep = event => {
      const stepNumber = event.detail.stepNumber;
      if (stepNumber && stepRefs[stepNumber]?.current) {
        // Expand the step
        setExpandedSteps(prev => ({
          ...prev,
          [stepNumber]: true,
        }));

        // Set it as active step
        setActiveStep(stepNumber);

        // Scroll to the step
        setTimeout(() => {
          const headerRect =
            stepRefs[stepNumber].current.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const absoluteTop = headerRect.top + scrollTop;
          const topOffset = 20; // Adjust this value as needed

          window.scrollTo({
            top: absoluteTop - topOffset,
            behavior: 'smooth',
          });
        }, 150);
      }
    };

    window.addEventListener('expand-next-step', handleExpandNextStep);

    return () => {
      window.removeEventListener('expand-next-step', handleExpandNextStep);
    };
  }, [stepRefs]); // Depend on stepRefs

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
        [activeStep]: true,
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
        debugLog('Preset detected, collapsing all steps except the first one');

        // Keep only the first step expanded when a preset is selected
        setExpandedSteps({
          1: true, // Keep first step (intent/preset selection) expanded
          2: false, // Collapse delivery speed
          3: false, // Collapse resource strategy
          4: false, // Collapse modules
          5: false, // Collapse parameters
        });
      }
    }
  }, [calculator.intent]); // Only depend on intent

  // Function to toggle a step's expanded state
  const toggleStep = stepNumber => {
    const newExpandedSteps = { ...expandedSteps };
    newExpandedSteps[stepNumber] = !expandedSteps[stepNumber];
    setExpandedSteps(newExpandedSteps);

    // If expanding the step, scroll to it
    if (!expandedSteps[stepNumber] && stepRefs[stepNumber]?.current) {
      setTimeout(() => {
        const headerRect = stepRefs[stepNumber].current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const absoluteTop = headerRect.top + scrollTop;
        const topOffset = 20; // Adjust this value as needed

        window.scrollTo({
          top: absoluteTop - topOffset,
          behavior: 'smooth',
        });
      }, 150);
    }

    // If we're expanding a step and it's the current active step,
    // automatically move to the next step in the sequence
    if (!expandedSteps[stepNumber] && stepNumber === activeStep) {
      setActiveStep(stepNumber + 1);
    }
  };

  // View module details function - navigate to module URL with state
  const viewModuleDetails = module => {
    navigate(`/modules/${module.id}`, {
      state: {
        from: '/calculator',
        moduleContext: 'calculator',
        calculatorState: {
          selectedModules: calculator.selectedModules,
          resourceAllocation: calculator.resourceAllocation,
          productionCapacity: calculator.productionCapacity,
        }
      }
    });
  };

  // Export to PDF function
  const exportToPdf = async () => {
    if (!selectedModule) return;

    setIsExporting(true);

    try {
      // Use our centralized PDF generation module with just the module name
      const result = await generateModulePdf(selectedModule.name);

      // Check the success status of the PDF generation
      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Close module details view
  const closeModuleDetails = () => {
    setIsDetailView(false);
    setSelectedModule(null);
    // Restore scroll position
    const savedPosition = window.sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedPosition), behavior: 'smooth' });
      }, 100);
    }
  };

  // Build journey steps for ModuleDetails
  const journeySteps = useMemo(() => {
    const iconMap = {
      faCompass: faCompass,
      faLightbulb: faLightbulb,
      faRocket: faRocket,
    };

    // Use modulesConfig.journeyStages instead of calculator.journeyStages
    return modulesConfig.journeyStages.map(stage => {
      // Map string icon names to icon objects
      const iconObject = iconMap[stage.icon] || faCompass;

      return {
        id: stage.id,
        title: stage.title,
        description: stage.description,
        icon: iconObject,
        categories: stage.categories,
      };
    });
  }, []);

  // Function to check if a step is complete
  const isStepComplete = stepNumber => {
    // When a preset is selected, all steps should be considered complete
    if (calculator.intent && calculator.intent !== 'Full Custom') {
      return true;
    }

    // For normal flow, check if the specific steps are complete
    switch (stepNumber) {
      case 1:
        return calculator.intent !== '';
      case 2:
        // For step 2, it's complete if a production capacity is selected
        return (
          calculator.productionCapacity && calculator.productionCapacity !== ''
        );
      case 3:
        // For step 3, it's complete if resource allocation is set
        return (
          calculator.resourceAllocation && calculator.resourceAllocation !== ''
        );
      case 4:
        // For step 4, it's complete if at least one module is selected
        return (
          calculator.selectedModules && calculator.selectedModules.length > 0
        );
      case 5:
        // For step 5, it's complete if payment option is set
        return calculator.paymentOption && calculator.paymentOption !== '';
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
      5: false,
    });
  };

  // Helper function to render a collapsible step
  const renderStep = (stepNumber, title, children) => {
    const isExpanded = expandedSteps[stepNumber];
    const isComplete = isStepComplete(stepNumber);
    const isActive = activeStep === stepNumber;

    return (
      <div
        className="mb-6 border border-gray-200 rounded-xl shadow-md overflow-hidden"
        id={`step-container-${stepNumber}`}
      >
        {/* Header */}
        <div
          ref={stepRefs[stepNumber]}
          className={`flex items-center justify-between p-4 cursor-pointer ${
            isExpanded
              ? 'bg-white border-b border-blue-100'
              : 'bg-white border-b border-gray-100'
          }`}
          onClick={() => toggleStep(stepNumber)}
        >
          <div className="flex items-center">
            {/* Step Number with Completion Indicator */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                isComplete
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700'
              }`}
            >
              {/* Always show the step number */}
              {stepNumber}

              {/* If complete, show a small checkmark indicator */}
              {isComplete && (
                <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h2
              className={`elx-section-heading text-xl flex items-center leading-none my-0 ${
                isComplete
                  ? 'text-green-800'
                  : isActive
                    ? 'text-blue-800'
                    : 'text-gray-700'
              }`}
            >
              {title}
            </h2>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div
          style={{ display: isExpanded ? 'block' : 'none' }}
          className="bg-white"
        >
          {/* Apply a wrapper div with negative margin to counteract the padding in child components */}
          <div className="collapsible-content-wrapper">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-0 px-0 py-0 elx-main-content">
      {/* If in detailed module view, only show the ModuleDetails component */}
      {isDetailView && selectedModule ? (
        <ModuleDetails
          selectedModule={selectedModule}
          onBack={closeModuleDetails}
          exportToPdf={exportToPdf}
          isExporting={isExporting}
          journeySteps={journeySteps}
        />
      ) : (
        /* Otherwise, show the regular calculator interface */
        <>
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
                      'Define Your Business Challenge',
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
                      'Choose Your Delivery Speed',
                      <ProductionCapacitySelector
                        productionCapacity={calculator.productionCapacity}
                        setProductionCapacity={calculator.setProductionCapacity}
                        recommendedCapacity={calculator.recommendedCapacity}
                      />
                    )}

                    {/* Step 3: Resource Strategy */}
                    {renderStep(
                      3,
                      'Optimize Your Resource Strategy',
                      <ResourceAllocationSelector
                        resourceAllocation={calculator.resourceAllocation}
                        setResourceAllocation={calculator.setResourceAllocation}
                        productionCapacity={calculator.productionCapacity}
                      />
                    )}

                    {/* Step 4: Module Selection */}
                    {renderStep(
                      4,
                      'Select Modules From Our Catalog',
                      <ModuleSelector
                        modules={calculator.modules}
                        selectedModules={calculator.selectedModules}
                        toggleModule={calculator.toggleModule}
                        activePillar={calculator.activePillar}
                        setActivePillar={calculator.setActivePillar}
                        selectedVariants={calculator.selectedVariants}
                        setSelectedVariants={calculator.setSelectedVariants}
                        viewModuleDetails={viewModuleDetails}
                      />
                    )}

                    {/* Step 5: Payment & Parameters */}
                    {renderStep(
                      5,
                      'Choose Additional Services and Add-ons',
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
              ) : activeTab === 'modules' ? (
                <ModuleExplorer />
              ) : activeTab === 'journey' ? (
                <JourneyPlanner />
              ) : null}
            </>
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
