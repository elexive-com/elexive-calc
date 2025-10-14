import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/**
 * ExpandableSection Component
 *
 * Provides progressive disclosure for solution brief content with smooth animations
 */
const DEFAULT_ACCENT = '#2E2266';

const ExpandableSection = memo(
  ({
    title,
    children,
    defaultExpanded = false,
    onToggle = null,
    className = '',
    accentColor,
  }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const accent = accentColor || DEFAULT_ACCENT;

    const handleToggle = () => {
      const newState = !isExpanded;
      setIsExpanded(newState);
      if (onToggle) {
        onToggle(newState);
      }
    };

    return (
      <div
        className={`border border-gray-200 rounded-2xl overflow-hidden ${className}`}
      >
        <button
          onClick={handleToggle}
          className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200"
          aria-expanded={isExpanded}
          data-testid="expandable-section-toggle"
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-1.5 h-8 rounded-full"
              style={{ backgroundColor: accent }}
            ></span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="transition-transform duration-200"
            style={{ color: accent }}
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
          <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-white">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ExpandableSection.displayName = 'ExpandableSection';

export default ExpandableSection;
