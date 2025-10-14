# Development Patterns

## Component Architecture Patterns

### Safe Feature Removal Pattern
Recent journey functionality removal demonstrated key patterns for safe feature elimination:

```javascript
// Test-driven removal approach
describe('[Journey-Removal] When journey is removed', () => {
  it('should not display journey UI elements', () => {
    // Test implementation
  });
  
  it('should maintain core functionality', () => {
    // Test implementation  
  });
});
```

**Critical Dependencies for Feature Removal:**
1. **Configuration-First**: Clean JSON configs before updating components
2. **Navigation Contexts**: Update both TabContext and RouterContext simultaneously
3. **Component Cascade**: Main app → Navigation contexts → Header → Detail components
4. **Validation**: Ensure core functionality remains intact

### Progressive Disclosure Pattern
The application uses a step-by-step guided experience where users can focus on current tasks while maintaining context:

```jsx
// CalculatorApp.jsx - Main flow controller
const [activeStep, setActiveStep] = useState(1);
const [expandedSteps, setExpandedSteps] = useState({
  1: true,  // First step expanded by default
  2: false,
  3: false,
  4: false,
  5: false,
});
```

### State Management Pattern
Central state management using custom hooks with context providers:

```jsx
// useCalculator.js - Central state management
const useCalculator = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState('balanced');
  const [productionCapacity, setProductionCapacity] = useState('roadster');
  
  // Calculations and business logic
  const calculateTotalPrice = useCallback(() => {
    // Complex pricing calculations
  }, [selectedModules, resourceAllocation, productionCapacity]);
  
  return {
    // State and actions
    selectedModules,
    setSelectedModules,
    calculateTotalPrice
  };
};
```

### Context Provider Pattern
Cross-component state sharing with React Context:

```jsx
// TabContext.js - Tab state management
const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};
```

## Routing Architecture

### URL State Management
Recent enhancement for browser navigation support:

```jsx
// App.js - Route configuration
<Routes>
  <Route path="/" element={<CalculatorApp />} />
  <Route path="/calculator" element={<CalculatorApp />} />
  <Route path="/modules" element={<CalculatorApp />} />
  <Route path="/modules/:slug" element={<ModuleDetailPage />} />
  <Route path="/journey" element={<CalculatorApp />} />
  <Route path="*" element={<CalculatorApp />} />
</Routes>
```

### Module Detail Routing
Direct linking to specific modules with URL parameters:

```jsx
// ModuleDetailPage.jsx - Dynamic module routing
const { slug } = useParams();
const module = modulesConfig.modules.find(m => m.id === slug);
```

## Configuration Management

### JSON-Based Configuration
Flexible configuration system using JSON files:

```javascript
// Configuration structure
src/config/
├── modulesConfig.json      # Service modules and variants
├── calculatorConfig.json   # Pricing logic and EVC calculations
├── calculatorPresets.json  # Pre-configured scenarios
└── exportConfig.json       # PDF generation settings
```

### Module Configuration Pattern
Structured module definitions with variants:

```json
{
  "name": "Leading Change",
  "pillar": "Transformation",
  "category": "Immediate Impact",
  "variants": [
    {
      "type": "Insight Primer",
      "evcValue": 10,
      "description": "Fixed-scope engagement"
    },
    {
      "type": "Integrated Execution", 
      "evcValue": 40,
      "description": "Continuous service model"
    }
  ]
}
```

## Component Communication Patterns

### Props Down, Events Up
Standard React data flow pattern:

```jsx
// Parent component passes data down
<ModuleSelector 
  calculator={calculator}
  onModuleToggle={handleModuleToggle}
/>

// Child component sends events up
const handleModuleToggle = (moduleId) => {
  onModuleToggle(moduleId);
};
```

### Hook-Based State Sharing
Custom hooks for shared functionality:

```jsx
// Multiple components use the same hook
const ModuleSelector = () => {
  const { savedModules, toggleSaveModule } = useCalculator();
  // Component logic
};

const ModuleExplorer = () => {
  const { savedModules, toggleSaveModule } = useCalculator();
  // Component logic
};
```

## Performance Optimization Patterns

### Lazy Loading Pattern
Dynamic imports for heavy components:

```jsx
// Lazy load PDF generation
const generateModulePdf = async (moduleData) => {
  const { generatePdf } = await import('./pdf');
  return generatePdf(moduleData);
};
```

### Memoization Pattern
Prevent unnecessary re-renders:

```jsx
// React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>;
});

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

## Error Handling Patterns

### Graceful Degradation
Handle missing data gracefully:

```jsx
// Safe module access with fallbacks
const module = modulesConfig.modules.find(m => m.id === slug);
if (!module) {
  return <ModuleNotFound />;
}
```

### Environment-Based Features
Feature flags for different environments:

```jsx
// environment.js - Environment detection
export const ENV = process.env.VITE_ENV || 'development';
export const DEBUG = process.env.VITE_DEBUG === 'true';

export const FEATURES = {
  showDebugInfo: DEBUG,
  detailedLogging: DEBUG,
  showEnvironmentBadge: !isProduction || DEBUG
};
```

## Testing Patterns

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

### Component Testing
React Testing Library for component tests:

```jsx
// ModuleDetailPage.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModuleDetailPage from './ModuleDetailPage';

test('renders module detail page', () => {
  render(
    <BrowserRouter>
      <ModuleDetailPage />
    </BrowserRouter>
  );
  expect(screen.getByText(/module details/i)).toBeInTheDocument();
});
```

### Integration Testing
Full user flow testing:

```jsx
// ModuleRouting.integration.test.js
test('navigates to module detail page', async () => {
  render(<App />);
  
  const moduleLink = screen.getByText('Leading Change');
  fireEvent.click(moduleLink);
  
  await waitFor(() => {
    expect(screen.getByText(/transformation/i)).toBeInTheDocument();
  });
});
```

## Build Optimization Patterns

### Manual Chunk Splitting
Optimize bundle loading:

```javascript
// vite.config.js - Manual chunks
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      router: ['react-router-dom'],
      fontawesome: ['@fortawesome/fontawesome-svg-core'],
      pdf: ['@react-pdf/renderer']
    }
  }
}
```

### Asset Optimization
Efficient asset handling:

```javascript
// Static assets in public directory
public/
├── images/           # Optimized images
├── icons/           # Icon assets
└── manifest.json    # PWA manifest
```
