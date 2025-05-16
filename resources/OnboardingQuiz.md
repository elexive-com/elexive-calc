# OnboardingQuiz Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: onboarding, quiz, personalization, presets, templates, configuration

## Overview

The OnboardingQuiz component serves as the initial personalization mechanism for the Elexive Solution Builder, helping users identify their core business priority and select an appropriate starting point. It presents pre-configured solution templates as well as a custom option, guiding users toward the most relevant calculator configuration.

> **Note:** This component is part of the [Elexive Solution Builder](./CalculatorApp.md) and adheres to the [Design Guidelines](./DesignGuidelines.md).

## Component-Specific Features

1. **Business Priority Selection Interface**
   - Presents strategic business priorities as visually distinct, selectable cards
   - Implements the Card Design Pattern with priority-specific imagery and content
   - Provides immediate visual feedback for the selected option
   - Creates an intuitive first step that builds user confidence

2. **Preset Configuration System**
   - Integrates with calculatorPresets.json to load pre-configured templates
   - Maps user selection to specific calculator configurations
   - Streamlines the configuration process for common use cases
   - Maintains a "Full Custom" option for complete flexibility

3. **Priority Explanation Presentation**
   - Provides contextual explanation of each business priority
   - Uses consistent formatting with concise, benefit-focused language
   - Implements subtle animations to enhance engagement
   - Creates immediate relevance through business outcome framing

4. **Configuration Jumpstart**
   - Initializes the calculator with appropriate starting values
   - Optimizes initial state based on selected priority
   - Triggers appropriate navigation to the main calculator
   - Creates a seamless transition to the next step in the process

## Implementation Highlights

### Template Card System

The component uses a specialized card implementation:

- Arranges selectable options in a responsive grid layout
- Implements consistent card styling with appropriate visual hierarchy
- Uses subtle hover and selection animations for interactive feedback
- Maintains card proportions across different screen sizes

### Selection State Management

The component maintains several pieces of local state:

- `selectedIntent`: Tracks the currently selected business priority
- `isAnimating`: Controls card selection animations
- `hasSelected`: Determines when to show the continue button

## Integration Points

- **useCalculator Hook**: Updates the global intent state upon selection
- **TabContext**: Used to navigate to the main calculator upon completion
- **calculatorPresets.json**: Provides the configuration presets data
- **CalculatorApp**: Receives the selected preset to initialize calculator state

## Related Components

- [CalculatorIntroduction](./CalculatorIntroduction.md): Precedes this component in the user journey
- [FeatureIntroduction](./FeatureIntroduction.md): Used to provide contextual education
- [ModuleSelector](./ModuleSelector.md): May be pre-configured based on quiz selection
- [SummarySidebar](./SummarySidebar.md): Displays the selected intent

**Note:** For comprehensive documentation of the Elexive Solution Builder, including the overall application architecture and user journey, see the [main application documentation](./CalculatorApp.md).