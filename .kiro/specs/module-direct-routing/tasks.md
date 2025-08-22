# Implementation Plan

- [x] 1. Update module configuration with slug identifiers
  - Add `id` field to each module in `src/config/modulesConfig.json` with URL-safe slugs
  - Generate slugs by converting module names to lowercase and replacing spaces with hyphens
  - Ensure all slug values are unique across the module collection
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_

- [ ] 2. Create ModuleDetailPage component for direct URL routing
  - Create `src/components/ModuleDetailPage.jsx` component that handles parameterized routes
  - Extract slug from URL parameters using `useParams()` hook
  - Implement module lookup logic to find module by slug in configuration
  - Render existing `ModuleDetails` component with found module data
  - _Requirements: 1.1, 4.1, 4.3_

- [ ] 3. Create ModuleNotFound error component
  - Create `src/components/ModuleNotFound.jsx` for handling invalid module slugs
  - Display user-friendly error message with the attempted slug
  - Provide navigation button to return to main modules page
  - Style component consistent with existing design system
  - _Requirements: 1.2_

- [ ] 4. Update App.js routing configuration
  - Add new parameterized route `/modules/:slug` to React Router configuration
  - Import and configure `ModuleDetailPage` component for the new route
  - Ensure route ordering places parameterized route after exact `/modules` route
  - Test that existing routes continue to work correctly
  - _Requirements: 1.1, 4.1_

- [ ] 5. Update RouterContext for module detail route handling
  - Modify `getCurrentTab()` function in `src/contexts/RouterContext.js` to handle module detail URLs
  - Ensure module detail routes (`/modules/{slug}`) keep the "modules" tab active
  - Add helper functions for module URL generation if needed
  - Test tab state management with new routing structure
  - _Requirements: 4.2, 3.3_

- [ ] 6. Update ModuleExplorer navigation to use URL routing
  - Modify `viewModuleDetails` function in `src/components/ModuleExplorer.jsx` to navigate to module URL
  - Replace local state management with URL-based navigation using `useNavigate()`
  - Update "View Details" button click handlers to use new routing approach
  - Ensure existing ModuleExplorer functionality remains unchanged
  - _Requirements: 1.1, 3.1, 3.3_

- [ ] 7. Update other components that trigger module details
  - Update `viewModuleDetails` function in `src/components/JourneyPlanner.jsx` to use URL navigation
  - Update `viewModuleDetails` function in `src/CalculatorApp.jsx` to use URL navigation
  - Update `ModuleSelector.jsx` if it has module detail functionality
  - Ensure consistent navigation behavior across all components
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8. Implement comprehensive error handling and loading states
  - Add loading spinner component for module lookup operations
  - Implement error boundaries for module detail route failures
  - Handle edge cases like malformed URLs and configuration loading errors
  - Add proper error logging for debugging purposes
  - _Requirements: 1.2, 4.3_

- [ ] 9. Add browser navigation support and URL state management
  - Implement proper back button handling from module detail to modules list
  - Ensure page refresh maintains current module view
  - Test forward/backward browser navigation scenarios
  - Validate that direct URL access works for all module slugs
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 10. Create unit tests for new routing functionality
  - Write tests for slug generation and module lookup logic
  - Test ModuleDetailPage component rendering with valid and invalid slugs
  - Test ModuleNotFound component display and navigation
  - Test RouterContext updates for module detail route handling
  - _Requirements: 1.1, 1.2, 4.1_

- [ ] 11. Create integration tests for complete routing flow
  - Test navigation from module list to detail view via URL
  - Test direct URL access to module details
  - Test browser navigation (back/forward) behavior
  - Test error scenarios and fallback handling
  - _Requirements: 1.3, 3.1, 3.2, 4.2_

- [ ] 12. Validate and test all module URLs work correctly
  - Test each generated module slug resolves to correct module
  - Verify all "View Details" buttons navigate to proper URLs
  - Test URL sharing functionality works as expected
  - Ensure mobile responsive behavior is maintained
  - _Requirements: 1.1, 1.3, 2.3, 4.4_