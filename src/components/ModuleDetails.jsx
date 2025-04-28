import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faDownload, faCheckCircle, faCircle, 
  faLightbulb, faRocket, faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

/**
 * ModuleDetails component
 * 
 * Displays detailed information about a selected consulting module.
 * Provides options to save the module for later or export to PDF.
 */
const ModuleDetails = ({ 
  selectedModule, 
  journeySteps, 
  savedModules, 
  toggleSaveModule, 
  exportToPdf, 
  isExporting, 
  onBack 
}) => {
  if (!selectedModule) return null;
  
  // Get variant definitions for this module
  const variantDefs = selectedModule.variants.map(v => ({
    ...v,
    ...v.definitions // The variant definitions should be already included in the module
  }));
  
  return (
    <div className="module-detail">
      <button 
        onClick={onBack}
        className="mb-4 text-elx-primary hover:text-elx-primary-dark flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Explorer
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
              selectedModule.pillarConfig.bgColor
            } ${selectedModule.pillarConfig.textColor}`}>
              <FontAwesomeIcon icon={selectedModule.pillarConfig.icon} className="mr-1" />
              {selectedModule.pillar}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {selectedModule.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-elx-primary">{selectedModule.name}</h2>
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
              icon={savedModules.includes(selectedModule.name) ? faBookmark : faBookmarkRegular} 
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
          
          <div className="bg-gray-50 p-5 rounded-lg mb-6 shadow-inner">
            <h4 className="text-lg font-medium text-elx-primary mb-2">Module Overview</h4>
            <p className="text-gray-700">
              {selectedModule.description}
            </p>
          </div>
          
          {/* Journey context */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-lg font-medium text-elx-primary mb-2">
              Where This Fits in Your Transformation Journey
            </h4>
            
            <div className="flex items-center overflow-x-auto pb-2 space-x-1">
              {journeySteps.map((step, index) => {
                const isActive = step.id === selectedModule.journeyStage;
                return (
                  <div 
                    key={step.id} 
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-sm flex items-center space-x-1 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={isActive ? faCheckCircle : faCircle} size="xs" />
                    <span>{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {variantDefs.map((variant, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className={`p-4 ${
                  variant.type === 'Insight Primer' 
                    ? 'bg-blue-50 border-b border-blue-100' 
                    : 'bg-green-50 border-b border-green-100'
                }`}>
                  <h4 className="font-medium flex items-center">
                    <FontAwesomeIcon icon={variant.type === 'Insight Primer' ? faLightbulb : faRocket} className="mr-2" />
                    {variant.type}
                  </h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {variant.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Value Units: {variant.evcValue}</span>
                    <button className="text-elx-primary hover:text-elx-primary-dark text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-elx-primary mb-3">Key Business Outcomes</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Improved operational efficiency and reduced costs</li>
              <li>Enhanced customer experience and satisfaction</li>
              <li>Increased workforce productivity and collaboration</li>
              <li>Accelerated innovation and time-to-market</li>
              <li>Strengthened competitive positioning in the marketplace</li>
            </ul>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
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
              <p className="text-sm text-gray-600">Add this module to your transformation journey</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => toggleSaveModule(selectedModule.name)}
                className={`elx-btn elx-btn-outline py-2 px-4 flex items-center`}
              >
                <FontAwesomeIcon icon={savedModules.includes(selectedModule.name) ? faBookmark : faBookmarkRegular} className="mr-1" />
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