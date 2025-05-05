import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faCar, 
  faJetFighterUp, faRocket,
  faCompass, faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const ProductionCapacitySelector = ({ productionCapacity, setProductionCapacity, recommendedCapacity }) => {
  // Custom handler to ensure "Roadster" option always uses "Laser Beam" allocation
  const handleCapacitySelect = (capacity) => {
    setProductionCapacity(capacity);
  };
  
  // Handler for the Continue button that expands the next step
  const handleContinue = () => {
    // Then dispatch a custom event to expand and scroll to Step 3
    const customEvent = new CustomEvent('expand-next-step', { detail: { stepNumber: 3 } });
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="elx-card p-6 mb-6">
      <h2 className="elx-section-heading text-2xl mb-4">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Choose Your Delivery Speed
      </h2>
      
      <p className="text-gray-700 mb-6">
        Think of this as choosing your business transformation pace. Whether you need targeted solutions for specific challenges or enterprise-wide transformation, this selection determines how quickly we'll deliver results together. Your choice here balances speed with the scope of what we can accomplish each week.
      </p>
      
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
                
                <p className="text-sm text-gray-600 text-left mb-3 flex-grow">
                  {key === "pathfinder" ? (
                    <>
                      <span className="font-medium text-elx-primary">Exploration & Discovery</span> — Pathfinder is your guide through uncharted territory. Perfect when you're starting your transformation journey and need to validate direction before scaling. Ideal for exploring new strategies or testing assumptions with minimal investment and maximum learning.
                    </>
                  ) : key === "roadster" ? (
                    <>
                      <span className="font-medium text-elx-primary">Reliability & Momentum</span> — Roadster keeps you moving forward with confidence. Delivers consistent results that build momentum without overwhelming your teams. Great for businesses that need steady transformation without disrupting day-to-day operations.
                    </>
                  ) : key === "jetpack" ? (
                    <>
                      <span className="font-medium text-elx-primary">Acceleration & Scaling</span> — Jetpack takes you beyond conventional growth limits. Provides the boost when you need to accelerate beyond organic growth. This option is designed for businesses ready to scale quickly and gain competitive advantage through faster implementation of strategic initiatives.
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-elx-primary">Velocity & Transformation</span> — Rocketship launches your enterprise-level change at maximum speed. Delivers transformative power when time is critical. Choose this when market windows are narrow or when you need to quickly capitalize on emerging opportunities.
                    </>
                  )}
                </p>
                
                {/* Recommended for preset label */}
                {recommendedCapacity === key && (
                  <div className="mb-3 py-1 px-2 bg-green-50 text-green-700 text-xs font-medium rounded-md flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                    Recommended for preset
                  </div>
                )}
                
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
      
      {/* Continue button positioned at the bottom right corner */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleContinue}
          className="elx-btn elx-btn-accent px-4 py-2 text-sm"
        >
          Continue
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ProductionCapacitySelector;