# Journey Planner Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: journey, transformation, stages, sequential, navigation, discovery

## Overview

The Journey Planner component provides an immersive, visual representation of the client transformation journey, allowing executives to understand the sequential nature of business transformation and discover modules that support each phase. This component organizes services into a clear, chronological narrative that guides customers through their transformation path.

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Transformation Stage Navigation System**
   - Presents transformation as a sequential, four-stage journey with clear visual progression
   - Uses distinctive color-coding and iconography for each journey stage
   - Provides intuitive navigation between different transformation phases
   - Implements dramatic visual state changes to highlight the active stage

2. **Stage-Contextual Module Discovery**
   - Dynamically filters modules based on relevance to each journey stage
   - Presents only contextually appropriate modules for the selected stage
   - Maintains consistent module card presentation with selective content
   - Creates a focused discovery experience within each transformation phase

3. **Journey Context Education Framework**
   - Provides stage-specific descriptions and educational content
   - Explains transformation progression, milestones, and business outcomes
   - Sets appropriate expectations for implementation timelines at each stage
   - Creates business context that helps justify module selection decisions

4. **Journey-Based Module Selection**
   - Enables adding journey-appropriate modules to the solution
   - Validates selections against journey stage dependencies
   - Provides clear feedback when selections span multiple journey stages
   - Creates a coherent transformation narrative through module selection

## Implementation Highlights

### Journey Visualization Architecture

The component implements a specialized navigation system:

- Uses a horizontally scrolling timeline interface on smaller screens
- Implements full-width stage navigation on larger displays
- Provides clear visual indicators for the active journey stage
- Creates smooth transitions between stages with appropriate animations

### Stage-Specific Content Management

The component implements sophisticated content filtering:

- Maintains mapping between modules and applicable journey stages
- Dynamically filters the module catalog based on the active stage
- Handles modules that span multiple journey stages appropriately
- Provides helpful empty states when no modules match the active stage

## Integration Points

- **ModuleContext**: Provides access to the complete module catalog
- **SelectionContext**: Manages the current state of selected modules
- **JourneyStageContext**: Maintains the active journey stage
- **ModuleDetails**: Launched from this component for detailed module information

## Related Components

- [ModuleSelector](./ModuleSelector.md): Provides an alternative module selection approach
- [ModuleExplorer](./ModuleExplorer.md): Offers a complete catalog view without journey context
- [SummarySidebar](./SummarySidebar.md): Displays modules selected through this component
- [ModuleDetails](./ModuleDetails.md): Shows detailed information about journey-specific modules

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).