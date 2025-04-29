import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faLightbulb, 
  faServer, faCheck, faAngleDown, faAngleUp,
  faCompass, faRocket, faChevronRight, faChevronDown,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const ModuleSelector = ({ 
  modules, 
  selectedModules, 
  toggleModule, 
  activePillar, 
  setActivePillar,
  selectedVariants = {},
  setSelectedVariants
}) => {
  // State for expanded pillars in the accordion
  const [expandedPillars, setExpandedPillars] = useState({
    Discovery: true,
    Transformation: false,
    Strategy: false,
    Technology: false
  });
  
  // State for module options explainer visibility
  const [isOptionsExplainerVisible, setIsOptionsExplainerVisible] = useState(false);
  
  // Toggle module options explainer visibility
  const toggleOptionsExplainer = () => {
    setIsOptionsExplainerVisible(!isOptionsExplainerVisible);
  };
  
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
  
  // Toggle accordion expansion for a pillar
  const togglePillarExpansion = (pillar) => {
    setExpandedPillars(prev => ({
      ...prev,
      [pillar]: !prev[pillar]
    }));
  };

  // Get pillar icon based on pillar type
  const getPillarIcon = (pillar) => {
    switch(pillar.toLowerCase()) {
      case 'discovery': return faCompass;
      case 'transformation': return faLayerGroup; 
      case 'strategy': return faLightbulb;
      case 'technology': return faServer;
      default: return faLayerGroup;
    }
  };
  
  // Get pillar color based on pillar type
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
      <h2 className="elx-section-heading text-2xl mb-4">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Select Service Modules
      </h2>
      
      <p className="text-gray-700 mb-6">
        Each service module is designed to address specific business needs and can be selected at different 
        levels of engagement. Combine modules across our pillars for a comprehensive solution.
      </p>
      
      {/* Module Options Explainer - Hidden by default */}
      <div className="mb-4 mt-6">
        <button 
          onClick={toggleOptionsExplainer}
          className="flex items-center justify-between w-full text-left text-base font-bold text-elx-primary mb-2"
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-elx-accent" />
            Learn more about Insight Primer and Integrated Execution options
          </div>
          <FontAwesomeIcon 
            icon={isOptionsExplainerVisible ? faAngleUp : faAngleDown} 
            className="text-elx-accent"
          />
        </button>
        
        {isOptionsExplainerVisible && (
          <div className="flex flex-col md:flex-row gap-4 my-4 animate-fadeIn">
            <div className="bg-blue-50 p-4 rounded-xl flex-1 border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <h3 className="font-bold text-base text-gray-800">Insight Primer</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">A clear direction before investing in execution.</p>
              <p className="text-xs text-gray-600 mb-3">Fixed-price, fixed-scope module: a timeboxed 2–4 week calendar time engagement with clear takeaways and effective next steps.</p>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">When to choose Insight Primer:</h4>
              <ul className="text-xs text-gray-700 list-disc pl-4 mb-3">
                <li>When you need rapid validation of a concept before full investment</li>
                <li>When budget constraints require a focused, efficient approach</li>
                <li>When facing uncertainty about exactly what solution would best fit your needs</li>
                <li>Ideal for early-stage exploration or when entering new market territories</li>
              </ul>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Sizing and resource allocation:</h4>
              <p className="text-xs text-gray-600 mb-2">Typically requires 2-3 experts working part-time over the 2-4 week period. Focuses on high-value insights and actionable recommendations rather than implementation.</p>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">In presets:</h4>
              <p className="text-xs text-gray-600">Automatically selected in "Rapid Assessment" and "Strategic Foundations" presets. These presets are structured to provide a comprehensive overview without immediate execution commitments.</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl flex-1 border border-green-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                  <FontAwesomeIcon icon={faRocket} />
                </div>
                <h3 className="font-bold text-base text-gray-800">Integrated Execution</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">A strategic partner to build and scale with you.</p>
              <p className="text-xs text-gray-600 mb-3">Continuous service model combining the agile, sprint-based methodology with tailored and specific implementation. Typically spans 3-12 months based on scope and complexity.</p>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">When to choose Integrated Execution:</h4>
              <ul className="text-xs text-gray-700 list-disc pl-4 mb-3">
                <li>When you've committed to a direction and need expert implementation</li>
                <li>When complex, cross-functional challenges require ongoing expertise</li>
                <li>When you need a team that can adapt to evolving business needs</li>
                <li>Ideal for mission-critical initiatives with significant business impact</li>
              </ul>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Sizing and resource allocation:</h4>
              <p className="text-xs text-gray-600 mb-2">Scales from 3-10+ experts depending on scope, working in dedicated sprint teams. Includes implementation, technical expertise, and ongoing strategic guidance.</p>
              
              <h4 className="text-sm font-semibold text-gray-800 mb-1">In presets:</h4>
              <p className="text-xs text-gray-600">Automatically selected in "Full Transformation" and "Technology Excellence" presets. These presets are designed for organizations ready to commit to implementation and seeking comprehensive support.</p>
            </div>
          </div>
        )}
      </div>
      

      {/* Module Accordion Sections */}
      <div className="space-y-4">
        {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
          <div key={pillar} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Pillar Header - Clickable to expand/collapse */}
            <button 
              onClick={() => togglePillarExpansion(pillar)}
              className="w-full flex items-center justify-between p-4"
              style={{ 
                backgroundColor: getPillarColor(pillar),
                color: 'white'
              }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-2">
                  <FontAwesomeIcon icon={getPillarIcon(pillar)} className="text-white" />
                </div>
                <h3 className="font-bold">{pillar}</h3>
                <div className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                  {pillarModules.length}
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs mr-3">
                  {pillarModules.filter(module => selectedModules.includes(module.name)).length} selected
                </div>
                <FontAwesomeIcon 
                  icon={expandedPillars[pillar] ? faChevronDown : faChevronRight} 
                  className="text-white text-sm" 
                />
              </div>
            </button>
            
            {/* Pillar Content - Shown when expanded */}
            {expandedPillars[pillar] && (
              <div className="bg-white p-4">
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
                      {/* Module header */}
                      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-b">
                        <div className="flex items-center">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-800">{module.name}</h3>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
                          {module.category}
                        </span>
                      </div>
                      
                      <div className="p-4 flex-grow">
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
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleSelector;