import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faBookmark, faChevronRight, faChevronDown,
  faLightbulb, faRocket, faCompass, faArrowRight, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import { getModuleIcon } from '../utils/iconUtils';
import ModuleDetails from './ModuleDetails';
import { generateModulePdf } from '../pdf';

/**
 * JourneyPlanner component
 * 
 * A dedicated component that visualizes the customer transformation journey
 * and helps users plan their transformation path through journey stages.
 */
const JourneyPlanner = () => {
  // State for module data and views
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVariant, setSelectedVariant] = useState('all');
  const [savedModules, setSavedModules] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  
  // State for interactive experience
  const [selectedModule, setSelectedModule] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  
  // Get journey stages from centralized configuration
  const journeySteps = useMemo(() => {
    return modulesConfig.journeyStages.map(stage => {
      // Use a safer approach than eval to map string icon names to icon objects
      let iconObject;
      switch(stage.icon) {
        case 'faCompass': iconObject = faCompass; break;
        case 'faLightbulb': iconObject = faLightbulb; break; 
        case 'faRocket': iconObject = faRocket; break;
        case 'faChartLine': iconObject = faChartLine; break;
        default: iconObject = faCompass; // Default icon
      }

      return {
        id: stage.id,
        title: stage.title,
        description: stage.description,
        icon: iconObject,
        categories: stage.categories
      };
    });
  }, []);
  
  // Get unique categories and variant types from modules
  const categories = [...new Set(modulesConfig.modules.map(module => module.category))];
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
        variantDefinitions: module.variants.map(variant => ({
          ...variant,
          ...modulesConfig.variantDefinitions[variant.type]
        }))
      };
    });
    
    setModules(enhancedModules);
    setFilteredModules(enhancedModules);
  }, []);
  
  // Determine which journey stage a module belongs to
  const determineJourneyStage = (module) => {
    // Return the primary journey stage ID from the module configuration
    return module.primaryJourneyStage || 'journey-stage-3'; // Default to 'Build' if not defined
  };

  // Handle filtering of modules
  useEffect(() => {
    let result = [...modules];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(module => 
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    
    // Filter by journey stage
    if (activeJourneyStep >= 0) {
      const stageId = journeySteps[activeJourneyStep].id;
      result = result.filter(module => module.journeyStage === stageId);
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
    journeySteps
  ]);

  // Toggle save/unsave module
  const toggleSaveModule = (moduleName) => {
    if (savedModules.includes(moduleName)) {
      setSavedModules(savedModules.filter(name => name !== moduleName));
    } else {
      setSavedModules([...savedModules, moduleName]);
    }
  };

  // View module details
  const viewModuleDetails = (module) => {
    setSelectedModule(module);
    setIsDetailView(true);
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
      switch(module.pillar.toLowerCase()) {
        case 'transformation': return '#D99000'; // Darkened from #FFBE59 for better contrast
        case 'strategy': return '#C85A30'; // Darkened from #EB8258 for better contrast
        case 'technology': return '#1F776D'; // Already had good contrast
        case 'discovery': return '#2E2266'; // Primary color for discovery
        default: return '#D99000';
      }
    };

    return (
      <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Colored header section with pillar name - matching pillar card style */}
        <div 
          className="px-4 py-3 flex items-center w-full"
          style={{ 
            backgroundColor: getPillarColor(),
            color: 'white'
          }}
        >
          <div 
            className="w-8 h-8 flex items-center justify-center mr-2"
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesomeIcon icon={module.iconObject || faCompass} />
          </div>
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-white text-sm">{module.pillar}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
              {module.category}
            </span>
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {module.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
            {module.heading}
          </p>
          
          <div className="mt-auto flex flex-wrap gap-1.5">
            {module.variants.map((variant, index) => (
              <span key={index} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                variant.type === 'Insight Primer' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                <FontAwesomeIcon 
                  icon={variant.type === 'Insight Primer' ? faLightbulb : faRocket} 
                  className="mr-1" 
                  size="xs" 
                />
                {variant.type}
              </span>
            ))}
          </div>
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
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveModule(module.name);
            }}
            className={`${
              savedModules.includes(module.name) 
                ? 'text-amber-500 hover:text-amber-600' 
                : 'text-gray-400 hover:text-gray-500'
            }`}
            aria-label={savedModules.includes(module.name) ? "Unsave module" : "Save module"}
          >
            <FontAwesomeIcon icon={savedModules.includes(module.name) ? faBookmark : faBookmarkRegular} />
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
        pathColor: 'rgba(43, 108, 176, 0.8)' // Path color when active
      },
      { 
        name: 'plan',
        baseColor: '#DD6B20', // Rich orange for Plan stage
        lightColor: 'rgba(221, 107, 32, 0.08)', // Very light orange background
        mediumColor: 'rgba(221, 107, 32, 0.15)', // Medium orange for hover
        borderColor: 'rgba(221, 107, 32, 0.3)', // Border color
        textColor: '#DD6B20', // Text color for inactive
        iconBg: 'rgba(221, 107, 32, 0.15)', // Icon background
        pathColor: 'rgba(221, 107, 32, 0.8)' // Path color when active
      },
      { 
        name: 'execute',
        baseColor: '#2F855A', // Rich green for Execute stage
        lightColor: 'rgba(47, 133, 90, 0.08)', // Very light green background
        mediumColor: 'rgba(47, 133, 90, 0.15)', // Medium green for hover
        borderColor: 'rgba(47, 133, 90, 0.3)', // Border color
        textColor: '#2F855A', // Text color for inactive
        iconBg: 'rgba(47, 133, 90, 0.15)', // Icon background
        pathColor: 'rgba(47, 133, 90, 0.8)' // Path color when active
      },
      { 
        name: 'optimize',
        baseColor: '#6B46C1', // Rich purple for Optimize stage
        lightColor: 'rgba(107, 70, 193, 0.08)', // Very light purple background
        mediumColor: 'rgba(107, 70, 193, 0.15)', // Medium purple for hover
        borderColor: 'rgba(107, 70, 193, 0.3)', // Border color
        textColor: '#6B46C1', // Text color for inactive
        iconBg: 'rgba(107, 70, 193, 0.15)', // Icon background
        pathColor: 'rgba(107, 70, 193, 0.8)' // Path color when active
      }
    ];
    
    const stageColor = stageColors[index];
    
    // Create dynamic styles
    const cardStyle = {
      backgroundColor: isActive ? stageColor.baseColor : 'white',
      borderColor: isActive ? stageColor.baseColor : stageColor.borderColor,
      boxShadow: isActive 
        ? `0 10px 15px -3px ${stageColor.lightColor}, 0 4px 6px -2px ${stageColor.borderColor}` 
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    };
    
    // Style for the number indicator
    const numberStyle = {
      backgroundColor: isActive ? 'white' : stageColor.iconBg,
      color: isActive ? stageColor.baseColor : 'white',
      boxShadow: isActive ? `0 0 0 2px ${stageColor.baseColor}` : 'none'
    };
    
    // Style for the icon
    const iconStyle = {
      color: isActive ? 'white' : stageColor.textColor,
      opacity: isActive ? 1 : 0.7
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
          style={{ color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(75, 85, 99, 0.9)' }}
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
                backgroundColor: activeJourneyStep >= index ? stageColor.pathColor : '#E5E7EB',
                transform: 'translateY(-50%)'
              }}
            ></div>
            
            {/* Path arrow */}
            <div 
              className="hidden md:flex absolute -right-8 top-1/2 w-4 h-4 items-center justify-center z-10 transition-all duration-300 transform -translate-y-1/2"
              style={{ 
                color: activeJourneyStep >= index ? stageColor.pathColor : '#E5E7EB'
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
            transform: 'translateY(-50%)'
          }}
        ></div>
        
        {/* Progress path - shows completion */}
        <div 
          className="hidden md:block absolute top-1/2 left-0 h-1 z-0 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${Math.min(100, (activeJourneyStep / (journeySteps.length - 1)) * 100)}%`,
            background: 'linear-gradient(to right, #2B6CB0, #DD6B20, #2F855A, #6B46C1)',
            transform: 'translateY(-50%)'
          }}
        ></div>
        
        {journeySteps.map((step, index) => (
          <JourneyStep key={step.id} step={step} index={index} />
        ))}
      </div>
    );
  };

  // Filter and search panel
  const FilterPanel = () => (
    <div className={`transition-all duration-300 overflow-hidden ${showFilter ? 'max-h-60' : 'max-h-0'}`}>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            >
              <option value="all">All Pillars</option>
              {['Transformation', 'Strategy', 'Technology', 'Discovery'].map((pillar) => (
                <option key={pillar} value={pillar}>{pillar}</option>
              ))}
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-elx-primary focus:border-elx-primary sm:text-sm"
          >
            <option value="all">All Variant Types</option>
            {variantTypes.map((variant) => (
              <option key={variant} value={variant}>{variant}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {isDetailView ? (
        <ModuleDetails 
          selectedModule={selectedModule}
          journeySteps={journeySteps}
          savedModules={savedModules}
          toggleSaveModule={toggleSaveModule}
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
                Plan your transformation journey from assessment to optimization. 
                Discover and organize modules that support each phase of your business transformation.
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
                    {showSavedOnly ? 'Show All' : `Saved (${savedModules.length})`}
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="elx-btn elx-btn-outline py-1 px-3 text-sm flex items-center"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-1" />
                {showFilter ? 'Hide Filters' : 'Filters & Search'}
                <FontAwesomeIcon 
                  icon={showFilter ? faChevronDown : faChevronRight} 
                  className="ml-1 text-xs" 
                />
              </button>
            </div>
          </div>
          
          {/* Filter panel (expandable) */}
          <FilterPanel />
          
          {/* Journey Steps */}
          <div className="mb-8">
            <JourneyStepsContainer />
            
            {filteredModules.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-elx-primary">
                    {journeySteps[activeJourneyStep].title} Phase Modules
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((module) => (
                    <ModuleCard key={module.name} module={module} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">No modules found for this journey phase with your current filters.</p>
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