import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faLightbulb,
  faServer,
  faCheck,
  faAngleDown,
  faAngleUp,
  faCompass,
  faRocket,
  faChevronRight,
  faChevronDown,
  faInfoCircle,
  faArrowRight,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import calculatorConfig from '../config/calculatorConfig.json';
import { getIcon } from '../utils/iconUtils';
import useCalculator from '../hooks/useCalculator';
import ModuleDetails from './ModuleDetails';
import { generateModulePdf } from '../pdf';

const ModuleSelector = ({
  modules,
  selectedModules,
  toggleModule,
  activePillar,
  setActivePillar,
  selectedVariants = {},
  setSelectedVariants,
  viewModuleDetails: externalViewModuleDetails,
}) => {
  // Get access to the shared savedModules state
  const { savedModules, toggleSaveModule } = useCalculator();
  const navigate = useNavigate();

  // State for expanded pillars in the accordion
  const [expandedPillars, setExpandedPillars] = useState(() => {
    // Initialize with all pillars from config set to false (collapsed)
    const initialState = {};
    calculatorConfig.pillars.forEach(pillar => {
      initialState[pillar.label] = false;
    });
    return initialState;
  });

  // State for module options explainer visibility
  const [isOptionsExplainerVisible, setIsOptionsExplainerVisible] =
    useState(false);

  // State for module detail view
  const [selectedModule, setSelectedModule] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Export to PDF function
  const exportToPdf = async () => {
    if (!selectedModule) return;

    setIsExporting(true);

    try {
      // Use our centralized PDF generation module with just the module name
      const result = await generateModulePdf(selectedModule.name);

      // Check the success status of the PDF generation
      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Journey steps for ModuleDetails
  const journeySteps = modulesConfig.journeyStages.map(stage => {
    // Map string icon names to icon objects
    let iconObject;
    switch (stage.icon) {
      case 'faCompass':
        iconObject = faCompass;
        break;
      case 'faLightbulb':
        iconObject = faLightbulb;
        break;
      case 'faRocket':
        iconObject = faRocket;
        break;
      default:
        iconObject = faCompass; // Default icon
    }

    return {
      id: stage.id,
      title: stage.title,
      description: stage.description,
      icon: iconObject,
      categories: stage.categories,
    };
  });

  // View module details function - navigate to module URL
  const viewModuleDetails = module => {
    if (externalViewModuleDetails) {
      // Use the external function if provided (for backward compatibility)
      externalViewModuleDetails(module);
    } else {
      // Navigate to module URL using React Router
      navigate(`/modules/${module.id}`);
    }
  };

  // Handler for the Continue button that expands the next step
  const handleContinue = () => {
    // Dispatch a custom event to expand and scroll to Step 5
    const customEvent = new CustomEvent('expand-next-step', {
      detail: { stepNumber: 5 },
    });
    window.dispatchEvent(customEvent);
  };

  // Toggle module options explainer visibility
  const toggleOptionsExplainer = () => {
    setIsOptionsExplainerVisible(!isOptionsExplainerVisible);
  };

  // Handle module variant selection
  const handleVariantSelect = (moduleName, variantType) => {
    // If selecting the same variant that's already selected, deselect the module
    if (
      selectedModules.includes(moduleName) &&
      selectedVariants[moduleName] === variantType
    ) {
      handleModuleDeselect(moduleName);
      return;
    }

    // Update selected variant for this module
    const newSelectedVariants = {
      ...selectedVariants,
      [moduleName]: variantType,
    };

    // Pass updated variants to parent component
    setSelectedVariants(newSelectedVariants);

    // If module wasn't selected before, toggle it on
    if (!selectedModules.includes(moduleName)) {
      toggleModule(moduleName);
    }
  };

  // Handle module deselection
  const handleModuleDeselect = moduleName => {
    // Remove this module from selected variants
    const newSelectedVariants = { ...selectedVariants };
    delete newSelectedVariants[moduleName];
    setSelectedVariants(newSelectedVariants);

    // Toggle the module off
    if (selectedModules.includes(moduleName)) {
      toggleModule(moduleName);
    }
  };

  // Group modules by pillar
  const modulesByPillar = {};

  // Dynamically populate the modulesByPillar using pillars from config
  calculatorConfig.pillars.forEach(pillar => {
    modulesByPillar[pillar.label] = modules.filter(
      module => module.pillar === pillar.label
    );
  });

  // Toggle accordion expansion for a pillar
  const togglePillarExpansion = pillar => {
    setExpandedPillars(prev => ({
      ...prev,
      [pillar]: !prev[pillar],
    }));
  };

  // Get pillar icon based on pillar type
  const getPillarIcon = pillar => {
    // Find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars.find(
      p => p.label.toLowerCase() === pillar.toLowerCase()
    );

    if (pillarConfig && pillarConfig.icon) {
      return getIcon(pillarConfig.icon);
    }

    // Fallback to default icons if not found in config
    switch (pillar.toLowerCase()) {
      case 'discovery':
        return faCompass;
      case 'transformation':
        return faLayerGroup;
      case 'strategy':
        return faLightbulb;
      case 'technology':
        return faServer;
      default:
        return faLayerGroup;
    }
  };

  // Get pillar tagline
  const getPillarTagline = pillar => {
    // Find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars.find(
      p => p.label.toLowerCase() === pillar.toLowerCase()
    );

    return pillarConfig ? pillarConfig.tagline : '';
  };

  // Get pillar color based on pillar type
  const getPillarColor = pillar => {
    // Predefined colors for backward compatibility
    const pillarColors = {
      transformation: '#D99000', // Darkened from #FFBE59 for better contrast
      strategy: '#C85A30', // Darkened from #EB8258 for better contrast
      technology: '#1F776D', // Already had good contrast
      discovery: '#2E2266', // Primary color for discovery
      catalyst: '#0A4DA1', // Dark blue for catalyst
    };

    // Try to find the pillar in the lowercase map first
    const pillarLower = pillar.toLowerCase();
    if (pillarColors[pillarLower]) {
      return pillarColors[pillarLower];
    }

    // If not found, return a default color
    return '#D99000'; // Default to the transformation color
  };

  return (
    <div
      className={`elx-card mb-6 p-4 sm:p-6 ${isDetailView ? 'min-h-screen' : ''}`}
    >
      {isDetailView && selectedModule && !externalViewModuleDetails ? (
        <div className="w-full h-full">
          <ModuleDetails
            selectedModule={selectedModule}
            journeySteps={journeySteps}
            exportToPdf={exportToPdf}
            isExporting={isExporting}
            onBack={() => setIsDetailView(false)}
          />
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-6">
            Each service module is designed to address specific business needs
            and can be selected at different levels of engagement. Combine
            modules across our pillars for a comprehensive solution.
          </p>

          {/* Module Options Explainer - Hidden by default */}
          <div className="mb-4 mt-6">
            <button
              onClick={toggleOptionsExplainer}
              className="flex items-center justify-between w-full text-left text-base font-bold text-elx-primary mb-2"
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-2 text-elx-accent"
                />
                Learn more about Insight Primer and Integrated Execution options
              </div>
              <FontAwesomeIcon
                icon={isOptionsExplainerVisible ? faAngleUp : faAngleDown}
                className="text-elx-accent"
              />
            </button>

            {isOptionsExplainerVisible && (
              <div className="flex flex-col md:flex-row gap-4 my-4 animate-fadeIn">
                <div className="bg-blue-50 p-4 rounded-xl flex-1 border border-blue-100">
                  <div className="flex items-center mb-2 bg-elx-primary p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 text-white flex items-center justify-center mr-2">
                      <FontAwesomeIcon icon={faLightbulb} />
                    </div>
                    <h3 className="font-bold text-base text-white uppercase">
                      Insight Primer
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 mt-2">
                    {modulesConfig.variantDefinitions['Insight Primer'].tagline}
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    {
                      modulesConfig.variantDefinitions['Insight Primer']
                        .description
                    }
                  </p>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    When to choose Insight Primer:
                  </h4>
                  <ul className="text-xs text-gray-700 list-disc pl-4 mb-3">
                    <li>
                      When you need rapid validation of a concept before full
                      investment
                    </li>
                    <li>
                      When budget constraints require a focused, efficient
                      approach
                    </li>
                    <li>
                      When facing uncertainty about exactly what solution would
                      best fit your needs
                    </li>
                    <li>
                      Ideal for early-stage exploration or when entering new
                      market territories
                    </li>
                  </ul>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Sizing and resource allocation:
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Typically requires 2-3 experts working part-time over the
                    2-4 week period. Focuses on high-value insights and
                    actionable recommendations rather than implementation.
                  </p>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    In presets:
                  </h4>
                  <p className="text-xs text-gray-600">
                    Automatically selected in "Rapid Assessment" and "Strategic
                    Foundations" presets. These presets are structured to
                    provide a comprehensive overview without immediate execution
                    commitments.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl flex-1 border border-green-100">
                  <div className="flex items-center mb-2 bg-elx-primary p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 text-white flex items-center justify-center mr-2">
                      <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <h3 className="font-bold text-base text-white uppercase">
                      Integrated Execution
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 mt-2">
                    {
                      modulesConfig.variantDefinitions['Integrated Execution']
                        .tagline
                    }
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    {
                      modulesConfig.variantDefinitions['Integrated Execution']
                        .description
                    }{' '}
                    Typically spans 3-12 months based on scope and complexity.
                  </p>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    When to choose Integrated Execution:
                  </h4>
                  <ul className="text-xs text-gray-700 list-disc pl-4 mb-3">
                    <li>
                      When you've committed to a direction and need expert
                      implementation
                    </li>
                    <li>
                      When complex, cross-functional challenges require ongoing
                      expertise
                    </li>
                    <li>
                      When you need a team that can adapt to evolving business
                      needs
                    </li>
                    <li>
                      Ideal for mission-critical initiatives with significant
                      business impact
                    </li>
                  </ul>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Sizing and resource allocation:
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Scales from 3-10+ experts depending on scope, working in
                    dedicated sprint teams. Includes implementation, technical
                    expertise, and ongoing strategic guidance.
                  </p>

                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    In presets:
                  </h4>
                  <p className="text-xs text-gray-600">
                    Automatically selected in "Full Transformation" and
                    "Technology Excellence" presets. These presets are designed
                    for organizations ready to commit to implementation and
                    seeking comprehensive support.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Module Accordion Sections */}
          <div className="space-y-4">
            {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
              <div
                key={pillar}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Pillar Header - Clickable to expand/collapse */}
                <button
                  onClick={() => togglePillarExpansion(pillar)}
                  className="w-full flex items-center justify-between p-4"
                  style={{
                    backgroundColor: getPillarColor(pillar),
                    color: 'white',
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center mr-2">
                      <FontAwesomeIcon
                        icon={getPillarIcon(pillar)}
                        className="text-white"
                      />
                    </div>
                    <h3 className="font-bold">{pillar}</h3>
                    <div className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                      {pillarModules.length}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs mr-3">
                      {
                        pillarModules.filter(module =>
                          selectedModules.includes(module.name)
                        ).length
                      }{' '}
                      selected
                    </div>
                    <FontAwesomeIcon
                      icon={
                        expandedPillars[pillar] ? faChevronDown : faChevronRight
                      }
                      className="text-white text-sm"
                    />
                  </div>
                </button>

                {/* Pillar Content - Shown when expanded */}
                {expandedPillars[pillar] && (
                  <div className="bg-white p-4">
                    {/* Pillar tagline at the top of the expanded content */}
                    <div className="mb-4 pb-3 border-b border-gray-100">
                      <p className="text-sm text-gray-700">
                        {getPillarTagline(pillar)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pillarModules.map(module => (
                        <div
                          key={module.name}
                          className={`flex flex-col bg-white rounded-lg overflow-hidden border transition-all duration-300 ${
                            selectedModules.includes(module.name)
                              ? 'shadow-md border-gray-300'
                              : 'border-gray-200 hover:shadow'
                          }`}
                        >
                          {/* Module header */}
                          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-b">
                            <div className="flex items-center">
                              <h3
                                className="font-semibold text-sm sm:text-base text-gray-800 hover:text-elx-primary cursor-pointer"
                                onClick={e => {
                                  e.stopPropagation();
                                  viewModuleDetails(module);
                                }}
                              >
                                {module.name}
                              </h3>
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                toggleSaveModule(module.name);
                              }}
                              className={`${
                                savedModules.includes(module.name)
                                  ? 'text-amber-500 hover:text-amber-600'
                                  : 'text-gray-400 hover:text-gray-500'
                              }`}
                              aria-label={
                                savedModules.includes(module.name)
                                  ? 'Unsave module'
                                  : 'Save module'
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  savedModules.includes(module.name)
                                    ? faBookmark
                                    : faBookmarkRegular
                                }
                              />
                            </button>
                          </div>

                          <div className="p-4 flex-grow">
                            <p className="text-xs font-bold text-gray-700 mb-1">
                              {module.heading}
                            </p>
                            <p className="text-xs text-gray-600 mb-4">
                              {module.description}
                            </p>

                            {/* Module options at the bottom */}
                            <div className="flex flex-col gap-2 mt-3 border-t pt-3">
                              {/* Show single size option or double size options based on module configuration */}
                              {module.singleSizeOnly ? (
                                <div
                                  onClick={() =>
                                    handleVariantSelect(
                                      module.name,
                                      'insightPrimer'
                                    )
                                  }
                                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                    selectedModules.includes(module.name)
                                      ? 'bg-blue-50 border border-blue-200'
                                      : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                        selectedModules.includes(module.name)
                                          ? 'bg-blue-600'
                                          : 'border border-gray-300 bg-white'
                                      }`}
                                    >
                                      {selectedModules.includes(
                                        module.name
                                      ) && (
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          className="text-white text-xs"
                                        />
                                      )}
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium">
                                      Fixed-scope Module
                                    </div>
                                  </div>
                                  <span className="elx-evc-label">
                                    {module.variants[0].evcValue} EVC
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div
                                    onClick={() =>
                                      handleVariantSelect(
                                        module.name,
                                        'insightPrimer'
                                      )
                                    }
                                    className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                      selectedModules.includes(module.name) &&
                                      selectedVariants[module.name] ===
                                        'insightPrimer'
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'bg-gray-50 border border-gray-200 hover:bg-blue-50'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                          selectedModules.includes(
                                            module.name
                                          ) &&
                                          selectedVariants[module.name] ===
                                            'insightPrimer'
                                            ? 'bg-blue-600'
                                            : 'border border-gray-300 bg-white'
                                        }`}
                                      >
                                        {selectedModules.includes(
                                          module.name
                                        ) &&
                                          selectedVariants[module.name] ===
                                            'insightPrimer' && (
                                            <FontAwesomeIcon
                                              icon={faCheck}
                                              className="text-white text-xs"
                                            />
                                          )}
                                      </div>
                                      <div className="flex items-center">
                                        <FontAwesomeIcon
                                          icon={faLightbulb}
                                          className="text-blue-600 mr-1 text-xs"
                                        />
                                        <div className="text-xs font-medium">
                                          Insight Primer
                                        </div>
                                      </div>
                                    </div>
                                    <span className="elx-evc-label">
                                      {module.variants[0].evcValue} EVC
                                    </span>
                                  </div>

                                  <div
                                    onClick={() =>
                                      handleVariantSelect(
                                        module.name,
                                        'integratedExecution'
                                      )
                                    }
                                    className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                                      selectedModules.includes(module.name) &&
                                      selectedVariants[module.name] ===
                                        'integratedExecution'
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-gray-50 border border-gray-200 hover:bg-green-50'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={`w-5 h-5 flex items-center justify-center rounded-sm mr-2 ${
                                          selectedModules.includes(
                                            module.name
                                          ) &&
                                          selectedVariants[module.name] ===
                                            'integratedExecution'
                                            ? 'bg-green-600'
                                            : 'border border-gray-300 bg-white'
                                        }`}
                                      >
                                        {selectedModules.includes(
                                          module.name
                                        ) &&
                                          selectedVariants[module.name] ===
                                            'integratedExecution' && (
                                            <FontAwesomeIcon
                                              icon={faCheck}
                                              className="text-white text-xs"
                                            />
                                          )}
                                      </div>
                                      <div className="flex items-center">
                                        <FontAwesomeIcon
                                          icon={faRocket}
                                          className="text-green-600 mr-1 text-xs"
                                        />
                                        <div className="text-xs font-medium">
                                          Integrated Execution
                                        </div>
                                      </div>
                                    </div>
                                    <span className="elx-evc-label">
                                      {module.variants[1]
                                        ? module.variants[1].evcValue
                                        : module.variants[0].evcValue}{' '}
                                      EVC
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
        </>
      )}
    </div>
  );
};

export default ModuleSelector;
