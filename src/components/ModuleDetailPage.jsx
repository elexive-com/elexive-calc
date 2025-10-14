import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ModuleDetails from './ModuleDetails';
import ModuleNotFound from './ModuleNotFound';
import ExecutiveSummary from './ExecutiveSummary';
import BusinessChallengeContent from './BusinessChallengeContent';
import ApproachContent from './ApproachContent';
import ExpectedOutcomesContent from './ExpectedOutcomesContent';
import ImplementationContent from './ImplementationContent';
import CaseStudyContent from './CaseStudyContent';
import EngagementModels from './InvestmentOptions';
import ExpandableSection from './ExpandableSection';
import ShowAllToggle from './ShowAllToggle';
import modulesConfig from '../config/modulesConfig.json';
import { generateModulePdf } from '../pdf';

/**
 * ModuleDetailPage component for direct URL routing
 *
 * Handles parameterized routes like /modules/{slug} and renders the
 * existing ModuleDetails component with the found module data.
 * Includes enhanced browser navigation support and URL state management.
 */
const ModuleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [navigationState, setNavigationState] = useState({
    canGoBack: false,
    referrer: null,
  });

  // Solution brief state management
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    businessChallenge: false,
    approach: false,
    expectedOutcomes: false,
    implementation: false,
    caseStudy: false,
  });

  // Enhanced module loading with validation and error handling
  useEffect(() => {
    const loadModule = async () => {
      setLoading(true);
      setError(null);

      try {
        // Validate slug format (should be kebab-case)
        if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
          setError('Invalid module identifier format');
          setModule(null);
          return;
        }

        // Find module by slug with case-insensitive fallback
        let foundModule = modulesConfig.modules.find(m => m.id === slug);

        // If not found, try case-insensitive search as fallback
        if (!foundModule) {
          foundModule = modulesConfig.modules.find(
            m => m.id && m.id.toLowerCase() === slug.toLowerCase()
          );
        }

        if (foundModule) {
          setModule(foundModule);
          setError(null);

          // Update document title for better browser navigation
          document.title = `${foundModule.name} - Elexive Modules`;
        } else {
          setError('Module not found');
          setModule(null);
          document.title = 'Module Not Found - Elexive';
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading module:', err);
        setError('Error loading module configuration');
        setModule(null);
        document.title = 'Error - Elexive';
      } finally {
        setLoading(false);
      }
    };

    loadModule();

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Elexive Calculator';
    };
  }, [slug]);

  // Enhanced navigation state management
  useEffect(() => {
    // Check if user can go back in browser history
    const canGoBack = window.history && window.history.length > 1;

    // Get referrer information from location state or document referrer
    const referrer =
      location.state?.from ||
      (document.referrer && new URL(document.referrer).pathname) ||
      null;

    setNavigationState({
      canGoBack,
      referrer,
    });
  }, [location.state]);

  // Enhanced back navigation with intelligent routing
  const handleBack = useCallback(() => {
    const { canGoBack, referrer } = navigationState;

    // If we have a referrer within our app and can go back, use browser back
    if (canGoBack && referrer && referrer.startsWith('/')) {
      // Check if referrer is within our app domain
      if (
        referrer === '/modules' ||
        referrer.startsWith('/modules') ||
        referrer === '/calculator' ||
        referrer === '/journey' ||
        referrer === '/'
      ) {
        window.history.back();
        return;
      }
    }

    // Default fallback: navigate to modules page
    navigate('/modules', { replace: false });
  }, [navigate, navigationState]);

  // Toggle all sections functionality
  const toggleAllSections = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    setExpandedSections(
      Object.keys(expandedSections).reduce((acc, key) => {
        acc[key] = newState;
        return acc;
      }, {})
    );
  };

  // Handle individual section toggle
  const handleSectionToggle = (sectionKey, isExpanded) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: isExpanded,
    }));

    // Update allExpanded state based on whether all sections are expanded
    const updatedSections = { ...expandedSections, [sectionKey]: isExpanded };
    const allSectionsExpanded = Object.values(updatedSections).every(
      expanded => expanded
    );
    setAllExpanded(allSectionsExpanded);
  };

  // Export to PDF function
  const exportToPdf = async () => {
    if (!module) return;

    setIsExporting(true);

    try {
      // Use our centralized PDF generation module with just the module name
      const result = await generateModulePdf(module.name);

      // Check the success status of the PDF generation
      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mx-0 px-4 py-8 elx-main-content">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elx-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading module details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !module) {
    return <ModuleNotFound slug={slug} />;
  }

  // Check if module has enhanced solution brief data
  const hasEnhancedData =
    module.executiveSummary ||
    module.businessChallenge ||
    module.approach ||
    module.expectedOutcomes;

  // Define pillar color mapping (same as ModuleDetails)
  const pillarColorMap = {
    Transformation: '#D99000', // Amber/gold
    Strategy: '#C85A30', // Orange/rust
    Technology: '#1F776D', // Teal
    Discovery: '#2E2266', // Deep purple (primary)
    Catalyst: '#0A4DA1', // Dark blue
  };

  // If module has enhanced data, render solution brief
  if (hasEnhancedData) {
    return (
      <div
        className="w-full mx-0 px-4 py-0 elx-main-content"
        data-testid="solution-brief"
      >
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="mb-4 text-elx-primary hover:text-elx-accent flex items-center space-x-2"
            >
              <span>← Back to Modules</span>
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  {module.pillar} • {module.category}
                </div>
                <h1 className="text-3xl font-bold text-elx-primary">
                  {module.name}
                </h1>
                {module.heading && (
                  <p className="text-lg text-gray-700 mt-2">{module.heading}</p>
                )}
              </div>

              <button
                onClick={exportToPdf}
                disabled={isExporting}
                className="px-4 py-2 bg-elx-primary text-white rounded-md hover:bg-elx-accent transition-colors duration-200 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>

          {/* Executive Summary with Pillar Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Executive Summary */}
            <div className="md:w-2/3">
              <ExecutiveSummary module={module} />
            </div>

            {/* Pillar Section */}
            <div
              className="p-5 rounded-lg shadow-md md:w-1/3 flex flex-col items-center justify-center"
              style={{
                backgroundColor: pillarColorMap[module.pillar] || '#2E2266',
              }}
            >
              <h3 className="elx-pillar-title">{module.pillar}</h3>
              <div className="text-white text-center">
                <img
                  src="/common-module-white.png"
                  alt="Module visualization"
                  className="mx-auto max-w-full h-auto w-1/2"
                />
              </div>
            </div>
          </div>

          {/* Show All Toggle */}
          <ShowAllToggle
            onToggle={toggleAllSections}
            allExpanded={allExpanded}
          />

          {/* Progressive Disclosure Sections */}
          {module.businessChallenge && (
            <ExpandableSection
              title={
                module.businessChallenge.title ||
                'Business Challenge & Opportunity'
              }
              defaultExpanded={expandedSections.businessChallenge}
              onToggle={isExpanded =>
                handleSectionToggle('businessChallenge', isExpanded)
              }
            >
              <BusinessChallengeContent challenge={module.businessChallenge} />
            </ExpandableSection>
          )}

          {module.approach && (
            <ExpandableSection
              title={module.approach.title || 'Our Approach & Methodology'}
              defaultExpanded={expandedSections.approach}
              onToggle={isExpanded =>
                handleSectionToggle('approach', isExpanded)
              }
            >
              <ApproachContent approach={module.approach} />
            </ExpandableSection>
          )}

          {module.expectedOutcomes && (
            <ExpandableSection
              title={
                module.expectedOutcomes.title ||
                'Expected Outcomes & Success Metrics'
              }
              defaultExpanded={expandedSections.expectedOutcomes}
              onToggle={isExpanded =>
                handleSectionToggle('expectedOutcomes', isExpanded)
              }
            >
              <ExpectedOutcomesContent outcomes={module.expectedOutcomes} />
            </ExpandableSection>
          )}

          {module.implementation && (
            <ExpandableSection
              title={module.implementation.title || 'Implementation Timeline'}
              defaultExpanded={expandedSections.implementation}
              onToggle={isExpanded =>
                handleSectionToggle('implementation', isExpanded)
              }
            >
              <ImplementationContent implementation={module.implementation} />
            </ExpandableSection>
          )}

          {module.caseStudy && (
            <ExpandableSection
              title={module.caseStudy.title || 'Success Story'}
              defaultExpanded={expandedSections.caseStudy}
              onToggle={isExpanded =>
                handleSectionToggle('caseStudy', isExpanded)
              }
            >
              <CaseStudyContent caseStudy={module.caseStudy} />
            </ExpandableSection>
          )}

          {/* Engagement Models - Always Visible */}
          <EngagementModels variants={module.variants} />
        </div>
      </div>
    );
  }

  // For modules without enhanced data, use original ModuleDetails component
  return (
    <ModuleDetails
      selectedModule={module}
      exportToPdf={exportToPdf}
      isExporting={isExporting}
      onBack={handleBack}
    />
  );
};

export default ModuleDetailPage;
