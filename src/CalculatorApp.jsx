import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useCalculator from './hooks/useCalculator';
import OnboardingQuiz from './components/OnboardingQuiz';
import ModuleSelector from './components/ModuleSelector';
import ResourceAllocationSelector from './components/ResourceAllocationSelector';
import ProductionCapacitySelector from './components/ProductionCapacitySelector';
import ServiceParameters from './components/ServiceParameters';
import PricingSummary from './components/PricingSummary';
import EvcExplainer from './components/EvcExplainer';
import SummarySidebar from './components/SummarySidebar';

const CalculatorApp = () => {
  const calculator = useCalculator();
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Onboarding Quiz, Module Selector, and all other components */}
        <div className="lg:col-span-2">
          <OnboardingQuiz 
            intent={calculator.intent}
            handleIntentSelect={calculator.handleIntentSelect}
            resetCalculator={calculator.resetCalculator}
          />
          <EvcExplainer 
            isVisible={calculator.isEvcExplainerVisible}
            toggleVisibility={calculator.toggleEvcExplainer}
            weeklyProductionCapacity={calculator.weeklyProductionCapacity}
            monthlyOutputValue={calculator.monthlyOutputValue}
          />
          <ModuleSelector 
            modules={calculator.modules}
            selectedModules={calculator.selectedModules}
            toggleModule={calculator.toggleModule}
            activePillar={calculator.activePillar}
            setActivePillar={calculator.setActivePillar}
            selectedVariants={calculator.selectedVariants}
            setSelectedVariants={calculator.setSelectedVariants}
          />
          {/* New Production Capacity Selector */}
          <ProductionCapacitySelector 
            productionCapacity={calculator.productionCapacity}
            setProductionCapacity={calculator.setProductionCapacity}
          />
          <ResourceAllocationSelector 
            resourceAllocation={calculator.resourceAllocation}
            setResourceAllocation={calculator.setResourceAllocation}
          />
          <ServiceParameters 
            serviceParameters={calculator.serviceParameters}
            paymentOption={calculator.paymentOption}
            togglePaymentOption={calculator.togglePaymentOption}
            parameters={calculator.parameters}
            updateParameter={calculator.updateParameter}
          />
          <PricingSummary 
            totalPrice={calculator.totalPrice}
            monthlyEvcs={calculator.monthlyEvcs}
            evcPricePerUnit={calculator.evcPricePerUnit}
            paymentOption={calculator.paymentOption}
            deliverySpeed={calculator.deliverySpeed}
            intent={calculator.intent}
            selectedModules={calculator.selectedModules}
            modules={calculator.modules}
            evcBase={calculator.evcBase}
            parameters={calculator.parameters}
            serviceParameters={calculator.serviceParameters}
            resourceAllocation={calculator.resourceAllocation}
            selectedVariants={calculator.selectedVariants}
          />
        </div>
        
        {/* Right Column - Summary Sidebar */}
        <div className="lg:block">
          <SummarySidebar 
            calculator={calculator}
          />
        </div>
      </div>
      
      {/* Mobile View - Request Proposal Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--elexive-secondary)] text-white rounded-full px-6 py-3 font-medium shadow-md hover:opacity-90 transition-opacity lg:hidden">
        <button
          onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
          className="flex items-center"
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Request Detailed Proposal
        </button>
      </div>
    </div>
  );
};

export default CalculatorApp;