# Development Standards

## Code Style & Quality

### React & JavaScript Standards

- Use modern React with functional components and hooks (React 18.2+)
- Prefer explicit prop types and JSDoc comments for component documentation
- Use ES6+ features consistently (arrow functions, destructuring, template literals)
- Follow naming conventions: PascalCase for components, camelCase for functions/variables
- Always define PropTypes or TypeScript interfaces for component props
- Use meaningful variable and function names that describe their purpose
- Implement proper error boundaries and error handling

### Component Architecture

- **React Components**: Use `.jsx` extension for components with JSX, place in `src/components/`
- **Custom Hooks**: Extract reusable logic into custom hooks, place in `src/hooks/`
- **Context Providers**: Use React Context for cross-component state, place in `src/contexts/`
- **Utility Functions**: Pure functions for calculations and helpers in `src/utils/`
- **Configuration**: JSON-based configuration files in `src/config/`
- **PDF Generation**: React-PDF components in `src/pdf/`

### Styling Guidelines

- Use Tailwind utility classes primarily with custom Elexive brand colors
- Custom CSS only when necessary in component-specific CSS files
- Follow mobile-first responsive design approach
- Use Elexive brand colors: `elx-primary`, `elx-accent`, `elx-secondary`, `elx-bg`, `elx-evc`
- Avoid inline styles - use Tailwind classes for maintainability
- Use CSS custom properties for dynamic styling when needed
- Implement consistent spacing and typography scales

## Feature Removal Standards

### Safe Feature Removal Process

When removing major features from the calculator:

1. **Test-First Approach**: Write tests defining expected behavior after removal
2. **Configuration Cleanup**: Remove feature data from JSON configs before touching components
3. **Component Cascade**: Update components in dependency order:
   - Main app component (`CalculatorApp.jsx`)
   - Navigation contexts (`TabContext.js`, `RouterContext.js`)
   - Header and routing (`Header.jsx`, `App.js`)
   - Detail components (`ModuleDetails.jsx`, `ModuleDetailPage.jsx`)
4. **Verification**: Ensure core functionality remains intact

### Configuration-Component Coupling

**Critical Pattern**: Components are tightly coupled to configuration structure:
- Changes to `modulesConfig.json` require coordinated component updates
- Missing configuration properties cause runtime errors
- Always validate configuration changes with component tests

## State Management Standards

### Calculator State Architecture

- **Central Hook**: Use `useCalculator` hook for all calculator-related state management
- **Context Providers**: Implement context for cross-component state (TabContext)
- **Local Storage**: Persist user configurations and saved modules
- **Real-time Updates**: Ensure immediate feedback on user interactions
- **State Normalization**: Keep state flat and normalized for performance

### State Management Patterns

```javascript
// Custom Hook Pattern
const useCalculator = () => {
  const [state, setState] = useState(initialState);
  
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  return { state, updateState };
};

// Context Provider Pattern
const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};
```

### Data Flow Guidelines

- Props flow down, events flow up
- Use callback functions for child-to-parent communication
- Implement proper dependency arrays in useEffect hooks
- Avoid prop drilling - use context for deeply nested state
- Keep component state local when possible

### Test-Driven Development Insights

**Journey Removal Learning**: TDD proved essential for safe feature removal:
- Tests defined expected behavior before implementation
- Caught configuration-component mismatches early
- Verified core functionality preservation throughout process
- Enabled confident refactoring of tightly coupled components

**Testing Pattern for Feature Changes**:
```javascript
// Define expected behavior first
describe('[Feature-Removal] When feature is removed', () => {
  it('should not display feature UI elements', () => {
    // Test implementation
  });
  
  it('should maintain core functionality', () => {
    // Test implementation  
  });
});
```

## File Organization

### Directory Structure

```
src/
├── components/     # React components (16+ components)
│   ├── Header.jsx
│   ├── CalculatorIntroduction.jsx
│   ├── ModuleSelector.jsx
│   └── ...
├── hooks/          # Custom React hooks
│   └── useCalculator.js
├── contexts/       # React Context providers
│   └── TabContext.js
├── config/         # JSON configuration files
│   ├── modulesConfig.json
│   ├── calculatorConfig.json
│   └── calculatorPresets.json
├── pdf/            # PDF generation components
├── utils/          # Utility functions
├── helpers/        # Helper functions
└── styles/         # CSS files (App.css, custom.css)
```

### Naming Conventions

- Components: PascalCase (`CalculatorIntroduction.jsx`, `ModuleSelector.jsx`)
- Files: camelCase for JavaScript, kebab-case for CSS
- Directories: camelCase
- Constants: UPPER_SNAKE_CASE
- Configuration files: camelCase with descriptive names

## Configuration Standards

### JSON Configuration Structure

- **modulesConfig.json**: Service modules, variants, and pillar definitions
- **calculatorConfig.json**: Pricing logic, EVC base prices, and service parameters
- **calculatorPresets.json**: Pre-configured scenarios for common use cases
- **exportConfig.json**: PDF generation and export settings

### Configuration Guidelines

```json
{
  "modules": {
    "moduleId": {
      "title": "Module Title",
      "description": "Clear description",
      "pillar": "Strategy|Transformation|Technology",
      "variants": {
        "insight-primer": { "evcValue": 10 },
        "integrated-execution": { "evcValue": 40 }
      }
    }
  }
}
```

- Use consistent naming conventions across all config files
- Include comprehensive descriptions for user-facing content
- Maintain backward compatibility when updating configurations
- Validate configuration structure on application startup

## Performance Standards

### React Performance Optimization

- Use React.memo for expensive components that re-render frequently
- Implement proper dependency arrays in useEffect and useCallback
- Avoid creating objects/functions in render methods
- Use lazy loading for heavy components (React.lazy)
- Optimize re-renders with useMemo for expensive calculations

### Bundle Optimization

- Keep components focused and single-purpose
- Use dynamic imports for code splitting where appropriate
- Minimize bundle size by avoiding unnecessary dependencies
- Implement proper tree shaking for unused code
- Monitor bundle size with build analysis tools

### User Experience Performance

- Implement loading states for async operations
- Provide immediate feedback for user interactions
- Use optimistic updates where appropriate
- Implement proper error handling and recovery
- Ensure smooth animations and transitions

## Component Standards

### Calculator Components

- **CalculatorIntroduction**: Onboarding and intent selection with animated elements
- **OnboardingQuiz**: Interactive assessment with progress tracking
- **ModuleSelector**: Service module selection with real-time pricing
- **ResourceAllocationSelector**: Team configuration with visual feedback
- **ProductionCapacitySelector**: Capacity planning with slider controls
- **ServiceParameters**: Fine-tuning options with contextual help
- **SummarySidebar**: Real-time pricing summary with breakdown details

### Interactive Component Patterns

```jsx
// Component with proper state management
const ModuleSelector = ({ calculator }) => {
  const [selectedModules, setSelectedModules] = useState([]);
  
  const handleModuleToggle = useCallback((moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  }, []);
  
  return (
    <div className="module-selector">
      {/* Component JSX */}
    </div>
  );
};
```

### Accessibility Standards

- Ensure WCAG 2.1 AA compliance minimum
- Use semantic HTML elements throughout
- Implement proper ARIA labels and roles
- Provide keyboard navigation support
- Include focus management for modal dialogs
- Respect `prefers-reduced-motion` settings

## Testing Standards

### Component Testing

- Write unit tests for all custom hooks
- Test component rendering and user interactions
- Mock external dependencies and API calls
- Use React Testing Library for component tests
- Maintain test coverage above 80% for critical paths

### Integration Testing

- Test complete user flows through the calculator
- Verify state management across components
- Test PDF generation and export functionality
- Validate configuration loading and parsing
- Test responsive design across device sizes

## Error Handling Standards

### Error Boundaries

```jsx
class CalculatorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Calculator Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Error Handling Patterns

- Implement graceful degradation for non-critical features
- Provide clear error messages to users
- Log errors for debugging and monitoring
- Use try-catch blocks for async operations
- Implement retry mechanisms for transient failures

## Environment & Deployment Standards

### Environment Configuration

- Use environment variables for configuration
- Implement environment-specific feature flags
- Provide development vs production builds
- Include debug mode for development
- Support multiple deployment environments

### Build & Deployment

- Use Create React App build system
- Implement proper asset optimization
- Configure Netlify deployment with redirects
- Use environment variables for sensitive configuration
- Implement proper caching strategies

### Code Quality Tools

- ESLint configuration for React and modern JavaScript
- Prettier for consistent code formatting
- Husky for pre-commit hooks
- Jest for unit testing
- React Testing Library for component testing
