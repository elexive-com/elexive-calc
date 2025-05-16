# ModuleSelector Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: modules, selection, configuration, pillars, consulting, transformation

## Overview

The ModuleSelector component enables users to select and configure consulting service modules for their business transformation initiatives. It provides an intuitive interface for browsing, comparing, and selecting from various service options organized into strategic pillars (Transformation, Strategy, and Technology).

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Strategic Pillar Organization**
   - Organizes modules into three strategic pillars (Transformation, Strategy, Technology)
   - Implements tabbed navigation with visual differentiation between pillars
   - Uses consistent color coding that aligns with the overall pillar system
   - Maintains pillar context throughout the selection process

2. **Engagement Model Selection**
   - Presents two distinct engagement options for each module (Insight Primer, Integrated Execution)
   - Visualizes differences in scope, timeline, and deliverables between options
   - Enables direct comparison of value and investment required
   - Implements clear visual feedback for selected options

3. **Module Card Presentation**
   - Displays modules as interactive cards with consistent information architecture
   - Visualizes module relationships and dependencies through placement and indicators
   - Provides appropriate detail while maintaining scannability
   - Implements the Card Design Pattern with module-specific adaptations

4. **Selection State Management**
   - Tracks and visualizes module selection state across the application
   - Implements appropriate visual feedback for selected/unselected states
   - Maintains selection state when switching between pillars
   - Synchronizes selection state with other components

## Implementation Highlights

### Selection Visualization

The component implements specialized techniques for visualizing selection state:

- Uses distinct visual treatments for selected vs. unselected modules
- Implements hover and focus states for interactive elements
- Provides immediate visual feedback when selection changes
- Maintains consistent selection indicators across all pillars

### Responsive Layout Management

The component handles various screen sizes through:

- Grid-based layout that adapts to available screen width
- Column adjustment based on viewport breakpoints
- Touch-friendly targets for mobile interfaces
- Specialized mobile navigation for pillar switching

### Component-Specific State

- `activePillar`: Tracks the currently displayed pillar tab
- `selectedModules`: Array of currently selected module IDs
- `selectedVariants`: Maps module IDs to their selected variant options

## Integration Points

- **useCalculator Hook**: Provides and receives module selection state
- **ModuleDetails**: Launches detailed view when View Details is clicked
- **SummarySidebar**: Provides selected module data for summary display
- **PricingSummary**: Sends module selections for pricing calculations

## Related Components

- [ModuleExplorer](./ModuleExplorer.md): Alternative module discovery interface
- [SummarySidebar](./SummarySidebar.md): Displays modules selected in the selector
- [JourneyPlanner](./JourneyPlanner.md): Alternative selection mechanism organized by transformation journey
- [ModuleDetails](./ModuleDetails.md): Detailed module information view launched from this component

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).