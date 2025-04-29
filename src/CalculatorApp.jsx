import React, { useState, useEffect } from 'react';
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
  
  return (
    <div className="w-full mx-0 px-0 py-0 elx-main-content">
      {activeTab === 'introduction' ? (
        <CalculatorIntroduction onGetStarted={handleGetStarted} />
      ) : (
        <>
          {activeTab === 'calculator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
              {/* Left Column - Onboarding Quiz, Module Selector, and all other components */}
              <div className="lg:col-span-2">
                {/* Step 1: Business Intent */}
                <OnboardingQuiz 
                  intent={calculator.intent}
                  handleIntentSelect={calculator.handleIntentSelect}
                  resetCalculator={calculator.resetCalculator}
                  openEvcExplainer={openEvcExplainer}
                />
                
                {/* Step 2: Delivery Speed */}
                <ProductionCapacitySelector 
                  productionCapacity={calculator.productionCapacity}
                  setProductionCapacity={calculator.setProductionCapacity}
                />
                
                {/* Step 3: Resource Strategy */}
                <ResourceAllocationSelector 
                  resourceAllocation={calculator.resourceAllocation}
                  setResourceAllocation={calculator.setResourceAllocation}
                  productionCapacity={calculator.productionCapacity}
                />
                
                {/* Step 4: Module Selection */}
                <ModuleSelector 
                  modules={calculator.modules}
                  selectedModules={calculator.selectedModules}
                  toggleModule={calculator.toggleModule}
                  activePillar={calculator.activePillar}
                  setActivePillar={calculator.setActivePillar}
                  selectedVariants={calculator.selectedVariants}
                  setSelectedVariants={calculator.setSelectedVariants}
                />
                
                {/* Step 5: Payment & Parameters */}
                <ServiceParameters 
                  serviceParameters={calculator.serviceParameters}
                  paymentOption={calculator.paymentOption}
                  togglePaymentOption={calculator.togglePaymentOption}
                  parameters={calculator.parameters}
                  updateParameter={calculator.updateParameter}
                  productionCapacity={calculator.productionCapacity}
                />
              </div>
              
              {/* Right Column - Summary Sidebar */}
              <div className="lg:block">
                <SummarySidebar 
                  calculator={calculator}
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