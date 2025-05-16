# ProductionCapacitySelector Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: capacity, selection, optimization, delivery, intensity, EVC, tiers

## Overview

The ProductionCapacitySelector component enables users to define the weekly consulting service delivery capacity for their business transformation initiative. It presents a set of tiered capacity options (Pathfinder, Roadster, Jetpack, Rocket) that determine the speed and intensity of service delivery, serving as a key element in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component adheres to the [Elexive Solution Builder Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The ProductionCapacitySelector addresses several key customer needs identified in our research:

1. **Resource Planning Clarity**: By providing transparent options for service delivery intensity
2. **Timeline Control**: By empowering executives to match transformation pace to business readiness
3. **Budget Alignment**: By directly connecting capacity investment to transformation outcomes
4. **Commitment Flexibility**: By offering multiple service intensity options with clear differentiation

## Core Functionality

1. **Capacity Tier Selection**
   - Presents multiple predefined capacity tiers (Pathfinder, Roadster, Jetpack, Rocket)
   - Each tier represents a different level of weekly EVC (Elastic Value Credit) production
   - Visually differentiates tiers using icons and styling that communicate scale
   - Provides clear business context for each capacity option
   
2. **Configuration-Driven Design**
   - Uses `calculatorConfig.json` to define capacity tiers and their properties
   - Dynamically generates options based on configuration data
   - Supports extensibility for adding or modifying capacity tiers
   - Maintains consistent presentation regardless of configuration changes

3. **Cost Impact Calculation**
   - Directly updates the EVC production rate in the calculator
   - Influences overall transformation timeline and delivery intensity
   - Affects cost calculations throughout the calculator experience
   - Updates pricing visualizations in real-time as selections change

4. **Business Context Presentation**
   - Provides clear descriptions of what each capacity tier means
   - Includes business-relevant factors for selecting each option
   - Uses consistent terminology aligned with the EVC explanation
   - Sets appropriate expectations for implementation timelines

## Component-Specific Design Decisions

### Capacity Option Design

This component implements the [Card Design Pattern](./DesignGuidelines.md#1-card-design-pattern) and follows the [Visual Selection Feedback Standards](./DesignGuidelines.md#visual-selection-feedback-standards) with the following specific adaptations:

1. **Capacity-Specific Card Structure** - Specialized for capacity selection:
   - Implements clear visual hierarchy from name to EVC value to description
   - Provides sufficient information for capacity decision-making without overwhelming
   - Creates appropriate visual distinction between different capacity tiers
   - Adapts card design to emphasize capacity differences

2. **Metaphorical Scale** - Unique conceptual framework:
   - Uses transportation/velocity metaphors that business executives understand
   - Creates intuitive progression from slower/smaller to faster/larger
   - Implements appropriate iconography that reinforces the metaphors
   - Provides immediate intuitive understanding of relative capacity

3. **Visual Selection Feedback** - Capacity-specific indicators:
   - Uses subtle hover effects to indicate interactivity
   - Provides appropriate color coding for different capacity levels
   - Creates clear visual contrast between selected and unselected states
   - Implements feedback appropriate for mutually exclusive options

### Responsive Design Approach

This component follows the [Responsive Design Guidelines](./DesignGuidelines.md#responsive-design-guidelines) with these specific adaptations:

1. **Layout Adaptation**
   - Uses a 3-column grid on desktop for side-by-side comparison
   - Collapses to single column on mobile devices
   - Maintains consistent spacing and proportions across viewports

2. **Visual Hierarchy**
   - Emphasizes tier labels and EVC values using size and color
   - Uses consistent iconography to represent capacity metaphorically
   - Provides supporting text that's visually de-emphasized but accessible

## Technical Implementation

### Props

- `productionCapacity`: String representing the currently selected capacity tier
- `setProductionCapacity`: Function to update the selected capacity tier
- `calculator`: Object containing the current calculator state
- `updateCalculator`: Function to update the calculator with new capacity value

### Component Structure

1. **Header Section**
   - Component title with appropriate typography
   - Introductory text explaining the capacity selection concept
   - FeatureIntroduction component with detailed guidance
   - Visual separation from capacity option cards

2. **Capacity Option Grid**
   - Responsive grid layout of capacity tier cards
   - Consistent card components with standardized layout
   - Selection state styling for the active option
   - Appropriate iconography for each capacity level

3. **Option Card Components**
   - Clear capacity tier label (Pathfinder, Roadster, etc.)
   - Prominent weekly EVC value display
   - Supporting description text explaining benefits
   - Visual selection indicators for the active option

### Integration Points

- **Calculator Context**: Updates calculator state with selected capacity
- **EVC Calculation**: Influences weekly production rate for timeline calculation
- **Pricing Summary**: Affects cost and timeline projections based on selection

## Related Components

- [EvcExplainer](./EvcExplainer.md): Provides context for understanding the EVC concept
- [PricingSummary](./PricingSummary.md): Displays cost impact of production capacity selection
- [SummarySidebar](./SummarySidebar.md): Shows selected capacity in the configuration summary
- [FeatureIntroduction](./FeatureIntroduction.md): Used to provide contextual education about capacity
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