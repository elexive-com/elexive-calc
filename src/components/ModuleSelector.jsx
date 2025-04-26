import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPuzzlePiece, faUsers, faLightbulb, 
  faServer, faCheck, faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { getModuleIcon } from '../utils/iconUtils';
import FeatureIntroduction from './FeatureIntroduction';

const ModuleSelector = ({ 
  modules, 
  selectedModules, 
  toggleModule, 
  activePillar, 
  setActivePillar,
  selectedVariants = {},
  setSelectedVariants
}) => {
  // Add state for mobile dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Handle module variant selection
  const handleVariantSelect = (moduleName, variantType) => {
    // If selecting the same variant that's already selected, deselect the module
    if (selectedModules.includes(moduleName) && selectedVariants[moduleName] === variantType) {
      handleModuleDeselect(moduleName);
      return;
    }
    
    // Update selected variant for this module
    const newSelectedVariants = {
      ...selectedVariants,
      [moduleName]: variantType
    };
    
    // Pass updated variants to parent component
    setSelectedVariants(newSelectedVariants);
    
    // If module wasn't selected before, toggle it on
    if (!selectedModules.includes(moduleName)) {
      toggleModule(moduleName);
    }
  };
  
  // Handle module deselection
  const handleModuleDeselect = (moduleName) => {
    // Remove this module from selected variants
    const newSelectedVariants = { ...selectedVariants };
    delete newSelectedVariants[moduleName];
    setSelectedVariants(newSelectedVariants);
    
    // Toggle the module off
    if (selectedModules.includes(moduleName)) {
      toggleModule(moduleName);
    }
  };
  
  // Group modules by pillar
  const modulesByPillar = {
    Transformation: modules.filter(module => module.pillar === "Transformation"),
    Strategy: modules.filter(module => module.pillar === "Strategy"),
    Technology: modules.filter(module => module.pillar === "Technology")
  };
  
  // Toggle dropdown and select pillar on mobile
  const handleMobilePillarSelect = (pillar) => {
    setActivePillar(pillar);
    setDropdownOpen(false);
  };
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2" />
        Select Service Modules
      </h2>
      
      {/* CEO-friendly introduction using the new component */}
      <FeatureIntroduction
        title="Build your tailored service package"
        description="Each service module is designed to address specific business needs and can be selected at different levels of engagement. Combine modules across our three strategic pillars for a comprehensive solution."
        additionalInfo="Select modules by clicking on the options. You can also de-select the options, if needed. You can mix different engagement levels based on your needs."
      />
      
      {/* Service Option Descriptions with introduction */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--elexive-primary)] mb-2">Module Delivery Options</h3>
        <p className="text-sm text-gray-700 mb-3">We offer two distinct engagement models for each module. Choose the delivery approach that best fits your timeline, budget, and implementation needs:</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-xl flex-1">
          <h3 className="font-bold text-base text-[var(--elexive-primary)] mb-1">Insight Primer</h3>
          <p className="text-sm text-gray-600 mb-2">A clear direction before investing in execution.</p>
          <p className="text-xs text-gray-500">Fixed-price, fixed-scope module: a timeboxed 2–4 week calendar time engagement with clear takeaways and effective next steps.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl flex-1">
          <h3 className="font-bold text-base text-[var(--elexive-primary)] mb-1">Integrated Execution</h3>
          <p className="text-sm text-gray-600 mb-2">A strategic partner to build and scale with you.</p>
          <p className="text-xs text-gray-500">Continuous service model combining the agile, sprint-based methodology with tailored and specific implementation.</p>
        </div>
      </div>
      
      {/* Mobile Dropdown Selector */}
      <div className="md:hidden relative mb-6 mt-4 z-20">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={
                activePillar === "Transformation" ? faUsers : 
                activePillar === "Strategy" ? faLightbulb : 
                faServer
              } 
              className="text-[var(--elexive-accent)] mr-2" 
            />
            <span className="font-medium">{activePillar}</span>
            <div className="ml-2 bg-[var(--elexive-evc-light)] rounded-full px-2 py-0.5 text-xs">
              {modulesByPillar[activePillar].length}
            </div>
          </div>
          <FontAwesomeIcon icon={dropdownOpen ? faAngleUp : faAngleDown} />
        </button>
        
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
            {Object.keys(modulesByPillar).map((pillar) => (
              <button
                key={pillar}
                onClick={() => handleMobilePillarSelect(pillar)}
                className={`
                  w-full text-left px-4 py-3 flex items-center justify-between
                  ${activePillar === pillar ? 'bg-gray-100 font-medium' : ''}
                  ${pillar !== Object.keys(modulesByPillar)[Object.keys(modulesByPillar).length - 1] ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={
                      pillar === "Transformation" ? faUsers : 
                      pillar === "Strategy" ? faLightbulb : 
                      faServer
                    } 
                    className={`mr-2 ${activePillar === pillar ? 'text-[var(--elexive-accent)]' : 'text-gray-500'}`} 
                  />
                  {pillar}
                  <div className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                    {modulesByPillar[pillar].length}
                  </div>
                </div>
                {activePillar === pillar && (
                  <FontAwesomeIcon icon={faCheck} className="text-[var(--elexive-accent)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop Pillar Tabs - Hidden on mobile */}
      <div className="hidden md:block relative mb-8 mt-6">
        {/* Light gray background for the tab container */}
        <div className="absolute inset-0 bottom-0 bg-gray-100 rounded-lg" style={{ height: '85%' }}></div>
        
        {/* Tab buttons */}
        <div className="flex relative">
          {Object.keys(modulesByPillar).map((pillar, index) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`
                relative px-4 sm:px-6 md:px-8 py-3 font-medium text-sm transition-all duration-200
                ${index === 0 ? 'ml-2' : 'ml-1'} 
                ${activePillar === pillar 
                  ? 'bg-white text-[var(--elexive-primary)] font-bold z-10 border-t-2 border-x-2 border-t-[var(--elexive-accent)] border-x-gray-200' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }
                rounded-t-lg mt-2
              `}
              style={{
                boxShadow: activePillar === pillar ? '0 -2px 4px rgba(0,0,0,0.05)' : 'none',
                marginBottom: '-1px',
                height: activePillar === pillar ? '42px' : '38px',
                marginTop: activePillar === pillar ? '0' : '4px',
              }}
            >
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={
                    pillar === "Transformation" ? faUsers : 
                    pillar === "Strategy" ? faLightbulb : 
                    faServer
                  } 
                  className={`mr-2 ${activePillar === pillar ? 'text-[var(--elexive-accent)]' : 'text-gray-500'}`} 
                />
                {pillar}
                <div className={`ml-2 ${activePillar === pillar ? 'bg-[var(--elexive-evc-light)]' : 'bg-gray-300'} rounded-full px-2 py-0.5 text-xs`}>
                  {modulesByPillar[pillar].length}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Content panel for desktop */}
        <div className="bg-white p-4 rounded-b-lg border-t-0 relative z-0 shadow-md">
          {/* Display modules by pillar */}
          {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
            <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pillarModules.map((module) => (
                  <div
                    key={module.name}
                    className={`p-3 sm:p-5 rounded-xl transition-all duration-200 ${
                      selectedModules.includes(module.name)
                        ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                        : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
                    }`}
                  >
                    {/* Category label moved to top row */}
                    <div className="flex justify-start mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        module.category === "Immediate Impact" 
                          ? 'bg-[#ECE9F3] text-[var(--elexive-primary)]' 
                          : 'bg-[#FFF0E3] text-[var(--elexive-secondary)]'
                      }`}>
                        {module.category}
                      </span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-full">
                        <div className="flex items-center mb-1">
                          <FontAwesomeIcon 
                            icon={getModuleIcon(module.pillar, module.name)} 
                            className="text-[var(--elexive-primary)] mr-2" 
                          />
                          <h3 className="font-semibold text-sm sm:text-base">{module.name}</h3>
                        </div>
                        <p className="text-xs font-medium text-[var(--elexive-primary)] mb-1">{module.heading}</p>
                        <p className="text-xs text-gray-600 mb-4">{module.description}</p>
                        
                        {/* Module options at the bottom */}
                        <div className="flex flex-col gap-2 mt-3 border-t pt-3">
                          <div 
                            onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                              selectedModules.includes(module.name) && 
                              selectedVariants[module.name] === 'insightPrimer'
                                ? 'bg-[var(--elexive-evc-light)]'
                                : 'bg-gray-100 hover:bg-[var(--elexive-evc-light)]'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-md mr-2 sm:mr-3 flex-shrink-0 flex items-center justify-center ${
                                selectedModules.includes(module.name) && 
                                selectedVariants[module.name] === 'insightPrimer'
                                  ? 'bg-[var(--elexive-evc)]' 
                                  : 'bg-gray-200'
                              }`}>
                                {selectedModules.includes(module.name) && 
                                 selectedVariants[module.name] === 'insightPrimer' && (
                                  <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium">Insight Primer</div>
                              </div>
                            </div>
                            <div className="ml-2 px-2 py-1 bg-[var(--elexive-evc-light)] rounded-md text-xs font-semibold text-[var(--elexive-evc)] whitespace-nowrap min-w-[60px] text-center">
                              {module.variants[0].evcValue} EVC
                            </div>
                          </div>
                          
                          <div 
                            onClick={() => handleVariantSelect(module.name, 'integratedExecution')}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                              selectedModules.includes(module.name) && 
                              selectedVariants[module.name] === 'integratedExecution'
                                ? 'bg-[var(--elexive-evc-light)]' 
                                : 'bg-gray-100 hover:bg-[var(--elexive-evc-light)]'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-md mr-2 sm:mr-3 flex-shrink-0 flex items-center justify-center ${
                                selectedModules.includes(module.name) && 
                                selectedVariants[module.name] === 'integratedExecution'
                                  ? 'bg-[var(--elexive-evc)]' 
                                  : 'bg-gray-200'
                              }`}>
                                {selectedModules.includes(module.name) && 
                                 selectedVariants[module.name] === 'integratedExecution' && (
                                  <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium">Integrated Execution</div>
                              </div>
                            </div>
                            <div className="ml-2 px-2 py-1 bg-[var(--elexive-evc-light)] rounded-md text-xs font-semibold text-[var(--elexive-evc)] whitespace-nowrap min-w-[60px] text-center">
                              {module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue} EVC
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Content Panel - Only visible on mobile */}
      <div className="md:hidden">
        {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
          <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 gap-4">
              {pillarModules.map((module) => (
                <div
                  key={module.name}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    selectedModules.includes(module.name)
                      ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                      : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
                  }`}
                >
                  {/* Category label */}
                  <div className="flex justify-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      module.category === "Immediate Impact" 
                        ? 'bg-[#ECE9F3] text-[var(--elexive-primary)]' 
                        : 'bg-[#FFF0E3] text-[var(--elexive-secondary)]'
                    }`}>
                      {module.category}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-full">
                      <div className="flex items-center mb-1">
                        <FontAwesomeIcon 
                          icon={getModuleIcon(module.pillar, module.name)} 
                          className="text-[var(--elexive-primary)] mr-2" 
                        />
                        <h3 className="font-semibold text-sm">{module.name}</h3>
                      </div>
                      <p className="text-xs font-medium text-[var(--elexive-primary)] mb-1">{module.heading}</p>
                      <p className="text-xs text-gray-600 mb-3">{module.description}</p>
                      
                      {/* Module options at the bottom */}
                      <div className="flex flex-col gap-2 mt-2 border-t pt-2">
                        <div 
                          onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                            selectedModules.includes(module.name) && 
                            selectedVariants[module.name] === 'insightPrimer'
                              ? 'bg-[var(--elexive-evc-light)]'
                              : 'bg-gray-100 hover:bg-[var(--elexive-evc-light)]'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-md mr-2 flex-shrink-0 flex items-center justify-center ${
                              selectedModules.includes(module.name) && 
                              selectedVariants[module.name] === 'insightPrimer'
                                ? 'bg-[var(--elexive-evc)]' 
                                : 'bg-gray-200'
                            }`}>
                              {selectedModules.includes(module.name) && 
                               selectedVariants[module.name] === 'insightPrimer' && (
                                <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                              )}
                            </div>
                            <div className="text-xs font-medium">Insight Primer</div>
                          </div>
                          <div className="ml-2 px-2 py-1 bg-[var(--elexive-evc-light)] rounded-md text-xs font-semibold text-[var(--elexive-evc)] whitespace-nowrap min-w-[60px] text-center">
                            {module.variants[0].evcValue} EVC
                          </div>
                        </div>
                        
                        <div 
                          onClick={() => handleVariantSelect(module.name, 'integratedExecution')}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                            selectedModules.includes(module.name) && 
                            selectedVariants[module.name] === 'integratedExecution'
                              ? 'bg-[var(--elexive-evc-light)]' 
                              : 'bg-gray-100 hover:bg-[var(--elexive-evc-light)]'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-md mr-2 flex-shrink-0 flex items-center justify-center ${
                              selectedModules.includes(module.name) && 
                              selectedVariants[module.name] === 'integratedExecution'
                                ? 'bg-[var(--elexive-evc)]' 
                                : 'bg-gray-200'
                            }`}>
                              {selectedModules.includes(module.name) && 
                               selectedVariants[module.name] === 'integratedExecution' && (
                                <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                              )}
                            </div>
                            <div className="text-xs font-medium">Integrated Execution</div>
                          </div>
                          <div className="ml-2 px-2 py-1 bg-[var(--elexive-evc-light)] rounded-md text-xs font-semibold text-[var(--elexive-evc)] whitespace-nowrap min-w-[60px] text-center">
                            {module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue} EVC
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;