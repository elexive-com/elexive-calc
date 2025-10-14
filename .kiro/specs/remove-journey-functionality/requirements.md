# Requirements Document

## Introduction

The Elexive Pricing Calculator currently includes journey planning functionality that maps modules to transformation journey stages (Assess → Plan → Execute → Optimize). This functionality adds complexity without impacting pricing calculations or core calculator functionality. This specification defines the requirements for completely removing all journey-related features from the calculator tool.

## Requirements

### Requirement 1: Remove Journey Planner Component
**User Story:** As a user, I should not see or be able to access journey planning functionality, so that the calculator focuses purely on pricing and configuration.

#### Acceptance Criteria
1. WHEN a user navigates to any route THE SYSTEM SHALL not display journey planner functionality
2. WHEN a user accesses the navigation menu THE SYSTEM SHALL not show journey planner options
3. WHEN a user visits `/journey` route THE SYSTEM SHALL redirect to the main calculator page
4. WHEN the application loads THE SYSTEM SHALL not load any journey-related components

### Requirement 2: Remove Journey Configuration Data
**User Story:** As a developer, I want all journey-related configuration removed from the data files, so that the configuration is simplified and focused on pricing logic.

#### Acceptance Criteria
1. WHEN the application loads module configuration THE SYSTEM SHALL not contain journeyStages definitions
2. WHEN modules are loaded THE SYSTEM SHALL not have primaryJourneyStage properties
3. WHEN modules are loaded THE SYSTEM SHALL not have secondaryJourneyStages properties
4. WHEN modules are loaded THE SYSTEM SHALL not have journeyStageRationale properties

### Requirement 3: Clean Navigation and Routing
**User Story:** As a user, I want simplified navigation that focuses on calculator functionality, so that I can efficiently configure and price services.

#### Acceptance Criteria
1. WHEN the application initializes routing THE SYSTEM SHALL not include `/journey` route definitions
2. WHEN navigation context loads THE SYSTEM SHALL not map journey tabs to paths
3. WHEN tab context initializes THE SYSTEM SHALL not include journey in path-to-tab mappings
4. WHEN users navigate THE SYSTEM SHALL only show calculator, modules, and introduction tabs

### Requirement 4: Remove Journey References from PDF Generation
**User Story:** As a user generating PDF reports, I want clean documents without journey stage references, so that the focus remains on service details and pricing.

#### Acceptance Criteria
1. WHEN generating module PDFs THE SYSTEM SHALL not include journey stage visualizations
2. WHEN creating PDF content THE SYSTEM SHALL not reference journey stages in module descriptions
3. WHEN exporting reports THE SYSTEM SHALL not display journey-related sections
4. WHEN PDF components render THE SYSTEM SHALL not call journey stage determination functions

### Requirement 5: Clean Module Display and Filtering
**User Story:** As a user browsing modules, I want simplified module information without journey stage references, so that I can focus on service capabilities and pricing.

#### Acceptance Criteria
1. WHEN displaying module cards THE SYSTEM SHALL not show journey stage indicators
2. WHEN filtering modules THE SYSTEM SHALL not provide journey stage filter options
3. WHEN showing module details THE SYSTEM SHALL not display journey stage information
4. WHEN modules are processed THE SYSTEM SHALL not calculate journey stage relationships

### Requirement 6: Maintain Core Calculator Functionality
**User Story:** As a user, I want all existing calculator functionality to work seamlessly after journey removal, so that I can continue to configure and price services effectively.

#### Acceptance Criteria
1. WHEN using the calculator THE SYSTEM SHALL maintain all pricing calculations
2. WHEN selecting modules THE SYSTEM SHALL preserve module selection and configuration
3. WHEN generating reports THE SYSTEM SHALL continue to produce accurate pricing documents
4. WHEN navigating between tabs THE SYSTEM SHALL maintain state and functionality
5. WHEN accessing module details THE SYSTEM SHALL show complete service information
