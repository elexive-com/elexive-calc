# ResourceAllocationSelector Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: resource allocation, efficiency, context-switching, strategy, overhead, optimization

## Overview

The ResourceAllocationSelector component enables users to determine how their EVC (Elastic Value Credit) resources are allocated across different business transformation initiatives. It offers three distinct allocation strategies (Focused, Balanced, Distributed), each with its own efficiency implications based on context-switching overhead, serving as a key element in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

> **Important:** The overhead represents additional work required due to context switching. While 100% is always the full EVC amount for the selected modules, when work is done in parallel (using Balanced or Distributed strategies), the configured overhead percentage is added on top of the module EVC totals to account for the extra effort needed to complete the work.

## Component-Specific Features

1. **Strategic Resource Allocation Interface**
   - Presents three distinct allocation approaches (Focused, Balanced, Distributed)
   - Uses the Card Design Pattern with strategy-specific visualizations
   - Implements appropriate visual differentiation for efficiency levels
   - Includes conditional recommendations based on selected capacity tier

2. **Context-Switching Overhead Visualization**
   - Illustrates productivity impact of different allocation strategies
   - Uses proportional bar charts showing base work versus overhead
   - Implements consistent color coding for efficiency levels
   - Provides both visual and numeric representations of overhead costs

3. **Capacity-Strategy Relationship Management**
   - Implements business rules relating capacity tiers to feasible allocation strategies
   - Provides contextual explanations when certain strategies aren't recommended
   - Shows appropriate visual indicators for capacity-strategy compatibility
   - Creates clear connections between capacity and allocation decisions

4. **Education-Forward Decision Support**
   - Integrates research-backed explanations of context-switching impacts
   - Provides concrete business examples of when each strategy is appropriate
   - Uses progressive disclosure for complex productivity concepts
   - Creates appropriate framing for technical resource allocation decisions

## Implementation Highlights

### Efficiency Visualization System

The component utilizes a specialized data visualization approach:

- Implements proportional bar charts showing base work versus context-switching overhead
- Uses consistent color coding (green for Focused, yellow for Balanced, orange for Distributed)
- Provides supporting numeric values showing exact efficiency percentages
- Creates immediate visual comprehension of productivity differences

### Expandable Educational Content

The component implements sophisticated progressive disclosure:

- Provides a concise initial explanation with expandable details
- Implements the Expandable Section Pattern for additional information
- Includes research-backed data on context-switching productivity impacts
- Creates appropriate business context for technical productivity concepts

## Integration Points

- **useCalculator Hook**: Updates the global allocation strategy upon selection
- **calculatorConfig.json**: Provides the strategy definitions and overhead percentages
- **ProductionCapacitySelector**: Influences available and recommended strategies
- **SummarySidebar**: Displays the selected strategy and its impact on timeline

## Related Components

- [ProductionCapacitySelector](./ProductionCapacitySelector.md): Selection influences available allocation strategies
- [SummarySidebar](./SummarySidebar.md): Displays the selected allocation strategy and efficiency
- [ModuleSelector](./ModuleSelector.md): Module selection affects allocation strategy recommendations
- [DetailedReportModal](./DetailedReportModal.md): Includes allocation strategy in reports

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).