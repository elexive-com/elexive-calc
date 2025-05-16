# Journey Planner Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: journey, transformation, stages, sequential, navigation, discovery

## Overview

The Journey Planner component provides an immersive, visual representation of the client transformation journey, allowing executives to understand the sequential nature of business transformation and discover modules that support each phase. This standalone component transforms the traditional consulting approach by organizing services into a clear, chronological narrative that guides customers through their transformation path.

> **Note:** This component adheres to the [Elexive Solution Builder Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and journey integration.

## Strategic Purpose

The Journey Planner component addresses several key customer needs identified in our research:

1. **Sequential Understanding**: By helping executives visualize transformation as a chronological process
2. **Stage-Specific Focus**: By allowing customers to focus on their current implementation stage
3. **Contextual Discovery**: By presenting modules within the relevant phase of transformation
4. **Transformation Narrative**: By creating a compelling story about how transformation unfolds

## Core Functionality

1. **Journey Stage Visualization**
   - Displays transformation as a sequential, four-stage process
   - Uses distinct visual treatment for each journey stage
   - Provides clear navigation between different stages
   - Shows current position in the overall transformation journey

2. **Module Discovery by Stage**
   - Filters modules based on their applicability to each journey stage
   - Presents contextually relevant modules for the selected stage
   - Adapts content display to match the selected journey phase
   - Maintains consistent module presentation with other selection interfaces

3. **Stage Transition Navigation**
   - Enables intuitive progression through transformation stages
   - Provides clear visual feedback for the active journey stage
   - Allows non-linear exploration of the full transformation journey
   - Creates visual continuity between different journey phases

4. **Journey Context Education**
   - Provides stage-specific descriptions of transformation phases
   - Educates users about transformation progression and milestones
   - Sets appropriate expectations for each journey stage
   - Creates business context for module selection decisions

## Component-Specific Design Decisions

### Journey Visualization Design

This component implements a specialized navigation approach that follows the guidelines in [Interaction Patterns](./DesignGuidelines.md#3-navigation):

1. **Journey Steps** - Transformation stage navigation:
   - Use distinct color-coding for each stage (blue, amber, green, purple)
   - Include numerical indicators (1,2,3,4) to reinforce sequential nature
   - Feature stage-specific iconography for visual recognition
   - Connect with directional arrows to indicate progression
   - Apply dramatic visual state changes between active and inactive stages

2. **Active State Design** - Selection feedback implementation:
   - Background color changes to the full saturation of the stage color
   - Text changes to white for maximum contrast
   - Icon colors adjust for visibility against the colored background
   - Number indicator inverts colors to maintain visibility
   - Shadow effect increases to create depth and focus

3. **Content Transition** - Dynamic content display:
   - Updates dynamically to show only relevant modules
   - Includes clear heading showing the active stage
   - Maintains consistent module card design across the application
   - Shows helpful empty state if no modules match filters

### Module Card Design

This component implements the [Card Design Pattern](./DesignGuidelines.md#1-card-design-pattern) with these journey-specific adaptations:

1. **Card Headers**
   - Uses the same color as the module's parent pillar
   - Prominently displays the pillar name to maintain context
   - Includes the pillar icon for additional visual reinforcement
   - Positions the category badge within the header but visually distinct

2. **Content Layout**
   - Places the module name in prominent position
   - Includes concise heading text that describes the module's purpose
   - Uses consistent typography matching the application design system
   - Features sufficient white space for readability

3. **Variant Badges**
   - Uses distinctive color coding (blue for Insight Primer, green for Implementation Accelerator)
   - Includes appropriate iconography (lightbulb for insight, rocket for implementation)
   - Maintains consistent positioning at the bottom of the content area

## Technical Implementation

### Props

- `modules`: Array of all available module objects
- `journeyStages`: Array of stage objects with names, descriptions, and colors
- `selectedStage`: Currently active journey stage
- `setSelectedStage`: Function to update the active stage
- `onModuleSelect`: Function to handle module selection

### Component Structure

1. **Journey Navigation Bar**
   - Connected step indicators with numerical labels
   - Stage titles with appropriate iconography
   - Active state styling for the current stage
   - Directional indicators showing progression

2. **Stage Content Area**
   - Dynamic heading showing current stage name
   - Module grid filtered to the active stage
   - Consistent module card components
   - Empty state handling for stages with no matching modules

3. **Filter Panel**
   - Collapsible filter interface with pillar, category, and variant options
   - Search input with appropriate controls
   - Count indicators showing matching modules
   - Clear filters option for easy reset

### Integration Points

- **ModuleSelector**: Shares module selection state and card styling
- **ModuleExplorer**: Uses consistent module card presentation
- **SummarySidebar**: Updates reflected when modules are selected through this view

## Related Components

- [ModuleSelector](./ModuleSelector.md): Alternative module selection interface organized by pillars
- [ModuleExplorer](./ModuleExplorer.md): Comprehensive module browsing interface with search capabilities
- [SummarySidebar](./SummarySidebar.md): Shows modules selected in the Journey Planner
- [OnboardingQuiz](./OnboardingQuiz.md): May direct users to a specific journey stage based on responses
- [CalculatorIntroduction](./CalculatorIntroduction.md): References the transformation journey process outlined in this component

Users can interact with modules through:

1. **Module Cards**
   - View summary information about each module
   - See which pillar and category the module belongs to
   - Identify available variants
   - Save modules for later reference
   - Access detailed module information

2. **Detail View**
   - Explore comprehensive module descriptions
   - Understand how the module fits within the transformation journey
   - Learn about available variants and their value propositions
   - Export module details as PDF for stakeholder alignment
   - Return easily to the journey view

## Technical Implementation

### Architecture

The Journey Planner is built as a self-contained React component that:

- Consumes module and journey data from centralized configuration sources
- Maintains internal state for selections and view preferences
- Implements responsive design for multi-device compatibility
- Uses CSS Grid and Flexbox for advanced layout requirements
- Leverages Tailwind CSS for consistent styling

### State Management

The component manages several key state variables:

- Active journey step selection
- Filtered modules based on journey stage and other criteria
- Search and filter parameters
- Saved/bookmarked modules
- Detail view state and selected module
- UI state like expanded filters

### Data Model

The component relies on structured data for:

- Journey stages with descriptions, icons, and color mappings
- Module metadata including journey stage associations
- Pillar and category classifications
- Variant definitions

### Accessibility Considerations

The Journey Planner is built with accessibility in mind:

- Semantic HTML structure for screen reader compatibility
- Keyboard navigation support for all interactive elements
- ARIA attributes for complex interactive widgets
- Sufficient color contrast for all text elements
- Focus management for interactive elements and transitions

## User Experience Flow

1. **Initial Engagement**
   - User arrives at the Journey Planner view
   - Visual journey stages draw attention to the sequential nature of transformation
   - Default journey stage (typically Assess) is pre-selected

2. **Journey Navigation**
   - User can click on any journey stage to see related modules
   - Visual changes clearly indicate which stage is active
   - Module grid updates to show only modules for the selected stage

3. **Refinement Phase**
   - Filtering and search options allow narrowing of visible modules
   - Saved modules feature enables creation of a shortlist
   - Clear feedback is provided when filters limit results

4. **Deep Dive**
   - Clicking on a module card reveals its detailed view
   - Comprehensive information allows for thorough evaluation
   - Context is maintained showing how the module fits in the journey
   - Export to PDF enables sharing with stakeholders

5. **Return to Journey**
   - Clear back navigation returns to the journey view
   - Previous selections and filters are maintained

## Integration Points

The Journey Planner integrates with:

- **ModuleDetails**: For displaying detailed module information
- **PDF Generation**: For creating shareable module documents
- **Application Theme**: For consistent visual design

## Performance Considerations

- Efficient filtering of modules by journey stage
- Optimized rendering of module grids
- Careful state management to prevent unnecessary re-renders
- Considered animation effects to maintain smooth performance

## Future Enhancement Opportunities

1. **Personalization**:
   - Industry-specific journey adaptation
   - Customized journey phases based on customer maturity
   - Recommended modules based on user profile

2. **Enhanced Visualization**:
   - Interactive timeline visualization
   - Progress tracking through the journey
   - Transformation maturity assessment

3. **Content Enrichment**:
   - Case studies specific to each journey stage
   - Video explanations of the transformation journey
   - Expert commentary on typical challenges at each stage

4. **Collaboration Features**:
   - Shared journey notes and annotations
   - Team progress tracking through stages
   - Collaborative journey planning

## Implementation Guidelines

When implementing or extending the Journey Planner:

1. Maintain the sequential narrative of the transformation journey
2. Preserve the distinct color-coding for each journey stage
3. Ensure journey stages are clearly connected visually
4. Keep module information consistent with other application views
5. Maintain the progressive disclosure approach to information
6. Ensure responsive design works across devices
7. Prioritize accessibility for all interactive elements

## Metrics & Success Indicators

The effectiveness of the Journey Planner should be measured by:

1. Journey stage engagement (which stages are most explored)
2. Module discovery patterns (modules viewed by journey stage)
3. Time spent exploring different journey phases
4. Filter usage patterns to understand refinement needs
5. PDF exports as indicators of sharing intent
6. Progression through journey stages over time

By continuously optimizing against these metrics, the Journey Planner can become an increasingly effective tool for guiding users through their transformation process and connecting them with the most relevant consulting modules for their current stage.