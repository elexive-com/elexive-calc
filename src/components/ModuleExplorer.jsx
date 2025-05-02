import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faBookmark, faChevronRight, faChevronDown,
  faLightbulb, faRocket, faCompass, faUsers, 
  faArrowRight, faCheckCircle, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import { getModuleIcon } from '../utils/iconUtils';
import ModuleDetails from './ModuleDetails';
// Import our new PDF generation module
import { generateModulePdf } from '../pdf';

/**
 * ModuleExplorer component - Reimagined with modern UX
 * 
 * Provides an interactive interface for exploring consulting modules with
 * pillars as the focal point and customer journey front and center.
 */
const ModuleExplorer = () => {
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
  const [activeView, setActiveView] = useState('pillars'); // 'pillars', 'journey', 'list'
  const [highlightedPillar, setHighlightedPillar] = useState(null);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  
  // Refs for animations
  const pillarsRef = useRef(null);
  
  // Define pillar details with useMemo to prevent recreation on each render
  const pillarConfig = useMemo(() => ({
    'Transformation': {
      name: 'Transformation',
      icon: faLayerGroup,
      description: 'Transform your organization with leadership strategies, cultural shifts, and agile methodologies.',
      focus: 'People & Process'
    },
    'Strategy': {
      name: 'Strategy',
      icon: faLayerGroup,
      description: 'Define your vision and chart the path forward with strategic insights and market positioning.',
      focus: 'Vision & Direction'
    },
    'Technology': {
      name: 'Technology',
      icon: faLayerGroup,
      description: 'Harness cutting-edge technology to drive innovation, efficiency, and competitive advantage.',
      focus: 'Tools & Systems'
    },
    'Discovery': {
      name: 'Discovery',
      icon: faCompass,
      description: 'Uncover insights and opportunities through research, assessment, and collaborative exploration.',
      focus: 'Research & Assessment'
    }
  }), []);
  
  // Define customer journey steps with useMemo to prevent recreation on each render
  const journeySteps = useMemo(() => [
    {
      id: 'assess',
      title: 'Assess',
      description: 'Understand your current state and define transformation goals',
      icon: faCompass,
      categories: ['Strategic Assessment']
    },
    {
      id: 'plan',
      title: 'Plan',
      description: 'Develop strategies and roadmaps for transformation success',
      icon: faLightbulb,
      categories: ['Immediate Impact', 'Vested Value']
    },
    {
      id: 'execute',
      title: 'Execute',
      description: 'Implement solutions and drive organizational change',
      icon: faRocket,
      categories: ['Immediate Impact']
    },
    {
      id: 'optimize',
      title: 'Optimize',
      description: 'Refine approaches and maximize transformation outcomes',
      icon: faCheckCircle,
      categories: ['Vested Value']
    }
  ], []);
  
  // Get unique pillars, categories, and variant types from modules
  const pillars = [...new Set(modulesConfig.modules.map(module => module.pillar))];
  const categories = [...new Set(modulesConfig.modules.map(module => module.category))];
  const variantTypes = Object.keys(modulesConfig.variantDefinitions);
  
  // Load modules data on component mount
  useEffect(() => {
    // Add any metadata we might want to enhance each module with
    const enhancedModules = modulesConfig.modules.map(module => {
      // Make sure the pillar exists in our pillarConfig before trying to use it
      const pillarConfigForModule = pillarConfig[module.pillar] || {
        // Default values if pillar isn't found
        color: 'gray',
        bgColor: 'bg-gray-100',
        hoverBgColor: 'hover:bg-gray-200',
        borderColor: 'border-gray-300',
        textColor: 'text-gray-800',
        icon: faCompass,
        description: 'This module is part of our consulting offerings.',
        focus: 'Business Transformation'
      };
      
      return {
        ...module,
        iconObject: getModuleIcon(module.pillar, module.name),
        pillarIcon: modulesConfig.pillarIcons[module.pillar],
        pillarConfig: pillarConfigForModule,
        journeyStage: determineJourneyStage(module.category),
        variantDefinitions: module.variants.map(variant => ({
          ...variant,
          ...modulesConfig.variantDefinitions[variant.type]
        }))
      };
    });
    
    setModules(enhancedModules);
    setFilteredModules(enhancedModules);
    
    // Set highlighted pillar to default to 'Transformation'
    setHighlightedPillar('Transformation');
  }, [pillarConfig]);
  
  // Determine which journey stage a module belongs to
  const determineJourneyStage = (category) => {
    if (category === 'Strategic Assessment') return 'assess';
    if (category === 'Immediate Impact') return Math.random() > 0.5 ? 'plan' : 'execute';
    if (category === 'Vested Value') return Math.random() > 0.5 ? 'plan' : 'optimize';
    return 'execute'; // Default
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
    } else if (highlightedPillar && activeView === 'pillars') {
      // When in pillars view and a pillar is highlighted
      result = result.filter(module => module.pillar === highlightedPillar);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(module => module.category === selectedCategory);
    }
    
    // Filter by journey stage
    if (activeView === 'journey' && activeJourneyStep >= 0) {
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
    highlightedPillar,
    activeView,
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
    // Get the color code based on pillar type - using the same function as in PillarCard
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
            <FontAwesomeIcon icon={module.pillarConfig.icon} />
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
  
  // Pillar card component with standardized elx- classes
  const PillarCard = ({ pillar }) => {
    // Add safety check to provide default values if config is undefined
    const config = pillarConfig[pillar] || {
      icon: faCompass,
      description: 'Explore this transformation area with its modules.',
      focus: 'Business Transformation'
    };
    
    const isActive = highlightedPillar === pillar;
    const pillarModules = modules.filter(module => module.pillar === pillar);
    
    // Get the color code based on pillar type - improved contrast versions
    const getPillarColor = () => {
      switch(pillar.toLowerCase()) {
        case 'transformation': return '#D99000'; // Darkened from #FFBE59 for better contrast
        case 'strategy': return '#C85A30'; // Darkened from #EB8258 for better contrast
        case 'technology': return '#1F776D'; // Already had good contrast
        case 'discovery': return '#2E2266'; // Primary color for discovery
        default: return '#D99000';
      }
    };
    
    return (
      <div 
        className={`${isActive ? 'shadow-md scale-105' : ''} bg-white`}
        onClick={() => setHighlightedPillar(pillar)}
        style={{
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}
      >
        {/* Colored header section with white text - full width */}
        <div 
          className="px-4 py-3 flex items-center w-full"
          style={{ 
            backgroundColor: getPillarColor(),
            color: 'white'
          }}
        >
          <div 
            className="w-12 h-12 flex items-center justify-center mr-3"
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesomeIcon icon={config.icon} size="2x" />
          </div>
          <div>
            <h3 className="font-bold text-white">{pillar}</h3>
            <p className="text-xs text-white text-opacity-90">{config.focus}</p>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4">
          <p className="elx-body text-sm mb-4">
            {config.description}
          </p>
          
          <div className="pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">{pillarModules.length} Modules Available</span>
            <div className="mt-2 flex items-center justify-between">
              <button 
                className="elx-btn-text"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPillar(pillar);
                  setActiveView('list');
                }}
              >
                See Modules
                <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(3, pillarModules.length) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 rounded-full" 
                    style={{ 
                      backgroundColor: isActive 
                        ? getPillarColor() 
                        : '#e5e7eb'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Journey step component
  const JourneyStep = ({ step, index }) => {
    const isActive = index === activeJourneyStep;
    const colors = ['blue', 'amber', 'green', 'purple'];
    const color = colors[index % colors.length];
    
    const colorClasses = {
      blue: {
        bg: isActive ? 'bg-blue-500' : 'bg-blue-100',
        text: isActive ? 'text-white' : 'text-blue-800',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-200'
      },
      amber: {
        bg: isActive ? 'bg-amber-500' : 'bg-amber-100',
        text: isActive ? 'text-white' : 'text-amber-800',
        border: 'border-amber-200',
        hover: 'hover:bg-amber-200'
      },
      green: {
        bg: isActive ? 'bg-green-500' : 'bg-green-100',
        text: isActive ? 'text-white' : 'text-green-800',
        border: 'border-green-200',
        hover: 'hover:bg-green-200'
      },
      purple: {
        bg: isActive ? 'bg-purple-500' : 'bg-purple-100',
        text: isActive ? 'text-white' : 'text-purple-800',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-200'
      }
    };
    
    return (
      <div 
        className={`relative rounded-xl p-5 cursor-pointer border transition-all duration-300 ${
          isActive 
            ? `${colorClasses[color].bg} ${colorClasses[color].text} shadow-md` 
            : `bg-white ${colorClasses[color].border} ${colorClasses[color].hover} hover:shadow-md`
        }`}
        onClick={() => setActiveJourneyStep(index)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`w-8 h-8 rounded-full ${
            isActive ? 'bg-white text-elx-primary' : `${colorClasses[color].bg} text-white`
          } flex items-center justify-center font-bold`}>
            {index + 1}
          </div>
          <FontAwesomeIcon icon={step.icon} className={isActive ? 'text-white opacity-80' : ''} />
        </div>
        
        <h3 className={`text-lg font-bold ${isActive ? 'text-white' : 'text-elx-primary'}`}>
          {step.title}
        </h3>
        
        <p className={`text-sm mt-1 ${isActive ? 'text-white opacity-90' : 'text-gray-600'}`}>
          {step.description}
        </p>
        
        {/* Connection line to next step */}
        {index < journeySteps.length - 1 && (
          <div className="hidden md:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
            <FontAwesomeIcon icon={faArrowRight} className="text-gray-300 fa-lg" />
          </div>
        )}
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
              {pillars.map((pillar) => (
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

  // Module list view (main explorer)
  const ModuleListView = () => (
    <div className="module-explorer">
      {/* Navigation tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex">
          <button 
            onClick={() => setActiveView('pillars')}
            className={`py-3 px-4 border-b-2 text-sm font-medium ${
              activeView === 'pillars' 
                ? 'border-elx-accent text-elx-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Transformation Pillars
          </button>
          <button 
            onClick={() => setActiveView('journey')}
            className={`py-3 px-4 border-b-2 text-sm font-medium ${
              activeView === 'journey' 
                ? 'border-elx-accent text-elx-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCompass} className="mr-2" />
            Customer Journey
          </button>
          <button 
            onClick={() => setActiveView('list')}
            className={`py-3 px-4 border-b-2 text-sm font-medium ${
              activeView === 'list' 
                ? 'border-elx-accent text-elx-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Browse All Modules
          </button>
        </div>
      </div>
      
      {/* Header and search/filter toggle */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-elx-primary mb-3 md:mb-0">
            {activeView === 'pillars' 
              ? 'Transformation Pillars' 
              : activeView === 'journey' 
                ? 'Customer Journey' 
                : 'Module Explorer'
            }
          </h2>
          {activeView === 'pillars' && (
            <p className="text-gray-600 mb-4 max-w-3xl">
              Explore our consulting modules organized by our core transformation pillars. Each pillar 
              represents a key area of business transformation.
            </p>
          )}
          {activeView === 'journey' && (
            <p className="text-gray-600 mb-4 max-w-3xl">
              Navigate through the customer transformation journey from assessment to optimization. 
              Discover modules that support each phase of your transformation.
            </p>
          )}
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
      
      {/* Content based on active view */}
      {activeView === 'pillars' && (
        <div className="mb-8">
          {/* Discovery pillar in its own row */}
          {pillars.includes('Discovery') && (
            <div className="mb-6" ref={pillarsRef}>
              <h3 className="text-xl font-bold text-elx-primary mb-4">Start Your Transformation Journey</h3>
              <div className="md:w-1/3">
                <PillarCard pillar="Discovery" />
              </div>
            </div>
          )}
          
          {/* Other pillars in a separate row */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-elx-primary mb-4">Core Transformation Pillars</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {pillars.filter(pillar => pillar !== 'Discovery').map(pillar => (
                <PillarCard key={pillar} pillar={pillar} />
              ))}
            </div>
          </div>
          
          {highlightedPillar && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${
                  pillarConfig[highlightedPillar] 
                    ? pillarConfig[highlightedPillar].textColor 
                    : 'text-gray-800'
                }`}>
                  {highlightedPillar} Modules
                </h3>
                <button 
                  className="text-sm text-elx-primary hover:text-elx-primary-dark"
                  onClick={() => {
                    setSelectedPillar(highlightedPillar);
                    setActiveView('list');
                  }}
                >
                  View All {highlightedPillar} Modules
                  <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
                </button>
              </div>
              
              {filteredModules.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No modules match your current filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedVariant('all');
                    }}
                    className="mt-2 text-elx-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredModules.slice(0, 6).map((module) => (
                    <ModuleCard key={module.name} module={module} />
                  ))}
                  {/* Add empty placeholder card if there are exactly 3 cards to maintain 2x2 grid */}
                  {filteredModules.length === 3 && (
                    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 opacity-0 pointer-events-none"></div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {activeView === 'journey' && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-8 relative">
            {/* Line connecting journey steps (visible on desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            
            {journeySteps.map((step, index) => (
              <JourneyStep key={step.id} step={step} index={index} />
            ))}
          </div>
          
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
      )}
      
      {activeView === 'list' && (
        <div className="mb-8">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredModules.length} of {modules.length} modules
            </p>
          </div>
          
          {filteredModules.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">No modules match your current filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPillar('all');
                  setSelectedCategory('all');
                  setSelectedVariant('all');
                  setShowSavedOnly(false);
                }}
                className="mt-2 text-elx-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <ModuleCard key={module.name} module={module} />
              ))}
            </div>
          )}
        </div>
      )}
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
        <ModuleListView />
      )}
    </div>
  );
};

export default ModuleExplorer;