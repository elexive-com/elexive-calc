import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faSeedling, 
  faJetFighterUp, faRocket
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const ProductionCapacitySelector = ({ productionCapacity, setProductionCapacity }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
        EVC Production Capacity
      </h2>
      <p className="text-gray-600 mb-6">
        Select your weekly EVC production capacity based on your business needs.
        Higher capacity tiers provide more EVCs per week for larger projects.
      </p>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(calculatorConfig.productionCapacity).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setProductionCapacity(key)}
              className={`p-5 rounded-xl transition-all duration-200 ${
                productionCapacity === key
                  ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                  : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
              }`}
            >
              <div className="flex flex-col items-center">
                <FontAwesomeIcon 
                  icon={
                    key === "seedling" ? faSeedling : 
                    key === "jetpack" ? faJetFighterUp : 
                    faRocket
                  } 
                  className="text-[var(--elexive-primary)] text-2xl mb-3" 
                />
                <h3 className="font-bold text-lg text-[var(--elexive-primary)]">{details.label}</h3>
                <div className={`text-sm ${details.colorClass} rounded-full px-3 py-1 my-2`}>
                  {details.weeklyEVCs} EVCs/week
                </div>
                <p className="text-sm text-gray-600 text-center mt-1">{details.valueProposition}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionCapacitySelector;