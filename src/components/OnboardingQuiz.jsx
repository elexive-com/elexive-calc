import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBullseye, faRocket, 
  faGears, faArrowRight, faCheck,
  faCompass, faBullhorn, faStar
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import calculatorPresets from '../config/calculatorPresets.json';
import FeatureIntroduction from './FeatureIntroduction';

const OnboardingQuiz = ({ intent, handleIntentSelect, resetCalculator }) => {
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
      <h2 className="elx-section-heading text-2xl">
        <FontAwesomeIcon icon={faBullseye} className="text-elx-accent mr-2" />
        What's your business priority?
      </h2>
      
      {/* Enhanced Introduction Section with CEO-friendly language */}
      <FeatureIntroduction
        title="Choose a ready-made solution or customize your own"
        description="Our ready-made solutions are designed by industry experts for specific business challenges. They save you time by providing pre-selected combinations of services proven to deliver results for your specific situation."
        additionalInfo="Prefer full control? Select 'Full Custom' to build your solution from the ground up."
      />
      
      <p className="text-gray-600 mb-6 font-medium">Select the option that best aligns with your current business need:</p>
      
      {/* Primary Objective Options - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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
            {/* Header section with icon and name - using primary purple background */}
            <div 
              className="px-4 py-3 flex items-center w-full"
              style={{ 
                backgroundColor: 'var(--elexive-primary)', 
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
            <div className="p-4">
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
              
              <p className="text-gray-600 text-sm">{getDescription(intentOption)}</p>
              
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
                  <FontAwesomeIcon icon={faCheck} className="text-amber-500" />
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