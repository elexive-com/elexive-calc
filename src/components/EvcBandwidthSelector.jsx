import React, { memo, useCallback } from 'react';

/**
 * EvcBandwidthSelector - Simple slider for selecting EVC bandwidth for flexible variants
 */
const EvcBandwidthSelector = memo(
  ({ moduleName, variant, currentBandwidth, onBandwidthChange }) => {
    const { minEvcPerWeek = 2, recommendedEvcPerWeek = 10 } = variant;
    const maxEvcPerWeek = variant.maxEvcPerWeek || 20; // Default max for slider
    const bandwidth = currentBandwidth || recommendedEvcPerWeek;

    const handleChange = useCallback(
      e => {
        const value = parseInt(e.target.value);
        onBandwidthChange(moduleName, value);
      },
      [moduleName, onBandwidthChange]
    );

    if (!variant.isFlexible) {
      return null;
    }

    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700">
            EVC per week: {bandwidth}
          </span>
          <span className="text-xs text-gray-500">
            Starting from {minEvcPerWeek} EVCs/week
          </span>
        </div>
        <input
          type="range"
          min={minEvcPerWeek}
          max={maxEvcPerWeek}
          value={bandwidth}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((bandwidth - minEvcPerWeek) / (maxEvcPerWeek - minEvcPerWeek)) * 100}%, #E5E7EB ${((bandwidth - minEvcPerWeek) / (maxEvcPerWeek - minEvcPerWeek)) * 100}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{minEvcPerWeek}</span>
          <span className="font-medium text-blue-600">
            Recommended: {recommendedEvcPerWeek}
          </span>
          <span>{maxEvcPerWeek}+</span>
        </div>
      </div>
    );
  }
);

EvcBandwidthSelector.displayName = 'EvcBandwidthSelector';

export default EvcBandwidthSelector;
