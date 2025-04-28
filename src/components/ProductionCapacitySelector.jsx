import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faCar, 
  faJetFighterUp, faRocket,
  faCompass, faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import FeatureIntroduction from './FeatureIntroduction';

const ProductionCapacitySelector = ({ productionCapacity, setProductionCapacity }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-elx-primary mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        EVC Production Capacity
      </h2>
      
      {/* CEO-friendly introduction using the FeatureIntroduction component */}
      <FeatureIntroduction
        title="Choose your weekly service delivery capacity"
        description="Your EVC production capacity determines how quickly we can deliver value to your organization. Select from options ranging from targeted exploration to enterprise-scale delivery."
        additionalInfo="Start with Pathfinder for focused exploration and initial implementation, or choose higher capacity tiers for faster, concurrent progress."
      />
      
      <div className="mb-4">
        {/* Changed from md:grid-cols-4 to md:grid-cols-2 for a 2x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(calculatorConfig.productionCapacity).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setProductionCapacity(key)}
              className={`p-5 rounded-xl transition-all duration-200 ${
                productionCapacity === key
                  ? 'bg-elx-discovery-bg border-2 border-elx-accent shadow'
                  : 'bg-gray-50 border border-gray-200 hover:border-elx-accent hover:shadow'
              }`}
            >
              <div className="flex flex-col items-center">
                <FontAwesomeIcon 
                  icon={
                    key === "pathfinder" ? faCompass :
                    key === "roadster" ? faCar : 
                    key === "jetpack" ? faJetFighterUp : 
                    faRocket
                  } 
                  className="text-elx-primary text-2xl mb-3" 
                />
                <h3 className="font-bold text-lg text-elx-primary">{details.label}</h3>
                
                {/* Updated EVC label to match the style used in ModuleSelector */}
                <div className="mt-2 mb-3 flex items-center justify-center">
                  <span className="elx-evc-label">
                    {details.weeklyEVCs} EVC
                  </span>
                  <span className="text-xs text-gray-500 ml-1">per week</span>
                </div>
                
                <p className="text-sm text-gray-600 text-center mt-1">{details.valueProposition}</p>
                
                {/* Selection indicator - shows "Selected" when this capacity is chosen */}
                <div className="mt-3">
                  {productionCapacity === key ? (
                    <div className="bg-elx-accent text-white py-1.5 px-3 rounded flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  ) : (
                    <div className="text-elx-primary hover:text-elx-accent py-1.5 rounded flex items-center gap-1.5 opacity-60">
                      <span className="text-sm">Select Capacity</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionCapacitySelector;