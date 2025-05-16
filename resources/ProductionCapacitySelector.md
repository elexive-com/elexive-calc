# ProductionCapacitySelector Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: capacity, selection, optimization, delivery, intensity, EVC, tiers

## Overview

The ProductionCapacitySelector component enables users to define the weekly consulting service delivery capacity for their business transformation initiative. It presents a set of tiered capacity options (Pathfinder, Roadster, Jetpack, Rocket) that determine the speed and intensity of service delivery, serving as a key element in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Tiered Capacity Selection Interface**
   - Presents four distinct capacity tiers using the Card Design Pattern
   - Implements transportation/velocity metaphors for intuitive capacity comparison
   - Provides clear visual differentiation between capacity options
   - Includes appropriate iconography reinforcing the velocity concept

2. **Dynamic EVC Rate Configuration**
   - Sets the weekly Elastic Value Credit (EVC) production rate
   - Directly influences total transformation timeline calculations
   - Affects resource allocation and planning visualizations
   - Implements configuration-driven design via calculatorConfig.json

3. **Capacity Decision Guidance**
   - Provides business-relevant context for each capacity option
   - Includes appropriately framed recommendations based on transformation complexity
   - Creates clear connections between capacity and organizational readiness
   - Offers tailored guidance through integrated FeatureIntroduction component

4. **Interactive Selection Experience**
   - Implements responsive card-based selection with appropriate feedback
   - Provides clear visual state changes for the selected option
   - Includes subtle animations for selection transitions
   - Creates an intuitive selection experience for mutually exclusive options

## Implementation Highlights

### Metaphorical Design Approach

The component utilizes a conceptual framework for capacity selection:

- Implements consistent transportation metaphors (Pathfinder, Roadster, Jetpack, Rocket)
- Uses appropriate iconography reinforcing relative capacity differences
- Creates intuitive progression from slower/smaller to faster/larger capacity
- Incorporates subtle visual cues suggesting relative velocity

### Responsive Selection Cards

The component implements specialized selection cards:

- Uses a 3-column grid on desktop for side-by-side comparison
- Collapses to single column on mobile devices with appropriate spacing
- Maintains consistent card heights through flexible content areas
- Provides appropriate visual feedback states (hover, focus, selected)

## Integration Points

- **useCalculator Hook**: Updates the global capacity state upon selection
- **calculatorConfig.json**: Provides the capacity tier definitions
- **CalculatorApp**: Maintains the selected capacity in global state
- **SummarySidebar**: Displays the selected capacity and its impact on timeline

## Related Components

- [ResourceAllocationSelector](./ResourceAllocationSelector.md): Works alongside this component to define resource distribution
- [SummarySidebar](./SummarySidebar.md): Displays the selected capacity and timeline impact
- [ModuleSelector](./ModuleSelector.md): Affected by capacity selection through timeline calculations
- [DetailedReportModal](./DetailedReportModal.md): Includes capacity selection in reports

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).