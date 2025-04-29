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
  // Custom handler to ensure "Roadster" option always uses "Laser Beam" allocation
  const handleCapacitySelect = (capacity) => {
    setProductionCapacity(capacity);
  };

  return (
    <div className="elx-card p-6 mb-6">
      <h2 className="elx-section-heading text-2xl mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Choose Your Delivery Speed
      </h2>
      
      {/* CEO-friendly introduction using the FeatureIntroduction component */}
      <FeatureIntroduction
        title="Choose your weekly service delivery capacity"
        description="Your EVC production capacity determines how quickly we can deliver value to your organization. Select from options ranging from targeted exploration to enterprise-scale delivery."
        additionalInfo="Start with Pathfinder for focused exploration and initial implementation, or choose higher capacity tiers for faster, concurrent progress."
      />
      
      <div className="mb-4">
        {/* Use grid-cols-1 for mobile, grid-cols-2 for tablet and desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(calculatorConfig.productionCapacity).map(([key, details]) => (
            <div
              key={key}
              onClick={() => handleCapacitySelect(key)}
              className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg ${
                productionCapacity === key
                  ? 'border-amber-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header section with icon and name - using primary purple background or accent color when selected */}
              <div 
                className="px-4 py-3 flex items-center w-full"
                style={{ 
                  backgroundColor: productionCapacity === key 
                    ? 'var(--elexive-accent)' 
                    : 'var(--elexive-primary)', 
                  color: 'white'
                }}
              >
                <div 
                  className="w-8 h-8 flex items-center justify-center mr-2"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <FontAwesomeIcon 
                    icon={
                      key === "pathfinder" ? faCompass :
                      key === "roadster" ? faCar : 
                      key === "jetpack" ? faJetFighterUp : 
                      faRocket
                    } 
                    className="text-white" 
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <h3 className="font-bold text-white text-sm">{details.label}</h3>
                </div>
              </div>
              
              {/* Card content */}
              <div className="p-4 flex flex-col h-full">
                {/* Weekly capacity label and EVC value on same row */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-gray-700">Weekly capacity</span>
                  <span className="elx-evc-label">
                    {details.weeklyEVCs} EVC
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 text-left mb-3 flex-grow">{details.valueProposition}</p>
                
                {/* Selection indicator at bottom */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-medium">
                    {productionCapacity === key ? (
                      <span className="text-amber-600">Selected</span>
                    ) : (
                      <span className="text-elx-primary">Select Capacity</span>
                    )}
                  </span>
                  {productionCapacity === key ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-amber-500" />
                  ) : (
                    <FontAwesomeIcon icon={faArrowRight} className="text-elx-primary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionCapacitySelector;