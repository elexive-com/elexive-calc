# Design Document

## Overview

This design implements direct URL routing for individual modules in the Module Explorer, allowing users to access specific module detail views via URLs like `/modules/{slug}`. The solution extends the existing React Router setup to support parameterized routes while maintaining all current functionality. Each module will have a unique slug identifier stored in the configuration file, and the existing ModuleDetails component will be accessible through these direct routes.

## Architecture

### URL Structure
- **Base Route**: `/modules` (existing Module Explorer)
- **Module Detail Route**: `/modules/{slug}` (new parameterized route)
- **Example URLs**: 
  - `/modules/foundation-mapping`
  - `/modules/leading-change`
  - `/modules/ai-impact`

### Component Hierarchy
```
App.js (BrowserRouter)
├── Routes
│   ├── /modules (existing - ModuleExplorer)
│   └── /modules/:slug (new - ModuleDetailPage wrapper)
│       └── ModuleDetails (existing component)
```

### Routing Flow
1. User navigates to `/modules/{slug}`
2. React Router matches the parameterized route
3. New ModuleDetailPage component extracts slug from URL params
4. Component looks up module by slug in configuration
5. Renders existing ModuleDetails component with found module
6. Handles error cases (invalid slug, module not found)

## Components and Interfaces

### New Components

#### ModuleDetailPage Component
```jsx
// src/components/ModuleDetailPage.jsx
const ModuleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find module by slug
  useEffect(() => {
    const foundModule = modulesConfig.modules.find(m => m.id === slug);
    if (foundModule) {
      setModule(foundModule);
    } else {
      setError('Module not found');
    }
    setLoading(false);
  }, [slug]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/modules');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ModuleNotFound slug={slug} />;

  return (
    <ModuleDetails
      selectedModule={module}
      onBack={handleBack}
      journeySteps={journeySteps}
      exportToPdf={exportToPdf}
      isExporting={false}
    />
  );
};
```

#### ModuleNotFound Component
```jsx
// src/components/ModuleNotFound.jsx
const ModuleNotFound = ({ slug }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-elx-primary mb-4">
        Module Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The module "{slug}" could not be found.
      </p>
      <button 
        onClick={() => navigate('/modules')}
        className="btn-primary"
      >
        Browse All Modules
      </button>
    </div>
  );
};
```

### Modified Components

#### App.js Route Updates
```jsx
// Add new parameterized route
<Routes>
  <Route path="/" element={<CalculatorApp />} />
  <Route path="/calculator" element={<CalculatorApp />} />
  <Route path="/modules" element={<CalculatorApp />} />
  <Route path="/modules/:slug" element={<ModuleDetailPage />} />
  <Route path="/journey" element={<CalculatorApp />} />
  <Route path="/style-test" element={<StyleTest />} />
  <Route path="/diagnostic" element={<DiagnosticTest />} />
  <Route path="*" element={<CalculatorApp />} />
</Routes>
```

#### ModuleExplorer Updates
```jsx
// Update viewModuleDetails function to navigate to URL
const viewModuleDetails = (module) => {
  navigate(`/modules/${module.id}`);
};
```

#### RouterContext Updates
```jsx
// Add module detail path mapping
const pathToTab = {
  '/': 'introduction',
  '/calculator': 'calculator',
  '/modules': 'modules',
  '/journey': 'journey'
};

// Update getCurrentTab to handle module detail routes
const getCurrentTab = () => {
  if (location.pathname.startsWith('/modules/')) {
    return 'modules'; // Keep modules tab active for detail views
  }
  return pathToTab[location.pathname] || 'introduction';
};
```

## Data Models

### Module Configuration Schema
```json
{
  "modules": [
    {
      "id": "foundation-mapping",           // NEW: URL slug identifier
      "name": "Foundation Mapping",        // Existing: Display name
      "pillar": "Discovery",              // Existing: Service pillar
      "category": "Strategic Assessment",  // Existing: Category
      "heading": "...",                   // Existing: Module heading
      "description": "...",               // Existing: Description
      "variants": [...],                  // Existing: Service variants
      // ... all other existing fields
    }
  ]
}
```

### Slug Generation Rules
- Convert module name to lowercase
- Replace spaces with hyphens
- Remove special characters (keep only letters, numbers, hyphens)
- Ensure uniqueness across all modules

### Generated Slugs Mapping
```javascript
const slugMappings = {
  "Foundation Mapping": "foundation-mapping",
  "Leading Change": "leading-change",
  "Culture Core": "culture-core",
  "AI-Augmented Leadership": "ai-augmented-leadership",
  "Culture Power": "culture-power",
  "Strategic Leadership": "strategic-leadership",
  "Executive Agility": "executive-agility",
  "Revenue Levers": "revenue-levers",
  "Customer Centricity": "customer-centricity",
  "Strategic Foresight": "strategic-foresight",
  "Model Shift": "model-shift",
  "Brand Core": "brand-core",
  "Brand Power": "brand-power",
  "AI Impact": "ai-impact",
  "Digital Fortress": "digital-fortress",
  "Resilient Digital": "resilient-digital",
  "Distributed Cloud": "distributed-cloud",
  "Data Advantage": "data-advantage",
  "Innovation Blueprint": "innovation-blueprint",
  "GenAI for Business Leaders": "genai-for-business-leaders",
  "Strategic Storytelling": "strategic-storytelling",
  "Culture Feedback Rituals": "culture-feedback-rituals"
};
```

## Error Handling

### Invalid Slug Scenarios
1. **Non-existent slug**: Display ModuleNotFound component with option to browse all modules
2. **Malformed URL**: Redirect to main modules page
3. **Configuration loading error**: Display error message with retry option

### Navigation Error Handling
```jsx
// Error boundary for module detail routes
const ModuleDetailErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={<ModuleNotFound />}
      onError={(error) => console.error('Module detail error:', error)}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### Browser Navigation Support
- **Back button**: Navigate from module detail to modules list
- **Forward button**: Support browser forward navigation
- **Refresh**: Maintain current module view on page refresh
- **Direct URL access**: Support bookmarking and sharing of module URLs

## Testing Strategy

### Unit Tests
- Module slug generation and validation
- Module lookup by slug functionality
- Error handling for invalid slugs
- Component rendering with valid/invalid modules

### Integration Tests
- Route navigation from modules list to detail view
- Direct URL access to module details
- Browser back/forward navigation
- URL parameter extraction and module resolution

### End-to-End Tests
- Complete user flow: browse modules → view details → share URL
- Direct URL sharing and access
- Error scenarios (404, invalid slugs)
- Mobile responsive behavior

### Test Cases
```javascript
describe('Module Direct Routing', () => {
  test('navigates to module detail via URL', () => {
    // Test direct navigation to /modules/foundation-mapping
  });
  
  test('handles invalid module slug', () => {
    // Test navigation to /modules/invalid-slug
  });
  
  test('updates URL when viewing module details', () => {
    // Test URL change when clicking "View Details"
  });
  
  test('maintains tab state on module detail view', () => {
    // Test that modules tab remains active
  });
});
```

## Implementation Phases

### Phase 1: Configuration Update
1. Add `id` field to all modules in modulesConfig.json
2. Generate slugs based on module names
3. Validate slug uniqueness

### Phase 2: Routing Infrastructure
1. Create ModuleDetailPage component
2. Create ModuleNotFound component
3. Update App.js with new route
4. Update RouterContext for module detail handling

### Phase 3: Navigation Integration
1. Update ModuleExplorer to use URL navigation
2. Update other components that trigger module details
3. Ensure consistent navigation behavior

### Phase 4: Error Handling & Polish
1. Implement comprehensive error handling
2. Add loading states and transitions
3. Test browser navigation scenarios
4. Optimize for mobile experience