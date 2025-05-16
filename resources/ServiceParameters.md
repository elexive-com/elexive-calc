# ServiceParameters Component

> **Status**: Implemented  
> **Last Updated**: May 16, 2025  
> **AI Keywords**: service parameters, payment options, billing, delivery, configuration, preferences

## Overview

The ServiceParameters component allows users to configure additional service-related settings that affect pricing, billing, and delivery options for their business transformation initiative. It provides an interface for selecting payment options and toggling various service-specific parameters, serving as a refinement mechanism in the "Strategic Optimization" phase of the customer journey.

> **Note:** This component adheres to the [Elexive Solution Builder Design Guidelines](./DesignGuidelines.md) for visual design, interaction patterns, and customer journey integration.

## Strategic Purpose

The ServiceParameters addresses several key customer needs identified in our research:

1. **Financial Flexibility**: By providing multiple payment options with transparent pricing implications
2. **Service Customization**: By allowing fine-tuning of delivery parameters to match business constraints
3. **Value Optimization**: By enabling adjustment of service elements to maximize ROI
4. **Control Enhancement**: By providing granular configuration options for the consulting engagement
5. **Business Relationship Management**: By offering dedicated support and service level options

## Core Functionality

1. **Payment Option Selection**
   - Presents multiple payment methods (Pay-As-You-Go, Reserved EVCs, Annual Contract)
   - Each option has different pricing implications and discount structures
   - Provides clear financial context for each payment approach
   - Updates pricing calculations based on selected payment method
   
2. **Service Parameter Toggles**
   - Offers configurable options for service delivery aspects
   - Includes dedicated account management, premium support, and other enhancements
   - Each toggle has clear descriptions of service implications
   - Updates pricing and service terms based on selected parameters

3. **Discount Application**
   - Calculates and displays applicable discounts based on payment selection
   - Provides transparent indication of cost savings
   - Creates clear connection between payment choice and financial benefits
   - Updates in real-time as users change payment options

4. **Configuration Integration**
   - Combines with other calculator selections to create complete service profile
   - Maintains consistent state across calculator interactions
   - Provides appropriate defaults based on other selections
   - Creates coherent service configuration for pricing and proposal output

## Component-Specific Design Decisions

### Payment Option Design

This component implements the [Visual Selection Feedback Standards](./DesignGuidelines.md#visual-selection-feedback-standards) with these specific adaptations for payment selection:

1. **Option Presentation** - Financial option selection approach:
   - Uses clear, distinctive styling for each payment option
   - Implements obvious visual feedback for the selected option
   - Provides immediate indication of financial implications (discounts)
   - Creates appropriate context for understanding payment terms

2. **Financial Transparency** - Cost implication visualization:
   - Shows explicit discount percentages for eligible payment options
   - Uses consistent formatting for financial information
   - Provides clear visual connection between selection and pricing impact
   - Implements appropriate typography for financial figures

### Reserved EVC Option

The Reserved EVC option (formerly "Prepaid EVCs") follows a similar concept to how cloud computing resources are reserved in advance:

1. **Reserved Capacity Model**
   - Allocates Elastic Value Credits (EVC) capacity in advance for the transformation initiative
   - Provides cost efficiency through upfront commitment
   - Ensures resource availability throughout the engagement
   - Follows industry-standard approach similar to cloud computing reserved instances

2. **Business Value Proposition**
   - Offers predictable pricing for budget planning
   - Provides cost savings through discount incentives
   - Ensures capacity is guaranteed for mission-critical initiatives
   - Simplifies financial planning and approval processes

### Parameter Toggle Design

The parameter toggle controls balance several competing needs:

1. **Toggle Control Design** - The interactive elements:
   - Implements accessible toggle switches with clear state indicators
   - Uses consistent sizing and spacing for optimal usability
   - Provides appropriate visual feedback for interaction states
   - Creates clear distinction between enabled and disabled parameters

2. **Information Architecture** - The parameter organization:
   - Groups related parameters into logical categories
   - Creates clear visual separation between parameter groups
   - Implements consistent labeling and description patterns
   - Provides appropriate spacing for optimal readability

## Technical Implementation

### Props

- `serviceParams`: Object containing the current service parameters
- `setServiceParams`: Function to update service parameters
- `paymentOption`: String representing the currently selected payment option
- `setPaymentOption`: Function to update payment option
- `calculator`: Object containing the current calculator state
- `updateCalculator`: Function to update calculator with new service parameters

### Component Structure

1. **Payment Options Section**
   - Radio button group for payment method selection
   - Visual indicators for discount percentages
   - Clear labels and descriptions for each payment option
   - Visual feedback for the selected option

2. **Service Parameter Toggles**
   - Toggle switches for various service options
   - Descriptive text explaining each parameter
   - Logical grouping of related parameters
   - Appropriate spacing and visual hierarchy

3. **Section Organization**
   - Clear section headings with appropriate typography
   - Visual separation between different parameter groups
   - Consistent styling with other calculator components
   - Responsive layout for different screen sizes

### Integration Points

- **Calculator Context**: Updates calculator state with service parameters
- **Pricing Summary**: Affects cost calculations based on payment options and parameters
- **DetailedReportModal**: Includes service parameters in detailed pricing breakdown
- **PricingSummary**: Applies appropriate discounts based on payment selection

## Related Components

- [PricingSummary](./PricingSummary.md): Displays cost impact of service parameters
- [SummarySidebar](./SummarySidebar.md): Shows selected service parameters in configuration summary
- [DetailedReportModal](./DetailedReportModal.md): Provides detailed breakdown of service configuration
- [EvcExplainer](./EvcExplainer.md): Provides context for understanding EVC-related parameters
   - Enables users to choose between different payment methods (e.g., standard, prepaid)
   - Each payment option has associated pricing modifiers that affect the total cost
   - Provides clear visual indication of cost implications (discounts) for different payment methods
   - Creates appropriate business context for financial decisions

2. **Additional Parameter Toggles**
   - Presents a list of configurable service parameters as toggle switches
   - Each parameter has a label and description explaining its purpose and impact
   - Maintains state for all parameter selections with visual feedback
   - Groups related parameters into logical categories for better organization

3. **Configuration-Driven Design**
   - Leverages configuration data from `calculatorConfig.json` to define payment options
   - Accepts dynamic service parameters from props to support modularity
   - Implements a responsive design that works across different screen sizes
   - Provides consistent experience regardless of parameter count or configuration

4. **Financial Transparency**
   - Clearly communicates pricing implications of different payment options
   - Shows discount percentages and other financial adjustments
   - Provides contextual explanation of payment terms and conditions
   - Creates appropriate business context for financial decision-making

## Technical Implementation

### Core Functionality

1. **Payment Option Selection**
   - Enables users to choose between different payment methods (e.g., standard, prepaid)
   - Each payment option has associated pricing modifiers that affect the total cost
   - Provides clear visual indication of cost implications (discounts) for different payment methods

2. **Additional Parameter Toggles**
   - Presents a list of configurable service parameters as toggle switches
   - Each parameter has a label and description explaining its purpose and impact
   - Maintains state for all parameter selections with visual feedback

3. **Configuration-Driven Design**
   - Leverages configuration data from `calculatorConfig.json` to define payment options
   - Accepts dynamic service parameters from props to support modularity
   - Implements a responsive design that works across different screen sizes

### Integration with Calculator Logic

The component influences core calculator functionality by:
   - Applying payment option modifiers to overall pricing calculations
   - Adjusting service delivery based on enabled/disabled parameters
   - Potentially affecting resource allocation and delivery timelines

## Service Parameter Options

The ServiceParameters component provides several business-critical parameter options that allow decision-makers to customize their service experience:

### Core Service Parameters

1. **On-site Presence**
   - Provides the option for advisors to work directly on the client's premises
   - Increases resource commitment but accelerates implementation
   - Valuable for clients requiring deep integration with their teams

2. **Premium Market Data**
   - Offers access to specialized industry data sources
   - Improves the quality and depth of strategic insights
   - Essential for data-driven strategic decision making

### Enhanced Business Parameters

3. **Training Sessions** (Added April 2025)
   - Provides comprehensive onboarding and knowledge transfer sessions
   - Ensures effective adoption and capability development within client teams
   - Essential for organizations seeking to build internal capabilities
   - Increases service value with a 10% price modifier

4. **Account Concierge** (Added April 2025)
   - Assigns a dedicated account manager for personalized service
   - Improves continuity and strategic alignment throughout the engagement
   - Provides consistent point of contact for all service-related matters
   - Premium service with a 20% price modifier reflecting the dedicated resource

5. **Premium SLA** (Added April 2025)
   - Offers enhanced response times and service level guarantees
   - Prioritizes client needs and ensures consistent service delivery
   - Critical for business-essential operations requiring guaranteed support
   - Premium service with a 25% price modifier reflecting the heightened commitment

Each parameter is represented with appropriate iconography to enhance visual recognition and includes detailed descriptions of the business value provided.

## Implementation Details

### Props

- `serviceParameters`: Array of parameter objects with configuration details
- `paymentOption`: String representing the currently selected payment option
- `togglePaymentOption`: Function to update the selected payment option
- `parameters`: Object containing the current state of all toggleable parameters
- `updateParameter`: Function to toggle a specific parameter's state

### External Dependencies

1. **Configuration Data**
   - Imports payment option definitions from `calculatorConfig.json`
   - Each payment option contains:
     - `name`: Display name for the payment option
     - `priceModifier`: Numeric factor applied to pricing calculations

2. **Utility Functions**
   - Uses `getDiscountLabel` from `iconUtils.js` to generate human-readable discount labels
   - Formats pricing modifiers as percentage discounts where applicable

### Rendering Logic

1. **Payment Option Section**
   - Maps through available payment options from configuration
   - Applies conditional styling to indicate the selected option
   - Provides contextual help text explaining the implications of the current selection

2. **Parameters Section**
   - Iterates through provided service parameters to create toggle controls
   - Implements binary on/off state for each parameter
   - Displays clear enabled/disabled visual states with appropriate icons

3. **Fallback Handling**
   - Implements safety check for undefined `serviceParameters` prop
   - Provides empty array fallback to ensure component doesn't break if data is missing

## User Experience Considerations

1. **Clear Financial Implications**
   - Explicitly shows discount percentages for payment options
   - Provides contextual explanation of payment terms
   - Uses consistent visual indicators for selections

2. **Informative Parameter Descriptions**
   - Each parameter includes a brief description of its purpose
   - Helps users understand the implications of enabling/disabling features
   - Reduces the need for external documentation

3. **Responsive Controls**
   - Implements appropriately sized touch targets for mobile usability
   - Uses clear visual feedback for interactive elements
   - Maintains consistent spacing and alignment across screen sizes

## Edge Cases and Error Handling

1. **Missing Configuration Data**
   - Implements defensive programming with fallbacks for missing data
   - Prevents rendering errors when parameters are undefined or null

2. **Dynamic Parameter Support**
   - Accommodates variable numbers of service parameters through props
   - Maintains stable rendering regardless of parameter count or order

## Performance Considerations

1. **Minimized Rerenders**
   - Implements clean component structure to reduce unnecessary rerenders
   - Uses button-based toggles instead of input elements to minimize DOM events

2. **Optimized State Management**
   - Maintains parameters as an object for O(1) lookup performance 
   - Updates only the specific parameter being changed rather than the entire state

## Future Enhancement Opportunities

1. **Parameter Dependency Logic**
   - Implement dependencies between parameters (enabling one could affect others)
   - Add validation rules for parameter combinations

2. **Enhanced Payment Options**
   - Expand payment section to include more detailed terms and conditions
   - Add support for custom payment schedules or financing options

3. **Parameter Categories**
   - Group related parameters into logical categories for better organization
   - Implement collapsible sections for advanced parameters

4. **Contextual Recommendations**
   - Provide smart recommendations for parameter settings based on selected modules
   - Highlight optimal configuration based on business goals

5. **Visual Parameter Effects**
   - Add visual representations of how each parameter affects service delivery
   - Provide before/after comparisons when parameters are toggled

6. **Service Bundle Presets**
   - Create predefined parameter bundles for common business needs
   - Offer tiered service levels (Standard, Professional, Enterprise) with appropriate parameter combinations

7. **ROI Calculator Integration**
   - Provide estimates of the business impact for each parameter
   - Show projected ROI improvement based on parameter selections