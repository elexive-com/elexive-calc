import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, faArrowRight, faCalculator, 
  faLightbulb, faChartLine, faPuzzlePiece,
  faTools, faShieldAlt, faUsers,
  faCompass, faServer, faCheckCircle,
  faPlus, faMinus, faClock, faPercentage, faHandshake
} from '@fortawesome/free-solid-svg-icons';

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

  // Pillar configuration - now directly visible on the page
  const pillars = [
    {
      name: 'Transformation',
      focus: 'People & Process',
      icon: faUsers,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Transform your organization with leadership strategies, cultural shifts, and agile methodologies.'
    },
    {
      name: 'Strategy',
      focus: 'Vision & Direction',
      icon: faCompass,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Define your vision and chart the path forward with strategic insights and market positioning.'
    },
    {
      name: 'Technology',
      focus: 'Tools & Systems',
      icon: faServer,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      description: 'Harness cutting-edge technology to drive innovation, efficiency, and competitive advantage.'
    }
  ];

  return (
    <div className="elx-card p-6 mb-6">
      {/* 1. CLEAR VALUE PROPOSITION - CEOs want to immediately understand the value */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-elx-primary mb-3">
            Fast-Track Your Business Transformation
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl">
            Configure precise solutions for your specific business challenges in minutes with complete transparency.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-20 h-20 bg-elx-primary rounded-xl shadow-md mt-4 md:mt-0 md:ml-6">
          <FontAwesomeIcon icon={faCalculator} className="text-white text-3xl" />
        </div>
      </div>

      {/* NEW SECTION: Key Business Outcomes and Timeframes - CEOs need this to decide */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-elx-primary mb-4">What You'll Gain</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-elx-accent hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-elx-accent bg-opacity-10 text-elx-accent mb-4">
                <FontAwesomeIcon icon={faPercentage} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Measurable ROI</h4>
              <p className="text-gray-600">
                Our clients typically see 3-5x return on their transformation investment within 12-18 months.
              </p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-amber-500 hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 mb-4">
                <FontAwesomeIcon icon={faClock} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Time-to-Value</h4>
              <p className="text-gray-600">
                Start seeing operational improvements and quick wins within the first 4-6 weeks of implementation.
              </p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Risk Mitigation</h4>
              <p className="text-gray-600">
                Modular approach with clear milestones allows for course correction without "all-in" commitments.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-elx-primary border-opacity-10 bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-elx-primary" />
            <strong>Time investment to configure:</strong> Less than 5 minutes to create your initial transformation scenario.
          </p>
        </div>
      </div>

      {/* 2. BUSINESS CHALLENGES - CEOs primarily care about their specific problems */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-elx-primary mb-4">Critical Business Challenges We Solve</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-blue-400 hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Growth & Revenue</h4>
              <p className="text-gray-600">
                Break revenue plateaus, capitalize on market opportunities, and develop sustainable growth engines that keep your business competitive.
              </p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-amber-400 hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 mb-4">
                <FontAwesomeIcon icon={faTools} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Execution & Operations</h4>
              <p className="text-gray-600">
                Eliminate operational bottlenecks, streamline decision processes, and build execution capabilities that turn strategy into measurable results.
              </p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-sm border-l-4 border-green-400 hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-white">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600 mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
              </div>
              <h4 className="font-bold text-lg text-elx-primary mb-2">Innovation & Resilience</h4>
              <p className="text-gray-600">
                Future-proof your business with adaptive capabilities, emerging technology integration, and innovation systems that maintain market leadership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VALUE PROPOSITION - CEOs want to know how we'll empower them */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-elx-primary mb-3">Take Control of Your Business Transformation</h3>
        <p className="text-gray-700 mb-3 leading-relaxed">
          This self-service tool puts you in the driver's seat. Configure exactly the expertise, resources, and timeline needed to address your specific business challenges with complete cost transparency.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Whether you're facing growth plateaus, digital disruption, operational bottlenecks, or leadership gaps, you'll see precisely what it takes to solve these problems—with no sales pressure.
        </p>
      </div>

      {/* 4. QUICK 3-STEP PROCESS - CEOs want to know it's simple & straightforward */}
      <div className="bg-[#f8f9fc] rounded-xl p-6 border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-elx-primary mb-4 flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mr-2" />
          Configure Your Solution in 3 Simple Steps
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-elx-primary mb-1">Define Challenge</h4>
              <p className="text-gray-600 text-sm">
                Identify your most critical business problem or opportunity.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-elx-primary mb-1">Select Components</h4>
              <p className="text-gray-600 text-sm">
                Choose the exact services needed across our transformation pillars.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-elx-primary mb-1">Set Parameters</h4>
              <p className="text-gray-600 text-sm">
                Adjust resource levels and timeline to match your budget and urgency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRANSFORMATION PILLARS - Now CEOs want to understand the solution framework */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-elx-primary mb-4">Our Transformation Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map(pillar => (
            <div 
              key={pillar.name} 
              className={`rounded-lg p-4 ${pillar.bgColor} ${pillar.borderColor} border transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-start mb-3">
                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm ${pillar.textColor}`}>
                  <FontAwesomeIcon icon={pillar.icon} size="lg" />
                </div>
                <div className="ml-3">
                  <h4 className={`text-lg font-bold ${pillar.textColor}`}>{pillar.name}</h4>
                  <p className="text-sm text-gray-500">{pillar.focus}</p>
                </div>
              </div>
              <p className="text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NEW SECTION: CEO and Executive Testimonials - Social Proof */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-elx-primary mb-4">What Other Executives Are Saying</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-elx-primary flex items-center justify-center text-white font-bold text-lg mr-3">
                SC
              </div>
              <div>
                <h4 className="font-bold text-elx-primary">Sarah Chen</h4>
                <p className="text-sm text-gray-600">CEO, TechVision Global</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "This tool saved us countless hours of traditional consulting discussions. We configured our transformation program in minutes, not weeks, and had complete visibility into costs and outcomes from day one."
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-elx-primary flex items-center justify-center text-white font-bold text-lg mr-3">
                ML
              </div>
              <div>
                <h4 className="font-bold text-elx-primary">Michael Lawson</h4>
                <p className="text-sm text-gray-600">COO, Apex Industries</p>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "After trying to scope a transformation project for months with another consulting firm, we used this calculator and had a comprehensive plan in an afternoon. The transparency alone was worth it."
            </p>
          </div>
        </div>
      </div>

      {/* 6. EXPANDABLE SECTIONS - Detailed information for CEOs who want to dig deeper */}
      <div className="space-y-4 mb-8">
        {/* Value Model Section - Expandable */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection('evcModel')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-elx-accent bg-opacity-20 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faPuzzlePiece} className="text-elx-accent" />
              </div>
              <h3 className="text-lg font-bold text-elx-primary">Our Transparent Value Delivery Model</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FontAwesomeIcon 
                icon={expandedSections.evcModel ? faMinus : faPlus} 
                className="text-elx-accent" 
              />
            </div>
          </div>
          
          {expandedSections.evcModel && (
            <div className="p-5 bg-white border-t border-gray-100">
              <p className="text-gray-700 mb-5">
                Our approach uses Elastic Value Credits (EVCs)—transparent work units that show exactly what expertise and resources are applied to your business challenge, with measurable ROI tracking from day one.
              </p>
              
              <div className="bg-[#f8f9fc] rounded-lg p-5 mb-5 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-elx-primary mb-2">Your Business Challenge</div>
                    <div className="text-sm text-gray-600 mb-3">Precisely Defined Problem</div>
                    <div className="bg-white rounded-lg px-4 py-3 font-bold text-elx-accent shadow-sm border border-elx-accent border-opacity-20">
                      Right-Sized Resources
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <FontAwesomeIcon icon={faArrowRight} className="text-elx-primary text-xl" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-elx-primary mb-2">Measurable Results</div>
                    <div className="text-sm text-gray-600 mb-3">Quantifiable Outcomes</div>
                    <div className="bg-white rounded-lg px-4 py-3 font-bold text-elx-secondary shadow-sm border border-elx-secondary border-opacity-20">
                      Business Impact
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700">
                We address immediate business challenges while simultaneously building your internal capabilities. You get both the immediate solution you need and the long-term organizational strength to prevent similar issues in the future.
              </p>
            </div>
          )}
        </div>
        
        {/* Detailed Process Section - Expandable */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleSection('process')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faLightbulb} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-elx-primary">Detailed Solution Process</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FontAwesomeIcon 
                icon={expandedSections.process ? faMinus : faPlus} 
                className="text-elx-accent" 
              />
            </div>
          </div>
          
          {expandedSections.process && (
            <div className="p-5 bg-white border-t border-gray-100">
              <p className="text-gray-700 mb-4">
                Our collaborative process ensures you get exactly the transformation solution your business needs, with transparency at every step. We've designed this approach based on how today's forward-thinking executives prefer to make decisions—with full visibility and control.
              </p>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-elx-primary text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-elx-primary mb-2">Define Your Business Challenge</h4>
                    <p className="text-gray-600 mb-3">
                      Identify your most critical business problem from our pre-configured scenarios, or customize your own multi-faceted approach. This establishes the foundation for your transformation journey.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
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
                    <h4 className="text-lg font-bold text-elx-primary mb-2">Select Solution Components</h4>
                    <p className="text-gray-600 mb-3">
                      Choose the exact services needed to solve your problem across our transformation pillars: Transformation (People & Process), Strategy (Vision & Direction), and Technology (Tools & Systems).
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
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
                    <h4 className="text-lg font-bold text-elx-primary mb-2">Configure Parameters & Delivery</h4>
                    <p className="text-gray-600 mb-3">
                      Adjust resource levels, timeline, and engagement model to align with your budget, urgency, and internal capabilities. This gives you complete control over how your solution is delivered.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
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
                <h4 className="font-bold text-elx-primary mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mr-2" />
                  Your Customized Solution Outcome
                </h4>
                <p className="text-gray-700 mb-3">
                  At the end of this process, you'll receive a comprehensive solution specifically designed for your business challenges with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Detailed breakdown of all solution components</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Clear timeline with key milestones and deliverables</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Transparent pricing with no hidden costs</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Expected business outcomes and ROI projections</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Resource allocation plan across transformation pillars</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-secondary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">Detailed implementation approach customized to your needs</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-elx-secondary border-opacity-20">
                  <p className="text-gray-700">
                    You can download this as a detailed report to share with stakeholders, save it for future reference, or proceed directly to implementation. The entire process puts you in control with complete transparency on costs, timelines, and expected outcomes.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-elx-primary mb-2 flex items-center">
                  <FontAwesomeIcon icon={faLightbulb} className="text-amber-500 mr-2" />
                  What Makes Our Approach Different
                </h5>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Complete Transparency:</strong> You see exactly what you're getting, how it's priced, and the expected outcomes—no black boxes or hidden agendas.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Self-Directed Exploration:</strong> Explore options at your own pace without sales pressure—put yourself in the driver's seat.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Value Before Commitment:</strong> Experience our expertise and approach through this tool before making any commitments.</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Modular Flexibility:</strong> Build precisely what you need instead of conforming to rigid, pre-packaged consulting offerings.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 7. CTA - Prominent and Action-Oriented with reinforcing text */}
      <div className="flex flex-col items-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 mb-5 text-center max-w-3xl">
          Ready to transform your business? Take control with our self-service tool and get complete transparency on costs, timelines, and expected outcomes.
        </p>
        <button
          onClick={onGetStarted}
          className="elx-btn bg-elx-accent text-elx-primary px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold text-lg flex items-center"
        >
          Build My Custom Solution
          <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
        </button>
        <p className="text-sm text-gray-500 mt-3 text-center">
          No commitment required. Configure your solution in minutes.
        </p>
        
        {/* NEW SECTION: No-Risk Reassurance */}
        <div className="mt-5 text-center max-w-xl">
          <p className="text-sm text-gray-600 flex flex-wrap justify-center items-center gap-3">
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" /> No credit card required</span>
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" /> Download your custom plan instantly</span>
            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" /> Export options for stakeholder sharing</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorIntroduction;