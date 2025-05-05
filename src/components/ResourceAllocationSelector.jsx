import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLayerGroup, faLightbulb, 
  faBullhorn, faGlobe, 
  faCheckCircle,
  faArrowRight, 
  faInfoCircle, faAngleUp, faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

// Added default value 'focused' for resourceAllocation parameter
const ResourceAllocationSelector = ({ resourceAllocation = 'focused', setResourceAllocation, productionCapacity }) => {
  const [showExplainer, setShowExplainer] = useState(false);
  
  // Handler for the Continue button that expands the next step
  const handleContinue = () => {
    // Dispatch a custom event to expand and scroll to Step 4
    const customEvent = new CustomEvent('expand-next-step', { detail: { stepNumber: 4 } });
    window.dispatchEvent(customEvent);
  };
  
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
      <h2 className="elx-section-heading text-2xl mb-4">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        Resource Allocation Strategy
      </h2>
      
      <p className="text-gray-700 mb-6">
        Think of this as choosing how to focus your transformation power. This selection determines whether to concentrate intensely on one strategic area or divide attention across multiple initiatives. Each approach has different benefits depending on your business goals and timeline.
      </p>
      
      {/* Context switching explainer toggle button - moved above cards */}
      <button 
        onClick={() => setShowExplainer(!showExplainer)}
        className="flex items-center text-left text-base font-bold text-elx-primary mb-2"
      >
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-elx-accent" />
        <span>How context switching affects productivity</span>
        <FontAwesomeIcon 
          icon={showExplainer ? faAngleUp : faAngleDown} 
          className="ml-2 text-elx-accent"
        />
      </button>
      
      {/* Detailed context switching explainer - hidden by default */}
      {showExplainer && (
        <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn">
          <h3 className="elx-section-heading text-lg mb-3">Context Switching & Team Productivity</h3>

          <p className="text-sm text-gray-700">
              When work is done in parallel across multiple initiatives, context switching creates additional overhead. 
              This overhead represents extra work that needs to be covered on top of the base EVC requirements.
              Smart Campaign adds only {getSwitchingCost('balanced')}% additional work overhead by pairing related initiatives.
              Omni-Channel approach requires {getSwitchingCost('distributed')}% extra work on top of base requirements 
              while managing multiple parallel workstreams.
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
                  <div><span className="font-medium">Research basis:</span> Studies show context switching requires 20-40% additional effort to complete the same work</div>
                </li>
              </ul>
            </div>
            
            {/* Right column - visual */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="elx-section-heading text-base text-center mb-4">Total Work by Allocation Strategy</h4>
              
              <div className="space-y-6">
                {/* Laser Beam visualization */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faLightbulb} className="text-elx-primary" />
                      <span className="font-medium">Laser Beam</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{getSwitchingCost('focused')}% overhead</span>
                  </div>
                  <div className="w-full relative">
                    {/* Fixed-width container for all green bars (100% base EVC) */}
                    <div className="w-[200px] h-8 bg-green-100 rounded flex items-center justify-center text-sm text-green-700">
                      100% base EVC work
                    </div>
                  </div>
                </div>
                
                {/* Smart Campaign visualization */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBullhorn} className="text-elx-primary" />
                      <span className="font-medium">Smart Campaign</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">{getSwitchingCost('balanced')}% overhead</span>
                  </div>
                  <div className="w-full relative">
                    {/* Fixed-width container for all green bars (100% base EVC) */}
                    <div className="flex items-center">
                      <div className="w-[200px] h-8 bg-green-100 rounded-l flex items-center justify-center text-sm text-green-700">
                        100% base EVC work
                      </div>
                      <div className="w-[16px] h-8 bg-yellow-200 rounded-r flex items-center justify-center text-sm text-yellow-800">
                        +
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      Total: {100 + getSwitchingCost('balanced')}% work required
                    </div>
                  </div>
                </div>
                
                {/* Omni-Channel visualization */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGlobe} className="text-elx-primary" />
                      <span className="font-medium">Omni-Channel</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">{getSwitchingCost('distributed')}% overhead</span>
                  </div>
                  <div className="w-full relative">
                    {/* Fixed-width container for all green bars (100% base EVC) */}
                    <div className="flex items-center">
                      <div className="w-[200px] h-8 bg-green-100 rounded-l flex items-center justify-center text-sm text-green-700">
                        100% base EVC work
                      </div>
                      <div className="w-[36px] h-8 bg-orange-100 rounded-r flex items-center justify-center text-sm text-orange-700">
                        +
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      Total: {100 + getSwitchingCost('distributed')}% work required
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Redesigned allocation strategy cards - 2x2 grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            
            {/* Card content - redesigned middle section */}
            <div className="p-4 flex flex-col h-full">
              {/* Strategy focus visual indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Focus Distribution</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    key === 'focused' 
                      ? 'bg-green-100 text-green-800' 
                      : key === 'balanced'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                  }`}>
                    {getOverheadLabel(key)} overhead
                  </span>
                </div>
                
                {/* Visual representation of focus distribution */}
                <div className="flex gap-1.5 mb-1">
                  {key === 'focused' && (
                    <div className="h-3 w-full bg-green-500 rounded"></div>
                  )}
                  
                  {key === 'balanced' && (
                    <>
                      <div className="h-3 w-3/5 bg-yellow-500 rounded"></div>
                      <div className="h-3 w-2/5 bg-yellow-300 rounded"></div>
                    </>
                  )}
                  
                  {key === 'distributed' && (
                    <>
                      <div className="h-3 w-1/5 bg-orange-500 rounded"></div>
                      <div className="h-3 w-1/5 bg-orange-400 rounded"></div>
                      <div className="h-3 w-1/5 bg-orange-300 rounded"></div>
                      <div className="h-3 w-1/5 bg-orange-200 rounded"></div>
                      <div className="h-3 w-1/5 bg-orange-100 rounded"></div>
                    </>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">{details.label}</p>
              </div>
              
              {/* Key benefits section */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  {key === 'focused' ? (
                    <>
                      <span className="font-medium text-elx-primary">Depth & Mastery</span> — {details.description} {details.valueProposition}
                    </>
                  ) : key === 'balanced' ? (
                    <>
                      <span className="font-medium text-elx-primary">Focus & Flexibility</span> — {details.description} {details.valueProposition}
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-elx-primary">Breadth & Coordination</span> — {details.description} {details.valueProposition}
                    </>
                  )}
                </p>
              </div>
              
              {/* Best for section */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Best For</h4>
                <p className="text-xs text-gray-600 italic">
                  {details.bestFor}
                </p>
              </div>
              
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
        {/* Add an invisible placeholder card when there's 3 cards to maintain 2x2 grid */}
        {Object.keys(calculatorConfig.resourceAllocation).length === 3 && (
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 opacity-0 pointer-events-none"></div>
        )}
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

export default ResourceAllocationSelector;