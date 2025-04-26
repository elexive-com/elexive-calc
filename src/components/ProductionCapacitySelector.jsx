import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faSeedling, 
  faJetFighterUp, faRocket
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import FeatureIntroduction from './FeatureIntroduction';

const ProductionCapacitySelector = ({ productionCapacity, setProductionCapacity }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
        EVC Production Capacity
      </h2>
      
      {/* CEO-friendly introduction using the FeatureIntroduction component */}
      <FeatureIntroduction
        title="Choose your weekly service delivery capacity"
        description="Your EVC production capacity determines how quickly we can deliver value to your organization. Higher capacity tiers allow for more concurrent service delivery and faster results."
        additionalInfo="You can adjust your capacity at any time based on your changing business needs and project timelines."
      />
      
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