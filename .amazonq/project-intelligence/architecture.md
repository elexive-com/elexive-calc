# Technical Architecture

## Technology Stack

### Core Framework
- **React 19.1.1**: Latest React with modern features and concurrent rendering
- **Vite 7.1.0**: Ultra-fast build tool and development server
- **React Router 6.30.1**: Client-side routing with URL state management
- **JavaScript ES6+**: Modern JavaScript with JSX support

### Styling & UI
- **TailwindCSS 3.4.17**: Utility-first CSS framework with custom Elexive brand colors
- **FontAwesome 7.0.0**: Modern icon system with React integration
- **PostCSS**: CSS processing with Autoprefixer and TailwindCSS

### Key Libraries
- **@react-pdf/renderer 4.3.0**: Client-side PDF generation for professional proposals
- **file-saver 2.0.5**: Client-side file download functionality
- **web-vitals 5.1.0**: Performance monitoring and Core Web Vitals tracking

### Development Tools
- **ESLint 9.32.0**: Modern linting with React and accessibility rules
- **Prettier 3.6.2**: Code formatting and consistency
- **Vitest 3.2.4**: Fast unit testing framework
- **Husky 9.1.7**: Git hooks for pre-commit quality gates
- **lint-staged 16.1.4**: Run linters on staged files

## Project Structure

```
src/
├── components/         # React components (20+ components)
│   ├── CalculatorIntroduction.jsx
│   ├── ModuleSelector.jsx
│   ├── ModuleExplorer.jsx
│   ├── JourneyPlanner.jsx
│   ├── SummarySidebar.jsx
│   └── ...
├── hooks/              # Custom React hooks
│   └── useCalculator.js
├── contexts/           # React Context providers
│   ├── TabContext.js
│   └── RouterContext.js
├── config/             # JSON configuration files
│   ├── modulesConfig.json
│   ├── calculatorConfig.json
│   ├── calculatorPresets.json
│   └── exportConfig.json
├── pdf/                # PDF generation components
├── utils/              # Utility functions
├── helpers/            # Helper functions
└── styles/             # CSS files
```

## State Management Architecture

### Custom Hook Pattern
- **useCalculator**: Central state management for all calculator functionality
- **Local Storage**: Persistent configurations and saved modules
- **Real-time Updates**: Immediate feedback on user interactions

### Context Providers
- **TabContext**: Cross-component tab state management
- **RouterContext**: URL routing and navigation state

### Component Architecture
- **Progressive Disclosure**: Step-by-step guided experience
- **Modular Design**: Focused, single-purpose components
- **Responsive Layout**: Mobile-first design approach

## Build & Performance

### Vite Configuration
- **Fast HMR**: Instant hot module replacement in development
- **Code Splitting**: Automatic chunk splitting for optimal loading
- **Bundle Optimization**: Manual chunks for vendor libraries
- **Source Maps**: Debugging support in development

### Performance Features
- **Lazy Loading**: Dynamic imports for heavy components
- **Asset Optimization**: Image compression and format optimization
- **Service Worker**: PWA capabilities with offline support
- **Bundle Analysis**: Optimized vendor chunks (React, Router, FontAwesome, PDF)

## Deployment Architecture

### Netlify Deployment
- **Static Hosting**: Optimized for SPA deployment
- **Continuous Deployment**: Automatic builds from Git
- **Environment Variables**: Production configuration
- **SPA Redirects**: Proper routing for client-side navigation

### Environment Configuration
- **Development**: Local development with debug features
- **Production**: Optimized builds with performance monitoring
- **Feature Flags**: Environment-specific functionality

## Recent Technical Improvements

### URL Routing Enhancement (Latest Updates)
- **Browser Navigation**: Full support for back/forward buttons
- **Direct Module URLs**: Deep linking to specific modules
- **URL State Management**: Persistent state across page refreshes
- **Module Detail Pages**: Dedicated routes for module exploration

### Module Organization
- **Pillar Grouping**: Modules organized by Strategy, Transformation, Technology
- **Brand Consolidation**: Streamlined brand modules for better UX
- **AI Integration**: Added Pragmatic AI module for modern consulting needs

## Code Quality Standards

### Linting & Formatting
- **ESLint**: React, JSX, and accessibility rules
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Automatic quality checks

### Testing Strategy
- **Vitest**: Fast unit testing with JSX support
- **React Testing Library**: Component testing best practices
- **Integration Tests**: Module routing and navigation testing

## Performance Metrics

### Build Performance
- **Development Startup**: ~95ms with Vite
- **Production Build**: ~2.5s build time
- **Bundle Size**: Optimized with code splitting
  - Main bundle: ~140KB gzipped
  - Vendor chunks: Separate for better caching
  - PDF renderer: Lazy-loaded for performance
