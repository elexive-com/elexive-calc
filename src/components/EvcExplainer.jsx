import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faUsers, faPuzzlePiece, faExchangeAlt,
  faBullseye, faProjectDiagram,
  faTasks, faGears, faRobot, faDatabase,
  faTimes, faChartLine, faBalanceScale,
  faHandshake, faPercentage,
  faArrowsAltH, faInfoCircle, faChartBar,
  faLightbulb, faClipboardCheck,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const EvcExplainer = ({ 
  isOpen, 
  onClose, 
  weeklyProductionCapacity, 
  monthlyOutputValue,
  selectedAllocationStrategy
}) => {
  // State to track current active section for navigation highlighting
  const [activeSection, setActiveSection] = useState('overview');

  // Create refs at the top level of the component (not inside callbacks)
  const overviewRef = useRef(null);
  const allocationRef = useRef(null);
  const overheadRef = useRef(null);
  const resourcesRef = useRef(null);

  // Create refs object with useMemo to avoid recreation on every render
  const sectionRefs = useMemo(() => ({
    overview: overviewRef,
    allocation: allocationRef,
    overhead: overheadRef,
    resources: resourcesRef
  }), []);
  
  // Get overhead from calculatorConfig.json
  const getOverheadForStrategy = (strategy) => {
    if (strategy && calculatorConfig.resourceAllocation[strategy]) {
      return calculatorConfig.resourceAllocation[strategy].switchingOverhead;
    }
    return 0;
  };
  
  // Current strategy details
  const currentOverhead = getOverheadForStrategy(selectedAllocationStrategy);
  
  // Get all overhead values for comparison
  const balancedOverhead = calculatorConfig.resourceAllocation.balanced.switchingOverhead;
  const distributedOverhead = calculatorConfig.resourceAllocation.distributed.switchingOverhead;
  
  // Scroll to section helper
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  
  // Set up intersection observer to update active section based on scroll
  useEffect(() => {
    if (!isOpen) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-10% 0px -80% 0px' // Adjust as needed
      }
    );
    
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [isOpen, sectionRefs]);
  
  // Early return if modal is not open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white shadow-sm z-20 border-b">
          <div className="px-6 py-5 flex justify-between items-center">
            <h2 className="elx-section-heading text-2xl mb-0 flex items-center">
              <FontAwesomeIcon icon={faCalculator} className="text-elx-accent mr-3" />
              Understanding Elastic Value Credits (EVCs)
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
          
          {/* Quick navigation */}
          <div className="px-6 py-3 flex gap-6 overflow-x-auto whitespace-nowrap border-t border-gray-100">
            <button 
              onClick={() => scrollToSection('overview')}
              className={`px-2 py-1 font-medium text-sm flex items-center transition-colors ${activeSection === 'overview' 
                ? 'text-elx-accent border-b-2 border-elx-accent' 
                : 'text-gray-600 hover:text-elx-accent'}`}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              Overview
            </button>
            <button 
              onClick={() => scrollToSection('allocation')}
              className={`px-2 py-1 font-medium text-sm flex items-center transition-colors ${activeSection === 'allocation' 
                ? 'text-elx-accent border-b-2 border-elx-accent' 
                : 'text-gray-600 hover:text-elx-accent'}`}
            >
              <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
              Resource Allocation
            </button>
            <button 
              onClick={() => scrollToSection('overhead')}
              className={`px-2 py-1 font-medium text-sm flex items-center transition-colors ${activeSection === 'overhead' 
                ? 'text-elx-accent border-b-2 border-elx-accent' 
                : 'text-gray-600 hover:text-elx-accent'}`}
            >
              <FontAwesomeIcon icon={faPercentage} className="mr-2" />
              Overhead & Efficiency
            </button>
            <button 
              onClick={() => scrollToSection('resources')}
              className={`px-2 py-1 font-medium text-sm flex items-center transition-colors ${activeSection === 'resources' 
                ? 'text-elx-accent border-b-2 border-elx-accent' 
                : 'text-gray-600 hover:text-elx-accent'}`}
            >
              <FontAwesomeIcon icon={faGears} className="mr-2" />
              Input Resources
            </button>
          </div>
        </div>
        
        {/* Single scrollable content area */}
        <div className="overflow-y-auto flex-grow px-8 py-6">
          {/* Overview Section */}
          <section id="overview" ref={sectionRefs.overview} className="mb-14">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-lg bg-elx-accent bg-opacity-10 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faInfoCircle} className="text-elx-accent text-xl" />
              </div>
              <h3 className="elx-section-heading text-xl mb-0 text-elx-primary font-bold">Overview</h3>
            </div>
            
            <div className="mb-10">
              <div className="bg-elx-primary-light p-6 rounded-xl mb-8 flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-elx-primary mb-3">The Executive Summary</h3>
                  <p className="text-gray-700 leading-relaxed">
                    EVCs create a transparent value exchange between your investment in transformation resources and 
                    the strategic outputs delivered. Think of EVCs as a currency that measures both input commitment 
                    and output value, connecting resources to concrete business outcomes.
                  </p>
                </div>
                <div className="flex-shrink-0 px-6 mt-6 md:mt-0">
                  <div className="w-20 h-20 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faHandshake} className="text-elx-accent text-4xl" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-elx-primary bg-opacity-10 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faUsers} className="text-elx-accent text-xl" />
                    </div>
                    <h3 className="font-bold text-elx-primary text-lg m-0">Input Resources</h3>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Strategic advisory, specialized AI tools, and proprietary data resources that generate 
                    your weekly EVC production capacity, forming the foundation of your transformation capability.
                  </p>
                  <div className="mt-3 text-center p-4 bg-elx-primary-light rounded-lg">
                    <span className="text-sm font-medium text-elx-primary mb-1 block">Weekly Production</span>
                    <div className="text-3xl font-bold text-elx-accent">{weeklyProductionCapacity} EVCs</div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-elx-secondary bg-opacity-10 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faPuzzlePiece} className="text-elx-secondary text-xl" />
                    </div>
                    <h3 className="font-bold text-elx-secondary text-lg m-0">Output Value</h3>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Strategic modules, implementations, and transformational deliverables that create 
                    tangible business value, organized by your strategic priorities.
                  </p>
                  <div className="mt-3 text-center p-4 bg-elx-secondary-light rounded-lg">
                    <span className="text-sm font-medium text-elx-secondary mb-1 block">Monthly Delivery</span>
                    <div className="text-3xl font-bold text-elx-secondary">{monthlyOutputValue} EVCs</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl mb-10 shadow-sm">
              <h3 className="elx-section-heading text-lg mb-6 flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="text-elx-accent mr-3" />
                <span className="font-bold">The EVC Value Equation</span>
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left flex-1 bg-white p-5 rounded-lg shadow-sm">
                  <div className="font-medium text-elx-primary mb-2">Weekly EVC Production</div>
                  <div className="text-3xl font-bold text-elx-accent mb-3">{weeklyProductionCapacity} EVCs</div>
                  <div className="text-gray-500 text-sm mb-4">Input resource capacity</div>
                  
                  <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center py-1">
                      <span>Advisory Services:</span>
                      <span className="font-medium">{Math.round(calculatorConfig.evcProducers[0].defaultAllocation * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>AI Tools:</span>
                      <span className="font-medium">{Math.round(calculatorConfig.evcProducers[1].defaultAllocation * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Data Resources:</span>
                      <span className="font-medium">{Math.round(calculatorConfig.evcProducers[2].defaultAllocation * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                    <FontAwesomeIcon icon={faArrowsAltH} className="text-elx-primary text-xl" />
                  </div>
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-medium text-elx-primary mb-1">Allocation Strategy</div>
                    <div className="text-xl font-bold text-elx-primary capitalize">{selectedAllocationStrategy}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {currentOverhead > 0 ? `${currentOverhead}% overhead` : 'No overhead'}
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-right flex-1 bg-white p-5 rounded-lg shadow-sm">
                  <div className="font-medium text-elx-secondary mb-2">Monthly EVC Delivery</div>
                  <div className="text-3xl font-bold text-elx-secondary mb-3">{monthlyOutputValue} EVCs</div>
                  <div className="text-gray-500 text-sm mb-4">Deliverable output value</div>
                  
                  <div className="mt-3 p-3 bg-elx-secondary-light rounded-lg">
                    <div className="font-medium text-elx-secondary mb-2">Monthly Calculation</div>
                    <div className="font-mono text-sm">
                      {weeklyProductionCapacity} EVCs × 4 weeks = {weeklyProductionCapacity * 4} EVCs
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-sm">
              <h3 className="elx-section-heading text-lg mb-6 flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="text-elx-accent mr-3" />
                <span className="font-bold">Why EVCs Matter to Your Business</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <FontAwesomeIcon icon={faLightbulb} className="text-elx-accent" />
                    </div>
                    <h4 className="font-medium text-elx-primary text-lg m-0">Strategic Clarity</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    EVCs provide a consistent framework for measuring transformation value, making complex initiatives 
                    comparable and allowing you to prioritize with confidence.
                  </p>
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <FontAwesomeIcon icon={faBalanceScale} className="text-elx-accent" />
                    </div>
                    <h4 className="font-medium text-elx-primary text-lg m-0">Resource Optimization</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    By tracking EVC production and consumption, you can identify inefficiencies and optimize 
                    resource allocation to maximize strategic impact.
                  </p>
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <FontAwesomeIcon icon={faHandshake} className="text-elx-accent" />
                    </div>
                    <h4 className="font-medium text-elx-primary text-lg m-0">Transparency & Alignment</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    EVCs create a universal language for transformation value, aligning stakeholders and 
                    creating transparency in complex consulting investments.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Resource Allocation Section */}
          <section id="allocation" ref={sectionRefs.allocation} className="mb-14">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-lg bg-elx-accent bg-opacity-10 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faBalanceScale} className="text-elx-accent text-xl" />
              </div>
              <h3 className="elx-section-heading text-xl mb-0 text-elx-primary font-bold">Resource Allocation Strategies</h3>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-4xl">
              How you allocate your transformation resources fundamentally impacts both efficiency and 
              output. Different allocation strategies have varying levels of overhead due to context-switching.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`bg-white rounded-xl shadow-sm p-6 border-t-4 hover:shadow-md transition-shadow ${
                selectedAllocationStrategy === 'focused' ? 'border-green-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faBullseye} className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 m-0">Focused</h4>
                    <div className="text-sm text-gray-500">Laser Beam Approach</div>
                  </div>
                </div>
                
                <div className="text-center my-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700 mb-1">Overhead</div>
                  <div className="text-3xl font-bold text-green-600">0%</div>
                  <div className="text-sm text-green-700 mt-1">Maximum efficiency</div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Concentrates 100% of resources on a single initiative, maximizing depth and velocity 
                  with zero context-switching overhead.
                </p>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium block mb-1">Ideal for:</span> 
                  Critical, time-sensitive initiatives requiring intensive focus and rapid results.
                </div>
                
                {selectedAllocationStrategy === 'focused' && (
                  <div className="mt-3 text-center text-green-600 font-medium text-sm">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Currently Selected
                  </div>
                )}
              </div>
              
              <div className={`bg-white rounded-xl shadow-sm p-6 border-t-4 hover:shadow-md transition-shadow ${
                selectedAllocationStrategy === 'balanced' ? 'border-yellow-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faProjectDiagram} className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 m-0">Balanced</h4>
                    <div className="text-sm text-gray-500">Smart Campaign Approach</div>
                  </div>
                </div>
                
                <div className="text-center my-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-700 mb-1">Overhead</div>
                  <div className="text-3xl font-bold text-yellow-600">{balancedOverhead}%</div>
                  <div className="text-sm text-yellow-700 mt-1">Moderate additional effort</div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Distributes resources across a moderate number of initiatives, balancing focus with 
                  parallel progress while managing context-switching overhead.
                </p>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium block mb-1">Ideal for:</span> 
                  Multi-faceted transformation programs with interdependent initiatives requiring coordinated progress.
                </div>
                
                {selectedAllocationStrategy === 'balanced' && (
                  <div className="mt-3 text-center text-yellow-600 font-medium text-sm">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Currently Selected
                  </div>
                )}
              </div>
              
              <div className={`bg-white rounded-xl shadow-sm p-6 border-t-4 hover:shadow-md transition-shadow ${
                selectedAllocationStrategy === 'distributed' ? 'border-orange-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faTasks} className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 m-0">Distributed</h4>
                    <div className="text-sm text-gray-500">Omni-Channel Approach</div>
                  </div>
                </div>
                
                <div className="text-center my-4 p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-700 mb-1">Overhead</div>
                  <div className="text-3xl font-bold text-orange-600">{distributedOverhead}%</div>
                  <div className="text-sm text-orange-700 mt-1">Significant additional effort</div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Spreads resources across many simultaneous initiatives, maximizing breadth but requiring 
                  substantial context-switching overhead.
                </p>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium block mb-1">Ideal for:</span> 
                  Broad organizational transformation requiring many parallel workstreams with coordinated but independent progress.
                </div>
                
                {selectedAllocationStrategy === 'distributed' && (
                  <div className="mt-3 text-center text-orange-600 font-medium text-sm">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Currently Selected
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-elx-primary-light rounded-xl p-8 shadow-sm">
              <h4 className="font-bold text-elx-primary text-lg mb-6">Your Current Strategy Impact</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">Weekly Production</div>
                  <div className="text-2xl font-bold text-elx-accent">{weeklyProductionCapacity} EVCs</div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">Overhead</div>
                  <div className="text-2xl font-bold text-elx-primary">{currentOverhead}%</div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">Monthly Output</div>
                  <div className="text-2xl font-bold text-elx-secondary">{monthlyOutputValue} EVCs</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center p-5 bg-white rounded-xl shadow-sm max-w-md">
                  <div className="font-medium text-elx-primary mb-2">Monthly EVC Delivery</div>
                  <div className="font-mono bg-gray-50 p-3 rounded-lg text-base border border-gray-100">
                    {weeklyProductionCapacity} EVCs × 4 weeks = {weeklyProductionCapacity * 4} EVCs
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Overhead & Efficiency Section */}
          <section id="overhead" ref={sectionRefs.overhead} className="mb-14">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-lg bg-elx-accent bg-opacity-10 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faPercentage} className="text-elx-accent text-xl" />
              </div>
              <h3 className="elx-section-heading text-xl mb-0 text-elx-primary font-bold">Overhead & Efficiency</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  When work is done in parallel across multiple initiatives, <strong>context-switching overhead</strong> represents 
                  the additional work required due to coordination, communication, and cognitive load.
                </p>
                
                <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500 mb-6 shadow-sm">
                  <div className="font-bold text-yellow-800 mb-3 text-base">Important: How Overhead Works</div>
                  <p className="text-yellow-700 leading-relaxed">
                    Overhead doesn't increase your EVC output - it increases how many EVCs modules consume.
                    When you work on multiple initiatives simultaneously, each module requires additional EVCs 
                    to account for context-switching, coordination, and cognitive loading effects.
                  </p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <h4 className="font-bold text-elx-primary mb-3 flex items-center">
                    <FontAwesomeIcon icon={faChartBar} className="text-elx-accent mr-2" />
                    Research-Backed Reality
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Studies show that context switching can consume up to 40% of productive time. Each time we shift 
                    between tasks, cognitive loading effects reduce efficiency by 20-80% depending on task complexity.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-elx-primary mb-4 text-center">Overhead Calculation Example</h4>
                
                <div className="flex items-center mb-5">
                  <div className="w-24 text-right text-sm font-medium text-gray-600 pr-4">Base Work:</div>
                  <div className="flex-1">
                    <div className="bg-blue-100 text-center py-3 rounded-lg border border-blue-200" style={{ width: `100%` }}>
                      <span className="font-bold text-blue-800">100 EVCs</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-5">
                  <div className="w-24 text-right text-sm font-medium text-gray-600 pr-4">
                    + Overhead:
                    <div className="font-medium text-orange-600">{currentOverhead}%</div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-orange-100 text-center py-3 rounded-lg border border-orange-200" 
                        style={{ width: `${currentOverhead === 0 ? 10 : currentOverhead}%`, minWidth: "60px" }}>
                      <span className="font-bold text-orange-800">{currentOverhead} EVCs</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-24 text-right text-sm font-medium text-gray-600 pr-4">
                    Total Effort:
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-700 text-center py-3 rounded-lg" style={{ width: `${100 + currentOverhead}%` }}>
                      <span className="font-bold text-white">{100 + currentOverhead} EVCs</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl mt-4 border border-gray-100">
                  <div className="font-bold text-gray-700 mb-3">In practical terms:</div>
                  <p className="text-gray-600 mb-0">
                    With a {currentOverhead}% overhead in your {selectedAllocationStrategy} strategy, 
                    modules <strong>consume {currentOverhead}% more EVCs</strong> than their base value. 
                    This means fewer modules can be implemented with your fixed EVC production capacity.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
              <h4 className="font-bold text-elx-primary mb-6 text-center text-lg">Efficiency Comparison Across Strategies</h4>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-32 text-sm font-bold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Focused
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-1">
                    <div className="bg-green-100 text-center py-3 px-4 rounded-lg" style={{ width: '100%' }}>
                      <span className="font-bold text-green-800">100% Efficient (No Overhead)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-32 text-sm font-bold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Balanced
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-1">
                    <div className="flex w-full">
                      <div className="bg-yellow-100 text-center py-3 rounded-l-lg border-r border-yellow-200" style={{ width: `${100 - balancedOverhead}%` }}>
                        <span className="font-bold text-yellow-800">100% Base Work</span>
                      </div>
                      <div className="bg-yellow-300 text-center py-3 rounded-r-lg" style={{ width: `${balancedOverhead}%` }}>
                        <span className="font-bold text-yellow-800">{balancedOverhead}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-32 text-sm font-bold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    Distributed
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-1">
                    <div className="flex w-full">
                      <div className="bg-orange-100 text-center py-3 rounded-l-lg border-r border-orange-200" style={{ width: `${100 - distributedOverhead}%` }}>
                        <span className="font-bold text-orange-800">100% Base Work</span>
                      </div>
                      <div className="bg-orange-300 text-center py-3 rounded-r-lg" style={{ width: `${distributedOverhead}%` }}>
                        <span className="font-bold text-orange-800">{distributedOverhead}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="font-bold text-green-600 mb-2 text-center">Focused Strategy</div>
                  <p className="text-gray-700 text-center leading-relaxed">
                    A module requiring 100 EVCs costs exactly 100 EVCs with no overhead. 
                    Most efficient approach with no context-switching costs.
                  </p>
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="font-bold text-yellow-600 mb-2 text-center">Balanced Strategy</div>
                  <p className="text-gray-700 text-center leading-relaxed">
                    A module requiring 100 EVCs costs {100 + balancedOverhead} EVCs due to {balancedOverhead}% overhead. 
                    Moderate efficiency with some context-switching costs.
                  </p>
                </div>
                
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="font-bold text-orange-600 mb-2 text-center">Distributed Strategy</div>
                  <p className="text-gray-700 text-center leading-relaxed">
                    A module requiring 100 EVCs costs {100 + distributedOverhead} EVCs due to {distributedOverhead}% overhead. 
                    Lower efficiency with significant context-switching costs.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Input Resources Section */}
          <section id="resources" ref={sectionRefs.resources} className="mb-10">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-lg bg-elx-accent bg-opacity-10 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faGears} className="text-elx-accent text-xl" />
              </div>
              <h3 className="elx-section-heading text-xl mb-0 text-elx-primary font-bold">Input Resources</h3>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-4xl">
              Your EVC production capacity comes from three key resource types, each contributing 
              unique value to your transformation initiatives.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {calculatorConfig.evcProducers.map((producer) => (
                <div key={producer.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-4">
                      <FontAwesomeIcon 
                        icon={
                          producer.id === "advisorHours" ? faUsers :
                          producer.id === "aiTools" ? faRobot :
                          faDatabase
                        } 
                        className="text-elx-accent text-xl" 
                      />
                    </div>
                    <h4 className="font-bold text-elx-primary text-lg m-0">{producer.name}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{producer.description}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-600">Default Allocation:</div>
                      <div className="font-bold text-elx-primary">{Math.round(producer.defaultAllocation * 100)}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div className="bg-elx-accent h-3 rounded-full" style={{ width: `${Math.round(producer.defaultAllocation * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-600">Production Value:</div>
                      <div className="font-bold text-elx-primary">{producer.productionValue}x</div>
                    </div>
                  </div>
                  
                  <div className="text-gray-600">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faClipboardCheck} className="text-elx-accent mr-2" />
                      <span className="font-medium">Expertise Areas</span>
                    </div>
                    <ul className="list-disc list-inside ml-1 mb-0 space-y-1">
                      {producer.expertiseAreas ? producer.expertiseAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      )) : (
                        <>
                          <li>{producer.id === "advisorHours" ? "Strategic guidance & execution leadership" : 
                               producer.id === "aiTools" ? "Predictive analytics & automation solutions" : 
                               "Specialized industry benchmarks & insights"}</li>
                          <li>{producer.id === "advisorHours" ? "Cross-functional transformation expertise" : 
                               producer.id === "aiTools" ? "Process optimization & decision support" : 
                               "Competitive intelligence & market trends"}</li>
                          <li>{producer.id === "advisorHours" ? "Change management & stakeholder alignment" : 
                               producer.id === "aiTools" ? "Custom algorithms & analytical frameworks" : 
                               "Performance metrics & success indicators"}</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-elx-primary-light p-8 rounded-xl shadow-sm">
              <h4 className="font-bold text-elx-primary mb-6 text-lg">Resource Composition Impact</h4>
              
              <p className="text-gray-700 mb-6 leading-relaxed max-w-4xl">
                Each resource type has different inherent efficiency characteristics based on its nature. 
                While advisory services require human coordination, AI tools and data resources can be 
                leveraged with less coordination overhead.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faUsers} className="text-elx-accent" />
                    </div>
                    <div className="font-bold text-elx-primary">Advisory Services</div>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    Human expertise has the highest context-switching cost but provides critical strategic 
                    guidance, leadership, and creative problem-solving.
                  </p>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-600">Overhead Sensitivity:</div>
                    <div className="font-bold text-elx-primary">High</div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faRobot} className="text-elx-accent" />
                    </div>
                    <div className="font-bold text-elx-primary">AI Tools</div>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    Automated capabilities have moderate context-switching costs related to configuration, 
                    monitoring, and integration across different use cases.
                  </p>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-600">Overhead Sensitivity:</div>
                    <div className="font-bold text-elx-primary">Medium</div>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-10 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faDatabase} className="text-elx-accent" />
                    </div>
                    <div className="font-bold text-elx-primary">Data Resources</div>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    Information assets have the lowest context-switching cost as they can be accessed and 
                    leveraged simultaneously across multiple initiatives.
                  </p>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-600">Overhead Sensitivity:</div>
                    <div className="font-bold text-elx-primary">Low</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EvcExplainer;