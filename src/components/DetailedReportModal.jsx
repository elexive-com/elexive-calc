import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, faTimes, faChartLine, faPuzzlePiece, faUsers, 
  faLightbulb, faTools, faBriefcase, faCalculator,
  faColumns, faRocket, faChevronUp, faChevronDown,
  faLock, faSpinner, faFileExport, faEnvelope,
  faInfoCircle, faCheckCircle, faCreditCard,
  faShieldAlt, faGlobe, faLayerGroup, faGraduationCap, faUserTie, faStar,
  faHandshake, faLongArrowAltRight, faBusinessTime, faChartBar
} from '@fortawesome/free-solid-svg-icons';

import { generateReportPdf } from '../pdf';
import calculatorConfig from '../config/calculatorConfig.json';
import modulesConfig from '../config/modulesConfig.json';
import { getIcon } from '../utils/iconUtils';

const DetailedReportModal = ({ isOpen, onClose, calculator }) => {
  const [isExporting, setIsExporting] = useState(false);
  const reportContentRef = useRef(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedAddOns, setExpandedAddOns] = useState({});
  // Add new state for strategic approach items
  const [expandedStrategicItems, setExpandedStrategicItems] = useState({
    pillars: {},
    delivery: {}
  });
  
  if (!isOpen) return null;

  // Toggle module expansion
  const toggleModule = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  // Toggle add-on expansion
  const toggleAddOn = (addOnId) => {
    setExpandedAddOns(prev => ({
      ...prev,
      [addOnId]: !prev[addOnId]
    }));
  };
  
  // Toggle strategic pillar expansion
  const togglePillar = (pillar) => {
    setExpandedStrategicItems(prev => ({
      ...prev,
      pillars: {
        ...prev.pillars,
        [pillar]: !prev.pillars[pillar]
      }
    }));
  };

  // Toggle delivery framework item expansion
  const toggleDeliveryItem = (item) => {
    setExpandedStrategicItems(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [item]: !prev.delivery[item]
      }
    }));
  };

  const { 
    totalPrice,
    evcPricePerUnit,
    paymentOption,
    intent,
    selectedModules,
    modules,
    evcBase,
    parameters,
    serviceParameters,
    resourceAllocation,
    selectedVariants = {},
    productionCapacity,
    completionTimeWeeks
  } = calculator;

  // Get selected modules with their EVC values and full details
  const selectedModuleDetails = modules
    .filter(module => selectedModules.includes(module.name))
    .map(module => {
      const variantType = selectedVariants[module.name] || 'insightPrimer';
      const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
      const evcValue = module.variants[variantIndex]?.evcValue || module.variants[0].evcValue;
      
      return {
        name: module.name,
        pillar: module.pillar,
        category: module.category,
        heading: module.heading,
        description: module.description,
        selectedVariant: variantType,
        evcValue: evcValue,
        evcRange: {
          min: module.variants[0].evcValue,
          max: module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue
        }
      };
    });
  
  // Group modules by pillar
  const modulesByPillar = selectedModuleDetails.reduce((acc, module) => {
    if (!acc[module.pillar]) {
      acc[module.pillar] = [];
    }
    acc[module.pillar].push(module);
    return acc;
  }, {});
  
  // Calculate total EVC sum of all selected modules
  const totalEvcSum = selectedModuleDetails.reduce((sum, module) => sum + module.evcValue, 0);

  // Calculate the absolute EVC overhead for resource allocation
  const overheadPercentage = calculatorConfig.resourceAllocation[resourceAllocation]?.switchingOverhead || 0;
  const absoluteOverheadEvcs = Math.ceil((totalEvcSum * overheadPercentage) / 100);
  
  // Total EVCs needed including overhead
  const totalEvcsWithOverhead = totalEvcSum + absoluteOverheadEvcs;

  // Get weekly production capacity
  const weeklyEVCs = calculatorConfig.productionCapacity[productionCapacity]?.weeklyEVCs || 0;
  
  // Helper function to calculate EVC cost for parameters
  const calculateEvcCost = (param) => {
    if (!param.evcCost) return null;
    
    const { type, value } = param.evcCost;
    
    if (type === 'absolute') {
      return value;
    } else if (type === 'relative') {
      // Calculate relative value and round up to nearest integer
      return Math.ceil((weeklyEVCs * value) / 100);
    }
    
    return null;
  };
  
  // Get payment option details
  const paymentDetails = evcBase.paymentOptions[paymentOption];
  
  // Use the completion time weeks from the calculator hook for consistency
  const estimatedCompletionWeeks = completionTimeWeeks;
    
  // Total EVC value across all modules (for display in report)
  const totalEvcValue = totalEvcsWithOverhead;
  
  // Get variant display name
  const getVariantDisplayName = (variantType) => {
    return variantType === 'insightPrimer' ? 'Insight Primer' : 'Integrated Execution';
  };
  
  // Get variant icon
  const getVariantIcon = (variantType) => {
    return variantType === 'insightPrimer' ? faLightbulb : faTools;
  };
  
  // Get pillar icon
  const getPillarIcon = (pillar) => {
    // Find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars.find(
      p => p.label.toLowerCase() === pillar.toLowerCase()
    );
    
    if (pillarConfig && pillarConfig.icon) {
      return getIcon(pillarConfig.icon);
    }
    
    // Fallback to default icons if not found in config
    switch(pillar) {
      case 'Transformation': return faUsers;
      case 'Strategy': return faChartLine;
      case 'Technology': return faShieldAlt;
      case 'Discovery': return faGlobe;
      default: return faPuzzlePiece;
    }
  };
  
  // Get pillar color class
  const getPillarColorClass = (pillar) => {
    // Try to find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars.find(
      p => p.label.toLowerCase() === pillar.toLowerCase()
    );
    
    if (pillarConfig) {
      // If the pillar is found in the config, return a color class based on the pillar's id
      switch(pillarConfig.id.toLowerCase()) {
        case 'transformation': return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'strategy': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'technology': return 'text-green-600 bg-green-50 border-green-200';
        case 'discovery': return 'text-amber-600 bg-amber-50 border-amber-200';
        case 'catalyst': return 'text-blue-800 bg-blue-50 border-blue-300';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    }
    
    // Fallback to legacy color mapping if not found in config
    switch(pillar) {
      case 'Transformation': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Strategy': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Technology': return 'text-green-600 bg-green-50 border-green-200';
      case 'Discovery': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Catalyst': return 'text-blue-800 bg-blue-50 border-blue-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Format number with thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate total projected cost for the entire implementation
  const totalProjectedCost = totalPrice * estimatedCompletionWeeks;
  
  // PDF export function
  const exportToPdf = async () => {
    setIsExporting(true);
    
    try {
      // Prepare the data needed for the PDF generation
      const reportData = {
        intent,
        totalPrice,
        completionTimeWeeks,
        totalEvcValue,
        formatNumber,
        paymentDetails,
        paymentOption,
        totalProjectedCost,
        productionCapacity,
        calculatorConfig,
        weeklyEVCs,
        modulesByPillar,
        estimatedCompletionWeeks,
        resourceAllocation,
        evcPricePerUnit,
        parameters,
        serviceParameters,
        calculator
      };
      
      // Generate the PDF
      await generateReportPdf(reportContentRef, reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with title - more professional styling */}
        <div className="bg-elx-primary shadow-md z-20 border-b">
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faBookmark} className="text-white mr-3 opacity-90" />
              Enterprise Strategic Solution Brief
              {intent && <span className="ml-3 text-sm font-normal text-white opacity-80">|</span>}
              {intent && <span className="ml-3 text-sm font-normal text-white opacity-80">{intent}</span>}
            </h2>
            <button 
              onClick={onClose}
              className="text-white focus:outline-none p-2 rounded-full transition-colors bg-black bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" className="text-white hover:text-elx-accent" />
            </button>
          </div>
        </div>
        
        {/* Content area with overflow - single scrollable view */}
        <div className="overflow-y-auto flex-grow p-8 min-h-[300px] bg-gray-50" ref={reportContentRef}>
          {/* Executive Summary Section with detailed context */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              Executive Summary
            </h3>

            {/* Context description for the executive audience */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                This Strategic Solution Brief outlines a comprehensive business transformation plan tailored to your organization's specific needs and objectives. 
                Based on your selections, we've designed a {estimatedCompletionWeeks}-week implementation roadmap that addresses 
                {Object.keys(modulesByPillar).map((pillar, index, array) => {
                  if (index === 0) return ` ${pillar}`;
                  if (index === array.length - 1) return ` and ${pillar}`;
                  return `, ${pillar}`;
                })} 
                priorities using our proven Elastic Value Credit (EVC) framework.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The proposed solution leverages {calculatorConfig.productionCapacity[productionCapacity].label} delivery capacity with a 
                {resourceAllocation === 'focused' ? ' laser-focused approach' : 
                 resourceAllocation === 'balanced' ? ' balanced resource allocation strategy' : 
                 ' distributed multi-channel strategy'} to maximize business impact while maintaining operational flexibility.
                {selectedModules.length > 0 ? ` We've included ${selectedModules.length} strategic modules across ${Object.keys(modulesByPillar).length} business pillars to address your complete transformation needs.` : ''}
              </p>
            </div>
            
            {/* Executive Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500 shadow-md">
                <div className="text-blue-700 mb-1 text-sm font-semibold uppercase tracking-wider">Investment</div>
                <div className="text-3xl font-bold text-elx-primary mb-2">€{formatNumber(totalPrice)}</div>
                <div className="text-gray-600 text-sm">Weekly investment</div>
                <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-lg inline-block mt-3 font-medium">
                  €{formatNumber(totalProjectedCost)} total projected cost
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  {paymentOption === 'prepaid' ? 
                    `Includes ${((1 - paymentDetails.priceModifier) * 100).toFixed(0)}% prepayment discount with reserved capacity benefits.` : 
                    'Standard monthly billing with maximum financial flexibility.'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-5 border-l-4 border-amber-500 shadow-md">
                <div className="text-amber-700 mb-1 text-sm font-semibold uppercase tracking-wider">Delivery Capacity</div>
                <div className="text-3xl font-bold text-elx-primary mb-2">{weeklyEVCs} EVCs</div>
                <div className="text-gray-600 text-sm">Weekly production capacity</div>
                <div className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-lg inline-block mt-3 font-medium">
                  {calculatorConfig.productionCapacity[productionCapacity].label} tier
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Ensures reliable, consistent progress with appropriate transformation velocity for your organization.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-5 border-l-4 border-green-500 shadow-md">
                <div className="text-green-700 mb-1 text-sm font-semibold uppercase tracking-wider">Implementation Timeline</div>
                <div className="text-3xl font-bold text-elx-primary mb-2">{estimatedCompletionWeeks} weeks</div>
                <div className="text-gray-600 text-sm">Estimated completion time</div>
                <div className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-lg inline-block mt-3 font-medium">
                  {totalEvcsWithOverhead} total EVC scope
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Strategic implementation timeline based on selected modules, capacity, and resource allocation strategy.
                </p>
              </div>
            </div>
            
            {/* Strategic Approach Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h4 className="text-xl font-bold text-elx-primary mb-5">Strategic Approach</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Strategic Pillars</h5>
                  <div className="space-y-4 mb-6">
                    {Object.entries(modulesByPillar).map(([pillar, modules]) => (
                      <div key={pillar} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div 
                          className="flex items-start p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => togglePillar(pillar)}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow ${getPillarColorClass(pillar)}`}>
                            <FontAwesomeIcon icon={getPillarIcon(pillar)} size="lg" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-elx-primary">{pillar}</div>
                            <div className="text-sm text-gray-600">{modules.length} modules selected</div>
                          </div>
                          <div className="ml-2 text-gray-400">
                            <FontAwesomeIcon 
                              icon={expandedStrategicItems.pillars[pillar] ? faChevronUp : faChevronDown} 
                              className="transition-transform"
                            />
                          </div>
                        </div>
                        
                        {/* Collapsible content */}
                        <div className={`overflow-hidden transition-all duration-300 ${
                          expandedStrategicItems.pillars[pillar] ? 'max-h-[500px]' : 'max-h-0'
                        }`}>
                          <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50">
                            <p className="text-sm text-gray-600 mb-2">
                              {pillar === 'Transformation' ? 
                                'Focus on people, processes, and organizational change management to enable successful business transformation.' :
                              pillar === 'Strategy' ? 
                                'Establish clear direction, market positioning, and competitive differentiation to drive business outcomes.' :
                              pillar === 'Technology' ? 
                                'Implement and optimize technological capabilities to support business innovation and efficiency.' :
                              'Explore new opportunities and build foundational knowledge to inform strategic decisions.'}
                            </p>
                            <div className="text-xs font-medium text-gray-500 uppercase mb-1 mt-3">Key Modules</div>
                            <div className="flex flex-wrap gap-2">
                              {modules.map(module => (
                                <div key={module.name} className="bg-gray-100 text-xs px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                                  {module.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Framework</h5>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div 
                        className="flex items-start p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleDeliveryItem('velocity')}
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 shadow">
                          <FontAwesomeIcon icon={faRocket} size="lg" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-elx-primary">Transformation Velocity</div>
                          <div className="text-sm text-gray-600">{calculatorConfig.productionCapacity[productionCapacity].label} ({weeklyEVCs} EVCs/week)</div>
                        </div>
                        <div className="ml-2 text-gray-400">
                          <FontAwesomeIcon 
                            icon={expandedStrategicItems.delivery.velocity ? faChevronUp : faChevronDown} 
                            className="transition-transform"
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible content */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedStrategicItems.delivery.velocity ? 'max-h-[500px]' : 'max-h-0'
                      }`}>
                        <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50">
                          <p className="text-sm text-gray-600">
                            {productionCapacity === 'pathfinder' ? 
                              'Focused exploration and initial implementation for targeted challenges. This approach provides a controlled pace suitable for organizations starting their transformation journey or addressing specific pain points.' :
                            productionCapacity === 'roadster' ? 
                              'Balanced approach delivering consistent progress without disrupting operations. This mid-tier velocity is ideal for organizations that need meaningful change while maintaining operational stability.' :
                            productionCapacity === 'jetpack' ? 
                              'Accelerated transformation with significant business impact and rapid results. This high-velocity approach enables organizations to quickly respond to market pressures and drive competitive advantage.' :
                              'Enterprise-grade transformation with maximum velocity for critical initiatives. This approach dedicates significant resources to drive comprehensive change across the organization for maximum strategic impact.'}
                          </p>
                          
                          <div className="mt-3 flex items-center">
                            <div className="flex-1 pr-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ 
                                  width: productionCapacity === 'pathfinder' ? '25%' : 
                                         productionCapacity === 'roadster' ? '50%' : 
                                         productionCapacity === 'jetpack' ? '75%' : '100%' 
                                }}></div>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-purple-700 whitespace-nowrap">
                              {weeklyEVCs} EVCs/week
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div 
                        className="flex items-start p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleDeliveryItem('allocation')}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shadow">
                          <FontAwesomeIcon icon={faColumns} size="lg" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-elx-primary">Resource Allocation</div>
                          <div className="text-sm text-gray-600">{calculatorConfig.resourceAllocation[resourceAllocation].description}</div>
                        </div>
                        <div className="ml-2 text-gray-400">
                          <FontAwesomeIcon 
                            icon={expandedStrategicItems.delivery.allocation ? faChevronUp : faChevronDown} 
                            className="transition-transform"
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible content */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedStrategicItems.delivery.allocation ? 'max-h-[500px]' : 'max-h-0'
                      }`}>
                        <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50">
                          <p className="text-sm text-gray-600">
                            {resourceAllocation === 'focused' ? 
                              'Laser-focused approach with minimal context switching for maximum efficiency on a single strategic priority. This approach minimizes coordination overhead and delivers the fastest possible results for your highest-priority initiative.' :
                            resourceAllocation === 'balanced' ? 
                              'Strategic balance between key priorities and operational initiatives with moderate coordination overhead. This approach enables parallel work on multiple interconnected initiatives with efficient resource sharing and knowledge transfer.' :
                              'Distributed approach addressing multiple concurrent initiatives across your organization. This approach enables broad transformation across multiple business units or functions with specialized expertise for each area.'}
                          </p>
                          
                          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className={`rounded p-2 ${resourceAllocation === 'focused' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                              Focused<br/>
                              <span className="text-[10px]">{calculatorConfig.resourceAllocation.focused?.switchingOverhead || 0}% overhead</span>
                            </div>
                            <div className={`rounded p-2 ${resourceAllocation === 'balanced' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                              Balanced<br/>
                              <span className="text-[10px]">{calculatorConfig.resourceAllocation.balanced?.switchingOverhead || 0}% overhead</span>
                            </div>
                            <div className={`rounded p-2 ${resourceAllocation === 'distributed' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                              Distributed<br/>
                              <span className="text-[10px]">{calculatorConfig.resourceAllocation.distributed?.switchingOverhead || 0}% overhead</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div 
                        className="flex items-start p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleDeliveryItem('payment')}
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 shadow">
                          <FontAwesomeIcon icon={faCreditCard} size="lg" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-elx-primary">Financial Model</div>
                          <div className="text-sm text-gray-600">{paymentDetails.name}</div>
                        </div>
                        <div className="ml-2 text-gray-400">
                          <FontAwesomeIcon 
                            icon={expandedStrategicItems.delivery.payment ? faChevronUp : faChevronDown} 
                            className="transition-transform"
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible content */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedStrategicItems.delivery.payment ? 'max-h-[500px]' : 'max-h-0'
                      }`}>
                        <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50">
                          <p className="text-sm text-gray-600">
                            {paymentOption === 'prepaid' ? 
                              `Provides ${((1 - paymentDetails.priceModifier) * 100).toFixed(0)}% discount through capacity reservation, ensuring dedicated resources and predictable budgeting. This model secures priority access to transformation resources and maximizes cost efficiency through reduced rates.` : 
                              'Maintains maximum financial flexibility with no upfront commitment, ideal for uncertain transformation timelines. This model provides complete flexibility to adjust your investment as your business needs evolve, without upfront financial commitments.'}
                          </p>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                            <div className={`rounded p-2 ${paymentOption === 'prepaid' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                              Prepaid Reservation<br/>
                              <span className="text-[10px]">{((1 - evcBase.paymentOptions.prepaid.priceModifier) * 100).toFixed(0)}% discount</span>
                            </div>
                            <div className={`rounded p-2 ${paymentOption === 'standard' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                              Standard Billing<br/>
                              <span className="text-[10px]">Maximum flexibility</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Strategic Resource Allocation graph - moved from Financial section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Strategic Resource Allocation</h5>
                <p className="text-sm text-gray-600 mb-4">
                  The distribution of EVCs across strategic pillars shows how transformation resources will be allocated to achieve your business objectives.
                  This allocation ensures appropriate balance between immediate operational improvements and long-term strategic capabilities.
                  {absoluteOverheadEvcs > 0 && ` An additional ${absoluteOverheadEvcs} EVCs (${overheadPercentage}%) are allocated to coordination overhead from the ${resourceAllocation} resource allocation strategy.`}
                </p>

                {/* Single bar showing proportional allocation of EVCs across all pillars */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-gray-600">Resource allocation by strategic pillar</div>
                    <div className="text-sm text-gray-600">{totalEvcValue} Total EVCs</div>
                  </div>
                  
                  <div className="w-full h-10 rounded-lg overflow-hidden flex mb-3">
                    {Object.entries(modulesByPillar).map(([pillar, modules], index) => {
                      const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                      const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(2);
                      
                      return (
                        <div 
                          key={pillar}
                          className={`h-full flex items-center justify-center ${
                            pillar === 'Transformation' ? 'bg-amber-600' :
                            pillar === 'Strategy' ? 'bg-orange-600' :
                            pillar === 'Technology' ? 'bg-teal-600' :
                            'bg-indigo-800'
                          }`} 
                          style={{ width: `${pillarPercentage}%` }}
                        >
                          {pillarPercentage > 10 && (
                            <span className="text-white text-xs font-medium px-2">{Math.round(pillarPercentage)}%</span>
                          )}
                        </div>
                      );
                    })}
                    {/* Add resource allocation overhead if it exists */}
                    {absoluteOverheadEvcs > 0 && (
                      <div 
                        className="h-full flex items-center justify-center bg-gray-500"
                        style={{ width: `${(absoluteOverheadEvcs / totalEvcValue * 100).toFixed(2)}%` }}
                      >
                        {(absoluteOverheadEvcs / totalEvcValue * 100) > 5 && (
                          <span className="text-white text-xs font-medium px-2">
                            {Math.round(absoluteOverheadEvcs / totalEvcValue * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(modulesByPillar).map(([pillar, modules]) => {
                      const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                      const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(0);
                      
                      return (
                        <div key={pillar} className="flex items-center">
                          <div className={`w-4 h-4 rounded-sm mr-2 ${
                            pillar === 'Transformation' ? 'bg-amber-600' :
                            pillar === 'Strategy' ? 'bg-orange-600' :
                            pillar === 'Technology' ? 'bg-teal-600' :
                            'bg-indigo-800'
                          }`}></div>
                          <div>
                            <span className="text-sm font-medium">{pillar}</span>
                            <span className="text-xs text-gray-500 ml-2">{pillarTotal} EVCs ({pillarPercentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                    {/* Add legend item for coordination overhead */}
                    {absoluteOverheadEvcs > 0 && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-sm mr-2 bg-gray-500"></div>
                        <div>
                          <span className="text-sm font-medium">Coordination Overhead</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {absoluteOverheadEvcs} EVCs ({Math.round(absoluteOverheadEvcs / totalEvcValue * 100)}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Service Delivery Timeline Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Delivery Timeline</h5>
                
                <p className="text-sm text-gray-600 mb-5">
                  Your service delivery timeline is based on our Elastic Value Credit (EVC) framework, which measures transformation 
                  resource requirements. This visualization shows how your service capacity and scope requirements create a predictable
                  delivery timeline.
                </p>
                
                {/* EVC delivery blocks visualization */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-medium text-gray-700">Continuous Service Delivery</div>
                    <div className="text-lg font-semibold text-elx-primary flex items-center">
                      {estimatedCompletionWeeks}
                      <span className="text-xs ml-1 text-gray-500">weeks</span>
                    </div>
                  </div>
                  
                  <div className="h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-1">
                    {/* Generate week blocks based on estimatedCompletionWeeks */}
                    <div className="flex h-full">
                      {Array.from({ length: Math.min(estimatedCompletionWeeks, 20) }).map((_, index) => (
                        <div 
                          key={index} 
                          className={`h-full ${index < estimatedCompletionWeeks - 1 ? 'border-r' : ''} border-gray-200 flex items-center justify-center`}
                          style={{ width: `${100 / Math.min(estimatedCompletionWeeks, 20)}%` }}
                        >
                          <div className="w-full h-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            {(estimatedCompletionWeeks <= 12 || index % 2 === 0 || index === estimatedCompletionWeeks - 1) && (
                              <span className="text-xs font-medium text-blue-700">
                                {weeklyEVCs}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* If more than 20 weeks, show ellipsis */}
                      {estimatedCompletionWeeks > 20 && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                          <span className="text-xs font-medium text-gray-500">...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Week markers */}
                  <div className="flex justify-between px-1 text-[10px] text-gray-500 mb-4">
                    <div>Week 1</div>
                    {estimatedCompletionWeeks <= 10 ? (
                      // If 10 or fewer weeks, show all week markers
                      Array.from({ length: estimatedCompletionWeeks - 2 }).map((_, index) => (
                        <div key={index}>Week {index + 2}</div>
                      ))
                    ) : (
                      // Otherwise, show some markers strategically
                      <>
                        <div>Week {Math.round(estimatedCompletionWeeks * 0.25)}</div>
                        <div>Week {Math.round(estimatedCompletionWeeks * 0.5)}</div>
                        <div>Week {Math.round(estimatedCompletionWeeks * 0.75)}</div>
                      </>
                    )}
                    <div>Week {estimatedCompletionWeeks}</div>
                  </div>
                  
                  {/* Formula visualization - simplified */}
                  <div className="flex items-center justify-center text-sm bg-gray-50 rounded-lg py-3 border border-gray-100">
                    <div className="text-center px-3">
                      <span className="font-semibold text-elx-primary">{totalEvcsWithOverhead}</span>
                      <span className="text-xs text-gray-500 block">Total EVCs</span>
                    </div>
                    <div className="px-2 text-xl text-gray-400">÷</div>
                    <div className="text-center px-3">
                      <span className="font-semibold text-blue-600">{weeklyEVCs}</span>
                      <span className="text-xs text-gray-500 block">EVCs/week</span>
                    </div>
                    <div className="px-2 text-xl text-gray-400">=</div>
                    <div className="text-center px-3">
                      <span className="font-semibold text-gray-700">{estimatedCompletionWeeks}</span>
                      <span className="text-xs text-gray-500 block">weeks</span>
                    </div>
                  </div>
                </div>
                
                {/* Service approach context */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-200">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-elx-accent mt-0.5 mr-2" />
                    <p>
                      Our service model delivers consistent value through a weekly EVC capacity of {weeklyEVCs}. 
                      With your selected {resourceAllocation} resource allocation strategy, we'll deliver the complete {totalEvcsWithOverhead} EVC scope over {estimatedCompletionWeeks} weeks, 
                      enabling continuous transformation without disrupting your operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Solution Components Section with Detailed Context */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              Strategic Solution Components
            </h3>
            
            {/* Business context for solution components */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <p className="text-gray-700 leading-relaxed">
                Your tailored solution consists of strategic modules designed to work together as an integrated transformation framework. 
                Each component addresses specific business challenges while contributing to your overall strategic objectives.
                The following sections detail each component's purpose, approach, and expected business outcomes.
              </p>
            </div>

            {Object.entries(modulesByPillar).map(([pillar, modules]) => (
              <div key={pillar} className="mb-10">
                <div className="flex items-center mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-elx-primary">{pillar} Pillar</h4>
                    <p className="text-sm text-gray-600">
                      {pillar === 'Transformation' ? 
                        'People, processes, and organizational change enablement' :
                      pillar === 'Strategy' ? 
                        'Direction setting, market positioning, and competitive advantage' :
                      pillar === 'Technology' ? 
                        'Technical capabilities and digital solutions' :
                        'Discovery and foundational knowledge building'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {modules.map(module => (
                    <div key={module.name} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                      {/* Collapsible header - always visible */}
                      <div 
                        className={`p-3 flex justify-between items-center cursor-pointer ${
                          pillar === 'Transformation' ? 'bg-amber-600' :
                          pillar === 'Strategy' ? 'bg-orange-600' :
                          pillar === 'Technology' ? 'bg-teal-600' :
                          'bg-indigo-800'
                        }`}
                        onClick={() => toggleModule(module.name)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 text-white">
                            <FontAwesomeIcon icon={faLayerGroup} />
                          </div>
                          <div>
                            <h5 className="text-md font-bold text-white">{module.name}</h5>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-white rounded-lg p-1.5 text-center mr-3 min-w-[60px] shadow-sm">
                            <div className="text-lg font-bold text-elx-primary">{module.evcValue} <span className="text-xs font-normal align-middle">EVCs</span></div>
                          </div>
                          <FontAwesomeIcon 
                            icon={expandedModules[module.name] ? faChevronUp : faChevronDown} 
                            className="text-white transition-transform"
                          />
                        </div>
                      </div>
                      
                      {/* Collapsible content - shown when expanded */}
                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          expandedModules[module.name] ? 'max-h-[2000px]' : 'max-h-0'
                        }`}
                      >
                        <div className="p-5 border-t border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <h6 className="text-sm font-semibold text-elx-primary mb-2">Business Context</h6>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-semibold text-elx-primary mb-2">Implementation Approach</h6>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    module.selectedVariant === 'insightPrimer' 
                                      ? 'bg-blue-100 text-blue-600' 
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    <FontAwesomeIcon icon={getVariantIcon(module.selectedVariant)} />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800">{getVariantDisplayName(module.selectedVariant)}</div>
                                    <div className="text-xs text-gray-500">
                                      {module.selectedVariant === 'insightPrimer' 
                                        ? 'Focused assessment and strategic recommendations' 
                                        : 'Comprehensive implementation with hands-on execution'}
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600">
                                  {module.selectedVariant === 'insightPrimer' 
                                    ? `Our experts will conduct a thorough assessment of your current ${module.name.toLowerCase()} capabilities, identify gaps and opportunities, and deliver actionable recommendations with a practical implementation roadmap.` 
                                    : `Our team will work alongside yours to fully implement the ${module.name.toLowerCase()} initiative, from initial planning through execution, ensuring successful adoption and delivering measurable business outcomes.`}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-semibold text-elx-primary mb-2">Expected Business Outcomes</h6>
                              <div className="grid grid-cols-1 gap-3">
                                {/* Display module-specific benefits from config */}
                                {modulesConfig.modules.find(m => m.name === module.name)?.benefits && (
                                  <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Key Benefits</div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {modulesConfig.modules.find(m => m.name === module.name)?.benefits.map((benefit, idx) => (
                                        <div key={idx} className="bg-green-50 text-xs px-3 py-1.5 rounded-full text-green-700 border border-green-200">
                                          {benefit}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-gray-50 rounded-lg p-3 border-l-2 border-green-500">
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Primary Benefit</div>
                                    <div className="text-sm text-gray-700">
                                      {module.category === 'Immediate Impact' 
                                        ? 'Rapid operational improvements with measurable ROI' 
                                        : module.category === 'Strategic Assessment'
                                          ? 'Clear strategic direction with validated business case'
                                          : 'Long-term competitive advantage and organizational capability'}
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 border-l-2 border-blue-500">
                                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Timeline Impact</div>
                                    <div className="text-sm text-gray-700">
                                      {module.selectedVariant === 'insightPrimer' 
                                        ? 'Results within 2-4 weeks with minimal disruption' 
                                        : 'Comprehensive implementation over the full engagement period'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Journey Stage Section */}
                            {modulesConfig.modules.find(m => m.name === module.name)?.primaryJourneyStage && (
                              <div>
                                <h6 className="text-sm font-semibold text-elx-primary mb-2">Transformation Journey Stages</h6>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  {(() => {
                                    const moduleConfig = modulesConfig.modules.find(m => m.name === module.name);
                                    if (!moduleConfig) return null;
                                    
                                    const primaryStageId = moduleConfig.primaryJourneyStage;
                                    const secondaryStageIds = moduleConfig.secondaryJourneyStages || [];
                                    
                                    const primaryStage = modulesConfig.journeyStages.find(js => js.id === primaryStageId);
                                    const secondaryStages = modulesConfig.journeyStages.filter(js => secondaryStageIds.includes(js.id));
                                    
                                    return (
                                      <>
                                        <div className="mb-3">
                                          <div className="text-xs font-medium text-gray-500 uppercase mb-2">Primary Focus</div>
                                          {primaryStage && (
                                            <div className="flex items-center">
                                              <div className="bg-elx-primary text-white rounded-full px-3 py-1 text-xs font-medium">
                                                {primaryStage.title}
                                              </div>
                                              <div className="ml-2 text-xs text-gray-600">{primaryStage.description}</div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {secondaryStages.length > 0 && (
                                          <div>
                                            <div className="text-xs font-medium text-gray-500 uppercase mb-2">Supporting Focus</div>
                                            <div className="flex flex-wrap gap-2">
                                              {secondaryStages.map(stage => (
                                                <div key={stage.id} className="flex items-center">
                                                  <div className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                                                    {stage.title}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {moduleConfig.journeyStageRationale && (
                                          <div className="mt-3 text-xs text-gray-600 italic border-t border-gray-200 pt-2">
                                            {moduleConfig.journeyStageRationale}
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Modules Sum - Total EVCs from all modules */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <div className="p-3 bg-black text-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 text-white">
                  <FontAwesomeIcon icon={faCalculator} />
                </div>
                <div>
                  <h5 className="text-md font-bold text-white">Modules Sum</h5>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-1.5 text-center min-w-[60px] shadow-sm">
                  <div className="text-lg font-bold text-elx-primary">{totalEvcSum} <span className="text-xs font-normal align-middle">EVCs</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services and Add Ons - Only shown if at least one add-on is selected */}
          {serviceParameters.filter(param => parameters[param.id]).length > 0 && (
            <div className="space-y-6 mb-12 mt-12">
              <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
                Additional Services and Add Ons
              </h3>
              
              {/* Business context for additional services */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
                <p className="text-gray-700 leading-relaxed">
                  Your solution includes the following additional services and add-ons, carefully selected to enhance your transformation experience
                  and maximize the impact of your strategic initiative. Each service adds specific capabilities to your transformation toolkit,
                  ensuring comprehensive support aligned with your business needs.
                </p>
              </div>
              
              <div className="space-y-4">
                {serviceParameters
                  .filter(param => parameters[param.id])
                  .map((param) => {
                    // Calculate EVC cost for the parameter
                    const evcCost = calculateEvcCost(param);
                    
                    return (
                      <div key={param.id} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                        {/* Collapsible header - always visible */}
                        <div 
                          className="p-3 flex justify-between items-center cursor-pointer bg-gray-800"
                          onClick={() => toggleAddOn(param.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 text-white">
                              <FontAwesomeIcon icon={
                                param.id === 'trainingSession' ? faGraduationCap :
                                param.id === 'accountConcierge' ? faUserTie :
                                param.id === 'premiumSLA' ? faShieldAlt : 
                                faStar
                              } />
                            </div>
                            <div>
                              <h5 className="text-md font-bold text-white">{param.label}</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {evcCost && (
                              <div className="bg-white rounded-lg p-1.5 text-center mr-3 min-w-[60px] shadow-sm">
                                <div className="text-lg font-bold text-elx-primary">{evcCost} <span className="text-xs font-normal align-middle">EVC</span></div>
                              </div>
                            )}
                            <FontAwesomeIcon 
                              icon={expandedAddOns[param.id] ? faChevronUp : faChevronDown} 
                              className="text-white transition-transform"
                            />
                          </div>
                        </div>
                        
                        {/* Collapsible content - shown when expanded */}
                        <div 
                          className={`transition-all duration-300 overflow-hidden ${
                            expandedAddOns[param.id] ? 'max-h-[2000px]' : 'max-h-0'
                          }`}
                        >
                          <div className="p-5 border-t border-gray-200">
                            <div className="space-y-4">
                              <div>
                                <h6 className="text-sm font-semibold text-elx-primary mb-2">Description</h6>
                                <p className="text-sm text-gray-600">{param.description}</p>
                              </div>
                              
                              {param.productionImpact && (
                                <div>
                                  <h6 className="text-sm font-semibold text-elx-primary mb-2">Business Impact</h6>
                                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 border border-blue-100">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                    <span className="font-medium">Impact:</span> {param.productionImpact}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* Payment option information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                  <FontAwesomeIcon icon={faCreditCard} className="text-elx-accent mr-2" />
                  Selected Payment Option
                </h4>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md" 
                    style={{ backgroundColor: 'var(--elexive-primary)' }}>
                    <FontAwesomeIcon 
                      icon={paymentOption === 'prepaid' ? faLock : faCreditCard} 
                      className="text-white" 
                      size="lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-elx-primary text-lg mb-1">
                      {evcBase.paymentOptions[paymentOption].name}
                    </h5>
                    <p className="text-gray-600 text-sm mb-2">
                      {paymentOption === 'prepaid' ? 
                        'Reserved capacity with allocated resources and predictable costs. Includes reduced pricing through our capacity reservation program.' : 
                        'Standard monthly billing with maximum financial flexibility. Pay only for the services you use with no long-term commitment required.'}
                    </p>
                    
                    {paymentOption === 'prepaid' && (
                      <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded inline-block">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        {((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% cost reduction
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Financial Summary Section */}
          <div className="space-y-6 mb-12 mt-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              Financial Investment Framework
            </h3>
            
            {/* Business context for financial investment */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <p className="text-gray-700 leading-relaxed">
                The financial framework for your strategic solution is structured to provide maximum value and predictability while maintaining 
                appropriate flexibility. The investment model is designed to align with your business outcomes, with transparent pricing 
                and clear correlation between resources committed and results delivered through our Elastic Value Credit (EVC) framework.
              </p>
            </div>
            
            {/* Financial summary cards with enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                  <FontAwesomeIcon icon={faBriefcase} className="text-elx-accent mr-2" />
                  Investment Summary
                </h4>
                
                {/* Summary description with business context */}
                <p className="text-sm text-gray-600 mb-5">
                  Your total investment is structured to provide predictable costs aligned with the scope and scale of your transformation initiative.
                  {paymentOption === 'prepaid' ? 
                    ` With the prepaid model, you benefit from reduced overall costs through our reservation discount of ${((1 - paymentDetails.priceModifier) * 100).toFixed(0)}%.` : 
                    ' The standard billing model provides maximum financial flexibility with no upfront commitment.'}
                </p>
                
                {/* Investment breakdown table */}
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Weekly Investment</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">€{formatNumber(totalPrice)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Monthly Investment</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">€{formatNumber(totalPrice * 4)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Quarterly Investment</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">€{formatNumber(totalPrice * 13)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600">Total Projected Cost</td>
                      <td className="py-3 text-right font-bold text-elx-primary text-lg">€{formatNumber(totalProjectedCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                  <FontAwesomeIcon icon={faCalculator} className="text-elx-accent mr-2" />
                  Value-Based Pricing Model
                </h4>
                
                {/* EVC model explanation */}
                <p className="text-sm text-gray-600 mb-5">
                  Our pricing is based on Elastic Value Credits (EVCs), a standardized unit of consulting value that ensures you pay only for 
                  the actual transformation resources you receive. Your selected {calculatorConfig.productionCapacity[productionCapacity].label} tier 
                  provides {weeklyEVCs} EVCs weekly, calibrated to your organization's transformation needs.
                </p>
                
                {/* Pricing components table */}
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Weekly Production Capacity</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">{weeklyEVCs} EVCs</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Base Price per EVC</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">€{evcBase.basePrice.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Effective Price per EVC</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">€{evcPricePerUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Payment Model</td>
                      <td className="py-3 text-right font-semibold text-elx-primary">{paymentDetails.name}</td>
                    </tr>
                    {paymentOption === 'prepaid' && (
                      <tr>
                        <td className="py-3 text-gray-600">Prepaid Reservation Discount</td>
                        <td className="py-3 text-right font-semibold text-green-600">
                          {((1 - paymentDetails.priceModifier) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    )}
                    {calculator.volumeDiscountPercentage > 0 && (
                      <tr>
                        <td className="py-3 text-gray-600">Volume Efficiency Discount</td>
                        <td className="py-3 text-right font-semibold text-purple-600">
                          {calculator.volumeDiscountPercentage.toFixed(1)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pricing note */}
                <div className="mt-4 bg-gray-50 p-3 rounded-lg text-xs text-gray-500 border border-gray-100">
                  <p>
                    <span className="font-medium">Note:</span> All figures represent non-binding estimates based on your current selections. 
                    Final investment will be detailed in your formal proposal and service agreement.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Implementation Plan Section with Enhanced Business Context */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              Next Steps
            </h3>
            
            {/* Business context for implementation plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <p className="text-gray-700 leading-relaxed">
                Your implementation roadmap provides a strategic framework for executing your transformation initiative with clear milestones and 
                resource allocation. The timeline below outlines the projected implementation journey, balancing speed with quality to ensure 
                sustainable business transformation and measurable outcomes at each stage.
              </p>
            </div>
            
            
            
            {/* Success Factors */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-elx-accent mr-2" />
                Critical Success Factors
              </h4>
              
              <p className="text-sm text-gray-600 mb-5">
                Based on your selected modules and implementation approach, we've identified the following critical success factors 
                that will be essential to achieving your desired transformation outcomes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-100 text-blue-600 shadow-sm">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <h5 className="font-medium text-elx-primary">Stakeholder Alignment</h5>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ensuring consistent executive sponsorship and cross-functional alignment throughout the {estimatedCompletionWeeks}-week 
                    implementation journey. Regular governance reviews will maintain momentum and address challenges proactively.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-100 text-green-600 shadow-sm">
                      <FontAwesomeIcon icon={faChartBar} />
                    </div>
                    <h5 className="font-medium text-elx-primary">Value Measurement</h5>
                  </div>
                  <p className="text-sm text-gray-600">
                    Establishing clear success metrics and KPIs tied to business outcomes, with regular measurement and 
                    course-correction to ensure the transformation delivers tangible value throughout implementation.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-purple-100 text-purple-600 shadow-sm">
                      <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <h5 className="font-medium text-elx-primary">Change Acceleration</h5>
                  </div>
                  <p className="text-sm text-gray-600">
                    Implementing robust change management practices to ensure successful adoption of new capabilities, including
                    communication strategies, training, and enablement activities aligned with your organizational culture.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-amber-100 text-amber-600 shadow-sm">
                      <FontAwesomeIcon icon={faBusinessTime} />
                    </div>
                    <h5 className="font-medium text-elx-primary">Resource Optimization</h5>
                  </div>
                  <p className="text-sm text-gray-600">
                    Balancing internal and external resources effectively with your selected {resourceAllocation} allocation strategy
                    to maximize transformation velocity while minimizing disruption to ongoing operations.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-elx-primary bg-opacity-5 rounded-xl p-6 border border-elx-primary border-opacity-20">
              <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faLongArrowAltRight} className="text-elx-accent mr-2" />
                Recommended Next Steps
              </h4>
              
              <p className="text-sm text-gray-700 mb-5">
                To move forward with your transformation initiative, we recommend the following steps to ensure a smooth and successful start:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-elx-primary mb-1">Schedule Executive Briefing</h5>
                    <p className="text-sm text-gray-600">
                      A 90-minute session with our transformation experts to discuss your specific business context and refine the proposed approach.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-elx-primary mb-1">Request Detailed Proposal</h5>
                    <p className="text-sm text-gray-600">
                      Receive a comprehensive proposal with detailed module descriptions, implementation methodology, and formal investment framework.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-elx-primary text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-elx-primary mb-1">Initial Discovery Workshop</h5>
                    <p className="text-sm text-gray-600">
                      A collaborative half-day workshop with key stakeholders to define success criteria and develop a detailed implementation roadmap.
                    </p>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3 shadow-md z-20">
          <button
            onClick={exportToPdf}
            className="elx-btn py-3 px-6"
            style={{ backgroundColor: 'var(--elexive-primary)', color: 'white' }}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                Export to PDF
              </>
            )}
          </button>
          <button
            onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Strategic%20Solution%20Proposal%20Request&body=I%20would%20like%20to%20request%20a%20detailed%20proposal%20based%20on%20the%20solution%20brief%20I%20created.'}
            className="elx-btn elx-btn-secondary px-6 py-3"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Schedule Executive Briefing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedReportModal;