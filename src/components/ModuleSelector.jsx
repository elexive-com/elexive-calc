import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPuzzlePiece, faUsers, faLightbulb, 
  faServer, faCheck, faChartBar,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { getModuleIcon } from '../utils/iconUtils';

const ModuleSelector = ({ 
  modules, 
  selectedModules, 
  toggleModule, 
  activePillar, 
  setActivePillar 
}) => {
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
                    onClick={() => toggleModule(module.name)}
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
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
                      <div className={`w-5 h-5 rounded-md mr-3 mt-1 flex-shrink-0 flex items-center justify-center ${
                        selectedModules.includes(module.name) ? 'bg-[var(--elexive-accent)]' : 'bg-gray-200'
                      }`}>
                        {selectedModules.includes(module.name) && (
                          <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <FontAwesomeIcon 
                            icon={getModuleIcon(module.pillar, module.name)} 
                            className="text-[var(--elexive-primary)] mr-2" 
                          />
                          <h3 className="font-semibold">{module.name}</h3>
                        </div>
                        <p className="text-xs font-medium text-[var(--elexive-primary)] mb-1">{module.heading}</p>
                        <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            <FontAwesomeIcon icon={faChartBar} className="mr-1" />
                            EVC Range: {module.variants[0].evcValue}-{module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue}
                          </span>
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