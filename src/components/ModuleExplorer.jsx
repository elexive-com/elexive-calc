import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBookmark,
  faChevronRight,
  faLightbulb,
  faRocket,
  faCompass,
  faLayerGroup,
  faTimes,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import modulesConfig from '../config/modulesConfig.json';
import { getModuleIcon } from '../utils/iconUtils';
import ModuleDetails from './ModuleDetails';
// Import our PDF generation module
import { generateModulePdf } from '../pdf';
// Import useCalculator hook to access shared state
import useCalculator from '../hooks/useCalculator';

/**
 * ModuleExplorer component - Simplified to Browse All Modules view
 *
 * Provides an interactive interface for exploring consulting modules with
 * comprehensive filtering capabilities.
 */
const ModuleExplorer = () => {
  // Get savedModules state and toggleSaveModule function from useCalculator hook
  const { savedModules, toggleSaveModule } = useCalculator();

  // State for module data and views
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillars, setSelectedPillars] = useState(new Set(['all']));
  const [selectedCategories, setSelectedCategories] = useState(
    new Set(['all'])
  );
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // State for interactive experience
  const [selectedModule, setSelectedModule] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get unique pillars, categories, and variant types from modules
  const pillars = [
    ...new Set(modulesConfig.modules.map(module => module.pillar)),
  ];
  const categories = [
    ...new Set(modulesConfig.modules.map(module => module.category)),
  ];

  // For journey stages reference in module details
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

    // Filter by pillars
    if (!selectedPillars.has('all')) {
      result = result.filter(module => selectedPillars.has(module.pillar));
    }

    // Filter by categories
    if (!selectedCategories.has('all')) {
      result = result.filter(module => selectedCategories.has(module.category));
    }

    // Filter by saved modules
    if (showSavedOnly) {
      result = result.filter(module => savedModules.includes(module.name));
    }

    setFilteredModules(result);
  }, [
    modules,
    searchQuery,
    selectedPillars,
    selectedCategories,
    savedModules,
    showSavedOnly,
  ]);

  // View module details
  const viewModuleDetails = module => {
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPillars(new Set(['all']));
    setSelectedCategories(new Set(['all']));
    setShowSavedOnly(false);
  };

  // Toggle pillar filter
  const togglePillarFilter = pillar => {
    setSelectedPillars(prev => {
      const newSet = new Set(prev);

      // If 'all' is currently selected and user selects a specific pillar
      if (newSet.has('all') && pillar !== 'all') {
        newSet.clear(); // Clear the 'all' selection first
        newSet.add(pillar); // Add just this pillar
        return newSet;
      }

      // If this pillar is already selected, toggle it off
      if (newSet.has(pillar)) {
        newSet.delete(pillar);
        // If no pillars are selected after this removal, set back to 'all'
        if (newSet.size === 0) {
          newSet.add('all');
        }
      } else {
        // If 'all' is not selected, just toggle this pillar
        newSet.add(pillar);
        // Remove 'all' if it exists since we now have specific filters
        newSet.delete('all');
      }

      return newSet;
    });
  };

  // Toggle category filter
  const toggleCategoryFilter = category => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);

      // If 'all' is currently selected and user selects a specific category
      if (newSet.has('all') && category !== 'all') {
        newSet.clear(); // Clear the 'all' selection first
        newSet.add(category); // Add just this category
        return newSet;
      }

      // If this category is already selected, toggle it off
      if (newSet.has(category)) {
        newSet.delete(category);
        // If no categories are selected after this removal, set back to 'all'
        if (newSet.size === 0) {
          newSet.add('all');
        }
      } else {
        // If 'all' is not selected, just toggle this category
        newSet.add(category);
        // Remove 'all' if it exists since we now have specific filters
        newSet.delete('all');
      }

      return newSet;
    });
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
        {/* Colored header section with pillar name */}
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

  // Modern always-visible filter panel
  const ModernFilterPanel = () => (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search bar section with saved modules and clear filters */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-elx-primary-light to-white">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-elx-primary" />
              </div>
              <input
                type="text"
                placeholder="Search for modules by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-10 py-3 border-2 border-elx-primary-light rounded-lg text-gray-700 
                bg-white bg-opacity-90 shadow-md focus:ring-2 focus:ring-elx-primary focus:ring-opacity-50 
                focus:border-elx-primary focus:outline-none transition-all"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  type="button"
                  tabIndex="-1" // Prevent focus stealing
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Clear filters button */}
            {(!selectedPillars.has('all') ||
              !selectedCategories.has('all') ||
              showSavedOnly) && (
              <button
                onClick={clearAllFilters}
                className="whitespace-nowrap py-2 px-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-elx-primary border border-gray-200 rounded-lg transition-colors flex items-center"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="mr-2 text-gray-500"
                />
                Clear filters
              </button>
            )}

            {/* Saved modules button */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              disabled={savedModules.length === 0}
              className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                savedModules.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : showSavedOnly
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                className={`mr-2 ${showSavedOnly ? 'text-white' : 'text-amber-500'}`}
              />
              {showSavedOnly ? 'Show All' : `Saved (${savedModules.length})`}
            </button>
          </div>
        </div>

        {/* Filters section */}
        <div className="p-4 bg-white">
          {/* Filters in two columns for better space usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar Toggles */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 ml-1 block">
                Pillars
              </label>
              <div className="flex flex-wrap gap-2">
                {pillars.map(pillar => (
                  <button
                    key={pillar}
                    onClick={() => togglePillarFilter(pillar)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedPillars.has(pillar) && !selectedPillars.has('all')
                        ? 'bg-elx-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Toggles */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 ml-1 block">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategoryFilter(category)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedCategories.has(category) &&
                      !selectedCategories.has('all')
                        ? 'bg-elx-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
          exportToPdf={exportToPdf}
          isExporting={isExporting}
          onBack={() => setIsDetailView(false)}
        />
      ) : (
        <div className="module-explorer">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-elx-primary mb-2">
              Module Explorer
            </h2>
            <p className="text-gray-600 max-w-3xl">
              Browse our complete catalog of consulting modules across all
              pillars and categories. Use the filters to find modules that match
              your specific requirements.
            </p>
          </div>

          {/* Always visible modern filter panel */}
          <ModernFilterPanel />

          {/* Module listing */}
          <div className="mb-8">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {filteredModules.length}
                  </span>{' '}
                  of {modules.length} modules
                </p>
              </div>

              {filteredModules.length > 0 && (
                <div className="flex items-center">
                  <button className="p-2 rounded-md text-gray-500 hover:text-elx-primary hover:bg-gray-50">
                    <FontAwesomeIcon icon={faList} />
                  </button>
                </div>
              )}
            </div>

            {filteredModules.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-400 text-2xl"
                  />
                </div>
                <p className="text-gray-600 mb-2">
                  No modules match your current filters.
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search criteria or clearing filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="elx-btn elx-btn-outline py-2 px-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredModules.map(module => (
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
