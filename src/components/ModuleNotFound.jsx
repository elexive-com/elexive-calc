import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

/**
 * ModuleNotFound component for handling invalid module slugs
 *
 * Displays a user-friendly error message when a module slug is not found
 * and provides navigation back to the main modules page.
 */
const ModuleNotFound = ({ slug }) => {
  const navigate = useNavigate();

  const handleBackToModules = () => {
    navigate('/modules');
  };

  return (
    <div className="w-full mx-0 px-4 py-8 elx-main-content">
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-6xl text-yellow-500 mb-4"
          />
        </div>

        <h2 className="text-3xl font-bold text-elx-primary mb-4">
          Module Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-2">
          The module "{slug}" could not be found.
        </p>

        <p className="text-gray-500 mb-8">
          It may have been moved, renamed, or doesn't exist. Please check the
          URL or browse our available modules.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToModules}
            className="elx-btn elx-btn-primary py-3 px-6 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Browse All Modules
          </button>

          <button
            onClick={() => navigate('/')}
            className="elx-btn elx-btn-outline py-3 px-6"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Looking for something specific?</strong>
            <br />
            Try browsing our modules by pillar: Strategy, Transformation,
            Technology, or Discovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModuleNotFound;
