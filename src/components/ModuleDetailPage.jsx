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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDownload,
  faLayerGroup,
  faClock,
  faRocket,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { getIcon } from '../utils/iconUtils';

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

  const pillarThemes = {
    Transformation: {
      accent: '#D99000',
      gradient:
        'linear-gradient(135deg, rgba(217,144,0,0.95) 0%, rgba(245,198,99,0.9) 54%, rgba(255,248,230,0.92) 100%)',
      badgeBg: 'rgba(217,144,0,0.12)',
      chipBg: 'rgba(217,144,0,0.14)',
      chipBorder: 'rgba(217,144,0,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#D99000',
    },
    Strategy: {
      accent: '#C85A30',
      gradient:
        'linear-gradient(135deg, rgba(200,90,48,0.95) 0%, rgba(226,143,102,0.9) 52%, rgba(255,234,223,0.92) 100%)',
      badgeBg: 'rgba(200,90,48,0.12)',
      chipBg: 'rgba(200,90,48,0.14)',
      chipBorder: 'rgba(200,90,48,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#C85A30',
    },
    Technology: {
      accent: '#1F776D',
      gradient:
        'linear-gradient(135deg, rgba(31,119,109,0.95) 0%, rgba(61,161,150,0.9) 55%, rgba(219,244,240,0.92) 100%)',
      badgeBg: 'rgba(31,119,109,0.12)',
      chipBg: 'rgba(31,119,109,0.14)',
      chipBorder: 'rgba(31,119,109,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#1F776D',
    },
    Discovery: {
      accent: '#2E2266',
      gradient:
        'linear-gradient(135deg, rgba(46,34,102,0.95) 0%, rgba(88,69,160,0.9) 55%, rgba(234,230,255,0.92) 100%)',
      badgeBg: 'rgba(46,34,102,0.14)',
      chipBg: 'rgba(46,34,102,0.16)',
      chipBorder: 'rgba(46,34,102,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#2E2266',
    },
    Catalyst: {
      accent: '#0A4DA1',
      gradient:
        'linear-gradient(135deg, rgba(10,77,161,0.95) 0%, rgba(58,129,221,0.9) 54%, rgba(223,236,255,0.92) 100%)',
      badgeBg: 'rgba(10,77,161,0.12)',
      chipBg: 'rgba(10,77,161,0.14)',
      chipBorder: 'rgba(10,77,161,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#0A4DA1',
    },
  };

  const pillarTheme = pillarThemes[module.pillar] ||
    pillarThemes.Discovery || {
      accent: '#2E2266',
      gradient:
        'linear-gradient(135deg, rgba(46,34,102,0.95) 0%, rgba(88,69,160,0.9) 55%, rgba(234,230,255,0.92) 100%)',
      badgeBg: 'rgba(46,34,102,0.16)',
      chipBg: 'rgba(46,34,102,0.16)',
      chipBorder: 'rgba(46,34,102,0.32)',
      iconBg: 'rgba(255,255,255,0.2)',
      canvasBg: '#2E2266',
    };

  const moduleIcon = getIcon(
    module.icon || modulesConfig.pillarIcons[module.pillar]
  );

  const businessValueItems =
    module.businessValue
      ?.split(',')
      .map(item => item.trim())
      .filter(Boolean) || [];

  const variantTypes =
    module.variants?.map(variant => variant.type).filter(Boolean) || [];

  const variantDurations = Array.from(
    new Set(
      (module.variants || []).map(variant => variant.duration).filter(Boolean)
    )
  );

  const timelineSummary =
    module.expectedOutcomes?.timeline ||
    (variantDurations.length > 0 ? variantDurations.join(' • ') : null);

  const quickFacts = [
    module.category && {
      label: 'Module Type',
      value: module.category,
      icon: faLayerGroup,
    },
    variantTypes.length > 0 && {
      label: 'Engagement Models',
      value: variantTypes.join(' • '),
      icon: faRocket,
    },
    timelineSummary && {
      label: 'Timeline',
      value: timelineSummary,
      icon: faClock,
    },
  ].filter(Boolean);

  const contactHref = `mailto:sales@elexive.com?subject=${encodeURIComponent(
    `Elexive Module Inquiry – ${module.name}`
  )}`;

  // If module has enhanced data, render solution brief
  if (hasEnhancedData) {
    return (
      <div
        className="w-full px-4 py-8 elx-main-content"
        data-testid="solution-brief"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm font-medium text-elx-primary hover:text-elx-accent transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4" />
            Back to Modules
          </button>

          {/* Hero */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-8 lg:p-10 flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${pillarTheme.accent}14`,
                      color: pillarTheme.accent,
                    }}
                  >
                    <FontAwesomeIcon icon={moduleIcon} className="h-3.5" />
                    {module.pillar}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700">
                    {module.category}
                  </span>
                </div>

                <header className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {module.name}
                  </h1>
                  {module.heading && (
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {module.heading}
                    </p>
                  )}
                </header>

                {businessValueItems.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Value Headlines
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {businessValueItems.map((value, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                          style={{
                            backgroundColor: pillarTheme.chipBg,
                            border: `1px solid ${pillarTheme.chipBorder}`,
                            color: pillarTheme.accent,
                          }}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {quickFacts.length > 0 && (
                  <div className="pt-4">
                    <div className="grid gap-6 md:grid-cols-3">
                      {quickFacts.map((fact, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${pillarTheme.accent}12`,
                              color: pillarTheme.accent,
                            }}
                          >
                            <FontAwesomeIcon icon={fact.icon} className="h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                              {fact.label}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 leading-snug">
                              {fact.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside
                className="lg:w-[360px] p-8 lg:p-10 flex flex-col gap-6"
                style={{ backgroundColor: pillarTheme.canvasBg }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-full text-white">
                    <h3 className="text-lg font-semibold tracking-[0.3em] text-white uppercase mb-6">
                      {module.pillar}
                    </h3>
                    <div className="text-white">
                      <img
                        src="/common-module-white.png"
                        alt={`${module.pillar} pillar`}
                        className="mx-auto max-w-full h-auto w-28"
                      />
                    </div>
                  </div>

                  {module.callToAction && (
                    <p className="text-sm text-white leading-relaxed">
                      {module.callToAction}
                    </p>
                  )}
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-4">
                  <button
                    onClick={exportToPdf}
                    disabled={isExporting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white bg-elx-primary hover:bg-elx-accent transition disabled:opacity-70"
                  >
                    <FontAwesomeIcon icon={faDownload} className="h-4" />
                    {isExporting ? 'Exporting…' : 'Export PDF'}
                  </button>
                  <a
                    href={contactHref}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-elx-primary border border-elx-primary hover:bg-elx-primary hover:text-white transition"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="h-4" />
                    Discuss This Module
                  </a>
                </div>
              </aside>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <ExecutiveSummary module={module} />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900">
                  Solution Brief
                </h2>
                <ShowAllToggle
                  onToggle={toggleAllSections}
                  allExpanded={allExpanded}
                  className="mb-0"
                  accentColor={pillarTheme.accent}
                />
              </div>

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
                  accentColor={pillarTheme.accent}
                  className="bg-white shadow-sm"
                >
                  <BusinessChallengeContent
                    challenge={module.businessChallenge}
                  />
                </ExpandableSection>
              )}

              {module.approach && (
                <ExpandableSection
                  title={module.approach.title || 'Our Approach & Methodology'}
                  defaultExpanded={expandedSections.approach}
                  onToggle={isExpanded =>
                    handleSectionToggle('approach', isExpanded)
                  }
                  accentColor={pillarTheme.accent}
                  className="bg-white shadow-sm"
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
                  accentColor={pillarTheme.accent}
                  className="bg-white shadow-sm"
                >
                  <ExpectedOutcomesContent outcomes={module.expectedOutcomes} />
                </ExpandableSection>
              )}

              {module.implementation && (
                <ExpandableSection
                  title={
                    module.implementation.title || 'Implementation Timeline'
                  }
                  defaultExpanded={expandedSections.implementation}
                  onToggle={isExpanded =>
                    handleSectionToggle('implementation', isExpanded)
                  }
                  accentColor={pillarTheme.accent}
                  className="bg-white shadow-sm"
                >
                  <ImplementationContent
                    implementation={module.implementation}
                  />
                </ExpandableSection>
              )}

              {module.caseStudy && (
                <ExpandableSection
                  title={module.caseStudy.title || 'Success Story'}
                  defaultExpanded={expandedSections.caseStudy}
                  onToggle={isExpanded =>
                    handleSectionToggle('caseStudy', isExpanded)
                  }
                  accentColor={pillarTheme.accent}
                  className="bg-white shadow-sm"
                >
                  <CaseStudyContent caseStudy={module.caseStudy} />
                </ExpandableSection>
              )}

              <EngagementModels variants={module.variants} />
            </div>

            <aside className="space-y-6">
              {module.whoIsItFor && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Ideal Executive
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {module.whoIsItFor}
                  </p>
                </div>
              )}

              {module.benefits && module.benefits.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                    Strategic Benefits
                  </h3>
                  <ul className="space-y-2">
                    {module.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-800 leading-snug border-l-2 pl-3"
                        style={{ borderColor: pillarTheme.accent }}
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {module.executiveSummary && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Executive Snapshot
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {module.executiveSummary}
                  </p>
                </div>
              )}

              {module.businessValue && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    KPI Impact
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {module.businessValue}
                  </p>
                </div>
              )}
            </aside>
          </div>
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
