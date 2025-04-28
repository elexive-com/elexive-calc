import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, faArrowDown, faCalculator, 
  faLightbulb, faRocket,
  faPuzzlePiece, faLayerGroup, faExchangeAlt,
  faMinus, faPlus, faCheckCircle,
  faChartLine, faTools, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const CalculatorIntroduction = ({ onGetStarted }) => {
  const [expandedSections, setExpandedSections] = useState({
    evcModel: false,
    howItWorks: false,
    whatToExpect: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      {/* Header with logo and title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-elx-primary">
            Solve Your Business Challenges
          </h2>
          <p className="text-gray-600 mt-1">Get targeted solutions for growth, transformation, and performance</p>
        </div>
        <div className="hidden sm:block w-16 h-16 bg-elx-accent rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faCalculator} className="text-elx-primary text-2xl" />
        </div>
      </div>

      {/* Main introduction section */}
      <div className="bg-[#f8f9fc] rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-elx-accent-light flex items-center justify-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-elx-accent text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-elx-primary mb-2">Calculate Solutions for Your Top Priorities</h3>
            <p className="text-gray-700 mb-3">
              This tool helps you pinpoint the exact expertise and resources needed to solve your most pressing business challenges. Get clear costs, timelines, and ROI projections for addressing specific problems in Transformation, Strategy, and Technology.
            </p>
            <p className="text-gray-700">
              Whether you're facing growth plateaus, digital disruption, operational inefficiencies, or leadership gaps, we'll show you precisely what it takes to overcome these obstacles.
            </p>
          </div>
        </div>
      </div>

      {/* Three Key Business Challenges Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-elx-accent-light flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faChartLine} className="text-elx-accent" />
          </div>
          <h3 className="font-medium text-elx-primary mb-1">Growth & Revenue</h3>
          <p className="text-xs text-gray-600">
            Break through plateaus, unlock new revenue streams, or stabilize declining sales with targeted growth initiatives.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-elx-accent-light flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faTools} className="text-elx-accent" />
          </div>
          <h3 className="font-medium text-elx-primary mb-1">Execution & Operations</h3>
          <p className="text-xs text-gray-600">
            Fix operational bottlenecks, streamline decision-making, and build execution capability across your organization.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-elx-accent-light flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faShieldAlt} className="text-elx-accent" />
          </div>
          <h3 className="font-medium text-elx-primary mb-1">Resilience & Innovation</h3>
          <p className="text-xs text-gray-600">
            Future-proof your business, respond to disruptions, and develop innovative capabilities to maintain market leadership.
          </p>
        </div>
      </div>

      {/* The Value Model Section */}
      <div className="border border-gray-200 rounded-xl mb-5">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection('evcModel')}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExchangeAlt} className="text-elx-accent mr-3" />
            <h3 className="text-lg font-semibold text-elx-primary">How Our Results-Focused Approach Works</h3>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.evcModel ? faMinus : faPlus} 
            className="text-elx-accent" 
          />
        </div>
        
        {expandedSections.evcModel && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <p className="text-gray-700 mb-4">
              We use Elastic Value Credits (EVCs) to deliver measurable results with complete transparency. These work units let you see exactly what resources are being applied to your specific business challenges and track the ROI.
            </p>
            
            <div className="bg-elx-accent-light bg-opacity-30 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="text-center p-3">
                  <div className="text-sm mb-1 font-medium text-elx-primary">Your Business Challenge</div>
                  <div className="text-xs text-gray-600 mb-2">Clearly Defined Problem</div>
                  <div className="bg-white rounded-lg px-3 py-2 font-bold text-elx-accent">Targeted Resources</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faArrowDown} className="text-gray-400 text-xl mb-1 rotate-90" />
                  <div className="text-xs text-gray-500">Delivers</div>
                </div>
                
                <div className="text-center p-3">
                  <div className="text-sm mb-1 font-medium text-elx-primary">Measurable Outcomes</div>
                  <div className="text-xs text-gray-600 mb-2">Tangible Results</div>
                  <div className="bg-white rounded-lg px-3 py-2 font-bold text-elx-secondary">Business Impact</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">
              Our flexible approach tackles immediate problems while building long-term capabilities. We address your current business challenges head-on while simultaneously developing the internal leadership capacity to prevent similar issues in the future.
            </p>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="border border-gray-200 rounded-xl mb-5">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection('howItWorks')}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-elx-accent mr-3" />
            <h3 className="text-lg font-semibold text-elx-primary">Configure Your Solution in 3 Steps</h3>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.howItWorks ? faMinus : faPlus} 
            className="text-elx-accent" 
          />
        </div>
        
        {expandedSections.howItWorks && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-elx-primary mb-1 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-2 text-sm">1</div>
                  Select your challenge
                </div>
                <p className="text-xs text-gray-600">
                  Identify your most critical business problem from our pre-configured solutions, or customize your own multi-faceted approach.
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-elx-primary mb-1 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-2 text-sm">2</div>
                  Choose solution components
                </div>
                <p className="text-xs text-gray-600">
                  Pick the exact services needed to solve your problem across business transformation, strategic planning, and technology enablement.
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-elx-primary mb-1 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-2 text-sm">3</div>
                  Set your parameters
                </div>
                <p className="text-xs text-gray-600">
                  Adjust resource levels, timeline, and engagement model to align with your budget, urgency, and internal capabilities.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm">
              The calculator provides instant visibility into costs, timeframes, and expected outcomes. What you see is what you get—with complete transparency in how we'll solve your specific business challenges.
            </p>
          </div>
        )}
      </div>

      {/* What to Expect Section */}
      <div className="border border-gray-200 rounded-xl mb-6">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection('whatToExpect')}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPuzzlePiece} className="text-elx-accent mr-3" />
            <h3 className="text-lg font-semibold text-elx-primary">Solutions Tailored to Your Timeline</h3>
          </div>
          <FontAwesomeIcon 
            icon={expandedSections.whatToExpect ? faMinus : faPlus} 
            className="text-elx-accent" 
          />
        </div>
        
        {expandedSections.whatToExpect && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faLightbulb} className="text-elx-accent mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-elx-primary mb-1">Immediate Problem-Solving</h4>
                  <p className="text-xs text-gray-600">
                    Get fast answers to pressing challenges with diagnosis, clear recommendations, and implementation roadmaps. Ideal when you need expert guidance on specific issues.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FontAwesomeIcon icon={faRocket} className="text-elx-accent mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-elx-primary mb-1">Sustained Performance Improvement</h4>
                  <p className="text-xs text-gray-600">
                    Transform entire business functions with comprehensive solutions that include implementation support, capability building, and continuous optimization to ensure lasting results.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-[#f8f9fc] p-3 rounded-lg">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-elx-primary mb-1">Your Detailed Solution Includes</h4>
                  <p className="text-xs text-gray-600">
                    After configuring your solution, you'll receive a complete proposal with:
                  </p>
                  <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                    <li>Detailed analysis of your business challenge</li>
                    <li>Expected business outcomes with measurable KPIs</li>
                    <li>Resource breakdown and implementation timeline</li>
                    <li>Clear milestones and delivery schedule</li>
                    <li>Complete pricing with no hidden costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Get Started Button */}
      <div className="flex justify-center">
        <button
          onClick={onGetStarted}
          className="px-8 py-3 bg-elx-accent text-elx-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
          Solve My Business Challenge
        </button>
      </div>
    </div>
  );
};

export default CalculatorIntroduction;