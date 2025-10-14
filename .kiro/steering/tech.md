# Technology Stack

## Core Framework

- **React 18.2+**: Modern React with functional components, hooks, and concurrent features
- **Create React App**: Zero-configuration build setup with optimized production builds
- **JavaScript ES6+**: Modern JavaScript features with Babel transpilation
- **TailwindCSS 3.3+**: Utility-first CSS framework with custom Elexive brand colors
- **Progressive Web App**: Service worker integration for offline capability and performance

## Key Libraries

- **@react-pdf/renderer 3.4+**: Client-side PDF generation for professional proposals
- **@fortawesome/react-fontawesome**: Icon system with FontAwesome integration
- **file-saver**: Client-side file download functionality
- **web-vitals**: Performance monitoring and Core Web Vitals tracking

## Build System & Optimization

- **Node.js 18+**: Runtime environment for development and build processes
- **Webpack 5**: Module bundling with code splitting and optimization (via CRA)
- **Babel**: JavaScript transpilation with modern syntax support
- **PostCSS**: CSS processing with Autoprefixer and TailwindCSS
- **ESLint**: Code linting with React and modern JavaScript rules
- **Service Worker**: Caching and offline functionality for PWA features

## Development Tools

- **React Developer Tools**: Browser extension for React debugging
- **TailwindCSS IntelliSense**: VS Code extension for utility class autocomplete
- **Hot Module Replacement**: Fast development with instant updates
- **Source Maps**: Debugging support in development builds

## Project Structure

```
src/
├── components/         # React components (16+ components)
│   ├── Header.jsx
│   ├── CalculatorIntroduction.jsx
│   ├── ModuleSelector.jsx
│   ├── ResourceAllocationSelector.jsx
│   ├── ProductionCapacitySelector.jsx
│   ├── ServiceParameters.jsx
│   ├── SummarySidebar.jsx
│   ├── ModuleExplorer.jsx
│   ├── JourneyPlanner.jsx
│   ├── DetailedReportModal.jsx
│   └── ...
├── hooks/              # Custom React hooks
│   └── useCalculator.js
├── contexts/           # React Context providers
│   └── TabContext.js
├── config/             # JSON configuration files
│   ├── modulesConfig.json
│   ├── calculatorConfig.json
│   ├── calculatorPresets.json
│   ├── exportConfig.json
│   └── environment.js
├── pdf/                # PDF generation components
├── utils/              # Utility functions
├── helpers/            # Helper functions
├── styles/             # CSS files
│   ├── App.css
│   ├── custom.css
│   └── index.css
└── assets/             # Static assets (handled by CRA)
```

## Common Commands

```bash
# Development
npm start              # Start development server (localhost:3000)
npm run build          # Production build with optimizations
npm run test           # Run test suite with Jest
npm run eject          # Eject from CRA (not recommended)

# Code Quality
npm run lint           # ESLint checking (if configured)
npm run format         # Prettier formatting (if configured)

# Deployment
npm run build          # Build for production
npm run preview        # Preview production build locally
```

## Performance Features

- **Code Splitting**: Automatic chunk splitting with React.lazy and Suspense
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Asset Optimization**: Image compression and format optimization
- **Caching Strategy**: Service worker caching for static assets
- **Progressive Loading**: Lazy loading for non-critical components
- **Real-time Updates**: Optimized state management for immediate feedback

## Deployment

- **Netlify**: Static hosting with continuous deployment from Git
- **Build Configuration**: Custom `netlify.toml` with SPA redirects
- **Environment Variables**: Production configuration through Netlify dashboard
- **Performance Monitoring**: Built-in analytics and Core Web Vitals tracking
- **CDN**: Global content delivery for optimal loading times

## State Management Architecture

### Custom Hook Pattern

```javascript
// useCalculator.js - Central state management
const useCalculator = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState('balanced');
  const [productionCapacity, setProductionCapacity] = useState('roadster');
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Calculations and business logic
  const calculateTotalPrice = useCallback(() => {
    // Complex pricing calculations
  }, [selectedModules, resourceAllocation, productionCapacity]);
  
  return {
    // State
    selectedModules,
    resourceAllocation,
    productionCapacity,
    totalPrice,
    // Actions
    setSelectedModules,
    setResourceAllocation,
    setProductionCapacity,
    // Computed values
    calculateTotalPrice
  };
};
```

### Context Provider Pattern

```javascript
// TabContext.js - Cross-component state
const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within TabProvider');
  }
  return context;
};
```

## Component Architecture Standards

### Calculator Flow Components

Each major step in the calculator flow is implemented as a focused component:

1. **CalculatorIntroduction**: Intent selection and onboarding
2. **OnboardingQuiz**: User needs assessment
3. **ModuleSelector**: Service module configuration
4. **ResourceAllocationSelector**: Team structure planning
5. **ProductionCapacitySelector**: Timeline and capacity planning
6. **ServiceParameters**: Fine-tuning and customization
7. **SummarySidebar**: Real-time pricing and summary

### Component Dependency Patterns

**Critical Discovery**: Components have tight coupling to configuration structure. When removing features:

- **Configuration-First Approach**: Always clean `modulesConfig.json` before updating components
- **Cascading Dependencies**: Changes to config structure require updates across multiple components:
  - `CalculatorApp.jsx` (main orchestrator)
  - `ModuleDetails.jsx` and `ModuleDetailPage.jsx` (detail views)
  - PDF generation components
- **Test-Driven Validation**: Essential for catching configuration-component mismatches

### Navigation Architecture Insights

**Key Discovery**: Navigation system uses dual-context pattern:
- **TabContext**: Manages active tab state and browser history integration
- **RouterContext**: Provides navigation utilities and path mappings

**Critical Dependencies**:
- Both contexts must be updated simultaneously when adding/removing routes
- Path mappings in both contexts must stay synchronized
- Header component depends on both contexts for navigation state

**Route Structure**:
```javascript
// Simplified after journey removal
const routes = {
  '/': 'introduction',
  '/calculator': 'calculator', 
  '/modules': 'modules',
  '/modules/:slug': 'module-detail'
};
```

### Interactive Component Patterns

```jsx
// Standard component structure
const ComponentName = ({ calculator, onUpdate }) => {
  const [localState, setLocalState] = useState(initialValue);
  
  const handleChange = useCallback((value) => {
    setLocalState(value);
    onUpdate(value);
  }, [onUpdate]);
  
  useEffect(() => {
    // Side effects and cleanup
  }, [dependencies]);
  
  return (
    <div className="component-container">
      {/* Component JSX with Tailwind classes */}
    </div>
  );
};

export default ComponentName;
```

### PDF Generation Architecture

```javascript
// PDF component structure using @react-pdf/renderer
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const ProposalDocument = ({ calculatorData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Elexive Consulting Proposal</Text>
        {/* Dynamic content based on calculator configuration */}
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF' },
  section: { margin: 10, padding: 10, flexGrow: 1 }
});
```

## Configuration System

### JSON-Based Configuration

The application uses a flexible JSON-based configuration system:

- **modulesConfig.json**: Service modules, variants, and pillar definitions
- **calculatorConfig.json**: Pricing logic, EVC calculations, and business rules
- **calculatorPresets.json**: Pre-configured scenarios for common use cases
- **environment.js**: Environment-specific settings and feature flags

### Configuration Loading Pattern

```javascript
// Configuration import and usage
import modulesConfig from '../config/modulesConfig.json';
import calculatorConfig from '../config/calculatorConfig.json';

const { modules, variantDefinitions } = modulesConfig;
const { evcBase, serviceParameters } = calculatorConfig;

// Use configuration in components
const calculatePrice = (selectedModules) => {
  return selectedModules.reduce((total, moduleId) => {
    const module = modules[moduleId];
    return total + (module.basePrice * evcBase.basePrice);
  }, 0);
};
```

## Environment Configuration

### Development vs Production

```javascript
// environment.js - Environment detection and configuration
export const ENV = process.env.REACT_APP_ENV || 
                  (window.location.hostname === 'localhost' ? 'development' : 'production');

export const DEBUG = process.env.REACT_APP_DEBUG === 'true' || ENV === 'development';

export const FEATURES = {
  showDebugInfo: DEBUG,
  detailedLogging: DEBUG,
  showEnvironmentBadge: !isProduction || DEBUG
};
```

### Build Configuration

```javascript
// package.json scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Performance Optimization Strategies

### React Performance

- **React.memo**: Prevent unnecessary re-renders of expensive components
- **useCallback**: Memoize event handlers and functions
- **useMemo**: Memoize expensive calculations
- **Code Splitting**: Dynamic imports for large components

### Bundle Optimization

- **Tree Shaking**: Remove unused code from final bundle
- **Asset Optimization**: Compress images and optimize static assets
- **Lazy Loading**: Load components only when needed
- **Service Worker**: Cache static assets for faster subsequent loads

### User Experience

- **Progressive Enhancement**: Core functionality works without JavaScript
- **Loading States**: Provide feedback during async operations
- **Error Boundaries**: Graceful error handling and recovery
- **Responsive Design**: Optimal experience across all device sizes

## Security Considerations

- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Proper escaping of dynamic content
- **HTTPS Only**: Secure communication in production
- **Content Security Policy**: Prevent code injection attacks
- **Environment Variables**: Secure handling of sensitive configuration
