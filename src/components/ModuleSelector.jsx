import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPuzzlePiece, faUsers, faLightbulb, 
  faServer, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { getModuleIcon } from '../utils/iconUtils';

const ModuleSelector = ({ 
  modules, 
  selectedModules, 
  toggleModule, 
  activePillar, 
  setActivePillar,
  selectedVariants = {},
  setSelectedVariants
}) => {
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
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2" />
        Select Service Modules
      </h2>
      <p className="text-gray-600 mb-4">Choose the components that match your strategic needs</p>
      
      {/* Pillar Tabs - Enhanced to look like folder tabs with original icons */}
      <div className="relative mb-8 mt-6">
        <div className="absolute inset-0 bottom-0 bg-gray-100 rounded-b-lg" style={{ height: '85%' }}></div>
        <div className="flex relative">
          {Object.keys(modulesByPillar).map((pillar, index) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`
                relative px-8 py-3 font-medium text-sm transition-all duration-200
                ${index === 0 ? 'ml-2' : 'ml-1'} 
                ${activePillar === pillar 
                  ? 'bg-white text-[var(--elexive-primary)] font-bold z-10' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }
                rounded-t-lg mt-2
              `}
              style={{
                boxShadow: activePillar === pillar ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none',
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
                <div className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                  {modulesByPillar[pillar].length}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Content panel */}
        <div className="bg-white p-4 rounded-b-lg border-t-0 relative z-0 shadow-md">
          {/* Display modules by pillar */}
          {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
            <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pillarModules.map((module) => (
                  <div
                    key={module.name}
                    className={`p-5 rounded-xl transition-all duration-200 ${
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
                      <div>
                        <div className="flex items-center mb-1">
                          <FontAwesomeIcon 
                            icon={getModuleIcon(module.pillar, module.name)} 
                            className="text-[var(--elexive-primary)] mr-2" 
                          />
                          <h3 className="font-semibold">{module.name}</h3>
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
                              <div className={`w-5 h-5 rounded-md mr-3 flex-shrink-0 flex items-center justify-center ${
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
                                <div className="text-sm font-medium">Insight Primer</div>
                                <div className="text-xs text-gray-600">Quick assessment and basic insights</div>
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
                              <div className={`w-5 h-5 rounded-md mr-3 flex-shrink-0 flex items-center justify-center ${
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
                                <div className="text-sm font-medium">Integrated Execution</div>
                                <div className="text-xs text-gray-600">Comprehensive implementation and support</div>
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
    </div>
  );
};

export default ModuleSelector;