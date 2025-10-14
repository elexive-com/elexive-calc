# Design Document

## Architecture Overview

The enhancement transforms module detail pages from condensed one-pagers into comprehensive solution briefs with progressive disclosure. The design focuses on executive decision-making flow while maintaining technical simplicity and performance.

## Current Module Structure

### Existing Data Fields
```json
{
  "id": "leading-change",
  "name": "Leading Change",
  "pillar": "Transformation",
  "category": "Immediate Impact",
  "description": "Brief description",
  "heading": "Short heading",
  "callToAction": "CTA text",
  "whoIsItFor": "Target audience",
  "variants": [
    {
      "type": "Insight Primer",
      "evcValue": 10
    },
    {
      "type": "Integrated Execution", 
      "evcValue": 40
    }
  ]
}
```

## Target Solution Brief Architecture

### Enhanced Data Structure
```json
{
  "id": "leading-change",
  "name": "Leading Change",
  "pillar": "Transformation",
  "category": "Immediate Impact",
  
  // Executive Summary (always visible)
  "executiveSummary": "2-3 sentence value proposition",
  "businessValue": "Key business impact statement",
  
  // Progressive Disclosure Sections
  "businessChallenge": {
    "title": "Business Challenge & Opportunity",
    "problem": "What problem this solves",
    "opportunity": "What opportunity this creates",
    "marketContext": "Industry/market context"
  },
  
  "approach": {
    "title": "Our Approach & Methodology", 
    "methodology": "How we solve the problem",
    "framework": "Frameworks and tools used",
    "differentiators": "What makes our approach unique"
  },
  
  "expectedOutcomes": {
    "title": "Expected Outcomes & Success Metrics",
    "outcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
    "metrics": ["Metric 1", "Metric 2", "Metric 3"],
    "timeline": "When results are typically seen"
  },
  
  "implementation": {
    "title": "Implementation Timeline",
    "phases": [
      {
        "name": "Phase 1",
        "duration": "2-3 weeks",
        "activities": ["Activity 1", "Activity 2"]
      }
    ],
    "keyMilestones": ["Milestone 1", "Milestone 2"]
  },
  
  "caseStudy": {
    "title": "Success Story",
    "clientType": "Industry/company type",
    "challenge": "Client's specific challenge",
    "solution": "What we implemented",
    "results": "Measurable outcomes achieved"
  },
  
  // Updated Variants Structure
  "variants": [
    {
      "type": "Insight Primer",
      "evcValue": 10,
      "description": "Fixed-scope introductory engagement"
    },
    {
      "type": "Integrated Execution",
      "isFlexible": true,
      "minEvcPerWeek": 5,
      "maxEvcPerWeek": 20,
      "description": "Continuous delivery with flexible EVC bandwidth"
    }
  ]
}
```

## User Interface Design

### Page Layout Structure
```
┌─────────────────────────────────────────┐
│ Module Header (Pillar, Name, CTA)       │
├─────────────────────────────────────────┤
│ Executive Summary (always visible)      │
├─────────────────────────────────────────┤
│ ▼ Business Challenge & Opportunity      │
│   (expandable section)                  │
├─────────────────────────────────────────┤
│ ▼ Our Approach & Methodology           │
│   (expandable section)                  │
├─────────────────────────────────────────┤
│ ▼ Expected Outcomes & Success Metrics  │
│   (expandable section)                  │
├─────────────────────────────────────────┤
│ ▼ Implementation Timeline              │
│   (expandable section)                  │
├─────────────────────────────────────────┤
│ ▼ Success Story                        │
│   (expandable section)                  │
├─────────────────────────────────────────┤
│ Investment Options (always visible)     │
└─────────────────────────────────────────┘
```

### Progressive Disclosure Components

#### Expandable Section Component
```jsx
const ExpandableSection = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronIcon expanded={isExpanded} />
      </button>
      
      <AnimateHeight height={isExpanded ? 'auto' : 0}>
        <div className="p-4 pt-0 border-t border-gray-100">
          {children}
        </div>
      </AnimateHeight>
    </div>
  );
};
```

#### Show All Toggle
```jsx
const ShowAllToggle = ({ onToggle, allExpanded }) => (
  <button 
    onClick={onToggle}
    className="mb-4 text-elx-primary hover:underline"
  >
    {allExpanded ? 'Collapse All Sections' : 'Show All Sections'}
  </button>
);
```

## Service Model Changes

### Current Variant Structure
```json
"variants": [
  {
    "type": "Insight Primer",
    "evcValue": 10
  },
  {
    "type": "Integrated Execution",
    "evcValue": 40
  }
]
```

### Enhanced Variant Structure
```json
"variants": [
  {
    "type": "Insight Primer",
    "evcValue": 10,
    "isFixed": true,
    "description": "Fixed-scope engagement to get started",
    "duration": "2-4 weeks",
    "deliverables": ["Deliverable 1", "Deliverable 2"]
  },
  {
    "type": "Integrated Execution", 
    "isFlexible": true,
    "minEvcPerWeek": 5,
    "maxEvcPerWeek": 20,
    "recommendedEvcPerWeek": 10,
    "description": "Continuous delivery with flexible bandwidth",
    "scalingFactors": ["Team size", "Complexity", "Timeline"]
  }
]
```

## Component Architecture

### Enhanced ModuleDetailPage Component
```jsx
const ModuleDetailPage = () => {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    businessChallenge: false,
    approach: false,
    expectedOutcomes: false,
    implementation: false,
    caseStudy: false
  });

  const toggleAllSections = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    setExpandedSections(Object.keys(expandedSections).reduce((acc, key) => {
      acc[key] = newState;
      return acc;
    }, {}));
  };

  return (
    <div className="solution-brief">
      <ModuleHeader module={module} />
      <ExecutiveSummary module={module} />
      
      <ShowAllToggle onToggle={toggleAllSections} allExpanded={allExpanded} />
      
      <ExpandableSection 
        title={module.businessChallenge.title}
        defaultExpanded={expandedSections.businessChallenge}
      >
        <BusinessChallengeContent challenge={module.businessChallenge} />
      </ExpandableSection>
      
      {/* Additional expandable sections */}
      
      <InvestmentOptions variants={module.variants} />
    </div>
  );
};
```

## Data Migration Strategy

### Phase 1: Extend Existing Structure
- Add new fields to modulesConfig.json without removing existing ones
- Implement backward compatibility for components
- Gradually populate new fields with content

### Phase 2: Enhanced UI Implementation
- Build progressive disclosure components
- Implement expandable sections with animations
- Add show/hide all functionality

### Phase 3: Service Model Updates
- Update variant structure for flexible EVC bandwidth
- Modify calculator to handle flexible pricing
- Update PDF generation for new variant types

## Performance Considerations

### Lazy Loading
- Load expanded content only when sections are opened
- Implement smooth animations without blocking UI
- Optimize for mobile performance

### Content Management
- Structure data for easy content updates
- Validate data structure on load
- Provide fallbacks for missing content

## Responsive Design

### Mobile Optimization
- Stack sections vertically on mobile
- Optimize touch targets for expandable sections
- Ensure readable typography on small screens

### Desktop Enhancement
- Consider side-by-side layout for larger screens
- Implement sticky navigation for long content
- Optimize for executive presentation scenarios
