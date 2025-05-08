import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faBookmark, faChevronRight, faChevronDown,
  faLightbulb, faRocket, faCompass,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import { getModuleIcon } from '../utils/iconUtils';
import ModuleDetails from './ModuleDetails';
// Import our PDF generation module
import { generateModulePdf } from '../pdf';

/**
 * ModuleExplorer component - Simplified to Browse All Modules view
 * 
 * Provides an interactive interface for exploring consulting modules with
 * comprehensive filtering capabilities.
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
  const [showFilter, setShowFilter] = useState(false);
  
  // Get unique pillars, categories, and variant types from modules
  const pillars = [...new Set(modulesConfig.modules.map(module => module.pillar))];
  const categories = [...new Set(modulesConfig.modules.map(module => module.category))];
  const variantTypes = Object.keys(modulesConfig.variantDefinitions);
  
  // For journey stages reference in module details
  const journeySteps = useMemo(() => {
    return modulesConfig.journeyStages.map(stage => {
      // Use a safer approach than eval to map string icon names to icon objects
      let iconObject;
      switch(stage.icon) {
        case 'faCompass': iconObject = faCompass; break;
        case 'faLightbulb': iconObject = faLightbulb; break; 
        case 'faRocket': iconObject = faRocket; break;
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
    showSavedOnly
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
        {/* Colored header section with pillar name */}
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
        <div className="module-explorer">
          {/* Header and search/filter toggle */}
          <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-elx-primary mb-3 md:mb-0">
                Module Explorer
              </h2>
              <p className="text-gray-600 mb-4 max-w-3xl">
                Browse our complete catalog of consulting modules across all pillars and categories. 
                Use the filters to find modules that match your specific requirements.
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
          
          {/* Module listing */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredModules.map((module) => (
                  <ModuleCard key={module.name} module={module} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleExplorer;