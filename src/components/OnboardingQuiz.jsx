import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBullseye, faRocket, 
  faGears, faArrowRight, faStar,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import calculatorPresets from '../config/calculatorPresets.json';

const OnboardingQuiz = ({ intent, handleIntentSelect, resetCalculator }) => {
  // Function to get description - use preset description if available
  const getDescription = (intentOption) => {
    if (calculatorPresets.presets[intentOption.name]) {
      return calculatorPresets.presets[intentOption.name].description;
    }
    return intentOption.description;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 relative">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mr-2" />
        What's your business priority?
      </h2>
      
      {/* Enhanced Introduction Section with CEO-friendly language */}
      <div className="mb-6">
        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-4 mb-4">
          <div className="flex items-start">
            <div className="bg-[var(--elexive-accent-light)] p-2 rounded-lg mr-3">
              <FontAwesomeIcon icon={faLightbulb} className="text-[var(--elexive-secondary)]" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--elexive-primary)] mb-1">Choose a ready-made solution or customize your own</h3>
              <p className="text-gray-600 text-sm mb-2">
                Our ready-made solutions are designed by industry experts for specific business challenges. 
                They save you time by providing pre-selected combinations of services proven to deliver results for your specific situation.
              </p>
              <p className="text-gray-600 text-sm">
                Prefer full control? Select "Full Custom" to build your solution from the ground up.
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4">Select the option that best aligns with your current business need:</p>
      </div>
      
      {/* Primary Objective Options - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {calculatorConfig.intents.map((intentOption) => (
          <button
            key={intentOption.name}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              intent === intentOption.name
                ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow-md'
                : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
            }`}
            onClick={() => handleIntentSelect(intentOption.name)}
          >
            {/* Preset label at the top */}
            {(intentOption.name === "Visionary Growth" || 
              intentOption.name === "Turnaround" || 
              intentOption.name === "Reinvention") && (
              <div className="flex justify-start mb-2">
                <span className="text-sm px-3 py-1 rounded-full bg-[#FFF0E3] text-[var(--elexive-secondary)] font-medium flex items-center">
                  <FontAwesomeIcon 
                    icon={faStar}
                    className="mr-1" 
                  />
                  Ready-Made Solution
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <FontAwesomeIcon 
                icon={
                  intentOption.name === "Visionary Growth" ? faChartLine :
                  intentOption.name === "Turnaround" ? faArrowRight :
                  intentOption.name === "Reinvention" ? faRocket :
                  intentOption.name === "Full Custom" ? faGears :
                  faRocket
                } 
                className="text-[var(--elexive-primary)] mr-2" 
              />
              <h3 className="font-bold text-lg text-[var(--elexive-primary)]">{intentOption.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{getDescription(intentOption)}</p>
          </button>
        ))}
      </div>
      
      {/* Reset Calculator Button - positioned on its own row at the bottom */}
      <div className="flex justify-end mt-3">
        <button
          onClick={resetCalculator}
          className="px-4 py-2 text-sm border border-[var(--elexive-accent)] bg-[var(--elexive-accent-light)] hover:bg-[var(--elexive-accent)] text-[var(--elexive-primary)] font-medium rounded-lg transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faArrowRight} className="mr-2 rotate-180" />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default OnboardingQuiz;