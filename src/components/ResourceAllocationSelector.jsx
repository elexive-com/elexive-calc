import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faBullseye, 
  faProjectDiagram, faTasks
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const ResourceAllocationSelector = ({ resourceAllocation, setResourceAllocation }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
        Weekly Burn Allocation
      </h2>
      <p className="text-gray-600 mb-6">
        Select how you'd like to distribute your EVC production capacity across your strategic initiatives.
        Different allocation strategies impact your total output value.
      </p>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(calculatorConfig.resourceAllocation).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setResourceAllocation(key)}
              className={`p-5 rounded-xl transition-all duration-200 ${
                resourceAllocation === key
                  ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                  : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
              }`}
            >
              <div className="flex flex-col items-center">
                <FontAwesomeIcon 
                  icon={
                    key === "focused" ? faBullseye : 
                    key === "balanced" ? faProjectDiagram : 
                    faTasks
                  } 
                  className="text-[var(--elexive-primary)] text-2xl mb-3" 
                />
                <h3 className="font-bold text-lg text-[var(--elexive-primary)]">{details.description}</h3>
                <div className="text-sm bg-[var(--elexive-accent-light)] rounded-full px-3 py-1 my-2">
                  {details.label}
                </div>
                <p className="text-sm text-gray-600 text-center mt-1">{details.valueProposition}</p>
                <div className="mt-3 px-3 py-1 bg-[#ECE9F3] rounded-lg text-xs text-center">
                  <span className="font-medium text-[var(--elexive-primary)]">
                    Output multiplier: {details.outputMultiplier}x
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocationSelector;