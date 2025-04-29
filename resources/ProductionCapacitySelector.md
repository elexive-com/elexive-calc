# ProductionCapacitySelector Component

## Overview

The ProductionCapacitySelector component enables users to define the weekly consulting service delivery capacity for their business transformation initiative. It presents a set of tiered capacity options (Pathfinder, Roadster, Jetpack, Rocket) that determine the speed and intensity of service delivery, serving as a key element in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component adheres to the [Elexive Calculator Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The ProductionCapacitySelector addresses several key customer needs identified in our research:

1. **Resource Planning Clarity**: By providing transparent options for service delivery intensity
2. **Timeline Control**: By empowering executives to match transformation pace to business readiness
3. **Budget Alignment**: By directly connecting capacity investment to transformation outcomes
4. **Commitment Flexibility**: By offering multiple service intensity options with clear differentiation

## Component-Specific Design Decisions

### Capacity Option Design

The capacity option cards represent a key UX decision point, balancing several competing needs:

1. **Card Structure** - The capacity presentation layout:
   - Uses consistent card dimensions for visual harmony
   - Implements clear visual hierarchy from name to EVC value to description
   - Provides sufficient information for decision-making without overwhelming
   - Creates appropriate visual distinction between different capacity tiers

2. **Metaphorical Scale** - The conceptual framework:
   - Uses transportation/velocity metaphors that business executives understand
   - Creates intuitive progression from slower/smaller to faster/larger
   - Implements appropriate iconography that reinforces the metaphors
   - Provides immediate intuitive understanding of relative capacity

3. **Visual Selection Feedback** - The interactive indicators:
   - Implements distinct styling for the selected capacity option
   - Uses subtle hover effects to indicate interactivity
   - Provides appropriate color coding for different capacity levels
   - Creates clear visual contrast between selected and unselected states

## Core Functionality

1. **Capacity Tier Selection**
   - Presents multiple predefined capacity tiers (Pathfinder, Roadster, Jetpack, Rocket)
   - Each tier represents a different level of weekly EVC (Elastic Value Credit) production
   - Visually differentiates tiers using icons and styling that communicate scale
   - Provides clear business context for each capacity option
   
2. **Configuration-Driven Design**
   - Uses `calculatorConfig.json` to define capacity tiers and their properties
   - Dynamically generates UI based on the configuration data
   - Allows for easy modification of capacity options without code changes
   - Maintains consistent presentation regardless of configuration changes

3. **Selection Mechanism**
   - Implements a simple selection model where only one capacity tier can be active
   - Uses distinct visual feedback to indicate the currently selected option
   - Provides immediate UI feedback when selection changes
   - Creates intuitive interaction patterns for changing selection

4. **Business Impact Visualization**
   - Clearly communicates the effect of capacity on transformation timeline
   - Presents capacity in terms of business outcomes rather than technical metrics
   - Uses executive-friendly language to describe benefits of each tier
   - Creates appropriate expectations around service delivery intensity

## Technical Implementation

### Core Functionality

1. **Capacity Tier Selection**
   - Presents multiple predefined capacity tiers (Pathfinder, Roadster, Jetpack, Rocket)
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
   - Uses visual metaphors (pathfinder, roadster, jetpack, rocket) for intuitive understanding

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