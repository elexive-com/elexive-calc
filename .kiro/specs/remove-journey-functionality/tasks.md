# Implementation Plan

- [ ] 1. Remove JourneyPlanner component and related files
    - Delete `src/components/JourneyPlanner.jsx` file completely
    - Remove any journey-related test files if they exist
    - Remove journey-related imports from other components
    - _Requirements: 1.1, 1.4_

- [ ] 2. Clean navigation routing and remove /journey route
    - Remove `/journey` route from `src/App.js` Routes configuration
    - Update route handling to redirect `/journey` to main calculator page
    - Remove journey route from catch-all routing logic
    - _Requirements: 1.3, 3.1_

- [ ] 3. Update TabContext to remove journey tab mappings
    - Remove `'/journey': 'journey'` from pathToTab mapping in `src/contexts/TabContext.js`
    - Remove journey from getInitialTab function logic
    - Remove journey from handlePopState event handler
    - Update tab initialization to exclude journey
    - _Requirements: 3.2, 3.4_

- [ ] 4. Update RouterContext to remove journey navigation
    - Remove `journey: '/journey'` from tabToPath mapping in `src/contexts/RouterContext.js`
    - Remove `'/journey': 'journey'` from pathToTab mapping
    - Remove journey from getCurrentTab function logic
    - Clean up any journey-related navigation helper functions
    - _Requirements: 3.2, 3.4_

- [ ] 5. Clean Header component navigation
    - Remove journey navigation button from desktop navigation in `src/components/Header.jsx`
    - Remove journey navigation button from mobile navigation
    - Remove journey-related click handlers and state
    - Remove journey tab active state checking
    - _Requirements: 1.2, 3.4_

- [ ] 6. Remove journeyStages configuration from modulesConfig.json
    - Delete entire `journeyStages` array from `src/config/modulesConfig.json`
    - Remove journeyStages import/usage from any components that reference it
    - Update any components that iterate over journeyStages
    - _Requirements: 2.1_

- [ ] 7. Clean journey properties from all modules in configuration
    - Remove `primaryJourneyStage` property from all modules in `src/config/modulesConfig.json`
    - Remove `secondaryJourneyStages` array property from all modules
    - Remove `journeyStageRationale` property from all modules
    - Verify module structure remains valid after cleanup
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 8. Clean PDF generation components of journey references
    - Remove journey stage determination function from `src/pdf/components/ModuleContentPage.js`
    - Remove journey visualization sections from PDF templates
    - Remove journey-related styles and layouts from PDF components
    - Remove journeyStages mapping and processing in PDF generation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9. Clean ModuleExplorer component of journey filtering
    - Remove journey stage filtering options from `src/components/ModuleExplorer.jsx`
    - Remove journey-related state management
    - Remove journey stage display in module cards
    - Update module organization to focus on pillars only
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 10. Clean ModuleDetails component of journey references
    - Remove journey stage information from `src/components/ModuleDetails.jsx`
    - Remove journey-related props and state
    - Remove journey stage display sections
    - Clean up journey-related navigation context usage
    - _Requirements: 5.3, 5.4_

- [ ] 11. Update any remaining components with journey references
    - Search for and remove journey references in `src/components/ModuleSelector.jsx`
    - Clean journey references in `src/components/CalculatorIntroduction.jsx`
    - Remove journey references from `src/components/ProductionCapacitySelector.jsx`
    - Clean any other components found with journey references
    - _Requirements: 5.4, 6.2_

- [ ] 12. Clean PDF report generation of journey sections
    - Remove journey sections from `src/pdf/components/ReportContentPage.js`
    - Update report templates to exclude journey visualizations
    - Remove journey-related data processing in report generation
    - Ensure reports focus on pricing and module information only
    - _Requirements: 4.2, 4.3_

- [ ] 13. Update CalculatorApp main component
    - Remove journey tab rendering logic from `src/CalculatorApp.jsx`
    - Remove JourneyPlanner component import and usage
    - Update tab switching logic to exclude journey
    - Ensure calculator state management remains intact
    - _Requirements: 1.1, 6.1, 6.2_

- [ ] 14. Test and verify core calculator functionality
    - Test module selection and configuration functionality
    - Verify pricing calculations work correctly
    - Test PDF generation without journey sections
    - Verify navigation between calculator, modules, and introduction tabs
    - Test module detail page navigation and functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 15. Clean up any remaining journey references and test files
    - Search codebase for any remaining "journey" or "Journey" references
    - Remove or update any test files that reference journey functionality
    - Update any documentation that mentions journey features
    - Verify no broken imports or undefined references remain
    - _Requirements: 1.4, 6.5_
