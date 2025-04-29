import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faLightbulb, 
  faBullhorn, faGlobe, 
  faCheckCircle,
  faArrowRight, faQuestionCircle, 
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import FeatureIntroduction from './FeatureIntroduction';

// Added default value 'focused' for resourceAllocation parameter
const ResourceAllocationSelector = ({ resourceAllocation = 'focused', setResourceAllocation, productionCapacity }) => {
  const [showExplainer, setShowExplainer] = useState(false);
  
  // Helper function to determine if a strategy is recommended for current capacity
  const isRecommendedStrategy = (strategy) => {
    // For pathfinder and roadster tiers, recommend Laser Beam for maximum efficiency
    if ((productionCapacity === 'roadster' || productionCapacity === 'pathfinder') && strategy === 'focused') return true;
    // For jetpack tier, Smart Campaign can be a good balance
    if (productionCapacity === 'jetpack' && strategy === 'balanced') return true;
    // For rocketship tier, any strategy can work well
    return false;
  };
  
  // Helper function to determine if a strategy is disabled based on production capacity
  const isStrategyDisabled = (strategy) => {
    // If Pathfinder capacity, only Laser Beam (focused) is available
    if (productionCapacity === 'pathfinder') {
      return strategy !== 'focused';
    }
    // If Roadster capacity, only Laser Beam (focused) is available - changed to restrict to focused only
    if (productionCapacity === 'roadster') {
      return strategy !== 'focused';
    }
    // If Jetpack capacity, only Laser Beam (focused) and Smart Campaign (balanced) are available
    if (productionCapacity === 'jetpack') {
      return strategy === 'distributed';
    }
    // Rocketship capacity can use all strategies
    return false;
  };
  
  // Function to handle allocation selection with validation
  const handleAllocationSelect = (key) => {
    // Only allow selection if the strategy is not disabled
    if (!isStrategyDisabled(key)) {
      setResourceAllocation(key);
    }
  };
  
  // Helper to generate example use cases based on strategy
  const getStrategyExample = (strategy) => {
    switch(strategy) {
      case 'focused':
        return "Ideal for transformational initiatives requiring deep expertise";
      case 'balanced':
        return "Perfect for maintaining strategic focus while handling operational needs";
      case 'distributed':
        return "Best for businesses managing multiple parallel growth initiatives";
      default:
        return "";
    }
  };
  
  // Get strategy icon
  const getStrategyIcon = (key) => {
    switch(key) {
      case 'focused': return faLightbulb;
      case 'balanced': return faBullhorn;
      case 'distributed': return faGlobe;
      default: return faLightbulb;
    }
  };
  
  // Get context switching overhead percentage from config
  const getSwitchingCost = (key) => {
    return calculatorConfig.resourceAllocation[key].switchingOverhead;
  };
  
  // Get overhead label from config
  const getOverheadLabel = (key) => {
    return calculatorConfig.resourceAllocation[key].overheadLabel;
  };

  return (
    <div className="elx-card p-6 mb-6">
      <h2 className="elx-section-heading text-2xl">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Resource Allocation Strategy
      </h2>
      
      {/* CEO-friendly introduction using the FeatureIntroduction component */}
      <FeatureIntroduction
        title="Choose how to deploy your resources"
        description="Your allocation strategy determines how effectively your EVC capacity translates into business results. Each approach has different efficiency impacts based on focus and context switching. "
        additionalInfo="Each strategy distributes your attention across a different number of concurrent initiatives. Laser Beam concentrates 100% of focus on a single priority, while other strategies spread your resources across multiple initiatives to increase overall impact at the cost of per-initiative focus."
      />
      
      {/* Context switching explainer toggle button */}
      <button 
        onClick={() => setShowExplainer(!showExplainer)}
        className="flex items-center gap-2 mb-4 text-sm font-medium text-elx-primary hover:text-elx-accent transition-colors"
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
        <span>How context switching affects productivity</span>
        <FontAwesomeIcon icon={showExplainer ? faChevronUp : faChevronDown} className="text-xs" />
      </button>
      
      {/* Detailed context switching explainer - hidden by default */}
      {showExplainer && (
        <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn">
          <h3 className="elx-section-heading text-lg mb-3">Context Switching & Team Productivity</h3>

          <p className="text-sm text-gray-700">
              Modern teams minimize switching costs through specialized roles and collaborative tools.
              Smart Campaign maintains high efficiency with only {getSwitchingCost('balanced')}% context switching overhead by pairing related initiatives.
              Even our Omni-Channel approach achieves good productive time through agile methodologies, 
              maintaining {100 - getSwitchingCost('distributed')}% productivity while managing multiple parallel workstreams.
          </p>
          <br></br>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - explanation */}
            <div>
              <h4 className="elx-section-heading text-base">How We Calculate Overhead</h4>
              <p className="text-sm text-gray-700 mb-3">
                Context switching costs vary based on team composition and resource type. Our model accounts for:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Team size effects:</span> Larger teams can distribute work to specialists</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Role-based impacts:</span> Coordination roles (e.g., account managers) experience higher switching costs</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">AI-enhanced work:</span> AI tools maintain consistent performance regardless of parallel tasks</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Research basis:</span> Studies show context switching can reduce productivity by 20-40%</div>
                </li>
              </ul>
            </div>
            
            {/* Right column - visual */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="elx-section-heading text-base text-center">Overhead by Allocation Strategy</h4>
              
              {/* Laser Beam visualization */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLightbulb} className="text-elx-primary" />
                    <span className="font-medium">Laser Beam</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{getSwitchingCost('focused')}% overhead</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-6 bg-gray-100 rounded overflow-hidden flex">
                    <div className="w-full bg-green-100 h-full flex items-center justify-center text-xs text-green-700">
                      100% productive time
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Smart Campaign visualization */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBullhorn} className="text-elx-primary" />
                    <span className="font-medium">Smart Campaign</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{getSwitchingCost('balanced')}% overhead</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-6 bg-gray-100 rounded overflow-hidden flex">
                    <div 
                      className="bg-green-100 h-full flex items-center justify-center text-xs text-green-700"
                      style={{ width: `${100 - getSwitchingCost('balanced')}%` }}
                    >
                      {100 - getSwitchingCost('balanced')}% productive time
                    </div>
                    <div 
                      className="bg-yellow-200 h-full flex items-center justify-center text-xs text-yellow-800"
                      style={{ width: `${getSwitchingCost('balanced')}%` }}
                    >
                      {getSwitchingCost('balanced')}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Omni-Channel visualization */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGlobe} className="text-elx-primary" />
                    <span className="font-medium">Omni-Channel</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{getSwitchingCost('distributed')}% overhead</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-6 bg-gray-100 rounded overflow-hidden flex">
                    <div 
                      className="bg-green-100 h-full flex items-center justify-center text-xs text-green-700"
                      style={{ width: `${100 - getSwitchingCost('distributed')}%` }}
                    >
                      {100 - getSwitchingCost('distributed')}% productive time
                    </div>
                    <div 
                      className="bg-orange-100 h-full flex items-center justify-center text-xs text-orange-700"
                      style={{ width: `${getSwitchingCost('distributed')}%` }}
                    >
                      {getSwitchingCost('distributed')}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Redesigned allocation strategy cards - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {Object.entries(calculatorConfig.resourceAllocation).map(([key, details]) => (
          <div
            key={key}
            onClick={() => handleAllocationSelect(key)}
            className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg ${
              resourceAllocation === key
                ? 'border-amber-500 shadow-md'
                : isStrategyDisabled(key)
                  ? 'border-gray-200 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Header section with icon and name - using primary purple background or accent color when selected */}
            <div 
              className="px-4 py-3 flex items-center w-full"
              style={{ 
                backgroundColor: resourceAllocation === key 
                  ? 'var(--elexive-accent)' 
                  : 'var(--elexive-primary)', 
                color: 'white',
                opacity: isStrategyDisabled(key) ? 0.7 : 1
              }}
            >
              <div 
                className="w-8 h-8 flex items-center justify-center mr-2"
                style={{ backgroundColor: 'transparent' }}
              >
                <FontAwesomeIcon 
                  icon={getStrategyIcon(key)}
                  className="text-white" 
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <h3 className="font-bold text-white text-sm">{details.description}</h3>
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4 flex flex-col h-full">
              {/* Strategy label and context switching overhead on same row */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-700">{details.label}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                  key === 'focused' 
                    ? 'bg-green-100 text-green-800' 
                    : key === 'balanced'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-orange-100 text-orange-800'
                }`}>
                  {getOverheadLabel(key)}
                </span>
              </div>
              
              {/* Value proposition and example */}
              <p className="text-sm text-gray-600 text-left mb-2 flex-grow">{details.valueProposition}</p>
              <p className="text-xs text-gray-500 italic mb-3">{getStrategyExample(key)}</p>
              
              {/* Recommended badge if applicable */}
              {isRecommendedStrategy(key) && (
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs flex items-center justify-center mb-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  Recommended for your capacity
                </div>
              )}
              
              {/* Selection indicator at bottom */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium">
                  {resourceAllocation === key ? (
                    <span className="text-amber-600">Selected</span>
                  ) : (
                    <span className="text-elx-primary">Select Strategy</span>
                  )}
                </span>
                {resourceAllocation === key ? (
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
  );
};

export default ResourceAllocationSelector;