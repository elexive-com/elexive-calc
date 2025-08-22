import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faLightbulb,
  faRocket,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import ModuleDetails from './ModuleDetails';
import ModuleNotFound from './ModuleNotFound';
import modulesConfig from '../config/modulesConfig.json';
import { generateModulePdf } from '../pdf';

/**
 * ModuleDetailPage component for direct URL routing
 *
 * Handles parameterized routes like /modules/{slug} and renders the
 * existing ModuleDetails component with the found module data.
 */
const ModuleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Find module by slug
  useEffect(() => {
    try {
      const foundModule = modulesConfig.modules.find(m => m.id === slug);
      if (foundModule) {
        setModule(foundModule);
        setError(null);
      } else {
        setError('Module not found');
        setModule(null);
      }
    } catch (err) {
      console.error('Error loading module:', err);
      setError('Error loading module configuration');
      setModule(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/modules');
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
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Build journey steps for ModuleDetails
  const journeySteps = useMemo(() => {
    const iconMap = {
      faCompass: faCompass,
      faLightbulb: faLightbulb,
      faRocket: faRocket,
      faChartLine: faChartLine,
    };

    return modulesConfig.journeyStages.map(stage => ({
      ...stage,
      icon: iconMap[stage.icon] || faCompass,
    }));
  }, []);

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
        journeySteps={journeySteps}
        exportToPdf={exportToPdf}
        isExporting={isExporting}
        onBack={handleBack}
      />
    </div>
  );
};

export default ModuleDetailPage;
