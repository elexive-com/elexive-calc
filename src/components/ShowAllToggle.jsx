import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

/**
 * ShowAllToggle Component
 *
 * Provides bulk expand/collapse functionality for solution brief sections
 */
const ShowAllToggle = ({ onToggle, allExpanded, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`mb-4 px-4 py-2 text-elx-primary hover:text-elx-accent border border-elx-primary hover:border-elx-accent rounded-md transition-colors duration-200 flex items-center space-x-2 ${className}`}
      data-testid="show-all-toggle"
    >
      <FontAwesomeIcon
        icon={allExpanded ? faCompress : faExpand}
        className="text-sm"
      />
      <span className="text-sm font-medium">
        {allExpanded ? 'Collapse All Sections' : 'Show All Sections'}
      </span>
    </button>
  );
};

export default ShowAllToggle;
