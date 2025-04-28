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
    // If Pathfinder or Roadster capacity, only Laser Beam (focused) is available
    if (productionCapacity === 'pathfinder') {
      return strategy !== 'focused';
    }
    // If Roadster capacity, only Laser Beam (focused) and Smart Campaign (balanced) are available
    if (productionCapacity === 'roadster') {
      return strategy === 'distributed';
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
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
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
        className="flex items-center gap-2 mb-4 text-sm font-medium text-[var(--elexive-primary)] hover:text-[var(--elexive-accent)] transition-colors"
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
        <span>How context switching affects productivity</span>
        <FontAwesomeIcon icon={showExplainer ? faChevronUp : faChevronDown} className="text-xs" />
      </button>
      
      {/* Detailed context switching explainer - hidden by default */}
      {showExplainer && (
        <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn">
          <h3 className="font-bold text-lg text-[var(--elexive-primary)] mb-3">Context Switching & Team Productivity</h3>

          <p className="text-sm text-gray-700">
              Modern teams minimize switching costs through specialized roles and collaborative tools.
              Smart Campaign maintains high efficiency with only {getSwitchingCost('balanced')}% context switching overhead by pairing related initiatives.
              Even our Omni-Channel approach achieves good productive time through agile methodologies, 
              maintaining {100 - getSwitchingCost('distributed')}% productivity while managing multiple parallel workstreams.
            </p><br>
            </br>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - explanation */}
            <div>
              <h4 className="font-semibold text-[var(--elexive-primary)] mb-2">How We Calculate Overhead</h4>
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
              <h4 className="font-semibold text-[var(--elexive-primary)] text-center mb-4">Overhead by Allocation Strategy</h4>
              
              {/* Laser Beam visualization */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLightbulb} className="text-[var(--elexive-primary)]" />
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
                    <FontAwesomeIcon icon={faBullhorn} className="text-[var(--elexive-primary)]" />
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
                    <FontAwesomeIcon icon={faGlobe} className="text-[var(--elexive-primary)]" />
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
      
      
      {/* Redesigned allocation strategy cards */}
      <div className="mb-4 flex flex-col gap-3">
        {Object.entries(calculatorConfig.resourceAllocation).map(([key, details]) => (
            <button
              key={key}
              onClick={() => handleAllocationSelect(key)}
              disabled={isStrategyDisabled(key)}
              className={`w-full transition-all duration-300 overflow-hidden ${
                resourceAllocation === key
                  ? 'border-2 border-[var(--elexive-accent)] shadow-md'
                  : isStrategyDisabled(key)
                    ? 'border border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow-sm'
              }`}
            >
              <div className={`flex flex-col md:flex-row items-stretch ${
                resourceAllocation === key 
                  ? 'bg-[#FFF6E8]' 
                  : isStrategyDisabled(key)
                    ? 'bg-gray-100'
                    : 'bg-gray-50'
              }`}>
                {/* Strategy type - Left column */}
                <div className="p-4 md:p-6 md:w-1/4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      resourceAllocation === key ? 'bg-[var(--elexive-accent)]' : 'bg-[var(--elexive-primary-light)]'
                    }`}>
                      <FontAwesomeIcon 
                        icon={getStrategyIcon(key)}
                        className={`text-lg ${
                          resourceAllocation === key ? 'text-white' : 'text-[var(--elexive-primary)]'
                        }`}
                      />
                    </div>
                    <h3 className="font-bold text-xl text-[var(--elexive-primary)]">
                      {details.description}
                    </h3>
                  </div>
                  
                  {/* Recommended badge - positioned below name and icon, full width */}
                  {isRecommendedStrategy(key) && (
                    <div className="mt-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded flex items-center justify-center gap-1 w-full md:w-auto">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Recommended for your capacity</span>
                    </div>
                  )}
                </div>
                
                {/* Strategy details - Center column */}
                <div className="p-4 md:p-6 md:w-2/4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200">
                  {/* Strategy label as heading */}
                  <div className="mb-4 text-left">
                    <div className="font-bold text-[var(--elexive-primary)]">Allocation Profile</div>
                    <div className="text-gray-700 text-sm font-normal">{details.label}</div>
                  </div>
                  
                  {/* Value proposition and example as bullet list */}
                  <ul className="text-left space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[var(--elexive-accent)] mr-2">•</span>
                      <span className="text-gray-600 font-normal">{details.valueProposition}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--elexive-accent)] mr-2">•</span>
                      <span className="text-gray-700 italic font-normal">"{getStrategyExample(key)}"</span>
                    </li>
                  </ul>
                </div>
                
                {/* Action column - Right side */}
                <div className="p-4 md:p-6 md:w-1/4 flex flex-col justify-center items-center">
                  {/* Context switching label - moved from center column */}
                  <div className="mb-4 w-full">
                    <div className="text-center mb-1 text-sm font-medium text-gray-600">Context switch overhead</div>
                    <div className={`text-center py-1.5 px-3 rounded-md text-sm font-medium 
                      ${key === 'focused' 
                        ? 'bg-green-100 text-green-800' 
                        : key === 'balanced'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                      {getOverheadLabel(key)}
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
                  {resourceAllocation === key ? (
                    <div className="bg-[var(--elexive-accent)] text-white py-2 px-4 rounded flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Selected</span>
                    </div>
                  ) : (
                    <div className="text-[var(--elexive-primary)] hover:text-[var(--elexive-accent)] py-2 rounded flex items-center gap-2">
                      <span>Select Strategy</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ResourceAllocationSelector;