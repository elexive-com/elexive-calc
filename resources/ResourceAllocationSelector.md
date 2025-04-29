# ResourceAllocationSelector Component

## Overview

The ResourceAllocationSelector component enables users to determine how their EVC (Elastic Value Credit) resources are allocated across different business transformation initiatives. It offers three distinct allocation strategies (Focused, Balanced, Distributed), each with its own efficiency implications based on context-switching overhead, serving as a key element in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component adheres to the [Elexive Calculator Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The ResourceAllocationSelector addresses several key customer needs identified in our research:

1. **Transformation Strategy Clarity**: By providing clear options for resource allocation approaches
2. **Efficiency Optimization**: By educating executives about context-switching costs in consulting services
3. **Business Priority Alignment**: By matching resource allocation strategy to organizational readiness
4. **Strategic Control**: By providing transparency into productivity trade-offs in transformation initiatives

## Component-Specific Design Decisions

### Strategy Option Design

The allocation strategy cards represent a key UX decision point, balancing several competing needs:

1. **Card Structure** - The strategy presentation layout:
   - Uses consistent card dimensions for visual harmony
   - Implements clear visual hierarchy from name to efficiency to description
   - Provides sufficient information for decision-making without overwhelming
   - Creates appropriate visual distinction between different allocation approaches

2. **Efficiency Visualization** - The productivity representation:
   - Uses proportional bar charts to illustrate productive vs. overhead time
   - Implements consistent color coding for efficiency levels (green, yellow, orange)
   - Creates immediate visual understanding of productivity differences
   - Provides supporting numeric values for precise comprehension

3. **Visual Selection Feedback** - The interactive indicators:
   - Implements distinct styling for the selected allocation strategy
   - Uses subtle hover effects to indicate interactivity
   - Provides appropriate visual treatment for disabled options with explanations
   - Creates clear visual contrast between selected and unselected states

### Educational Content Design

The educational elements implement a deliberate learning architecture:

1. **Context Switching Explainer** - The conceptual framework:
   - Provides research-backed explanation of productivity impacts
   - Uses progressive disclosure to avoid overwhelming users
   - Implements expandable section for additional details
   - Creates appropriate business context for technical productivity concepts

2. **Strategy Recommendations** - The decision guidance:
   - Provides capacity-specific recommendations with visual indicators
   - Explains the reasoning behind constraints and recommendations
   - Presents concrete examples of when each strategy is appropriate
   - Creates clear connections between capacity selection and allocation options

## Core Functionality

1. **Allocation Strategy Selection**
   - Presents three distinct resource allocation approaches:
     - **Laser Beam (Focused)**: Concentrates 100% of resources on a single initiative
     - **Smart Campaign (Balanced)**: Distributes resources across a limited number of concurrent initiatives
     - **Omni-Channel (Distributed)**: Spreads resources across many parallel initiatives
   - Each strategy has associated context-switching overhead percentages that affect productivity
   - Provides clear visual indicators of efficiency differences between strategies
   - Creates appropriate business context for technical productivity concepts

2. **Capacity-Aware Strategy Constraints**
   - Intelligently restricts available strategies based on the selected production capacity:
     - Pathfinder capacity only allows the Focused strategy
     - Jetpack capacity allows Focused and Balanced strategies
     - Rocket capacity enables all three strategies
   - Provides visual indication of disabled options with explanation
   - Creates clear connections between capacity selection and allocation options
   - Implements appropriate validation to prevent invalid selections

3. **Educational Visualization**
   - Includes an expandable detailed explanation of context switching costs
   - Visualizes productive vs. overhead time for each strategy with proportional bar charts
   - Provides research-backed explanations of how context switching affects productivity
   - Uses business-friendly language to explain technical productivity concepts

4. **Strategy Recommendation Engine**
   - Analyzes the selected production capacity to recommend optimal allocation strategies
   - Highlights recommended strategies with visual badges and explanatory text
   - Provides strategic guidance appropriate to the user's specific situation
   - Creates clear decision support for executive users

## Technical Implementation

### Props

- `resourceAllocation`: String representing the currently selected allocation strategy (default: 'focused')
- `setResourceAllocation`: Function to update the selected allocation strategy
- `productionCapacity`: String representing the current production capacity tier

### State Management

- `showExplainer`: Boolean controlling visibility of the detailed context switching explanation section

### Helper Functions

1. **`isRecommendedStrategy(strategy)`**
   - Determines if a strategy should be recommended based on the current production capacity
   - Returns boolean indicating recommendation status
   - Logic:
     - For pathfinder capacity, recommends focused strategy
     - For jetpack capacity, recommends balanced strategy
     - For rocket capacity, all strategies are viable so none receive special recommendation

2. **`isStrategyDisabled(strategy)`**
   - Determines if a strategy should be disabled based on production capacity constraints
   - Returns boolean indicating disabled status
   - Enforces rules about which capacity tiers can use which allocation strategies

3. **`handleAllocationSelect(key)`**
   - Handles strategy selection with validation against disabled options
   - Only allows selection of strategies that are valid for current capacity

4. **`getStrategyExample(strategy)`**
   - Provides context-specific example use cases for each strategy
   - Returns descriptive text explaining ideal use case for the strategy

5. **`getStrategyIcon(key)`**, **`getSwitchingCost(key)`**, **`getOverheadLabel(key)`**
   - Utility functions to retrieve strategy-specific UI elements and data points
   - Maintain consistent visual language and calculations

### External Dependencies

1. **Configuration Data**
   - Imports resource allocation definitions from `calculatorConfig.json`
   - Each allocation strategy contains:
     - `description`: Text label for the strategy
     - `label`: Detailed description of the allocation approach
     - `valueProposition`: Primary benefit statement
     - `switchingOverhead`: Numeric percentage of productivity lost to context switching
     - `overheadLabel`: Human-readable representation of the overhead

2. **UI Components**
   - Uses `FeatureIntroduction` component to provide contextual guidance
   - Leverages FontAwesome icons for visual representation of concepts

## User Experience Considerations

1. **Educational Approach**
   - Takes a "teach, then guide" approach to complex productivity concepts
   - Provides expandable detailed explanation that doesn't overwhelm by default
   - Uses visual aids (bar charts) to illustrate abstract productivity concepts

2. **Contextual Constraints**
   - Clearly communicates which strategies are available for the current capacity
   - Provides visual feedback for disabled options rather than hiding them completely
   - Explains the reasoning behind constraints through recommendations

3. **Decision Support**
   - Shows concrete examples of when each strategy is appropriate
   - Highlights context switching costs prominently to emphasize this key consideration
   - Uses color-coding to quickly communicate efficiency levels (green, yellow, orange)

## Edge Cases and Error Handling

1. **Default Selection**
   - Provides a default 'focused' strategy to ensure calculations remain valid
   - Prevents invalid selections by disabling incompatible options based on capacity

2. **Capacity Changes**
   - Re-evaluates strategy availability when production capacity changes
   - May auto-adjust selected strategy if current selection becomes invalid with capacity change

3. **Configuration Validation**
   - Reliably handles configuration data with fallbacks for missing properties
   - Ensures switching cost calculations always render correctly

## Performance Considerations

1. **Conditional Rendering**
   - Uses state to control visibility of detailed explanations rather than including them always
   - Implements animation for smooth transitions when expanding/collapsing sections

2. **Cached Calculations**
   - Utilizes helper functions to calculate derived values only when needed
   - Avoids redundant calculations by using component variables

## Future Enhancement Opportunities

1. **Custom Overhead Settings**
   - Allow advanced users to adjust context switching overhead percentages
   - Provide simulation tools to model different productivity scenarios

2. **Team Composition Effects**
   - Add configuration for team size and composition to refine overhead calculations
   - Account for specialized roles and their different context switching sensitivities

3. **Temporal Allocation Planning**
   - Enable planning for changes in allocation strategy over time
   - Allow for strategy shifts as projects move through different phases

4. **AI-Powered Recommendations**
   - Implement AI-based recommendation engine for optimal resource allocation
   - Account for project complexity, team expertise, and business priorities

5. **Case Study Integration**
   - Include real-world examples of successful resource allocation approaches
   - Provide industry-specific benchmarks and best practices