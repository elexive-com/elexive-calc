import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBookmark,
  faChevronRight,
  faLightbulb,
  faRocket,
  faCompass,
  faArrowRight,
  faChartLine,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import { getModuleIcon } from '../utils/iconUtils';
import ModuleDetails from './ModuleDetails';
import { generateModulePdf } from '../pdf';
// Import useCalculator hook to access shared state
import useCalculator from '../hooks/useCalculator';

/**
 * JourneyPlanner component
 *
 * A dedicated component that visualizes the customer transformation journey
 * and helps users plan their transformation path through journey stages.
 */
const JourneyPlanner = () => {
  // Get savedModules state and toggleSaveModule function from useCalculator hook
  const { savedModules, toggleSaveModule } = useCalculator();
  const navigate = useNavigate();

  // State for module data and views
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVariant, setSelectedVariant] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // State for interactive experience
  const [selectedModule, setSelectedModule] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [showFilter] = useState(false);

  // State for secondary journey stages
  const [activeSecondaryStage, setActiveSecondaryStage] = useState(null);
  const [secondaryStages, setSecondaryStages] = useState([]);
  const [modulesBySecondaryStage, setModulesBySecondaryStage] = useState({});

  // Get journey stages from centralized configuration
  const journeySteps = useMemo(() => {
    return modulesConfig.journeyStages.map(stage => {
      // Use a safer approach than eval to map string icon names to icon objects
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
        case 'faChartLine':
          iconObject = faChartLine;
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
  }, []);

  // Get unique categories and variant types from modules
  const categories = [
    ...new Set(modulesConfig.modules.map(module => module.category)),
  ];
  const variantTypes = Object.keys(modulesConfig.variantDefinitions);

  // Load modules data on component mount
  useEffect(() => {
    // Add any metadata we might want to enhance each module with
    const enhancedModules = modulesConfig.modules.map(module => {
      return {
        ...module,
        iconObject: getModuleIcon(module.pillar, module.name),
        pillarIcon: modulesConfig.pillarIcons[module.pillar],
        journeyStage: determineJourneyStage(module),
        secondaryJourneyStages: module.secondaryJourneyStages || [],
        variantDefinitions: module.variants.map(variant => ({
          ...variant,
          ...modulesConfig.variantDefinitions[variant.type],
        })),
      };
    });

    setModules(enhancedModules);
    setFilteredModules(enhancedModules);
  }, []);

  // Determine which journey stage a module belongs to
  const determineJourneyStage = module => {
    // Return the primary journey stage ID from the module configuration
    return module.primaryJourneyStage || 'journey-stage-3'; // Default to 'Build' if not defined
  };

  // Extract and set secondary stages when primary journey stage changes
  useEffect(() => {
    if (activeJourneyStep >= 0 && journeySteps.length > 0) {
      const primaryStageId = journeySteps[activeJourneyStep].id;

      // Find all modules that have this stage as primary or secondary
      const relevantModules = modules.filter(
        module =>
          module.journeyStage === primaryStageId ||
          (module.secondaryJourneyStages &&
            module.secondaryJourneyStages.includes(primaryStageId))
      );

      // Find all unique secondary stages for the current primary stage
      // These are the other primary stages that have modules with this stage as secondary
      const otherStages = journeySteps
        .filter(stage => stage.id !== primaryStageId)
        .filter(stage => {
          return relevantModules.some(
            module =>
              module.journeyStage === stage.id ||
              (module.secondaryJourneyStages &&
                module.secondaryJourneyStages.includes(stage.id))
          );
        });

      // Add the current primary stage first
      const allRelevantStages = [
        journeySteps[activeJourneyStep],
        ...otherStages,
      ];

      // Group modules by stage
      const groupedModules = {};
      allRelevantStages.forEach(stage => {
        groupedModules[stage.id] = relevantModules.filter(
          module =>
            module.journeyStage === stage.id ||
            (module.secondaryJourneyStages &&
              module.secondaryJourneyStages.includes(stage.id))
        );
      });

      setSecondaryStages(allRelevantStages);
      setModulesBySecondaryStage(groupedModules);
      setActiveSecondaryStage(primaryStageId); // Default to current primary stage
    }
  }, [activeJourneyStep, journeySteps, modules]);

  // Handle filtering of modules
  useEffect(() => {
    let result = [...modules];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        module =>
          module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          module.heading.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by pillar
    if (selectedPillar !== 'all') {
      result = result.filter(module => module.pillar === selectedPillar);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(module => module.category === selectedCategory);
    }

    // Filter by journey stage - now using both primary and secondary stage filtering
    if (activeJourneyStep >= 0) {
      const primaryStageId = journeySteps[activeJourneyStep].id;

      if (activeSecondaryStage && activeSecondaryStage !== primaryStageId) {
        // If a secondary stage is selected (and it's not the same as primary),
        // only show modules that have the secondary stage as a secondary journey stage
        result = result.filter(
          module =>
            module.secondaryJourneyStages &&
            module.secondaryJourneyStages.includes(activeSecondaryStage)
        );
      } else {
        // If primary stage is selected or no secondary stage is selected,
        // only show modules where this is the primary journey stage
        result = result.filter(
          module => module.journeyStage === primaryStageId
        );
      }
    }

    // Filter by variant type
    if (selectedVariant !== 'all') {
      result = result.filter(module =>
        module.variants.some(variant => variant.type === selectedVariant)
      );
    }

    // Filter by saved modules
    if (showSavedOnly) {
      result = result.filter(module => savedModules.includes(module.name));
    }

    setFilteredModules(result);
  }, [
    modules,
    searchQuery,
    selectedPillar,
    selectedCategory,
    selectedVariant,
    savedModules,
    showSavedOnly,
    activeJourneyStep,
    activeSecondaryStage,
    journeySteps,
  ]);

  // Function to get modules with all filters EXCEPT the secondary stage filter
  const getTotalFilteredModulesBeforeSecondaryStageFilter = () => {
    let result = [...modules];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        module =>
          module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          module.heading.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by pillar
    if (selectedPillar !== 'all') {
      result = result.filter(module => module.pillar === selectedPillar);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(module => module.category === selectedCategory);
    }

    // Filter by variant type
    if (selectedVariant !== 'all') {
      result = result.filter(module =>
        module.variants.some(variant => variant.type === selectedVariant)
      );
    }

    // Filter by saved modules
    if (showSavedOnly) {
      result = result.filter(module => savedModules.includes(module.name));
    }

    return result;
  };

  // Get the count of filtered modules for each stage
  const getFilteredModuleCountForStage = stageId => {
    // Get the modules with all filters applied except the secondary stage filter
    const modulesBeforeSecondaryFilter =
      getTotalFilteredModulesBeforeSecondaryStageFilter();

    // For primary stage, count modules that have this as their primary journey stage
    if (stageId === journeySteps[activeJourneyStep]?.id) {
      return modulesBeforeSecondaryFilter.filter(
        module => module.journeyStage === stageId
      ).length;
    }

    // For secondary stages, we need to match the exact logic used when filtering modules
    // Only count modules that have this stage as a secondary journey stage
    return modulesBeforeSecondaryFilter.filter(
      module =>
        module.secondaryJourneyStages &&
        module.secondaryJourneyStages.includes(stageId)
    ).length;
  };

  // View module details - navigate to module URL
  const viewModuleDetails = module => {
    navigate(`/modules/${module.id}`);
  };

  // Export module details to PDF
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

  // Module card component with standardized elx- classes
  const ModuleCard = ({ module }) => {
    // Get the color code based on pillar type
    const getPillarColor = () => {
      switch (module.pillar.toLowerCase()) {
        case 'transformation':
          return '#D99000'; // Darkened from #FFBE59 for better contrast
        case 'strategy':
          return '#C85A30'; // Darkened from #EB8258 for better contrast
        case 'technology':
          return '#1F776D'; // Already had good contrast
        case 'discovery':
          return '#2E2266'; // Primary color for discovery
        case 'catalyst':
          return '#0A4DA1'; // Dark blue for catalyst
        default:
          return '#D99000';
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Colored header section with pillar name - matching pillar card style */}
        <div
          className="px-4 py-3 flex items-center w-full"
          style={{
            backgroundColor: getPillarColor(),
            color: 'white',
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center mr-2"
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-white text-sm">{module.pillar}</h3>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {module.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
            {module.heading}
          </p>

          {/* No variant labels or delivery option icons - completely removed */}
        </div>

        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => viewModuleDetails(module)}
            className="text-sm font-medium text-elx-primary hover:text-elx-primary-dark flex items-center"
          >
            View Details
            <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
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
      </div>
    );
  };

  // Journey step component with enhanced visual design
  const JourneyStep = ({ step, index }) => {
    const isActive = index === activeJourneyStep;

    // Define brand-aligned colors instead of generic ones
    const stageColors = [
      {
        name: 'assess',
        baseColor: '#2B6CB0', // A rich blue for Assess stage
        lightColor: 'rgba(43, 108, 176, 0.08)', // Very light blue background
        mediumColor: 'rgba(43, 108, 176, 0.15)', // Medium blue for hover
        borderColor: 'rgba(43, 108, 176, 0.3)', // Border color
        textColor: '#2B6CB0', // Text color for inactive
        iconBg: 'rgba(43, 108, 176, 0.15)', // Icon background
        pathColor: 'rgba(43, 108, 176, 0.8)', // Path color when active
      },
      {
        name: 'plan',
        baseColor: '#DD6B20', // Rich orange for Plan stage
        lightColor: 'rgba(221, 107, 32, 0.08)', // Very light orange background
        mediumColor: 'rgba(221, 107, 32, 0.15)', // Medium orange for hover
        borderColor: 'rgba(221, 107, 32, 0.3)', // Border color
        textColor: '#DD6B20', // Text color for inactive
        iconBg: 'rgba(221, 107, 32, 0.15)', // Icon background
        pathColor: 'rgba(221, 107, 32, 0.8)', // Path color when active
      },
      {
        name: 'execute',
        baseColor: '#2F855A', // Rich green for Execute stage
        lightColor: 'rgba(47, 133, 90, 0.08)', // Very light green background
        mediumColor: 'rgba(47, 133, 90, 0.15)', // Medium green for hover
        borderColor: 'rgba(47, 133, 90, 0.3)', // Border color
        textColor: '#2F855A', // Text color for inactive
        iconBg: 'rgba(47, 133, 90, 0.15)', // Icon background
        pathColor: 'rgba(47, 133, 90, 0.8)', // Path color when active
      },
      {
        name: 'optimize',
        baseColor: '#6B46C1', // Rich purple for Optimize stage
        lightColor: 'rgba(107, 70, 193, 0.08)', // Very light purple background
        mediumColor: 'rgba(107, 70, 193, 0.15)', // Medium purple for hover
        borderColor: 'rgba(107, 70, 193, 0.3)', // Border color
        textColor: '#6B46C1', // Text color for inactive
        iconBg: 'rgba(107, 70, 193, 0.15)', // Icon background
        pathColor: 'rgba(107, 70, 193, 0.8)', // Path color when active
      },
    ];

    const stageColor = stageColors[index];

    // Create dynamic styles
    const cardStyle = {
      backgroundColor: isActive ? stageColor.baseColor : 'white',
      borderColor: isActive ? stageColor.baseColor : stageColor.borderColor,
      boxShadow: isActive
        ? `0 10px 15px -3px ${stageColor.lightColor}, 0 4px 6px -2px ${stageColor.borderColor}`
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    };

    // Style for the number indicator
    const numberStyle = {
      backgroundColor: isActive ? 'white' : stageColor.iconBg,
      color: isActive ? stageColor.baseColor : 'white',
      boxShadow: isActive ? `0 0 0 2px ${stageColor.baseColor}` : 'none',
    };

    // Style for the icon
    const iconStyle = {
      color: isActive ? 'white' : stageColor.textColor,
      opacity: isActive ? 1 : 0.7,
    };

    return (
      <div
        className={`relative rounded-xl p-5 cursor-pointer border transition-all duration-300`}
        style={cardStyle}
        onClick={() => setActiveJourneyStep(index)}
      >
        <div className="flex items-center justify-between mb-3">
          {/* Enhanced number indicator */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300"
            style={numberStyle}
          >
            {index + 1}
          </div>

          {/* Enhanced icon styling */}
          <FontAwesomeIcon
            icon={step.icon}
            className="text-xl transition-all duration-300"
            style={iconStyle}
          />
        </div>

        {/* Enhanced typography with better hierarchy */}
        <h3
          className={`text-lg font-bold mb-1 transition-all duration-300`}
          style={{ color: isActive ? 'white' : stageColor.textColor }}
        >
          {step.title}
        </h3>

        <p
          className={`text-sm mt-1 transition-all duration-300 line-clamp-3`}
          style={{
            color: isActive
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(75, 85, 99, 0.9)',
          }}
        >
          {step.description}
        </p>

        {/* Connection line to next step - enhanced */}
        {index < journeySteps.length - 1 && (
          <>
            {/* Enhanced path indicator - solid color when active */}
            <div
              className="hidden md:block absolute -right-3 top-1/2 h-0.5 w-6 z-10 transition-all duration-300"
              style={{
                backgroundColor:
                  activeJourneyStep >= index ? stageColor.pathColor : '#E5E7EB',
                transform: 'translateY(-50%)',
              }}
            ></div>

            {/* Path arrow */}
            <div
              className="hidden md:flex absolute -right-8 top-1/2 w-4 h-4 items-center justify-center z-10 transition-all duration-300 transform -translate-y-1/2"
              style={{
                color:
                  activeJourneyStep >= index ? stageColor.pathColor : '#E5E7EB',
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} className="text-current" />
            </div>
          </>
        )}

        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white"></div>
        )}
      </div>
    );
  };

  // Update journey steps container with enhanced styling
  const JourneyStepsContainer = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-8 relative">
        {/* Improved path line connecting journey steps (visible on desktop) */}
        <div
          className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 z-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, #E5E7EB, #E5E7EB)',
            transform: 'translateY(-50%)',
          }}
        ></div>

        {/* Progress path - shows completion */}
        <div
          className="hidden md:block absolute top-1/2 left-0 h-1 z-0 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${Math.min(100, (activeJourneyStep / (journeySteps.length - 1)) * 100)}%`,
            background:
              'linear-gradient(to right, #2B6CB0, #DD6B20, #2F855A, #6B46C1)',
            transform: 'translateY(-50%)',
          }}
        ></div>

        {journeySteps.map((step, index) => (
          <JourneyStep key={step.id} step={step} index={index} />
        ))}
      </div>
    );
  };

  // New component for secondary journey stages
  const SecondaryJourneyStages = () => {
    // Tooltip state for explaining the secondary stages
    const [showTooltip, setShowTooltip] = useState(false);

    // Only show this component if we have secondary stages
    if (!secondaryStages.length || activeJourneyStep < 0) return null;

    // Get color for current primary stage
    const stageColors = [
      {
        name: 'assess',
        baseColor: '#2B6CB0',
        lightColor: 'rgba(43, 108, 176, 0.08)',
      },
      {
        name: 'plan',
        baseColor: '#DD6B20',
        lightColor: 'rgba(221, 107, 32, 0.08)',
      },
      {
        name: 'execute',
        baseColor: '#2F855A',
        lightColor: 'rgba(47, 133, 90, 0.08)',
      },
      {
        name: 'optimize',
        baseColor: '#6B46C1',
        lightColor: 'rgba(107, 70, 193, 0.08)',
      },
    ];

    const primaryStageColor = stageColors[activeJourneyStep];
    const primaryStage = journeySteps[activeJourneyStep];

    // Calculate a visual indicator of stage relationship strength
    const calculateRelationshipStrength = stageId => {
      if (stageId === primaryStage?.id) return 'primary';

      const moduleCount = getFilteredModuleCountForStage(stageId);
      const totalModules =
        getTotalFilteredModulesBeforeSecondaryStageFilter().length;

      // Calculate percentage of all modules that are in this stage
      const percentage =
        totalModules > 0 ? (moduleCount / totalModules) * 100 : 0;

      if (percentage > 60) return 'strong';
      if (percentage > 30) return 'moderate';
      return 'light';
    };

    return (
      <div className="mb-8 mt-6 animate-fadeIn">
        {/* Enhanced title section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-elx-primary mb-1">
              Journey Paths
            </h2>
            <p className="text-gray-600">
              Select a primary or secondary path to focus your transformation
              journey
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md transition-colors flex items-center"
            aria-label={showTooltip ? 'Hide explanation' : 'Show explanation'}
          >
            Learn more
            <div
              className={`transform transition-transform duration-300 ml-1 ${showTooltip ? 'rotate-180' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Explanation that can be toggled - using the same animation style as CalculatorApp */}
        <div
          className="bg-white"
          style={{ display: showTooltip ? 'block' : 'none' }}
        >
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-indigo-800 mb-2">
              How Journey Paths Work
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Your transformation journey can follow multiple paths
              simultaneously. Think of these as highways and connecting roads
              that lead you through your transformation journey:
            </p>
            <div className="mt-2 flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                  style={{
                    borderColor: primaryStageColor.baseColor,
                    backgroundColor: primaryStageColor.baseColor,
                  }}
                >
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <div>
                  <p className="font-semibold">Primary Path</p>
                  <p className="text-gray-600">
                    The main phase of your transformation journey. Currently in{' '}
                    <span
                      className="font-medium"
                      style={{ color: primaryStageColor.baseColor }}
                    >
                      {primaryStage?.title}
                    </span>{' '}
                    phase. This contains core modules central to your current
                    focus.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-1">
                <div
                  className="w-6 h-6 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                  style={{
                    borderColor: primaryStageColor.baseColor,
                    backgroundColor: 'white',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: primaryStageColor.baseColor }}
                  >
                    S
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Secondary Paths</p>
                  <p className="text-gray-600">
                    Additional phases that complement your primary path. These
                    contain modules that bridge between phases or prepare you
                    for the next stage of your journey.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-indigo-100 text-sm">
              <p className="font-medium text-gray-700">💡 Quick Tip:</p>
              <p className="text-gray-600">
                The strength indicator on each secondary path shows how closely
                related it is to your primary path. Stronger relationships mean
                more overlapping modules.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Primary Path - More streamlined design */}
          <button
            key={primaryStage?.id}
            onClick={() => setActiveSecondaryStage(primaryStage?.id)}
            className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
              activeSecondaryStage === primaryStage?.id
                ? 'bg-opacity-100 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-opacity-20'
            } border-2`}
            style={{
              backgroundColor:
                activeSecondaryStage === primaryStage?.id
                  ? primaryStageColor.baseColor
                  : 'white',
              borderColor: primaryStageColor.baseColor,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <FontAwesomeIcon
                icon={primaryStage?.icon}
                className={`text-xl ${activeSecondaryStage === primaryStage?.id ? 'text-white' : ''}`}
                style={{
                  color:
                    activeSecondaryStage === primaryStage?.id
                      ? 'white'
                      : primaryStageColor.baseColor,
                }}
              />
            </div>

            <div className="flex-1 text-left">
              <div className="font-bold text-base">
                {primaryStage?.title}{' '}
                <span className="text-sm font-medium ml-1">(Primary Path)</span>
              </div>
              <div
                className={`text-sm ${activeSecondaryStage === primaryStage?.id ? 'text-white text-opacity-90' : 'text-gray-500'}`}
              >
                Main focus of your current journey
              </div>
            </div>

            <span
              className={`inline-flex items-center justify-center min-w-8 h-8 text-sm rounded-full font-medium ${
                activeSecondaryStage === primaryStage?.id
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-100 text-gray-700'
              } px-2`}
            >
              {getFilteredModuleCountForStage(primaryStage?.id)}
            </span>
          </button>

          {/* Secondary Paths - More streamlined list */}
          <div className="flex flex-col gap-2">
            <div className="text-sm uppercase font-semibold text-gray-500 mb-2 flex items-center">
              <div
                className="w-5 h-5 rounded-full mr-2 flex items-center justify-center border-2"
                style={{ borderColor: primaryStageColor.baseColor }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: primaryStageColor.baseColor }}
                >
                  S
                </span>
              </div>
              Secondary Paths
            </div>

            {secondaryStages
              .filter(stage => stage.id !== primaryStage?.id)
              .map(stage => {
                const isActive = activeSecondaryStage === stage.id;
                const moduleCount = getFilteredModuleCountForStage(stage.id);

                // Skip stages with no modules
                if (moduleCount === 0) return null;

                // Find the color for this stage
                const stageIndex = journeySteps.findIndex(
                  s => s.id === stage.id
                );
                const stageColor = stageColors[stageIndex] || primaryStageColor;

                const relationshipStrength = calculateRelationshipStrength(
                  stage.id
                );

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveSecondaryStage(stage.id)}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 relative ${
                      isActive
                        ? 'bg-opacity-100 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border`}
                    style={{
                      backgroundColor: isActive
                        ? stageColor.baseColor
                        : 'white',
                      borderColor: isActive ? stageColor.baseColor : '#E5E7EB',
                    }}
                  >
                    {/* Visual indicator of relationship strength */}
                    {!isActive && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                        style={{
                          backgroundColor: stageColor.baseColor,
                          opacity:
                            relationshipStrength === 'strong'
                              ? 0.8
                              : relationshipStrength === 'moderate'
                                ? 0.5
                                : 0.3,
                        }}
                      ></div>
                    )}

                    <div
                      className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                      style={{
                        backgroundColor: isActive
                          ? 'rgba(255,255,255,0.2)'
                          : stageColor.lightColor,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={stage.icon}
                        className="text-xl"
                        style={{
                          color: isActive ? 'white' : stageColor.baseColor,
                        }}
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="font-bold text-base">{stage.title}</div>
                      <div
                        className={`text-sm ${isActive ? 'text-white text-opacity-90' : 'text-gray-500'}`}
                      >
                        {relationshipStrength === 'strong'
                          ? 'Strongly connected to your primary path'
                          : relationshipStrength === 'moderate'
                            ? 'Moderately connected to your primary path'
                            : 'Complementary to your primary path'}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center justify-center min-w-8 h-8 text-sm rounded-full font-medium ${
                        isActive
                          ? 'bg-white text-gray-800'
                          : 'bg-gray-100 text-gray-700'
                      } px-2`}
                    >
                      {moduleCount}
                    </span>
                  </button>
                );
              })}

            {/* If there are no secondary stages with modules, show a message */}
            {secondaryStages.filter(
              stage =>
                stage.id !== primaryStage?.id &&
                getFilteredModuleCountForStage(stage.id) > 0
            ).length === 0 && (
              <div className="text-center py-4 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed">
                No secondary paths available with the current filters
              </div>
            )}
          </div>

          {/* Visual representation of current path selection */}
          {activeSecondaryStage && (
            <div className="flex flex-col items-center justify-center py-2 text-sm">
              <div className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-center">
                <div
                  className="flex items-center justify-center gap-2 font-bold"
                  style={{
                    color:
                      stageColors[
                        journeySteps.findIndex(
                          s => s.id === activeSecondaryStage
                        )
                      ]?.baseColor || primaryStageColor.baseColor,
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      journeySteps.find(s => s.id === activeSecondaryStage)
                        ?.icon || primaryStage?.icon
                    }
                  />
                  <span>
                    Currently viewing:{' '}
                    {journeySteps.find(s => s.id === activeSecondaryStage)
                      ?.title || primaryStage?.title}{' '}
                    Path
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Filter and search panel
  const FilterPanel = () => (
    <div
      className={`transition-all duration-300 overflow-hidden ${showFilter ? 'max-h-60' : 'max-h-0'}`}
    >
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedPillar}
              onChange={e => setSelectedPillar(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            >
              <option value="all">All Pillars</option>
              {['Transformation', 'Strategy', 'Technology', 'Discovery'].map(
                pillar => (
                  <option key={pillar} value={pillar}>
                    {pillar}
                  </option>
                )
              )}
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedVariant}
            onChange={e => setSelectedVariant(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
          >
            <option value="all">All Variant Types</option>
            {variantTypes.map(variant => (
              <option key={variant} value={variant}>
                {variant}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // New component for displaying modules grouped by secondary stage
  const ModulesBySecondaryStage = () => {
    if (
      !activeSecondaryStage ||
      !modulesBySecondaryStage[activeSecondaryStage]
    ) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredModules.map(module => (
            <ModuleCard key={module.name} module={module} />
          ))}
        </div>
      );
    }

    const activeStage = secondaryStages.find(
      stage => stage.id === activeSecondaryStage
    );

    return (
      <div>
        <h3 className="text-xl font-bold text-elx-primary mb-4">
          {activeStage?.title} Phase Modules
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredModules.map(module => (
            <ModuleCard key={module.name} module={module} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {isDetailView ? (
        <ModuleDetails
          selectedModule={selectedModule}
          journeySteps={journeySteps}
          exportToPdf={exportToPdf}
          isExporting={isExporting}
          onBack={() => setIsDetailView(false)}
        />
      ) : (
        <div className="journey-planner">
          {/* Header and search/filter toggle */}
          <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-elx-primary mb-3 md:mb-0">
                Journey Planner
              </h2>
              <p className="text-gray-600 mb-4 max-w-3xl">
                Plan your transformation journey from assessment to
                optimization. Discover and organize modules that support each
                phase of your business transformation.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {savedModules.length > 0 && (
                <div className="flex items-center">
                  <button
                    onClick={() => setShowSavedOnly(!showSavedOnly)}
                    className={`elx-btn ${showSavedOnly ? 'elx-btn-secondary' : 'elx-btn-outline'} py-1 px-3 text-sm flex items-center`}
                  >
                    <FontAwesomeIcon icon={faBookmark} className="mr-1" />
                    {showSavedOnly
                      ? 'Show All'
                      : `Saved (${savedModules.length})`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter panel (expandable) */}
          <FilterPanel />

          {/* Journey Steps */}
          <div className="mb-8">
            <JourneyStepsContainer />

            {/* Secondary Journey Stages */}
            <SecondaryJourneyStages />

            {filteredModules.length > 0 ? (
              <ModulesBySecondaryStage />
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  No modules found for this journey phase with your current
                  filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPillar('all');
                    setSelectedCategory('all');
                    setSelectedVariant('all');
                  }}
                  className="mt-2 text-elx-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPlanner;
