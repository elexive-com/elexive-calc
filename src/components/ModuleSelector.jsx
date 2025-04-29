import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPuzzlePiece, faLayerGroup, faLightbulb, 
  faServer, faCheck, faAngleDown, faAngleUp,
  faCompass, faRocket
} from '@fortawesome/free-solid-svg-icons';
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
    Discovery: modules.filter(module => module.pillar === "Discovery"),
    Transformation: modules.filter(module => module.pillar === "Transformation"),
    Strategy: modules.filter(module => module.pillar === "Strategy"),
    Technology: modules.filter(module => module.pillar === "Technology")
  };
  
  // Toggle dropdown and select pillar on mobile
  const handleMobilePillarSelect = (pillar) => {
    setActivePillar(pillar);
    setDropdownOpen(false);
  };

  // Handle special Discovery module selection (Foundation Mapping)
  const handleDiscoveryModuleSelect = (moduleName) => {
    if (selectedModules.includes(moduleName)) {
      handleModuleDeselect(moduleName);
    } else {
      // Auto-select Insight Primer variant for Foundation Mapping
      const newSelectedVariants = {
        ...selectedVariants,
        [moduleName]: 'insightPrimer'
      };
      setSelectedVariants(newSelectedVariants);
      toggleModule(moduleName);
    }
  };
  
  // Get pillar color based on pillar type - for consistency with ModuleExplorer
  const getPillarColor = (pillar) => {
    switch(pillar.toLowerCase()) {
      case 'transformation': return '#D99000'; // Darkened from #FFBE59 for better contrast
      case 'strategy': return '#C85A30'; // Darkened from #EB8258 for better contrast
      case 'technology': return '#1F776D'; // Already had good contrast
      case 'discovery': return '#2E2266'; // Primary color for discovery
      default: return '#D99000';
    }
  };
  
  return (
    <div className="elx-card mb-6 p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-elx-primary mb-4">
        <FontAwesomeIcon icon={faPuzzlePiece} className="text-amber-500 mr-2" />
        Select Service Modules
      </h2>
      
      {/* CEO-friendly introduction using the new component */}
      <FeatureIntroduction
        title="Build your tailored service package"
        description="Each service module is designed to address specific business needs and can be selected at different levels of engagement. Combine modules across our pillars for a comprehensive solution."
        additionalInfo="Start with Foundation Mapping to define your transformation journey, then add modules from our Transformation, Strategy, and Technology pillars to build your complete solution."
      />
      
      {/* Discovery Module Section - Special standalone section */}
      {modulesByPillar.Discovery.length > 0 && (
        <div className="mb-6 mt-4">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon 
              icon={faCompass} 
              className="text-amber-500 mr-2" 
            />
            <h3 className="text-xl font-bold text-elx-primary">Discovery</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 bg-elx-pillar-bg-discovery p-4 rounded-xl border border-gray-200">
            {modulesByPillar.Discovery.map((module) => (
              <div
                key={module.name}
                onClick={() => handleDiscoveryModuleSelect(module.name)}
                className={`flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  selectedModules.includes(module.name)
                    ? 'border-2 border-amber-500 shadow-md'
                    : 'border border-gray-200 hover:border-amber-400 hover:shadow'
                }`}
              >
                {/* Colored header section with pillar name - matching ModuleExplorer style */}
                <div 
                  className="px-4 py-3 flex items-center w-full"
                  style={{ 
                    backgroundColor: getPillarColor("Discovery"),
                    color: 'white'
                  }}
                >
                  <div 
                    className="w-8 h-8 flex items-center justify-center mr-2"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <FontAwesomeIcon icon={faCompass} />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <h3 className="font-bold text-white text-sm">Discovery</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
                      Strategic Assessment
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="w-full">
                      <div className="mb-1">
                        <h3 className="font-semibold text-base text-gray-800">{module.name}</h3>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{module.heading}</p>
                      <p className="text-xs text-gray-600 mb-3">{module.description}</p>
                      
                      {/* Single module option */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div
                          className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                            selectedModules.includes(module.name) 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                              selectedModules.includes(module.name) 
                                ? 'bg-blue-600' 
                                : 'border border-gray-300 bg-white'
                            }`}>
                              {selectedModules.includes(module.name) && (
                                <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                              )}
                            </div>
                            <div className="text-sm font-medium">Fixed-scope assessment</div>
                          </div>
                          <span className="elx-evc-label">
                            {module.variants[0].evcValue} EVC
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Service Option Descriptions with introduction */}
      <div className="mb-4 mt-6">
        <h3 className="text-xl font-bold text-elx-primary mb-2">Transformation Module Options</h3>
        <p className="text-sm text-gray-700 mb-3">We offer two distinct engagement models for each transformation module. Choose the delivery approach that best fits your timeline, budget, and implementation needs:</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 my-6">
        <div className="bg-blue-50 p-4 rounded-xl flex-1 border border-blue-100">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <h3 className="font-bold text-base text-gray-800">Insight Primer</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">A clear direction before investing in execution.</p>
          <p className="text-xs text-gray-600">Fixed-price, fixed-scope module: a timeboxed 2–4 week calendar time engagement with clear takeaways and effective next steps.</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex-1 border border-green-100">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <h3 className="font-bold text-base text-gray-800">Integrated Execution</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">A strategic partner to build and scale with you.</p>
          <p className="text-xs text-gray-600">Continuous service model combining the agile, sprint-based methodology with tailored and specific implementation.</p>
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
              icon={faLayerGroup}
              className="text-amber-500 mr-2" 
            />
            <span className="font-medium">{activePillar}</span>
            <div className="ml-2 bg-teal-50 rounded-full px-2 py-0.5 text-xs">
              {modulesByPillar[activePillar].length}
            </div>
          </div>
          <FontAwesomeIcon icon={dropdownOpen ? faAngleUp : faAngleDown} />
        </button>
        
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
            {Object.keys(modulesByPillar).filter(pillar => pillar !== "Discovery").map((pillar) => (
              <button
                key={pillar}
                onClick={() => handleMobilePillarSelect(pillar)}
                className={`
                  w-full text-left px-4 py-3 flex items-center justify-between
                  ${activePillar === pillar ? 'bg-gray-100 font-medium' : ''}
                  ${pillar !== Object.keys(modulesByPillar).filter(p => p !== "Discovery")[Object.keys(modulesByPillar).filter(p => p !== "Discovery").length - 1] ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={
                      pillar === "Transformation" ? faLayerGroup : 
                      pillar === "Strategy" ? faLightbulb : 
                      faServer
                    } 
                    className={`mr-2 ${activePillar === pillar ? 'text-amber-500' : 'text-gray-500'}`} 
                  />
                  {pillar}
                  <div className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                    {modulesByPillar[pillar].length}
                  </div>
                </div>
                {activePillar === pillar && (
                  <FontAwesomeIcon icon={faCheck} className="text-amber-500" />
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
          {Object.keys(modulesByPillar).filter(pillar => pillar !== "Discovery").map((pillar, index) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`
                relative px-4 sm:px-6 md:px-8 py-3 font-medium text-sm transition-all duration-200
                ${index === 0 ? 'ml-2' : 'ml-1'} 
                ${activePillar === pillar 
                  ? 'bg-white text-elx-primary font-bold z-10 border-t-2 border-x-2 border-t-amber-500 border-x-gray-200' 
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
                  icon={faLayerGroup}
                  className={`mr-2 ${activePillar === pillar ? 'text-amber-500' : 'text-gray-500'}`} 
                />
                {pillar}
                <div className={`ml-2 ${activePillar === pillar ? 'bg-teal-50' : 'bg-gray-300'} rounded-full px-2 py-0.5 text-xs`}>
                  {modulesByPillar[pillar].length}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Content panel for desktop */}
        <div className="bg-white p-4 rounded-b-lg border-t-0 relative z-0 shadow-md">
          {/* Display modules by pillar */}
          {Object.entries(modulesByPillar).filter(([pillar]) => pillar !== "Discovery").map(([pillar, pillarModules]) => (
            <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pillarModules.map((module) => (
                  <div
                    key={module.name}
                    className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 ${
                      selectedModules.includes(module.name)
                        ? 'shadow-md border-gray-300'
                        : 'border-gray-200 hover:shadow'
                    }`}
                  >
                    {/* Colored header section with pillar name - matching ModuleExplorer style */}
                    <div 
                      className="px-4 py-3 flex items-center w-full"
                      style={{ 
                        backgroundColor: getPillarColor(pillar),
                        color: 'white'
                      }}
                    >
                      <div 
                        className="w-8 h-8 flex items-center justify-center mr-2"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <FontAwesomeIcon 
                          icon={faLayerGroup}
                        />
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <h3 className="font-bold text-white text-sm">{pillar}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
                          {module.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <div className="flex items-start">
                        <div className="w-full">
                          <div className="mb-1">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800">{module.name}</h3>
                          </div>
                          <p className="text-xs font-medium text-gray-700 mb-1">{module.heading}</p>
                          <p className="text-xs text-gray-600 mb-4 line-clamp-3">{module.description}</p>
                          
                          {/* Module options at the bottom */}
                          <div className="flex flex-col gap-2 mt-3 border-t pt-3">
                            {/* Show single size option or double size options based on module configuration */}
                            {module.singleSizeOnly ? (
                              <div 
                                onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                  selectedModules.includes(module.name)
                                    ? 'bg-blue-50 border border-blue-200' 
                                    : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                    selectedModules.includes(module.name)
                                      ? 'bg-blue-600' 
                                      : 'border border-gray-300 bg-white'
                                  }`}>
                                    {selectedModules.includes(module.name) && (
                                      <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                    )}
                                  </div>
                                  <div className="text-xs sm:text-sm font-medium">Fixed-scope Module</div>
                                </div>
                                <span className="elx-evc-label">
                                  {module.variants[0].evcValue} EVC
                                </span>
                              </div>
                            ) : (
                              <>
                                <div 
                                  onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                    selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'insightPrimer'
                                      ? 'bg-blue-50 border border-blue-200' 
                                      : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                      selectedModules.includes(module.name) && 
                                      selectedVariants[module.name] === 'insightPrimer'
                                        ? 'bg-blue-600' 
                                        : 'border border-gray-300 bg-white'
                                    }`}>
                                      {selectedModules.includes(module.name) && 
                                      selectedVariants[module.name] === 'insightPrimer' && (
                                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 mr-1 text-xs" />
                                      <div className="text-xs font-medium">Insight Primer</div>
                                    </div>
                                  </div>
                                  <span className="elx-evc-label">
                                    {module.variants[0].evcValue} EVC
                                  </span>
                                </div>
                                
                                <div 
                                  onClick={() => handleVariantSelect(module.name, 'integratedExecution')}
                                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                    selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'integratedExecution'
                                      ? 'bg-green-50 border border-green-200' 
                                      : 'bg-gray-50 border border-gray-200 hover:bg-green-50'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                      selectedModules.includes(module.name) && 
                                      selectedVariants[module.name] === 'integratedExecution'
                                        ? 'bg-green-600' 
                                        : 'border border-gray-300 bg-white'
                                    }`}>
                                      {selectedModules.includes(module.name) && 
                                      selectedVariants[module.name] === 'integratedExecution' && (
                                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <FontAwesomeIcon icon={faRocket} className="text-green-600 mr-1 text-xs" />
                                      <div className="text-xs font-medium">Integrated Execution</div>
                                    </div>
                                  </div>
                                  <span className="elx-evc-label">
                                    {module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue} EVC
                                  </span>
                                </div>
                              </>
                            )}
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
        {Object.entries(modulesByPillar).filter(([pillar]) => pillar !== "Discovery").map(([pillar, pillarModules]) => (
          <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 gap-4">
              {pillarModules.map((module) => (
                <div
                  key={module.name}
                  className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 ${
                    selectedModules.includes(module.name)
                      ? 'shadow-md border-gray-300'
                      : 'border-gray-200 hover:shadow'
                  }`}
                >
                  {/* Colored header section with pillar name - matching ModuleExplorer style */}
                  <div 
                    className="px-4 py-3 flex items-center w-full"
                    style={{ 
                      backgroundColor: getPillarColor(pillar),
                      color: 'white'
                    }}
                  >
                    <div 
                      className="w-8 h-8 flex items-center justify-center mr-2"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <FontAwesomeIcon icon={faLayerGroup} />
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <h3 className="font-bold text-white text-sm">{pillar}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
                        {module.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="w-full">
                        <div className="mb-1">
                          <h3 className="font-semibold text-sm text-gray-800">{module.name}</h3>
                        </div>
                        <p className="text-xs font-medium text-gray-700 mb-1">{module.heading}</p>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-3">{module.description}</p>
                        
                        {/* Module options at the bottom */}
                        <div className="flex flex-col gap-2 mt-2 border-t pt-2">
                          {module.singleSizeOnly ? (
                            <div 
                              onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                selectedModules.includes(module.name)
                                  ? 'bg-blue-50 border border-blue-200' 
                                  : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                  selectedModules.includes(module.name)
                                    ? 'bg-blue-600' 
                                    : 'border border-gray-300 bg-white'
                                }`}>
                                  {selectedModules.includes(module.name) && (
                                    <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                  )}
                                </div>
                                <div className="text-xs font-medium">Fixed-scope Module</div>
                              </div>
                              <span className="elx-evc-label">
                                {module.variants[0].evcValue} EVC
                              </span>
                            </div>
                          ) : (
                            <>
                              <div 
                                onClick={() => handleVariantSelect(module.name, 'insightPrimer')}
                                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                  selectedModules.includes(module.name) && 
                                  selectedVariants[module.name] === 'insightPrimer'
                                    ? 'bg-blue-50 border border-blue-200' 
                                    : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                    selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'insightPrimer'
                                      ? 'bg-blue-600' 
                                      : 'border border-gray-300 bg-white'
                                  }`}>
                                    {selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'insightPrimer' && (
                                      <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 mr-1 text-xs" />
                                    <div className="text-xs font-medium">Insight Primer</div>
                                  </div>
                                </div>
                                <span className="elx-evc-label">
                                  {module.variants[0].evcValue} EVC
                                </span>
                              </div>
                              
                              <div 
                                onClick={() => handleVariantSelect(module.name, 'integratedExecution')}
                                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                  selectedModules.includes(module.name) && 
                                  selectedVariants[module.name] === 'integratedExecution'
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-gray-50 border border-gray-200 hover:bg-green-50'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                    selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'integratedExecution'
                                      ? 'bg-green-600' 
                                      : 'border border-gray-300 bg-white'
                                  }`}>
                                    {selectedModules.includes(module.name) && 
                                    selectedVariants[module.name] === 'integratedExecution' && (
                                      <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <FontAwesomeIcon icon={faRocket} className="text-green-600 mr-1 text-xs" />
                                    <div className="text-xs font-medium">Integrated Execution</div>
                                  </div>
                                </div>
                                <span className="elx-evc-label">
                                  {module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue} EVC
                                </span>
                              </div>
                            </>
                          )}
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