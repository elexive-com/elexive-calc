import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faRocket, 
  faGears, faArrowRight, faCheckCircle,
  faCompass, faBullhorn, faStar, faLayerGroup,
  faInfoCircle, faCalculator, faAngleDown, faAngleUp,
  faExchangeAlt, faUsers, faPuzzlePiece
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import calculatorPresets from '../config/calculatorPresets.json';

const OnboardingQuiz = ({ intent, handleIntentSelect, resetCalculator, openEvcExplainer }) => {
  const [showEvcInfo, setShowEvcInfo] = useState(false);

  // Function to get description - use preset description if available
  const getDescription = (intentOption) => {
    if (calculatorPresets.presets[intentOption.name]) {
      return calculatorPresets.presets[intentOption.name].description;
    }
    return intentOption.description;
  };

  // Function to get EVC budget for presets
  const getEvcBudget = (intentName) => {
    if (calculatorPresets.presets[intentName] && calculatorPresets.presets[intentName].evcBudget) {
      return `${calculatorPresets.presets[intentName].evcBudget} EVC`;
    }
    return "";
  };

  // Enhanced intent selection handler that resets calculator when "Full Custom" is selected
  const handleOptionSelect = (intentName) => {
    if (intentName === "Full Custom") {
      // Reset all values to default when Full Custom is selected
      resetCalculator();
      // Still need to set the intent to "Full Custom"
      handleIntentSelect(intentName);
    } else {
      // For other options, just call the normal intent selection handler
      handleIntentSelect(intentName);
    }
  };

  return (
    <div className="elx-card p-6 mb-6 relative">
      <h2 className="elx-section-heading text-2xl mb-4">
        <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-2" />
        What's your business priority?
      </h2>
      
      <p className="text-gray-700 mb-6">
        Select the option that best aligns with your current business needs. Our ready-made solutions 
        are designed by industry experts for specific business challenges, or choose 'Full Custom' to build 
        your solution from the ground up.
      </p>
      
      {/* What are EVCs section - styled like context switching explainer */}
      <button 
        onClick={() => setShowEvcInfo(!showEvcInfo)}
        className="flex items-center text-left text-base font-bold text-elx-primary mb-2"
      >
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-elx-accent" />
        <span>What are EVCs?</span>
        <FontAwesomeIcon 
          icon={showEvcInfo ? faAngleUp : faAngleDown} 
          className="ml-2 text-elx-accent"
        />
      </button>
      
      {/* Detailed EVC explainer - hidden by default */}
      {showEvcInfo && (
        <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn">
          <h3 className="elx-section-heading text-lg mb-3">Elastic Value Credits (EVCs)</h3>
          
          <p className="text-sm text-gray-700 mb-4">
            EVCs represent our producer-consumer model where input resources are converted into 
            strategic output value for your business. They measure the amount of work required to 
            implement each module and help you understand project timelines and resource allocation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - explanation */}
            <div>
              <h4 className="elx-section-heading text-base">How EVCs Work</h4>
              <p className="text-sm text-gray-700 mb-3">
                EVCs function as a measurement system to quantify work effort and value delivery:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Resource inputs:</span> Advisory services, AI tools, and specialized data resources</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Value outputs:</span> Strategic modules and deliverables that achieve your business goals</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Production capacity:</span> The weekly EVC rate determines your implementation timeline</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">•</div>
                  <div><span className="font-medium">Efficiency factors:</span> Resource allocation strategies impact your effective EVC output</div>
                </li>
              </ul>
              
              {/* New note about EVC styling */}
              <div className="bg-gray-100 p-3 rounded-md border border-gray-200 mb-3">
                <p className="text-xs text-gray-700 mb-2 font-medium">
                  Note: Throughout the application, EVCs are denoted by this label:
                </p>
                <div className="flex items-center justify-center">
                  <span className="bg-rose-50 text-xs font-semibold px-2 py-1 rounded-md text-elx-evc border border-rose-200 inline-block">
                    42 EVC
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right column - visual */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="elx-section-heading text-base text-center mb-3">The EVC Value Exchange</h4>
              
              <div className="bg-elx-primary-light p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-center p-3">
                    <div className="text-sm mb-1 font-medium text-elx-primary">Input Resources</div>
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-elx-primary-light flex items-center justify-center">
                        <FontAwesomeIcon icon={faUsers} className="text-elx-accent text-xl" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Weekly Capacity</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faExchangeAlt} className="text-elx-accent text-xl mb-1" />
                    <div className="text-xs text-gray-500">Converts to</div>
                  </div>
                  
                  <div className="text-center p-3">
                    <div className="text-sm mb-1 font-medium text-elx-primary">Output Value</div>
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-elx-primary-light flex items-center justify-center">
                        <FontAwesomeIcon icon={faPuzzlePiece} className="text-elx-accent text-xl" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Business Results</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={openEvcExplainer}
                className="w-full elx-btn bg-elx-primary hover:bg-elx-primary-dark text-white px-4 py-2 text-sm rounded-md flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                Learn More About EVCs
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Added space before the cards */}
      <div className="mb-6"></div>
      
      {/* Primary Objective Options - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {calculatorConfig.intents.map((intentOption) => (
          <div
            key={intentOption.name}
            className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg ${
              intent === intentOption.name
                ? 'border-amber-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleOptionSelect(intentOption.name)}
          >
            {/* Header section with icon and name - using primary purple background or accent color when selected */}
            <div 
              className="px-4 py-3 flex items-center w-full"
              style={{ 
                backgroundColor: intent === intentOption.name 
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
                    intentOption.name === "Strategic Discovery" ? faCompass :
                    intentOption.name === "Visionary Growth" ? faChartLine :
                    intentOption.name === "Market Influence" ? faBullhorn :
                    intentOption.name === "Turnaround" ? faArrowRight :
                    intentOption.name === "Reinvention" ? faRocket :
                    intentOption.name === "Full Custom" ? faGears :
                    faRocket
                  } 
                  className="text-white" 
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <h3 className="font-bold text-white text-sm">{intentOption.name}</h3>
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4 flex flex-col h-full">
              {/* Ready-Made Solution or Custom Build label and EVC budget on same row */}
              <div className="flex justify-between items-center mb-3">
                {intentOption.name !== "Full Custom" ? (
                  <>
                    <span className="elx-category-badge elx-category-badge-strategic flex items-center text-xs font-medium">
                      <FontAwesomeIcon 
                        icon={faStar}
                        className="mr-1" 
                      />
                      Ready-Made Solution
                    </span>
                    <span className="elx-evc-label">
                      {getEvcBudget(intentOption.name)}
                    </span>
                  </>
                ) : (
                  <span className="elx-category-badge flex items-center text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                    <FontAwesomeIcon 
                      icon={faGears}
                      className="mr-1" 
                    />
                    Custom Build
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm flex-grow">{getDescription(intentOption)}</p>
              
              {/* Selection indicator at bottom */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium">
                  {intent === intentOption.name ? (
                    <span className="text-amber-600">Selected</span>
                  ) : (
                    <span className="text-elx-primary">Select</span>
                  )}
                </span>
                {intent === intentOption.name ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-amber-500" />
                ) : (
                  <FontAwesomeIcon icon={faArrowRight} className="text-elx-primary" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Reset Calculator Button - positioned on its own row at the bottom */}
      <div className="flex justify-end mt-3">
        <button
          onClick={resetCalculator}
          className="elx-btn elx-btn-accent px-4 py-2 text-sm"
        >
          <FontAwesomeIcon icon={faArrowRight} className="mr-2 rotate-180" />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default OnboardingQuiz;