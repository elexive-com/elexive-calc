import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

/**
 * ShowAllToggle Component
 *
 * Provides bulk expand/collapse functionality for solution brief sections
 */
const DEFAULT_ACCENT = '#2E2266';

const ShowAllToggle = ({
  onToggle,
  allExpanded,
  className = '',
  accentColor,
}) => {
  const accent = accentColor || DEFAULT_ACCENT;

  return (
    <button
      onClick={onToggle}
      className={`mb-4 px-4 py-2 border rounded-md transition-colors duration-200 flex items-center space-x-2 hover:bg-gray-50 ${className}`}
      data-testid="show-all-toggle"
      style={{
        color: accent,
        borderColor: accent,
      }}
    >
      <FontAwesomeIcon
        icon={allExpanded ? faCompress : faExpand}
        className="text-sm"
        style={{ color: accent }}
      />
      <span className="text-sm font-medium">
        {allExpanded ? 'Collapse All Sections' : 'Show All Sections'}
      </span>
    </button>
  );
};

export default ShowAllToggle;
