import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBullseye, faRocket, 
  faGears, faArrowRight, faStar,
  faCompass, faBullhorn
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
          <button
            key={intentOption.name}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              intent === intentOption.name
                ? 'elx-module-card-selected'
                : 'elx-module-card elx-module-card-unselected'
            }`}
            onClick={() => handleOptionSelect(intentOption.name)}
          >
            {/* Preset label at the top */}
            {(intentOption.name === "Strategic Discovery" || 
              intentOption.name === "Visionary Growth" || 
              intentOption.name === "Market Influence" || 
              intentOption.name === "Turnaround" || 
              intentOption.name === "Reinvention") && (
              <div className="flex justify-between mb-2"> 
                <span className="elx-category-badge elx-category-badge-strategic flex items-center">
                  <FontAwesomeIcon 
                    icon={faStar}
                    className="mr-1" 
                  />
                  Ready-Made Solution
                </span>
                <span className="elx-evc-label text-sm font-medium">
                  {getEvcBudget(intentOption.name)}
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-2">
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
                className="text-elx-primary mr-2" 
              />
              <h3 className="font-bold text-lg text-elx-primary">{intentOption.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{getDescription(intentOption)}</p>
          </button>
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