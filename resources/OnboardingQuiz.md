# OnboardingQuiz Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: onboarding, quiz, personalization, presets, templates, configuration

## Overview

The OnboardingQuiz component serves as the initial personalization mechanism for the Elexive Solution Builder, helping users identify their core business priority and select an appropriate starting point. It presents pre-configured solution templates as well as a custom option, guiding users toward the most relevant calculator configuration for their needs.

> **Note:** This component adheres to the [Elexive Solution Builder Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The OnboardingQuiz addresses several key customer needs identified in our research:

1. **Initial Orientation**: By helping users quickly identify relevant starting points
2. **Complexity Reduction**: By presenting curated templates for common business priorities
3. **Personalization**: By matching calculator configuration to specific business priorities
4. **User Confidence**: By providing guidance that reduces uncertainty in the early experience

## Core Functionality

1. **Business Priority Selection**
   - Presents a set of pre-defined business intents for users to choose from
   - Distinguishes between ready-made solutions and custom configuration options
   - Provides visual feedback for the currently selected option
   - Updates the calculator intent based on selection

2. **Preset Integration**
   - Leverages pre-configured presets from calculatorPresets.json
   - Maps intent selections to appropriate preset configurations
   - Uses preset descriptions when available for consistent messaging
   - Applies selected presets to the calculator configuration

3. **Navigation Controls**
   - Includes a "Start Over" button to reset the calculator
   - Implements selection handlers to move users to the next step
   - Maintains consistent visual styling with the rest of the application
   - Creates clear transition to subsequent configuration steps

4. **Educational Elements**
   - Uses the FeatureIntroduction component to provide guidance
   - Explains the difference between ready-made and custom solutions
   - Sets appropriate expectations for the subsequent configuration process
   - Provides contextual help for making appropriate selections

## Component-Specific Design Decisions

### Option Card Design

This component implements the [Card Design Pattern](./DesignGuidelines.md#1-card-design-pattern) with the following specific adaptations:

1. **Intent Card Customization** - Specialized for business intent selection:
   - Provides "Ready-Made Solution" badges where appropriate
   - Creates appropriate visual hierarchy for intent information
   - Adapts the standard card pattern for choice selection
   - Implements business intent-specific iconography

2. **Content Structure** - Specialized for intent presentation:
   - Displays concise, clear intent titles
   - Provides descriptive text explaining each option
   - Uses consistent iconography to reinforce concepts
   - Balances information density with readability

### Educational Content Design

This component implements the [Educational Content Pattern](./DesignGuidelines.md#3-educational-content-pattern) with the following specific adaptations:

1. **Guidance Text** - Contextual help specific to onboarding:
   - Explains the purpose of the selection step
   - Provides clear instructions for proceeding
   - Uses accessible, non-technical language specific to initial usage
   - Creates appropriate context for initial decision-making

2. **Feature Introduction Integration** - Specialized educational component:
   - Positioned prominently to support first-time users
   - Contains onboarding-specific guidance content
   - Creates clear visual distinction from the option cards
   - Focuses on establishing confidence for new users

## Technical Implementation

### Props

- `intent`: String representing the currently selected business priority
- `handleIntentSelect`: Function to update the selected intent
- `resetCalculator`: Function to clear all selections and return to initial state
- `handleContinue`: Function to proceed to the next configuration step

### Component Structure

1. **Header Section**
   - Component title with appropriate typography
   - Introductory text explaining the purpose
   - FeatureIntroduction component with detailed guidance
   - Visual separation from the option cards

2. **Option Card Grid**
   - Responsive grid layout of intent option cards
   - Consistent card components with standardized layout
   - Selection state styling for the active option
   - Badge indicators for ready-made solutions

3. **Navigation Controls**
   - Primary action button to continue the process
   - Secondary action to reset the calculator
   - Appropriate visual treatment for each action
   - Disabled states based on selection status

### Integration Points

- **FeatureIntroduction**: Used to provide educational content
- **Calculator Context**: Updates calculator state with selected intent
- **Preset Configuration**: Loads appropriate presets based on selection

## Related Components

- [FeatureIntroduction](./FeatureIntroduction.md): Used to provide contextual education
- [CalculatorIntroduction](./CalculatorIntroduction.md): Precedes this component in the user journey
- [ModuleSelector](./ModuleSelector.md): May be pre-configured based on quiz selection
- [SummarySidebar](./SummarySidebar.md): Displays the selected intent

2. **Configuration Loading**
   - Efficiently loads configuration data only when needed
   - Uses static imports for predictable loading behavior
   - Avoids redundant data processing

## Future Enhancement Opportunities

1. **Multi-Step Qualification**
   - Expand to a multi-question qualification process for more precise matching
   - Implement branching logic based on previous answers
   - Add progress indicators for multi-step qualification

2. **Enhanced Preset Visualization**
   - Add visual previews of what each preset configuration includes
   - Implement comparison view for different preset options
   - Show outcome previews based on preset selections

3. **Industry-Specific Options**
   - Add industry-specific preset configurations
   - Implement industry selection as part of the qualification process
   - Tailor language and examples to specific industry contexts

4. **User Preference Storage**
   - Add capability to save and recall previous selections
   - Implement user profiles for returning visitors
   - Create shareable configuration links for team collaboration

5. **Hybrid Configuration**
   - Allow users to start with a preset and then customize specific aspects
   - Implement "recommended modifications" for preset configurations
   - Create guided customization paths based on business context