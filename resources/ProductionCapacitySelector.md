# ProductionCapacitySelector Component

## Overview

The ProductionCapacitySelector component enables users to define the weekly service delivery capacity for their EV charging infrastructure project. It presents a set of tiered capacity options that determine the speed and volume of service delivery.

## Purpose

This component serves a critical role in the calculator by allowing users to set expectations around project velocity and resource allocation. It translates abstract service needs into concrete delivery timelines, helping users understand the relationship between capacity investment and project outcomes.

## Technical Implementation

### Core Functionality

1. **Capacity Tier Selection**
   - Presents multiple predefined capacity tiers (Seedling, Jetpack, Rocket)
   - Each tier represents a different level of weekly EVC (Elexive Value Credit) production
   - Visually differentiates tiers using icons and styling that communicate scale
   
2. **Configuration-Driven Design**
   - Uses `calculatorConfig.json` to define capacity tiers and their properties
   - Dynamically generates UI based on the configuration data
   - Allows for easy modification of capacity options without code changes

3. **Selection Mechanism**
   - Implements a simple selection model where only one capacity tier can be active
   - Uses distinct visual feedback to indicate the currently selected option
   - Provides immediate UI feedback when selection changes

### Responsive Design Implementation

1. **Layout Adaptation**
   - Uses a 3-column grid on desktop for side-by-side comparison
   - Collapses to single column on mobile devices
   - Maintains consistent spacing and proportions across viewports

2. **Visual Hierarchy**
   - Emphasizes tier labels and EVC values using size and color
   - Uses consistent iconography to represent capacity metaphorically
   - Provides supporting text that's visually de-emphasized but accessible

### Integration with Calculator Logic

The component directly influences the calculator's core calculations by:
   - Setting the weekly production rate of EVCs
   - Affecting the timeline for service delivery
   - Impacting resource allocation calculations

## Implementation Details

### Props

- `productionCapacity`: String representing the currently selected capacity tier
- `setProductionCapacity`: Function to update the selected capacity tier

### External Dependencies

1. **Configuration Data**
   - Imports capacity tier definitions from `calculatorConfig.json`
   - Each tier contains:
     - `label`: Human-readable name for the tier
     - `weeklyEVCs`: Numeric value representing EVCs produced per week
     - `valueProposition`: Description of the tier's benefits
     - `colorClass`: CSS class for styling the EVC display

2. **UI Components**
   - Uses `FeatureIntroduction` component to provide contextual guidance
   - Leverages FontAwesome icons to represent capacity tiers visually

### Rendering Logic

1. **Dynamic Option Generation**
   - Maps through configuration data to generate capacity tier options
   - Applies conditional styling based on selection state
   - Assigns appropriate icons based on tier key

2. **Visual Feedback**
   - Selected tier receives highlighted styling with accent border
   - Unselected tiers have subtle hover effects to indicate interactivity
   - Uses consistent color coding from the application's design system

## User Experience Considerations

1. **Simplified Decision Making**
   - Presents clear, differentiated options to simplify user choice
   - Provides adequate information for informed decisions without overwhelming
   - Uses visual metaphors (seedling, jetpack, rocket) for intuitive understanding

2. **Contextual Guidance**
   - Incorporates the FeatureIntroduction component to explain the concept
   - Clarifies the impact of the selection on project outcomes
   - Mentions the ability to adjust capacity later to reduce commitment anxiety

3. **Clear Visual Hierarchy**
   - Emphasizes the weekly EVC value as the primary decision factor
   - Supports the value with descriptive text explaining benefits
   - Uses consistent visual language with the rest of the application

## Performance Considerations

1. **Efficient Rendering**
   - Minimizes state changes by only updating on explicit selection
   - Uses configuration data to avoid hardcoded options
   - Implements clean component boundaries for efficient re-renders

2. **Predictable Behavior**
   - Maintains a single source of truth for selection state
   - Provides immediate visual feedback for user actions
   - Ensures consistent behavior across different device types

## Future Enhancement Opportunities

1. **Custom Capacity Input**
   - Allow users to specify custom EVC/week values for more flexibility
   - Implement validation and guidance for custom inputs

2. **Capacity Planning Tool**
   - Add a mini-calculator to help users determine appropriate capacity
   - Incorporate project timeline estimations based on selected capacity

3. **Seasonal Adjustments**
   - Enable planning for variable capacity over time
   - Add visualization of capacity changes and their impact

4. **Historical Data Integration**
   - Provide recommendations based on similar projects
   - Show distribution of capacity selections from other users

5. **Enhanced Visualization**
   - Add graphical representation of delivery timelines
   - Visualize the relationship between capacity and project completion