# SummarySidebar Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: sidebar, calculator, configuration, summary, pricing, EVC, customer journey

## Overview

The SummarySidebar component provides a persistent, consolidated view of the user's current calculator configuration. It displays key selections, calculations, and summary information in a compact, easily scannable format that remains visible throughout the configuration process, serving as a continuous feedback mechanism.

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Real-Time Configuration Summary**
   - Provides immediate visual reflection of all user selections
   - Updates dynamically as configuration choices change
   - Organizes information in a logical hierarchy based on importance
   - Maintains consistent visual structure regardless of configuration state

2. **Financial Impact Visualization**
   - Displays calculated pricing based on current selections
   - Shows EVC allocation across different pillars and modules
   - Updates calculations in real-time as configuration changes
   - Provides appropriate formats for financial data presentation

3. **Expandable Information Architecture**
   - Implements the Expandable Section Pattern for progressive disclosure
   - Allows users to focus on specific aspects of their configuration
   - Maintains appropriate information density through collapsible sections
   - Provides intuitive controls for information exploration

4. **Modal Launch Integration**
   - Serves as the entry point for the DetailedReportModal
   - Provides access to the EvcExplainer for educational content
   - Includes appropriate visual cues for these modal triggers
   - Maintains context when returning from modal interactions

## Implementation Highlights

### Information Organization Strategy

The sidebar implements a deliberate information architecture:

- Organizes information into logical sections based on decision importance
- Places critical metrics (price, timeline) with prominent visual treatment
- Groups related selections together in collapsible sections
- Implements consistent visual hierarchy across all information types

### Component-Specific State

- `expandedSections`: Tracks which information sections are expanded
- `reportModalOpen`: Controls the visibility of the detailed report modal
- `evcModalOpen`: Controls the visibility of the EVC explainer modal

## Integration Points

- **useCalculator Hook**: Receives all configuration data for display
- **DetailedReportModal**: Launched from this component for comprehensive reporting
- **EvcExplainer**: Launched from this component for educational content
- **All Selector Components**: Displays selections made in these components

## Related Components

- [DetailedReportModal](./DetailedReportModal.md): Launched from the SummarySidebar to provide comprehensive reporting
- [EvcExplainer](./EvcExplainer.md): Accessed via the SummarySidebar to provide educational content about EVCs
- [ModuleSelector](./ModuleSelector.md): Provides content that is summarized in the SummarySidebar
- [ProductionCapacitySelector](./ProductionCapacitySelector.md): Selection is reflected in the SummarySidebar
- [ResourceAllocationSelector](./ResourceAllocationSelector.md): Selection is reflected in the SummarySidebar

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).