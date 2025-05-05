# Elexive Pricing Calculator

## Overview

The Elexive Pricing Calculator is an interactive web tool designed to help potential clients configure and price Elexive's management consulting services. This B2C-style calculator simplifies the complex decision-making process for B2B consulting services by providing transparency, personalization, and immediate value across our three service pillars: Transformation, Strategy, and Technology.

## Purpose

This tool accelerates the sales cycle by empowering prospects to self-educate and explore service options before engaging with our sales team. It offers transparent pricing, clear deliverables, and helps executives build confidence in their consulting decisions while providing a frictionless pathway to conversion.

For a detailed strategic vision of how this tool drives sales and enhances the customer journey, see our [strategic plan](./resources/plan.md).

## Project Structure

- `/src`: Core application code
  - `/components`: React components for each section of the calculator
  - `/config`: JSON configuration files for calculator options and presets
  - `/hooks`: Custom React hooks including the core useCalculator hook
  - `/utils`: Utility functions for icon management and calculations

- `/resources`: Comprehensive documentation for each component
  - Component-specific markdown files explaining purpose and implementation
  - `plan.md`: Strategic vision and customer journey documentation

- `/public`: Static assets and entry point HTML

## Technology Stack

- React (Create React App)
- TailwindCSS for styling
- Progressive Web App capabilities
- JSON-based configuration for easy updates
- FontAwesome for iconography

## Environment Configuration

The application uses environment variables to control environment-specific behavior:

- `VITE_ENV`: Specifies the environment (`development` or `production`)
- `VITE_DEBUG`: Enables/disables debug mode (`true` or `false`)

### Environment Indicators

- Development builds display an environment badge (DEV)
- Production builds hide the badge by default
- Debug logs are only shown when `VITE_DEBUG=true` or in development mode

### Local Development

Create a `.env.local` file in the root directory with your environment variables:

```bash
# Development environment with debug enabled
VITE_ENV=development
VITE_DEBUG=true
```

### Netlify Configuration

Environment variables can be configured in the Netlify dashboard:
1. Go to Site settings > Build & deploy > Environment
2. Add variables:
   - `VITE_ENV=production` for production sites
   - `VITE_DEBUG=false` to disable debug features
   - Optional: Set `VITE_DEBUG=true` for staging environments

## Deployment

This project is deployed on Netlify using continuous deployment from the GitHub repository. The `netlify.toml` file contains the configuration for the deployment process, including build settings and redirect rules.

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/elexive-calc.git

# Install dependencies
cd elexive-calc
npm install

# Start development server
npm start
```

### Build

```bash
# Create production build
npm run build
```

## Documentation

Each major component is thoroughly documented in the `/resources` directory. These markdown files explain the purpose, implementation details, and future enhancement opportunities for each part of the calculator.

## License

[MIT License with Commons Clause](LICENSE) - This project is licensed under MIT with Commons Clause, which allows for viewing and forking the code but restricts commercial use of the software without permission.

## Contact

For questions or inquiries, or licensing for commercial use, please contact [sales@elexive.com](mailto:sales@elexive.com).
