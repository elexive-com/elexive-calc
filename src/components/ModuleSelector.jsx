import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPuzzlePiece, faUsers, faLightbulb, 
  faServer, faCheck, faChartBar
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
      
      {/* Pillar Tabs */}
      <div className="flex border-b mb-6">
        {Object.keys(modulesByPillar).map((pillar) => (
          <button
            key={pillar}
            onClick={() => setActivePillar(pillar)}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activePillar === pillar 
                ? 'border-b-2 border-[var(--elexive-accent)] text-[var(--elexive-primary)]' 
                : 'text-gray-500 hover:text-[var(--elexive-primary)]'
            }`}
          >
            <FontAwesomeIcon 
              icon={
                pillar === "Transformation" ? faUsers : 
                pillar === "Strategy" ? faLightbulb : 
                faServer
              } 
              className="mr-2" 
            />
            {pillar}
          </button>
        ))}
      </div>
      
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
  );
};

export default ModuleSelector;