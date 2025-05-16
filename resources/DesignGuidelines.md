# Elexive Solution Builder Design Guidelines

## Overview

This document defines the shared design principles, color system, interaction patterns, and customer journey integration guidelines for the Elexive Solution Builder application. These guidelines ensure consistency across all components while supporting the strategic business goals of reducing information asymmetry, managing complexity, and empowering customer control.

## Strategic Foundation

The Elexive Solution Builder transforms the consulting sales process through a customer-centric digital experience that addresses key pain points identified in our research:

1. **Information Asymmetry**: Traditional consulting sales processes obscure true costs and value
2. **Complexity Overwhelm**: The multifaceted nature of transformation consulting often leads to analysis paralysis
3. **Control Deficit**: Modern decision-makers expect transparency and self-service options

## Customer Journey Phases

The Solution Builder is architected around a customer journey that builds trust, demonstrates value, and creates momentum toward conversion:


### 1. **Intuitive Onboarding**
   - Meets executives where they are with business-focused language
   - Quickly personalizes the experience to their specific challenges
   - Creates immediate value through ready-made solutions for common business transformation scenarios
   - **Key Components**: [SolutionBuilderIntroduction](./CalculatorIntroduction.md), [OnboardingQuiz](./OnboardingQuiz.md)

### 2. **Guided Exploration**
   - Presents consulting modules through multiple navigation paradigms to match executive thinking styles
   - Organizes offerings by transformation pillars and journey stages
   - Uses visual storytelling to make complex service choices intuitive
   - Empowers self-guided discovery with filtering, search, and save functionality
   - **Key Components**: [ModuleExplorer](./ModuleExplorer.md), [ModuleSelector](./ModuleSelector.md), [ModuleDetails](./ModuleDetails.md), [ProductionCapacitySelector](./ProductionCapacitySelector.md)

### 3. **Strategic Optimization**
   - Frames consulting decisions in terms of business outcomes
   - Visualizes trade-offs in ways meaningful to executive decision-makers
   - Provides contextual education that builds customer expertise
   - **Key Components**: [ResourceAllocationSelector](./ResourceAllocationSelector.md), [ServiceParameters](./ServiceParameters.md)

### 4. **Value Validation**
   - Transparently shows pricing alongside value delivered
   - Presents ROI and time-to-value metrics prominent to executives
   - Creates shareable artifacts that facilitate internal stakeholder alignment
   - **Key Components**: [DetailedReportModal](./DetailedReportModal.md), [SummarySidebar](./SummarySidebar.md), [PricingSummary](./PricingSummary.md)

### 5. **Friction-Free Conversion**
   - Provides multiple, low-commitment next steps tailored to decision readiness
   - Seamlessly transitions from self-service to sales conversation when appropriate
   - Captures value-signaling data that enables personalized follow-up
   - **Implementation**: Integrated throughout components via strategic calls-to-action

## Journey Impact Matrix

| Phase                  | Component                    | Design Role                    | Strategic Goal                                |
|------------------------|------------------------------|--------------------------------|-----------------------------------------------|
| Intuitive Onboarding   | CalculatorIntroduction       | Establish trust, relevance     | Reduce bounce rate, increase config starts     |
| Guided Exploration     | ModuleExplorer, Selector     | Encourage discovery             | Increase modules viewed, save events           |
| Strategic Optimization | ResourceAllocationSelector   | Frame decisions in outcomes     | Improve scenario time, deepen engagement       |
| Value Validation       | PricingSummary, Reports      | Visualize ROI, socialize config | Increase internal sharing, shorten cycle       |
| Friction-Free Conversion | CTA Integration             | Create forward momentum         | Increase contact rate, reduce friction         |

## Service-First Design Mindset

The Elexive Solution Builder is not a scoping tool—it is the gateway to an ongoing, modular advisory service. Every design decision should support:

- Re-engagement and persistent access
- Clarity around long-term advisory pathways
- Transparent delivery through Elastic Value Credits (EVCs)
- Momentum toward relationship-building, not just transaction completion

Our interface must reflect that this is a recurring service, not a one-off decision.

## Core Design Principles

All components within the Elexive Solution Builder adhere to these foundational design principles:

### 1. **Visual Consistency**
   - Maintain strong visual relationships between related elements
   - Use the established color system for semantic meaning
   - Ensure interface elements have consistent visual treatment
   - Apply coherent typographic hierarchy throughout the application

### 2. **Information Hierarchy**
   - Present information in a logical order of importance
   - Use size, color, and position to indicate information priority
   - Create clear visual distinction between primary, secondary, and tertiary information
   - Implement progressive disclosure for complex information through expandable sections

### 3. **Cognitive Load Management**
   - Chunk information into digestible sections
   - Limit the number of choices presented at any given moment
   - Use consistent patterns and layouts across the interface
   - Provide visual cues that guide attention to important elements
   - Support executive decision-making under time pressure
   - Increase clarity of high-impact actions during reconfiguration

### 4. **Business-Focused Language**
   - Frame all information in executive-friendly terms
   - Emphasize business outcomes rather than technical details
   - Use familiar business terminology and metrics
   - Avoid consulting jargon in favor of clear business language

### 5. **Visual Storytelling**
   - Use design elements to convey relationships and processes
   - Implement color coding to create meaningful associations
   - Apply consistent iconography to reinforce concepts
   - Create clear visual patterns that guide users through the experience

## Color System

The Elexive Solution Builder implements a cohesive color system that creates meaningful associations while maintaining accessibility:

### 1. **Brand Colors**
   - **Elexive Primary**: #2E2266 (Deep purple) - Used for primary UI elements, main headers
   - **Elexive Secondary**: #EB8258 (Coral) - Used for secondary actions, highlights
   - **Elexive Accent**: #FFBD59 (Amber) - Used for emphasis, calls-to-action, selection indicators

### 2. **Transformation Pillar Colors**
   - **Transformation**: #D99000 (Amber/gold) - For people and process transformation modules
   - **Strategy**: #C85A30 (Orange) - For vision and direction strategy modules
   - **Technology**: #1F776D (Teal) - For tools and systems technology modules
   - **Discovery**: #2E2266 (Purple) - For assessment and discovery modules

### 3. **UI Framework Colors**
   - **Dark Neutral**: #111827 - Primary text, headings
   - **Medium Dark Neutral**: #374151 - Body text
   - **Medium Neutral**: #6B7280 - Secondary text, descriptions
   - **Light Neutral**: #E5E7EB - Borders, dividers
   - **Lightest Neutral**: #F9FAFB - Backgrounds, cards
   - **White**: #FFFFFF - Primary background

### 4. **Semantic Colors**
   - **Success**: #10B981 (Green) - Positive indicators, confirmations
   - **Warning**: #F59E0B (Amber) - Caution indicators, moderate efficiency
   - **Alert**: #EF4444 (Red) - Error states, negative indicators
   - **Info**: #3B82F6 (Blue) - Informational elements, insight indicators

### 5. **Variant Indicators**
   - **Insight Primer**: #3B82F6 (Blue) - For insight/assessment modules
   - **Integrated Execution**: #10B981 (Green) - For implementation/execution modules

### Implementation Guidelines
   - Use colors consistently for their semantic meaning across the application
   - Apply appropriate opacity reductions (10%, 15%, etc.) to create hierarchy
   - Maintain sufficient contrast for text and interactive elements (WCAG AA compliance)
   - Use color alongside other visual indicators to support accessibility

## Typography System

A consistent typographic hierarchy supports clear information organization:

### 1. **Headings**
   - **H1**: 24px/1.5 Semibold - Primary headings, component titles
   - **H2**: 20px/1.5 Semibold - Section headings, modal titles
   - **H3**: 18px/1.5 Medium - Subsection headings, card titles
   - **H4**: 16px/1.5 Medium - Minor headings, group labels

### 2. **Body Text**
   - **Body Large**: 16px/1.5 Regular - Primary content, descriptions
   - **Body**: 14px/1.5 Regular - Standard text, card content
   - **Body Small**: 12px/1.5 Regular - Secondary information, supporting text

### 3. **Interactive Text**
   - **Button Large**: 16px/1.5 Medium - Primary CTA buttons
   - **Button**: 14px/1.5 Medium - Standard buttons
   - **Button Small**: 12px/1.5 Medium - Compact buttons, links

### 4. **Specialized Text**
   - **Label**: 12px/1.33 Medium - Form labels, badges
   - **Caption**: 11px/1.33 Regular - Captions, meta information
   - **Overline**: 10px/1.2 Medium, uppercase, tracked - Category labels, section markers

### Implementation Guidelines
   - Maintain consistent type scale throughout the application
   - Use weight variations (Regular, Medium, Semibold) to create hierarchy
   - Apply appropriate line height for optimal readability
   - Ensure sufficient contrast between text and background

## Interaction Patterns

Consistent interaction patterns create predictable user experiences:

### 1. **Selection & Toggle**
   - Use clear visual indicators for selected states (borders, backgrounds, checkmarks)
   - Implement consistent hover and focus states across similar elements
   - Provide immediate visual feedback for selection changes
   - Use toggle switches for binary options, radio buttons for mutually exclusive choices

### 2. **Progressive Disclosure**
   - Implement collapsible sections for managing information density
   - Use clear visual affordances indicating expandability
   - Provide smooth animations for state transitions
   - Maintain consistent expansion/collapse behavior across the application

### 3. **Navigation**
   - Implement clear tab designs for switching between primary views
   - Use breadcrumbs or step indicators for multi-stage processes
   - Provide consistent back/forward navigation where appropriate
   - Maintain persistent access to key functionality throughout the experience

### 4. **Modals & Overlays**
   - Use modals for focused tasks and detailed information
   - Implement consistent header and close button positioning
   - Provide appropriate focus management and keyboard navigation
   - Use semi-transparent overlays to maintain context

### 5. **Forms & Inputs**
   - Apply consistent styling for all input elements
   - Provide clear validation feedback and error states
   - Use appropriate input types for different data requirements
   - Implement logical keyboard navigation and tab order

## Responsive Design Guidelines

The application adapts appropriately across different viewport sizes:

### 1. **Layout Adaptation**
   - Use responsive grid systems that adapt from multi-column to single-column
   - Prioritize critical information in mobile views
   - Maintain consistent spacing through relative units
   - Adjust information density based on available screen space

### 2. **Touch Optimization**
   - Ensure all interactive elements meet minimum touch target sizes (44px)
   - Adjust hover states to be touch-friendly on mobile devices
   - Provide appropriate spacing between touch targets
   - Implement mobile-specific interactions where appropriate

### 3. **Content Prioritization**
   - Use progressive disclosure more aggressively on smaller screens
   - Maintain the same core functionality across device sizes
   - Adjust visual hierarchy to emphasize key information on smaller screens
   - Consider alternative navigation patterns for mobile (e.g., dropdown instead of tabs)

## Component Integration

Components should integrate seamlessly within the larger application:

### 1. **Data Flow**
   - Implement clear prop interfaces between components
   - Use consistent naming conventions for shared data structures
   - Maintain unidirectional data flow where possible
   - Document integration points and dependencies

### 2. **State Management**
   - Use appropriate state management based on component complexity
   - Implement local state for UI-specific controls
   - Leverage shared state for cross-component coordination
   - Avoid redundant state that could lead to inconsistencies

### 3. **Event Handling**
   - Use consistent event naming and handling patterns
   - Implement appropriate event bubbling/propagation strategies
   - Provide clear callback interfaces for component communication
   - Document event flow between related components

## Accessibility Guidelines

All components must meet accessibility standards:

### 1. **Semantic Structure**
   - Use semantic HTML elements appropriately (headings, lists, buttons, etc.)
   - Implement proper ARIA attributes for complex interactive elements
   - Maintain logical document structure and reading order
   - Provide appropriate alt text for images and icons

### 2. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Implement logical tab order through the interface
   - Provide appropriate focus management for modals and complex widgets
   - Use visual focus indicators that meet WCAG standards

### 3. **Color & Contrast**
   - Ensure sufficient color contrast for all text (WCAG AA minimum)
   - Don't rely on color alone to convey information
   - Provide appropriate focus and hover states for interactive elements
   - Test color combinations for common color vision deficiencies

### 4. **Screen Reader Support**
   - Test all components with screen readers
   - Provide appropriate ARIA labels and descriptions
   - Implement status updates for dynamic content
   - Ensure modal dialogs are properly announced

## Performance Considerations

Components should follow these performance best practices:

### 1. **Rendering Efficiency**
   - Optimize component rendering to minimize unnecessary updates
   - Use appropriate memoization techniques where beneficial
   - Implement efficient list rendering for large data sets
   - Minimize DOM complexity where possible

### 2. **Resource Management**
   - Lazy-load non-critical content and components
   - Implement appropriate code splitting
   - Optimize asset loading (images, fonts, etc.)
   - Minimize network requests through batching and caching

### 3. **Animation Performance**
   - Use CSS transitions/animations where possible
   - Optimize JavaScript animations to avoid layout thrashing
   - Consider reducing animation complexity on lower-end devices
   - Test animations for performance impact

## Metrics & Success Indicators

Component effectiveness should be measured against these key metrics:

### 1. **Engagement Metrics**
   - Time spent within each component/phase
   - Interaction patterns (clicks, views, expansions)
   - Progress through the customer journey
   - Feature utilization rates

### 2. **User Satisfaction**
   - Self-reported understanding and confidence
   - Task completion rates
   - Error and recovery patterns
   - Explicit feedback on component usability

### 3. **Business Impact**
   - Conversion rates through the customer journey
   - Quality of leads generated
   - Sales cycle velocity
   - Customer acquisition costs

### 4. **Performance Metrics**
   - Load and render times
   - Interaction responsiveness
   - Error rates and exceptions
   - Resource utilization

## Implementation Resources

### 1. **Design Assets**
   - Component-specific Figma libraries
   - Shared icon system
   - Color and typography tokens
   - Responsive layout templates

### 2. **Code Resources**
   - Reusable utility components
   - Shared hooks and utilities
   - Theme and style definitions
   - Documentation and examples

## Version Control

This document and associated design guidelines will evolve over time:

- **Current Version**: 1.1
- **Last Updated**: May 16, 2025
- **Change History**: 
  - 1.0 (April 29, 2025): Initial consolidated guidelines
  - 1.1 (May 16, 2025): Added common UI/UX patterns, component implementation guidelines

## Common Component Patterns

These reusable design patterns appear across multiple components and should be implemented consistently to maintain visual cohesion and user experience continuity.

### 1. **Card Design Pattern**
   - **Purpose**: Used for presenting discrete, selectable options or information units
   - **Visual Structure**:
     - Consistent dimensions (typically height-flexible, fixed width)
     - Clear header area with distinctive background color
     - Well-defined content area with appropriate spacing
     - Optional footer/action area visually separated from content
   - **Selection States**:
     - Distinctive border (2px solid in primary or accent color)
     - Subtle background color change
     - Selection indicator (checkmark, highlight, or icon) 
     - Focus/hover states with appropriate visual feedback
   - **Implementation**: 
     - Use consistent border-radius (typically 8px)
     - Maintain consistent shadow treatment (typically 0 2px 4px rgba(0,0,0,0.1))
     - Implement hover, focus, and active states consistently
   - **Used in**: ModuleSelector, ModuleExplorer, ModuleDetails, ProductionCapacitySelector, ResourceAllocationSelector, OnboardingQuiz

### 2. **Expandable Section Pattern**
   - **Purpose**: Used for progressive disclosure of related information
   - **Visual Structure**:
     - Consistent header with expansion indicator (typically chevron/arrow)
     - Clear visual feedback for expanded/collapsed states
     - Smooth animation for expansion/collapse transitions
     - Content area with appropriate padding and hierarchy
   - **Behavior**:
     - Click/tap on header toggles expansion state
     - Default open/closed state based on information priority
     - Keyboard-accessible expansion control
     - Optional group behavior (accordion-style)
   - **Implementation**:
     - Use consistent animation timing (typically 200-300ms)
     - Apply aria-expanded and aria-controls attributes for accessibility
     - Implement directionally appropriate indicators (down when closed, up when open)
   - **Used in**: SummarySidebar, CalculatorIntroduction, ResourceAllocationSelector

### 3. **Educational Content Pattern**
   - **Purpose**: Used for providing explanatory information and guidance
   - **Visual Structure**:
     - Distinctive background color or border (typically using info/blue colors)
     - Clear hierarchical organization (title, description, additional details)
     - Optional icon indicating informational content
     - Visual separation from interactive elements
   - **Content Guidelines**:
     - Use concise, business-focused language
     - Implement progressive disclosure for detailed information
     - Balance information completeness with cognitive load
     - Maintain consistent tone across all educational elements
   - **Implementation**:
     - Use subtle visual treatment that doesn't compete with primary content
     - Apply consistent typography for titles (typically H3 or H4)
     - Consider expandable implementation for longer explanations
   - **Used in**: FeatureIntroduction, EvcExplainer, ModuleDetails, ResourceAllocationSelector, OnboardingQuiz

## Visual Selection Feedback Standards

Consistent visual feedback for selection states creates predictable user experiences and reinforces the interaction model.

### 1. **Option Selection**
   - **Single-Select Options**:
     - Apply accent-colored border (2px solid) to the selected item
     - Use subtle background color change (#F8F9FA to #F0F7FF)
     - Add visual indicator (checkmark or highlight) in consistent position
     - Maintain clear visual distinction from unselected items
   - **Multi-Select Options**:
     - Use checkbox or toggle controls with consistent styling
     - Provide clear visual feedback for partial and complete selection
     - Implement distinguishable states (selected, unselected, disabled)
     - Apply consistent hover/focus effects across selectable elements

### 2. **Interactive Element States**
   - **Buttons and Controls**:
     - Provide distinctive hover state (typically lightened background)
     - Implement active/pressed state (typically darkened background)
     - Use consistent focus indicators (outline or glow effect)
     - Apply disabled state with reduced opacity (typically 0.5-0.6)
   - **Links and Toggles**:
     - Use consistent hover effects (underline or color change)
     - Apply clear active state indicators
     - Implement keyboard focus states that meet accessibility standards

### 3. **Selection Confirmation**
   - Provide immediate visual feedback when selection changes
   - Consider subtle transition animations for state changes
   - Ensure selection state is clearly visible even at a glance
   - Use appropriate ARIA attributes for screen reader users

## Component-Specific Implementation Guidelines

These guidelines explain how common patterns should be applied to specific component types.

### 1. **Selection Components**
   Selection components (ModuleSelector, ModuleDetails, ProductionCapacitySelector, ResourceAllocationSelector) should:
   - Implement the Card Design Pattern with appropriate selection states
   - Use consistent spacing between options (typically 16px)
   - Provide both visual and programmatic grouping of related options
   - Consider responsive adaptation for different viewport sizes
   - Include clear instruction/explanation text above option groups

### 2. **Information Display Components**
   Information display components (SummarySidebar, DetailedReportModal, PricingSummary) should:
   - Implement the Expandable Section Pattern for managing information density
   - Apply consistent information hierarchy within sections
   - Use appropriate typographic styles for different information types
   - Provide sufficient context and labeling for numerical values
   - Implement responsive layouts that prioritize critical information

### 3. **Educational Components**
   Educational components (FeatureIntroduction, EvcExplainer, CalculatorIntroduction) should:
   - Implement the Educational Content Pattern with consistent styling
   - Balance information completeness with cognitive load
   - Use progressive disclosure for detailed explanations
   - Maintain consistent tone and terminology across all educational content
   - Consider context of use when determining information density

---

For component-specific design decisions and implementation details, refer to the individual component documentation files linked in the Customer Journey Phases section.