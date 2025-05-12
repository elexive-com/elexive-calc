import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faCircle, faCheckCircle, faBookmark as faBookmarkSolid,
  faDownload, faUsers, faLightbulb, faRocket
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import useCalculator from '../hooks/useCalculator';

/**
 * ModuleDetails component
 * 
 * Displays detailed information about a selected consulting module.
 * Provides options to save the module for later or export to PDF.
 */
const ModuleDetails = ({ 
  selectedModule, 
  journeySteps, 
  exportToPdf, 
  isExporting, 
  onBack 
}) => {
  // Get savedModules state and toggleSaveModule function directly from useCalculator hook
  const { savedModules, toggleSaveModule } = useCalculator();
  
  if (!selectedModule) return null;
  
  // Define pillar color mapping
  const pillarColorMap = {
    'Transformation': '#D99000', // Amber/gold
    'Strategy': '#C85A30', // Orange/rust
    'Technology': '#1F776D', // Teal
    'Discovery': '#2E2266',  // Deep purple (primary)
    'Catalyst': '#0A4DA1'    // Dark blue
  };
  
  // Get variant definitions for this module
  const variantDefs = selectedModule.variants.map(v => ({
    ...v,
    ...v.definitions // The variant definitions should be already included in the module
  }));

  return (
    <div className="module-detail w-full min-h-full">
      <button 
        onClick={onBack}
        className="mb-4 text-elx-primary hover:text-elx-primary-dark flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Module Selection
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {selectedModule.category}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-elx-primary">{selectedModule.name}</h2>
        </div>
        
        <div className="flex mt-3 md:mt-0">
          <button 
            onClick={exportToPdf}
            disabled={isExporting}
            className="elx-btn elx-btn-outline py-2 px-4 mr-2 flex items-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-1" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          
          <button
            onClick={() => toggleSaveModule(selectedModule.name)}
            className={`elx-btn ${
              savedModules.includes(selectedModule.name) 
                ? 'elx-btn-secondary' 
                : 'elx-btn-outline'
            } py-2 px-4 flex items-center`}
          >
            <FontAwesomeIcon 
              icon={savedModules.includes(selectedModule.name) ? faBookmarkSolid : faBookmarkRegular} 
              className="mr-1" 
            />
            {savedModules.includes(selectedModule.name) ? 'Saved' : 'Save Module'}
          </button>
        </div>
      </div>
      
      <div id="module-detail-content" className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-elx-primary mb-4">
            {selectedModule.heading}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="bg-gray-50 p-5 rounded-lg shadow-inner md:w-2/3">
              <h4 className="text-lg font-medium text-elx-primary mb-2">Module Overview</h4>
              <p className="text-gray-700">
                {selectedModule.description}
              </p>
              
              {selectedModule.fix && (
                <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-elx-primary">
                  <p className="text-gray-700 font-medium">
                    <span className="font-bold text-elx-primary">How we help: </span>
                    {selectedModule.fix}
                  </p>
                </div>
              )}
            </div>
            
            <div 
              className={`p-5 rounded-lg shadow-md md:w-1/3 flex flex-col items-center justify-center`}
              style={{ 
                backgroundColor: pillarColorMap[selectedModule.pillar] || '#2E2266'
              }}
            >
              <h3 className="elx-pillar-title">{selectedModule.pillar}</h3>
              <div className="text-white text-center">
                <img 
                  src="/common-module-white.png" 
                  alt="Module visualization" 
                  className="mx-auto max-w-full h-auto w-1/2"
                />
              </div>
            </div>
          </div>
          
          {/* Journey context - improved vertical alignment */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-lg font-medium text-elx-primary mb-3">
              Where This Fits in Your Transformation Journey
            </h4>
            
            <div className="flex items-center justify-start space-x-4">
              {journeySteps.map((step, index) => {
                const isActive = step.id === selectedModule.primaryJourneyStage;
                const isSecondary = selectedModule.secondaryJourneyStages && selectedModule.secondaryJourneyStages.includes(step.id);
                return (
                  <div 
                    key={step.id} 
                    className={`flex items-center space-x-1.5 ${
                      isActive 
                        ? 'text-blue-800 font-medium' 
                        : isSecondary
                          ? 'text-blue-600'
                          : 'text-gray-600'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={isActive ? faCheckCircle : isSecondary ? faCheckCircle : faCircle} 
                      className={`${isActive ? 'text-blue-500' : isSecondary ? 'text-blue-300' : 'text-gray-400'}`} 
                      size="sm" 
                    />
                    <span className="text-sm">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Benefits section */}
          {selectedModule.benefits && selectedModule.benefits.length > 0 && (
            <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white">
              <h4 className="text-lg font-medium text-elx-primary mb-3">
                Key Business Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModule.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div 
                      className="h-6 w-6 rounded-full flex-shrink-0 mr-3 flex items-center justify-center font-medium text-white"
                      style={{ backgroundColor: pillarColorMap[selectedModule.pillar] || '#2E2266' }}
                    >
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Target audience section */}
          {selectedModule.whoIsItFor && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-white text-blue-600 mr-3 flex-shrink-0">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-elx-primary mb-1">
                    Who This Is For
                  </h4>
                  <p className="text-gray-700">{selectedModule.whoIsItFor}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Variant cards with improved alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {variantDefs.map((variant, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden h-full">
                <div className={`p-4 ${
                  variant.type === 'Insight Primer' 
                    ? 'bg-elx-primary text-white' 
                    : 'bg-elx-primary text-white'
                } flex items-center`}>
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={variant.type === 'Insight Primer' ? faLightbulb : faRocket} 
                      className="mr-2 text-white" 
                      fixedWidth
                    />
                    <h4 className="font-medium uppercase">{variant.type}</h4>
                  </div>
                </div>
                <div className="p-4 flex flex-col h-full">
                  {/* Variant tagline (new) */}
                  {variant.type === 'Insight Primer' || variant.type === 'Integrated Execution' ? (
                    <p className="text-md text-gray-900 mb-2">
                      {variant.type === 'Insight Primer' 
                        ? modulesConfig.variantDefinitions['Insight Primer'].tagline
                        : modulesConfig.variantDefinitions['Integrated Execution'].tagline}
                    </p>
                  ) : null}
                  
                  {/* Generic description from variantDefinitions */}
                  <p className="text-md text-gray-700 mb-2 pb-2 border-b border-gray-100">
                    {variant.type === 'Insight Primer' 
                      ? modulesConfig.variantDefinitions['Insight Primer'].description
                      : modulesConfig.variantDefinitions['Integrated Execution'].description}
                  </p>
                  
                  {/* Module-specific description */}
                  <p className="text-md text-gray-700 mb-4 flex-grow pt-2">
                    <span className="font-medium">For this module: </span>
                    {variant.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500">Value Units: {variant.evcValue}</span>
                    <button className="text-elx-primary hover:text-elx-primary-dark text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-elx-primary mb-3">Implementation Approach</h4>
            <p className="text-gray-700 mb-4">
              Our expert consultants follow a structured, proven methodology tailored to your unique business needs:
            </p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Discovery and Assessment: Understanding your current state and defining success metrics</li>
              <li>Strategy Development: Creating a customized roadmap for implementation</li>
              <li>Execution Planning: Mapping resources, timelines, and dependencies</li>
              <li>Implementation Support: Guiding you through each step of the process</li>
              <li>Measurement and Optimization: Tracking outcomes and refining approaches</li>
            </ol>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-3 md:mb-0">
              <h4 className="text-lg font-medium text-elx-primary">Ready to get started?</h4>
              <p className="text-sm text-gray-600">
                {selectedModule.callToAction || "Add this module to your transformation journey"}
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => toggleSaveModule(selectedModule.name)}
                className={`elx-btn elx-btn-outline py-2 px-4 flex items-center`}
              >
                <FontAwesomeIcon icon={savedModules.includes(selectedModule.name) ? faBookmarkSolid : faBookmarkRegular} className="mr-1" />
                {savedModules.includes(selectedModule.name) ? 'Saved' : 'Save for Later'}
              </button>
              <button className="elx-btn elx-btn-primary py-2 px-4">
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetails;