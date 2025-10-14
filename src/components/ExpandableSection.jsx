import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/**
 * ExpandableSection Component
 *
 * Provides progressive disclosure for solution brief content with smooth animations
 */
const ExpandableSection = memo(
  ({
    title,
    children,
    defaultExpanded = false,
    onToggle = null,
    className = '',
  }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const handleToggle = () => {
      const newState = !isExpanded;
      setIsExpanded(newState);
      if (onToggle) {
        onToggle(newState);
      }
    };

    return (
      <div
        className={`border border-gray-200 rounded-lg mb-4 overflow-hidden ${className}`}
      >
        <button
          onClick={handleToggle}
          className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
          aria-expanded={isExpanded}
          data-testid="expandable-section-toggle"
        >
          <h3 className="text-lg font-semibold text-elx-primary">{title}</h3>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="text-elx-primary transition-transform duration-200"
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            overflow: isExpanded ? 'visible' : 'hidden',
          }}
        >
          <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
        </div>
      </div>
    );
  }
);

ExpandableSection.displayName = 'ExpandableSection';

export default ExpandableSection;
