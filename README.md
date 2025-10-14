# Elexive Pricing Calculator

## Overview

The Elexive Pricing Calculator is an interactive web tool designed to help potential clients configure and price Elexive's management consulting services. This B2C-style calculator simplifies the complex decision-making process for B2B consulting services by providing transparency, personalization, and immediate value across our three service pillars: Transformation, Strategy, and Technology.

## Purpose

This tool accelerates the sales cycle by empowering prospects to self-educate and explore service options before engaging with our sales team. It offers transparent pricing, clear deliverables, and helps executives build confidence in their consulting decisions while providing a frictionless pathway to conversion.

For a detailed strategic vision of how this tool drives sales and enhances the customer journey, see our [strategic plan](./resources/plan.md).

## Technology Stack

- **React 19** - Latest React with modern features
- **Vite 7** - Ultra-fast build tool and development server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **FontAwesome 7** - Modern icon library
- **React Router 6** - Client-side routing
- **React PDF Renderer** - PDF generation
- **Vitest** - Fast unit testing
- **ESLint + Prettier** - Code quality and formatting
- **Husky + lint-staged** - Pre-commit quality gates

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/elexive-com/elexive-calc.git

# Install dependencies
cd elexive-calc
npm install

# Start development server
npm start
```

### Available Scripts

```bash
# Development
npm start          # Start Vite dev server (fast HMR)
npm run dev        # Alias for npm start

# Building
npm run build      # Production build
npm run preview    # Preview production build

# Testing
npm test           # Run tests once and exit
npm run test:watch # Run tests in watch mode

# Code Quality
npm run lint       # Check code with ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier
npm run format:check # Check if code is formatted
```

### Development Workflow

1. **Code Quality**: ESLint and Prettier are configured for consistent code style
2. **Pre-commit Hooks**: Husky runs linting and formatting before commits
3. **Fast Development**: Vite provides instant hot module replacement
4. **Type Safety**: Modern JavaScript with comprehensive linting rules

## Environment Configuration

The application uses environment variables to control behavior:

- `VITE_ENV`: Environment (`development` or `production`)
- `VITE_DEBUG`: Debug mode (`true` or `false`)

### Local Development

Create a `.env.local` file:

```bash
# Development environment with debug enabled
VITE_ENV=development
VITE_DEBUG=true
```

### Production Deployment

Environment variables can be configured in your deployment platform:
- `VITE_ENV=production` for production builds
- `VITE_DEBUG=false` to disable debug features

## Project Structure

```
/src
├── components/     # React components
├── config/        # JSON configuration files
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── pdf/           # PDF generation components
├── contexts/      # React contexts
└── helpers/       # Helper utilities

/resources         # Documentation
/public           # Static assets
```

## Build Performance

- **Development**: ~95ms startup time
- **Production Build**: ~2.5s build time
- **Bundle Size**: Optimized with code splitting
  - Main bundle: ~140KB gzipped
  - Vendor chunks: Separate for better caching
  - PDF renderer: Lazy-loaded for performance

## Code Quality Standards

- **ESLint**: Modern configuration with React and accessibility rules
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Automatic linting and formatting
- **Testing**: Vitest for fast unit tests

## Deployment

This project is deployed on Netlify with continuous deployment from GitHub. The build configuration is optimized for modern browsers with automatic polyfills.

## Documentation

Each major component is documented in the `/resources` directory with implementation details and enhancement opportunities.
For contributor onboarding and workflow guardrails, see [AGENTS.md](./AGENTS.md).

## License

[MIT License with Commons Clause](LICENSE) - Allows viewing and forking but restricts commercial use without permission.

## Contact

For questions or commercial licensing inquiries: [sales@elexive.com](mailto:sales@elexive.com)
