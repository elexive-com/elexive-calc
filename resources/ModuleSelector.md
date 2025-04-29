# ModuleSelector Component

## Overview

The ModuleSelector component is a sophisticated UI element that enables users to select and configure consulting service modules for their business transformation initiatives. It provides an intuitive interface for users to browse, compare, and select from various service options organized into strategic pillars (Transformation, Strategy, and Technology), serving as a critical bridge between the exploration and optimization phases of the customer journey.

> **Note:** This component adheres to the [Elexive Calculator Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The ModuleSelector addresses several key customer needs identified in our research:

1. **Complexity Management**: By organizing consulting modules into meaningful strategic pillars
2. **Decision Support**: By providing clear comparison between engagement models for each module
3. **Value Transparency**: By clearly displaying EVC values for each consulting option
4. **Configuration Control**: By enabling customized selection of a transformation solution

## Component-Specific Design Decisions

### Module Card Design

The module cards represent a key UX decision point, balancing several competing needs:

1. **Card Structure** - The module presentation layout:
   - Uses consistent card dimensions for visual harmony
   - Implements clear visual hierarchy from name to description to options
   - Provides sufficient information for decision-making without overwhelming
   - Creates appropriate visual distinction between different modules

2. **Engagement Model Options** - The dual selection interface:
   - Clearly distinguishes between Insight Primer and Integrated Execution options
   - Visually emphasizes the differences in scope, timeline, and EVC values
   - Implements intuitive toggle behavior for selection
   - Provides appropriate visual feedback for current selection state

3. **Pillar Association** - The strategic context indicators:
   - Uses color coding consistent with ModuleExplorer for pillar association
   - Incorporates pillar-specific iconography for visual reinforcement
   - Maintains consistent styling conventions from exploration to selection
   - Creates clear visual grouping of modules within each pillar

### Responsive Approach

The component implements carefully considered responsive behaviors:

1. **Desktop Experience** - Optimized for precision and comparison:
   - Presents modules in a tabbed interface with pillars as tab headers
   - Displays modules in a two-column grid layout for efficient scanning
   - Uses an optimized UI with more detailed information visibility
   - Implements hover states and other desktop-specific interactions

2. **Mobile Experience** - Adapted for touch and limited space:
   - Converts tabs to a dropdown selector for conserving vertical space
   - Implements a single-column layout for module cards
   - Adjusts spacing, font sizes, and interactive elements for touch interactions
   - Prioritizes the most important information in the constrained view

## Core Functionality

1. **Module Organization by Strategic Pillars**
   - Modules are grouped into three strategic pillars: Transformation, Strategy, and Technology
   - Each pillar represents a distinct approach to business transformation
   - The component dynamically generates the UI based on the data structure of available modules
   - Provides intuitive navigation between pillars for efficient exploration

2. **Dual Engagement Model Selection**
   - For each module, users can select from two distinct engagement models:
     - **Insight Primer**: Fixed-price, fixed-scope engagement (2-4 weeks) for initial direction
     - **Integrated Execution**: Continuous service model using agile methodologies for full implementation
   - Each engagement option is associated with an EVC (Elastic Value Credit) value representing its business value and cost
   - Provides clear comparison between options for informed decision-making

3. **Selection State Management**
   - Tracks which modules are selected and which engagement model is chosen for each
   - Maintains selection state via the `selectedModules` and `selectedVariants` props
   - Implements toggling behavior that allows adding/removing modules from selection
   - Provides clear visual feedback on current selection state

4. **Module Categorization**
   - Visually distinguishes modules by "Immediate Impact" vs. other categories
   - Applies appropriate styling based on the category to help users prioritize
   - Maintains consistent categorization from the ModuleExplorer
   - Supports informed decision-making about transformation priorities

## Technical Implementation

### Props

- `modules`: Array of module objects containing detailed information about each available service module
- `selectedModules`: Array of currently selected module names
- `toggleModule`: Function to toggle a module's selection state
- `activePillar`: String indicating which pillar's modules are currently displayed
- `setActivePillar`: Function to change the active pillar
- `selectedVariants`: Object mapping module names to their selected engagement models
- `setSelectedVariants`: Function to update the selected variants

### State Management

- `dropdownOpen`: Boolean state for controlling the mobile dropdown visibility

### Key Methods

1. **`handleVariantSelect(moduleName, variantType)`**
   - Main method for selecting a module variant
   - Logic:
     - If selecting the same variant that's already selected, deselects the module
     - Otherwise, updates the selected variant and ensures the module is selected
   - Updates both `selectedVariants` and potentially `selectedModules`

2. **`handleModuleDeselect(moduleName)`**
   - Helper method to properly deselect a module
   - Removes the module from both `selectedVariants` and `selectedModules`

3. **`handleMobilePillarSelect(pillar)`**
   - Handles pillar selection in mobile view
   - Updates active pillar and closes the dropdown

### Integration Points

1. **External Component Integration**
   - Utilizes `FeatureIntroduction` component to provide contextual guidance
   - Uses `getModuleIcon` utility to fetch appropriate icons for modules

2. **CSS Variables and Theming**
   - Uses CSS variables (e.g., `--elexive-primary`, `--elexive-accent`) for consistent theming
   - Implements conditional styling based on selection state and module properties

## User Experience Considerations

The effectiveness of the ModuleSelector should be measured by:

1. **Selection Patterns**
   - Distribution of selections across pillars (balance vs. concentration)
   - Frequency of engagement model choices (Insight vs. Execution)
   - Module selection/deselection patterns indicating decision uncertainty

2. **Interaction Metrics**
   - Time spent configuring module selections
   - Pillar switching frequency as indicator of comparative evaluation
   - Hesitation patterns indicating decision difficulty

3. **Progression Metrics**
   - Conversion rate from module selection to resource allocation
   - Completion rate of module configuration stage
   - Module selection diversity as indicator of solution sophistication

By optimizing against these metrics, the ModuleSelector can become increasingly effective at guiding users toward appropriate module configurations that align with their business transformation needs.

## Edge Cases and Error Handling

- Ensure robust handling of cases where no modules are selected
- Provide clear error messages or indicators for any issues in module selection

## Performance Considerations

- Optimize rendering performance for the module cards, especially in the context of a large number of modules
- Ensure that the component remains responsive and performant on both desktop and mobile devices

## Future Enhancement Opportunities

Potential improvements to consider:

1. **Search/Filter Functionality**
   - Add ability to search or filter modules based on keywords or attributes

2. **Comparison View**
   - Implement side-by-side comparison of module options

3. **Favorites or Recommended Packages**
   - Allow saving favorite configurations or provide recommended packages

4. **Enhanced Accessibility**
   - Further improve keyboard navigation and screen reader support

5. **Analytics Integration**
   - Track module selection patterns to optimize offerings