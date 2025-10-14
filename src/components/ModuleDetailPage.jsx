import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ModuleDetails from './ModuleDetails';
import ModuleNotFound from './ModuleNotFound';
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

  // Render module details
  return (
    <div className="w-full mx-0 px-4 py-0 elx-main-content">
      <ModuleDetails
        selectedModule={module}
        exportToPdf={exportToPdf}
        isExporting={isExporting}
        onBack={handleBack}
      />
    </div>
  );
};

export default ModuleDetailPage;
