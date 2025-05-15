import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, faArrowRight, faCalculator, 
  faLightbulb, faPuzzlePiece,
  faLayerGroup,
  faCheckCircle, faNetworkWired,
  faPlus, faMinus,
  faChartPie,
  faClock, faMoneyBillWave, faHandshake, faBolt,
  faShieldAlt, faChevronDown, faChartLine
} from '@fortawesome/free-solid-svg-icons';
// Remove direct import and use process.env.PUBLIC_URL for images in public folder

// Card component with self-contained state management - redesigned to match minimalist style
const CollapsibleCard = ({ title, icon, content }) => {
  // Each card maintains its own expansion state
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle function specific to this card instance only
  const toggleCard = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="border-t border-gray-200 overflow-hidden">
      {/* Clean, minimalist header - clickable */}
      <div 
        className="py-4 px-2 flex items-center justify-between w-full cursor-pointer"
        onClick={toggleCard}
      >
        <h4 className="font-semibold text-lg text-indigo-900">{title}</h4>
        <div>
          <FontAwesomeIcon 
            icon={isExpanded ? faMinus : faPlus} 
            className="text-indigo-900" 
          />
        </div>
      </div>
      
      {/* Content area with conditional rendering */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 py-4' : 'opacity-0 h-0 py-0'}`}
      >
        {isExpanded && content}
      </div>
    </div>
  );
};

const CalculatorIntroduction = ({ onGetStarted }) => {
  const [expandedSections, setExpandedSections] = useState({
    evcModel: false,
    process: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Updated pillar configuration using standardized CSS classes with elx- prefix
  const pillars = [
    {
      name: 'Transformation',
      focus: 'People & Operations',
      icon: faLayerGroup,
      description: 'Optimize your organization through leadership development, workflow improvements, and operational excellence.'
    },
    {
      name: 'Strategy',
      focus: 'Direction & Growth',
      icon: faLayerGroup, 
      description: 'Define your market position and competitive advantage with clear strategic roadmaps and execution plans.'
    },
    {
      name: 'Technology',
      focus: 'Tools & Innovation',
      icon: faLayerGroup,
      description: 'Leverage the right technology to drive efficiency, unlock new capabilities, and create competitive advantages.'
    }
  ];

  return (
    <div className="elx-card p-6 mb-6">
      {/* HEADER: Lead with control and speed */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-elx-primary mb-3">
            Build Your Transformation Plan, Your Way
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl">
            Configure your business solution instantly. Get precise breakdown of the cost. Move forward on your timeline.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-20 h-20 bg-elx-primary rounded-xl shadow-md mt-4 md:mt-0 md:ml-6">
          <FontAwesomeIcon icon={faCalculator} className="text-white text-3xl" />
        </div>
      </div>

      {/* TOP ACTION SECTION: Immediate option to proceed */}
      <div className="bg-elx-primary bg-opacity-5 rounded-xl p-5 mb-8 border border-elx-primary border-opacity-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-elx-primary mb-2">
              Get Started Now
            </h3>
            <p className="text-sm text-gray-700">
              Plan your transformation in minutes. Access all pricing and options instantly. 
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="elx-btn-primary md:flex-shrink-0"
          >
            Build My Solution
            <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
          </button>
        </div>
      </div>

      {/* BUSINESS OUTCOMES: Focus on measurable results */}
      <div className="elx-section mb-8">
        <h3 className="elx-heading-2">Business Impact You Can Expect</h3>
        
        <div className="flex flex-col md:flex-row">
          <div className="order-1 md:order-1 w-full md:w-3/4 pr-0 md:pr-8">
            <div className="space-y-0">
              <CollapsibleCard 
                title="3-5x ROI"
                icon={faMoneyBillWave}
                content={
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Our clients typically see 3-5x return on their transformation investment within 12-18 months.
                  </p>
                
                  <div className="pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-elx-primary text-sm mb-2">How we deliver this ROI:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Strategic operational improvements that reduce costs</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Revenue optimization through improved processes</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Capability building that delivers long-term value</span>
                      </li>
                    </ul>
                  </div>
                </>
              }
            />
            
            <CollapsibleCard 
              title="4-6 Week Results"
              icon={faBolt}
              content={
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Start seeing operational improvements and quick wins within the first 4-6 weeks of implementation.
                  </p>
                
                  <div className="pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-elx-primary text-sm mb-2">Our rapid delivery approach:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Agile implementation methodology focused on quick wins</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Pre-built frameworks that can be rapidly customized</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Weekly progress tracking and milestone achievements</span>
                      </li>
                    </ul>
                  </div>
                </>
              }
            />              <CollapsibleCard 
              title="Low-Risk Approach"
              icon={faHandshake}
              content={
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Our modular methodology allows for course correction without "all-in" commitments, protecting your investment.
                  </p>
                
                  <div className="pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-elx-primary text-sm mb-2">How we minimize risk:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Phased implementation with clear go/no-go decision points</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Transparent KPIs and success metrics from day one</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                        <span>Knowledge transfer to your team throughout the process</span>
                      </li>
                    </ul>
                  </div>
                </>
              }
            />
            
            <CollapsibleCard 
              title="Value Delivery Model"
              icon={faChartLine}
              content={
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Our system uses Elastic Value Credits (EVCs)—transparent work units that clearly show what resources are applied to your business needs.
                  </p>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-elx-primary text-sm mb-2">How our value model works:</h5>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex flex-col md:flex-row items-center justify-around gap-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-elx-primary mb-1">Your Business Challenge</div>
                          <div className="text-xs text-gray-600">Precisely Defined</div>
                        </div>
                        <div className="hidden md:block">
                          <FontAwesomeIcon icon={faArrowRight} className="text-elx-primary" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-elx-primary mb-1">Measurable Results</div>
                          <div className="text-xs text-gray-600">Quantifiable Outcomes</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      We address immediate business challenges while simultaneously building your internal capabilities for long-term organizational strength.
                    </p>
                  </div>
                </>
              }
            />
            </div>
          </div>
          
          <div className="order-2 md:order-2 w-full md:w-1/4 mt-6 md:mt-0 md:pl-6">
            <div className="sticky top-6">
              <img 
                src={`${process.env.PUBLIC_URL}/bonsai-square-1.png`} 
                alt="Bonsai tree representing growth and balance" 
                className="w-full shadow-md rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-none" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. BUSINESS CHALLENGES - CEOs primarily care about their specific problems */}
      <div className="mb-8">
        <h3 className="elx-heading-2">Critical Business Challenges We Solve</h3>
        <div className="flex flex-col md:flex-row">
          <div className="order-2 md:order-1 w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <div>
              <img 
                src={`${process.env.PUBLIC_URL}/bonsai-square-1.png`} 
                alt="Bonsai tree representing growth and balance" 
                className="w-full shadow-md rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-none" 
              />
            </div>
          </div>
        
          <div className="order-1 md:order-2 w-full md:w-3/4">
            <div className="space-y-0">
              <CollapsibleCard 
                title="Growth & Revenue"
                icon={faLightbulb}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Break revenue plateaus, capitalize on market opportunities, and develop sustainable growth engines that keep your business competitive.
                    </p>
                  
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">Growth strategies we deliver:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Market expansion and new customer acquisition frameworks</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Revenue stream diversification and optimization</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Strategic partnership and alliance development</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="Execution & Operations"
                icon={faNetworkWired}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Eliminate operational bottlenecks, streamline decision processes, and build execution capabilities that turn strategy into measurable results.
                    </p>
                  
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">Operational excellence solutions:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Process optimization and workflow streamlining</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Decision framework development and implementation</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Cross-functional coordination and alignment</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="Innovation & Resilience"
                icon={faPuzzlePiece}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Future-proof your business with adaptive capabilities, emerging technology integration, and innovation systems that maintain market leadership.
                    </p>
                  
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">Innovation frameworks we implement:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Structured innovation processes and idea management</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Adaptive business models for market disruption</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Technology evaluation and integration roadmaps</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* VALUE PROPOSITION: Differentiation & control - Redesigned with collapsible cards & bonsai image */}
      <div className="mb-8">
        <h3 className="elx-heading-2">Why Executives Choose This Approach</h3>
        
        <div className="flex flex-col md:flex-row">
          <div className="order-1 md:order-1 w-full md:w-3/4 pr-0 md:pr-8">
            <div className="space-y-0">
              <CollapsibleCard 
                title="Instant Access"
                icon={faClock}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Configure your solution and see pricing immediately—no waiting for sales calls or proposals.
                    </p>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">Benefits of instant access:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Make decisions on your timeline, not a salesperson's</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Preview your complete solution before any commitment</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="Complete Transparency"
                icon={faChartPie}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      See exactly what you're buying, what it costs, and the outcomes you can expect—before committing.
                    </p>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">What we make transparent:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Item-by-item breakdown of costs and services</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Clear timeline and delivery expectations</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="Tailored Solutions"
                icon={faPuzzlePiece}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Build exactly what you need instead of conforming to rigid, pre-packaged consulting offerings.
                    </p>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">How we enable customization:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Modular components you can mix and match</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Adjustable resource levels for each solution area</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="No Pressure Decision-Making"
                icon={faHandshake}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Explore at your own pace without sales pressure—you decide when and how to move forward.
                    </p>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">Our no-pressure approach:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Save and revisit your plan as needed</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Support available but never pushy</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
              
              <CollapsibleCard 
                title="Complete Control"
                icon={faShieldAlt}
                content={
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      This self-service tool puts you in control. Configure the exact expertise, resources, and timeline needed for your business priorities with complete cost visibility.
                    </p>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-elx-primary text-sm mb-2">How you maintain control:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Configure specific resources for your unique business challenges</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Adjust delivery timelines to match your organizational readiness</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>Get exactly what you need without paying for unnecessary services</span>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              />
            </div>
          </div>
          
          <div className="order-2 md:order-2 w-full md:w-1/4 mt-6 md:mt-0 md:pl-6">
            <div className="sticky top-6">
              <img 
                src={`${process.env.PUBLIC_URL}/bonsai-square-1.png`} 
                alt="Bonsai tree representing growth and balance" 
                className="w-full shadow-md rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-none" 
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-elx-primary mr-2" />
                  <p className="text-sm font-medium text-elx-primary">
                    Design your solution in under 5 minutes. Download instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMPLIFIED PROCESS: 3 quick steps - Modified to match collapsible style */}
      <div className="mb-8">
        <h3 className="elx-heading-2 flex items-center">
          Design Your Solution in 3 Steps
        </h3>
        
        <div className="flex flex-col md:flex-row">
          <div className="order-2 md:order-1 w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <div>
              <img 
                src={`${process.env.PUBLIC_URL}/bonsai-square-1.png`} 
                alt="Bonsai tree representing growth and balance" 
                className="w-full shadow-md rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-none" 
              />
            </div>
          </div>
          
          <div className="order-1 md:order-2 w-full md:w-3/4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-elx-primary mb-1">Define Your Challenge</h4>
                    <p className="text-gray-600 text-sm">
                      Select from common business challenges or create your own custom scenario.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-elx-primary mb-1">Choose Your Solutions</h4>
                    <p className="text-gray-600 text-sm">
                      Select the exact capabilities needed across transformation, strategy, and technology.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-elx-primary mb-1">Set Your Budget & Timeline</h4>
                    <p className="text-gray-600 text-sm">
                      Adjust scope and resources to see real-time pricing and delivery estimates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-center">
                <button
                  onClick={onGetStarted}
                  className="elx-btn-primary"
                >
                  Start Building Now
                  <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                </button>
              </div>
              
              <div className="text-center mt-2">
                <button
                  onClick={() => {
                    toggleSection('process');
                    document.getElementById('detailed-process').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-elx-primary font-medium text-sm flex items-center justify-center mx-auto"
                >
                  View detailed process information
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOLUTION FRAMEWORK: Three key areas of expertise */}
      <div className="mb-8">
        <h3 className="elx-heading-2">Solution Framework: Three Strategic Areas</h3>
        <div className="elx-grid-3col">
          {pillars.map(pillar => {
            // Get the color code based on pillar type - improved contrast versions
            const getPillarColor = () => {
              switch(pillar.name.toLowerCase()) {
                case 'transformation': return 'var(--pillar-transformation-color)';
                case 'strategy': return 'var(--pillar-strategy-color)';
                case 'technology': return 'var(--pillar-technology-color)';
                case 'discovery': return '#2E2266'; // Purple for discovery
                case 'catalyst': return 'var(--pillar-catalyst-color)';
                default: return 'var(--pillar-transformation-color)';
              }
            };
            
            return (
              <div 
                key={pillar.name} 
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300"
              >
                {/* Colored header section with white text */}
                <div 
                  className="px-4 py-3 flex items-center text-white"
                  style={{ 
                    backgroundColor: getPillarColor()
                  }}
                >
                  <div 
                    className="w-12 h-12 flex items-center justify-center mr-3"
                  >
                    <FontAwesomeIcon icon={pillar.icon} size="2x" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{pillar.name}</h4>
                    <p className="text-xs text-white text-opacity-90">{pillar.focus}</p>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-4">
                  <p className="elx-body">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOCIAL PROOF: Executive testimonials */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="elx-heading-2">What Other Executives Are Saying</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg mr-3">
                SC
              </div>
              <div>
                <h4 className="font-semibold text-elx-primary">Sarah Chen</h4>
                <p className="text-sm text-gray-600">CEO, TechVision Global</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "We configured our entire transformation plan in one evening, with complete cost visibility from the start. The time saved on traditional consulting discussions alone was worth it."
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg mr-3">
                ML
              </div>
              <div>
                <h4 className="font-semibold text-elx-primary">Michael Lawson</h4>
                <p className="text-sm text-gray-600">COO, Apex Industries</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "After trying to scope a transformation project for months with another firm, we had a comprehensive plan ready within hours using this tool. The transparency alone was worth it."
            </p>
          </div>
        </div>
      </div>

      {/* 6. EXPANDABLE SECTIONS - Detailed information for CEOs who want to dig deeper */}
      <div className="space-y-0 mb-8 bg-[#f8f9fc] rounded-xl p-6 border border-gray-200 shadow-sm">
        {/* Detailed Process Section - Expandable */}
        <div className="border-t border-gray-200 overflow-hidden" id="detailed-process">
          <div 
            className="py-4 px-2 flex items-center justify-between w-full cursor-pointer"
            onClick={() => toggleSection('process')}
          >
            <h3 className="font-semibold text-lg text-indigo-900">Solution Development Process</h3>
            <div>
              <FontAwesomeIcon 
                icon={expandedSections.process ? faMinus : faPlus} 
                className="text-indigo-900" 
              />
            </div>
          </div>
          
          {expandedSections.process && (
            <div className="p-5 bg-white border-t border-gray-100">
              <p className="text-gray-700 mb-4">
                Our streamlined process ensures you get exactly the business solution you need, with full visibility at every step. Designed for busy executives who need results without endless meetings and proposals.
              </p>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-elx-primary mb-2">Define Your Business Objectives</h4>
                    <p className="text-gray-600 mb-3">
                      Identify your most critical business problem from our pre-configured scenarios, or customize your own multi-faceted approach. This establishes the foundation for your transformation journey.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                      <h5 className="font-medium text-elx-primary mb-2">This step includes:</h5>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Selecting from common business transformation scenarios or creating a custom challenge definition</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Tailoring to your specific industry context and business environment</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Establishing clear success metrics so we can measure transformation outcomes</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      Unlike traditional consulting approaches that begin with pre-determined solutions, we start by understanding your unique situation and requirements.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-elx-primary mb-2">Select Solution Components</h4>
                    <p className="text-gray-600 mb-3">
                      Choose the exact services needed to solve your problem across our transformation pillars: Transformation (People & Process), Strategy (Vision & Direction), and Technology (Tools & Systems).
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                      <h5 className="font-medium text-elx-primary mb-2">This step includes:</h5>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Exploring our comprehensive module library with detailed descriptions of each service</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Selecting from multiple delivery options for each module (from quick insights to full implementation)</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Understanding how modules work together to create comprehensive transformation</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      You'll see the exact purpose and business impact of each component, allowing you to create a solution that precisely addresses your specific challenges.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-elx-primary mb-2">Configure Parameters & Delivery</h4>
                    <p className="text-gray-600 mb-3">
                      Adjust resource levels, timeline, and engagement model to align with your budget, urgency, and internal capabilities. This gives you complete control over how your solution is delivered.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                      <h5 className="font-medium text-elx-primary mb-2">This step includes:</h5>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Fine-tuning delivery timeframes to match your business urgency (from quick-start to phased approach)</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Allocating resources across your transformation pillars based on your priorities</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Setting collaboration levels between your team and our consultants</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                          <span>Viewing real-time cost calculations with complete transparency</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      This adaptive approach ensures you're never forced into a rigid consulting framework—instead, the solution adapts to your specific needs and constraints.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-elx-accent bg-opacity-10 rounded-lg p-5 mt-6 border border-elx-accent border-opacity-20">
                <h4 className="font-semibold text-elx-primary mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mr-2" />
                  Your Complete Business Solution Package
                </h4>
                <p className="text-gray-700 mb-3">
                  Upon completion, you'll receive a comprehensive business solution with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Executive summary with business case</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Strategic implementation timeline</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Itemized pricing with complete transparency</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Clear ROI projections and metrics</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Optimized resource allocation plan</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Boardroom-ready presentation materials</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-elx-secondary border-opacity-20">
                  <p className="text-gray-700">
                    Download this comprehensive package to share with your executive team, or proceed directly to implementation. The entire process gives you complete control with full cost visibility, precise timelines, and clear expected outcomes.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="elx-section-heading flex items-center">
                  <FontAwesomeIcon icon={faLightbulb} className="text-amber-500 mr-2" />
                  Executive Benefits
                </h5>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Time Efficiency:</strong> Configure complex solutions in minutes instead of sitting through weeks of consulting presentations.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Cost Visibility:</strong> See exactly what you're paying for with transparent pricing—no surprises or hidden fees.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Control:</strong> Make decisions on your timeline without pressure—evaluate options thoroughly before committing.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Precision:</strong> Get exactly what your business needs without paying for unnecessary consulting services.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* FINAL CTA: Emphasize control, transparency and ease */}
      <div className="flex flex-col items-center pt-5 mt-2 border-t border-gray-200">
        <p className="text-gray-600 mb-5 text-center max-w-3xl">
          Ready to craft your strategic business plan? Get exactly what you need with complete transparency on costs, timelines, and expected outcomes.
        </p>
        <button
          onClick={onGetStarted}
          className="elx-btn-primary"
        >
          Design My Business Solution
          <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
        </button>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Make informed decisions, on your terms. Build your plan in under 5 minutes.
        </p>
        
        {/* Executive Decision Support */}
        <div className="mt-5 text-center max-w-xl">
          <p className="text-sm text-gray-600 flex flex-wrap justify-center items-center gap-3">
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mr-1" /> Complete cost transparency</span>
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mr-1" /> Detailed ROI projections</span>
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mr-1" /> Implementation timeline included</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorIntroduction;
