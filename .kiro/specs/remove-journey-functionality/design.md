# Design Document

## Architecture Overview

The journey functionality removal involves cleaning up multiple layers of the application:
- Component layer (JourneyPlanner component and references)
- Configuration layer (journey stages and module journey properties)
- Navigation layer (routing and tab management)
- PDF generation layer (journey visualizations)

## Current Journey Architecture

### Components Affected
- `JourneyPlanner.jsx` - Main journey planning component (to be removed)
- `Header.jsx` - Contains journey navigation (to be cleaned)
- `ModuleDetails.jsx` - May contain journey references (to be cleaned)
- `ModuleExplorer.jsx` - May have journey filtering (to be cleaned)
- PDF components - Journey visualizations (to be cleaned)

### Configuration Structure
```json
// Current structure in modulesConfig.json
{
  "journeyStages": [...], // To be removed
  "modules": [
    {
      "primaryJourneyStage": "journey-stage-1", // To be removed
      "secondaryJourneyStages": [...], // To be removed
      "journeyStageRationale": "...", // To be removed
      // Other properties remain
    }
  ]
}
```

### Navigation Structure
```javascript
// Current routing structure
const tabToPath = {
  introduction: '/',
  calculator: '/calculator',
  modules: '/modules',
  journey: '/journey', // To be removed
};
```

## Target Architecture

### Simplified Navigation
```javascript
// Simplified routing structure
const tabToPath = {
  introduction: '/',
  calculator: '/calculator',
  modules: '/modules',
};

const pathToTab = {
  '/': 'introduction',
  '/calculator': 'calculator',
  '/modules': 'modules',
};
```

### Clean Module Configuration
```json
// Simplified module structure
{
  "modules": [
    {
      "id": "leading-change",
      "name": "Leading Change",
      "pillar": "Transformation",
      "category": "Immediate Impact",
      "description": "...",
      "variants": [...],
      // No journey-related properties
    }
  ]
}
```

### Component Cleanup Strategy

#### 1. Component Removal
- Delete `JourneyPlanner.jsx` entirely
- Remove journey imports from other components
- Clean journey-related state and functions

#### 2. Navigation Cleanup
- Remove `/journey` route from App.js
- Clean TabContext journey mappings
- Clean RouterContext journey references
- Remove journey navigation from Header.jsx

#### 3. Configuration Cleanup
- Remove `journeyStages` array from modulesConfig.json
- Remove journey properties from all modules:
  - `primaryJourneyStage`
  - `secondaryJourneyStages` 
  - `journeyStageRationale`

#### 4. PDF Generation Cleanup
- Remove journey stage determination functions
- Remove journey visualizations from PDF components
- Clean journey-related styles and layouts

## Data Flow Changes

### Before (with Journey)
```
User Navigation → TabContext (includes journey) → JourneyPlanner Component
Module Data → Journey Stage Mapping → Filtered Display
PDF Generation → Journey Stage Visualization → Document
```

### After (without Journey)
```
User Navigation → TabContext (calculator, modules, introduction only)
Module Data → Direct Display (pillar-based organization)
PDF Generation → Clean Module Information → Document
```

## Risk Mitigation

### Potential Breaking Changes
1. **Module Detail Navigation**: Ensure module detail pages still work without journey context
2. **State Management**: Verify calculator state remains intact after journey removal
3. **PDF Generation**: Ensure PDFs generate correctly without journey sections
4. **URL Routing**: Handle `/journey` redirects gracefully

### Backward Compatibility
- Redirect `/journey` URLs to main calculator page
- Maintain all existing module functionality
- Preserve pricing calculations and configurations
- Keep module organization by pillars

## Testing Strategy

### Unit Tests
- Test navigation without journey routes
- Test module loading without journey properties
- Test PDF generation without journey sections

### Integration Tests
- Test complete user flows without journey functionality
- Test module selection and pricing calculations
- Test PDF export functionality

### Manual Testing
- Verify all navigation works correctly
- Test module browsing and selection
- Verify calculator functionality remains intact
- Test PDF generation and export

## Performance Impact

### Positive Impacts
- Reduced bundle size (JourneyPlanner component removal)
- Simplified state management
- Faster module loading (no journey calculations)
- Cleaner configuration parsing

### No Negative Impacts Expected
- Core calculator functionality unchanged
- Module data structure simplified but compatible
- Navigation becomes more straightforward
