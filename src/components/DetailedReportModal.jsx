import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, faTimes, faChartLine, faPuzzlePiece, faUsers, 
  faLightbulb, faTools, faBriefcase, faCalculator,
  faColumns, faRocket, faChevronUp, faChevronDown,
  faLock, faSpinner, faFileExport, faEnvelope,
  faInfoCircle, faCheckCircle, faCreditCard,
  faShieldAlt, faGlobe, faLayerGroup, faGraduationCap, faUserTie, faStar,
  faChartPie, faSlidersH, faCalendarAlt, faHandshake, faLongArrowAltRight, faBusinessTime, faChartBar,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

import { generateReportPdf } from '../pdf';
import calculatorConfig from '../config/calculatorConfig.json';
import modulesConfig from '../config/modulesConfig.json';

const DetailedReportModal = ({ isOpen, onClose, calculator }) => {
  const [isExporting, setIsExporting] = useState(false);
  const reportContentRef = useRef(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedAddOns, setExpandedAddOns] = useState({});
  
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

  const { 
    totalPrice,
    monthlyEvcs,
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
    switch(pillar) {
      case 'Transformation': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Strategy': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Technology': return 'text-green-600 bg-green-50 border-green-200';
      case 'Discovery': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Format number with thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate estimated annual value
  const annualValue = totalPrice * 52;
  
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
        annualValue,
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
        <div className="bg-gradient-to-r from-elx-primary to-white shadow-md z-20 border-b">
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
                  €{formatNumber(annualValue)} projected annually
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
                      <div key={pillar} className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow ${getPillarColorClass(pillar)}`}>
                          <FontAwesomeIcon icon={getPillarIcon(pillar)} size="lg" />
                        </div>
                        <div>
                          <div className="font-semibold text-elx-primary">{pillar}</div>
                          <div className="text-sm text-gray-600">{modules.length} modules selected</div>
                          <p className="text-xs text-gray-500 mt-1">
                            {pillar === 'Transformation' ? 
                              'Focus on people, processes, and organizational change management to enable successful business transformation.' :
                            pillar === 'Strategy' ? 
                              'Establish clear direction, market positioning, and competitive differentiation to drive business outcomes.' :
                            pillar === 'Technology' ? 
                              'Implement and optimize technological capabilities to support business innovation and efficiency.' :
                            'Explore new opportunities and build foundational knowledge to inform strategic decisions.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Framework</h5>
                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 shadow">
                        <FontAwesomeIcon icon={faRocket} size="lg" />
                      </div>
                      <div>
                        <div className="font-semibold text-elx-primary">Transformation Velocity</div>
                        <div className="text-sm text-gray-600">{calculatorConfig.productionCapacity[productionCapacity].label} ({weeklyEVCs} EVCs/week)</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {productionCapacity === 'pathfinder' ? 
                            'Focused exploration and initial implementation for targeted challenges.' :
                          productionCapacity === 'roadster' ? 
                            'Balanced approach delivering consistent progress without disrupting operations.' :
                          productionCapacity === 'jetpack' ? 
                            'Accelerated transformation with significant business impact and rapid results.' :
                            'Enterprise-grade transformation with maximum velocity for critical initiatives.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shadow">
                        <FontAwesomeIcon icon={faColumns} size="lg" />
                      </div>
                      <div>
                        <div className="font-semibold text-elx-primary">Resource Allocation</div>
                        <div className="text-sm text-gray-600">{calculatorConfig.resourceAllocation[resourceAllocation].description}</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {resourceAllocation === 'focused' ? 
                            'Laser-focused approach with minimal context switching for maximum efficiency on a single strategic priority.' :
                          resourceAllocation === 'balanced' ? 
                            'Strategic balance between key priorities and operational initiatives with moderate coordination overhead.' :
                            'Distributed approach addressing multiple concurrent initiatives across your organization.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 shadow">
                        <FontAwesomeIcon icon={faCreditCard} size="lg" />
                      </div>
                      <div>
                        <div className="font-semibold text-elx-primary">Financial Model</div>
                        <div className="text-sm text-gray-600">{paymentDetails.name}</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {paymentOption === 'prepaid' ? 
                            `Provides ${((1 - paymentDetails.priceModifier) * 100).toFixed(0)}% discount through capacity reservation, ensuring dedicated resources and predictable budgeting.` : 
                            'Maintains maximum financial flexibility with no upfront commitment, ideal for uncertain transformation timelines.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Parameters */}
              {serviceParameters.filter(param => parameters[param.id]).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Custom Configuration Parameters</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceParameters
                      .filter(param => parameters[param.id])
                      .map(param => (
                        <div key={param.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-elx-primary bg-opacity-10 flex items-center justify-center mr-2">
                              <FontAwesomeIcon icon={faCheckCircle} className="text-elx-accent text-xs" />
                            </div>
                            <span className="font-medium text-sm text-elx-primary">{param.label}</span>
                          </div>
                          <p className="text-xs text-gray-600 pl-8">{param.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
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

          {/* Additional Services and Add Ons */}
          <div className="space-y-6 mb-12">
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
            
            {/* Check if any parameters are enabled */}
            {serviceParameters.filter(param => parameters[param.id]).length > 0 ? (
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
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <div className="text-gray-400 mb-3">
                  <FontAwesomeIcon icon={faInfoCircle} size="2x" />
                </div>
                <h4 className="text-lg font-medium text-gray-500 mb-2">No Additional Services Selected</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your solution is configured with the core transformation modules only. Add-on services can be included to enhance specific aspects of your engagement.
                </p>
              </div>
            )}
            
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
          
          {/* Financial Summary Section */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-elx-accent mr-3" />
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
                      <td className="py-3 text-gray-600">Annual Investment</td>
                      <td className="py-3 text-right font-bold text-elx-primary text-lg">€{formatNumber(annualValue)}</td>
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
            
            {/* EVC Distribution visualization with business context */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faChartPie} className="text-elx-accent mr-2" />
                Strategic Resource Allocation
              </h4>
              
              <p className="text-sm text-gray-600 mb-5">
                The distribution of EVCs across strategic pillars shows how transformation resources will be allocated to achieve your business objectives.
                This allocation ensures appropriate balance between immediate operational improvements and long-term strategic capabilities.
              </p>
              
              <div className="space-y-5">
                {Object.entries(modulesByPillar).map(([pillar, modules]) => {
                  const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                  const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(0);
                  
                  return (
                    <div key={pillar} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow ${
                            pillar === 'Transformation' ? 'bg-purple-600' :
                            pillar === 'Strategy' ? 'bg-blue-600' :
                            pillar === 'Technology' ? 'bg-green-600' :
                            'bg-amber-600'
                          }`}>
                            <FontAwesomeIcon icon={getPillarIcon(pillar)} className="text-white" />
                          </div>
                          <div>
                            <span className="text-gray-800 font-medium">{pillar}</span>
                            <div className="text-xs text-gray-500">
                              {pillar === 'Transformation' ? 
                                'People, processes, and organizational change' :
                              pillar === 'Strategy' ? 
                                'Direction setting and competitive positioning' :
                              pillar === 'Technology' ? 
                                'Technical capabilities and systems' :
                                'Research and opportunity identification'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right">
                            <span className="text-gray-700 font-medium">{pillarTotal} EVCs</span>
                            <div className="text-xs text-gray-500">{pillarPercentage}% of total resources</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                        <div className={`h-3 rounded-full ${
                          pillar === 'Transformation' ? 'bg-purple-600' :
                          pillar === 'Strategy' ? 'bg-blue-600' :
                          pillar === 'Technology' ? 'bg-green-600' :
                          'bg-amber-600'
                        }`} style={{ width: `${pillarPercentage}%` }}></div>
                      </div>
                      
                      <div className="ml-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                        {modules.map(module => (
                          <div key={module.name} className="bg-gray-50 rounded px-3 py-2 border border-gray-100 text-xs">
                            <div className="font-medium text-gray-700 mb-1">{module.name}</div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">{getVariantDisplayName(module.selectedVariant)}</span>
                              <span className="font-medium text-elx-primary">{module.evcValue} EVCs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Delivery Model Factors */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faSlidersH} className="text-elx-accent mr-2" />
                Delivery Model Configuration
              </h4>
              
              <p className="text-sm text-gray-600 mb-5">
                Your solution's delivery model has been tailored to your specific business needs through several key configuration parameters.
                These factors affect your weekly production capacity and overall transformation approach.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <div>
                    <span className="text-sm font-medium text-elx-primary">Base Weekly Capacity</span>
                    <div className="text-xs text-gray-500">
                      {productionCapacity === 'pathfinder' ? 
                        'Focused exploration tier for targeted solutions' :
                      productionCapacity === 'roadster' ? 
                        'Standard capacity for balanced implementation pace' :
                      productionCapacity === 'jetpack' ? 
                        'Accelerated delivery for critical business priorities' :
                        'Maximum velocity for enterprise-wide transformation'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-elx-primary">
                      {calculatorConfig.productionCapacity[productionCapacity].weeklyEVCs} EVCs
                    </span>
                    <div className="text-xs text-gray-500">{calculatorConfig.productionCapacity[productionCapacity].label} tier</div>
                  </div>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <div>
                    <span className="text-sm font-medium text-elx-primary">Resource Allocation Strategy</span>
                    <div className="text-xs text-gray-500">
                      {calculatorConfig.resourceAllocation[resourceAllocation]?.description || ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-elx-primary">
                      {overheadPercentage}% overhead
                    </span>
                    <div className="text-xs text-gray-500">
                      {calculatorConfig.resourceAllocation[resourceAllocation]?.overheadLabel || ''} context switching
                    </div>
                  </div>
                </div>
                
                {Object.entries(parameters)
                  .filter(([, enabled]) => enabled)
                  .map(([paramId]) => {
                    const param = serviceParameters.find(p => p.id === paramId);
                    if (!param) return null;
                    const evcCost = calculateEvcCost(param);
                    return (
                      <div key={paramId} className="flex justify-between py-3 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-elx-primary">{param.label}</span>
                          <div className="text-xs text-gray-500">{param.productionImpact}</div>
                        </div>
                        <div className="text-right">
                          {param.modifier && (
                            <span className="text-sm font-semibold text-elx-primary">{param.modifier}x multiplier</span>
                          )}
                          {evcCost && (
                            <div className="text-xs text-gray-500">
                              {evcCost} EVCs/week
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                }
                
                <div className="flex justify-between py-3 font-medium bg-gray-50 p-3 rounded-lg mt-2">
                  <div>
                    <span className="text-elx-primary">Final Weekly Production Capacity</span>
                    <div className="text-xs text-gray-500">After all modifiers applied</div>
                  </div>
                  <span className="text-lg font-bold text-elx-primary">{monthlyEvcs} EVCs</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Implementation Plan Section with Enhanced Business Context */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-bold text-elx-primary mb-6 pb-2 border-b-2 border-elx-accent flex items-center">
              <FontAwesomeIcon icon={faRocket} className="text-elx-accent mr-3" />
              Implementation Roadmap
            </h3>
            
            {/* Business context for implementation plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <p className="text-gray-700 leading-relaxed">
                Your implementation roadmap provides a strategic framework for executing your transformation initiative with clear milestones and 
                resource allocation. The timeline below outlines the projected implementation journey, balancing speed with quality to ensure 
                sustainable business transformation and measurable outcomes at each stage.
              </p>
            </div>
            
            {/* Timeline Summary with enhanced styling */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h4 className="text-lg font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-elx-accent mr-2" />
                Strategic Implementation Timeline
              </h4>
              
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-elx-primary to-elx-primary-dark text-white font-bold text-3xl flex items-center justify-center shadow-lg">
                  {estimatedCompletionWeeks}
                </div>
                <div className="ml-5">
                  <div className="text-elx-primary font-bold text-xl">Week Implementation Plan</div>
                  <div className="text-gray-600 mt-1">Calibrated to your selected production capacity and scope</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Based on {weeklyEVCs} EVCs weekly with {
                      resourceAllocation === 'focused' ? 'focused allocation for maximum efficiency' : 
                      resourceAllocation === 'balanced' ? 'balanced resource distribution across priorities' : 
                      'distributed approach across multiple initiatives'
                    }
                  </div>
                </div>
              </div>
              
              {/* Implementation Phases */}
              <div className="bg-gray-50 p-5 rounded-lg mb-8">
                <h5 className="font-medium text-elx-primary mb-4">Implementation Phases</h5>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="w-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="font-bold">1</span>
                      </div>
                    </div>
                    <div className="flex-grow border-l-2 border-blue-100 pl-5 pb-6">
                      <h6 className="font-semibold text-elx-primary mb-2">Discovery & Assessment</h6>
                      <p className="text-sm text-gray-600 mb-2">
                        Comprehensive analysis of current state, stakeholder interviews, and strategic alignment sessions to establish clear 
                        transformation objectives and success metrics.
                      </p>
                      <div className="bg-white rounded p-2 border border-gray-200 text-xs text-gray-500">
                        <span className="font-medium text-elx-primary">Duration:</span> ~{Math.max(1, Math.round(estimatedCompletionWeeks * 0.2))} weeks
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <span className="font-bold">2</span>
                      </div>
                    </div>
                    <div className="flex-grow border-l-2 border-amber-100 pl-5 pb-6">
                      <h6 className="font-semibold text-elx-primary mb-2">Design & Strategic Planning</h6>
                      <p className="text-sm text-gray-600 mb-2">
                        Collaborative development of detailed implementation roadmaps for each module, resource planning, and establishment of 
                        governance frameworks to ensure successful execution.
                      </p>
                      <div className="bg-white rounded p-2 border border-gray-200 text-xs text-gray-500">
                        <span className="font-medium text-elx-primary">Duration:</span> ~{Math.max(1, Math.round(estimatedCompletionWeeks * 0.25))} weeks
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <span className="font-bold">3</span>
                      </div>
                    </div>
                    <div className="flex-grow border-l-2 border-green-100 pl-5 pb-6">
                      <h6 className="font-semibold text-elx-primary mb-2">Implementation & Change Management</h6>
                      <p className="text-sm text-gray-600 mb-2">
                        Methodical execution of solution components, stakeholder enablement, change management, and iterative delivery of 
                        business capabilities with regular checkpoints and adaptation.
                      </p>
                      <div className="bg-white rounded p-2 border border-gray-200 text-xs text-gray-500">
                        <span className="font-medium text-elx-primary">Duration:</span> ~{Math.max(1, Math.round(estimatedCompletionWeeks * 0.4))} weeks
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <span className="font-bold">4</span>
                      </div>
                    </div>
                    <div className="flex-grow border-l-2 border-purple-100 pl-5">
                      <h6 className="font-semibold text-elx-primary mb-2">Optimization & Sustainability Planning</h6>
                      <p className="text-sm text-gray-600 mb-2">
                        Measurement of business outcomes, capability refinement, knowledge transfer, and establishment of ongoing governance to 
                        ensure sustainable transformation beyond the initial implementation.
                      </p>
                      <div className="bg-white rounded p-2 border border-gray-200 text-xs text-gray-500">
                        <span className="font-medium text-elx-primary">Duration:</span> ~{Math.max(1, Math.round(estimatedCompletionWeeks * 0.15))} weeks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* EVC Calculation Breakdown with better context */}
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h5 className="font-medium text-elx-primary mb-3">Resource Requirements & Timeline Calculation</h5>
                
                <p className="text-sm text-gray-600 mb-4">
                  Your implementation timeline is calculated using our Elastic Value Credit (EVC) framework, which provides a precise measurement 
                  of transformation resource requirements. The calculation below illustrates how your specific module selections and resource allocation 
                  strategy translate into a realistic implementation timeline.
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md">
                    <div>
                      <span className="text-sm font-medium text-elx-primary">Total Module EVC Requirements</span>
                      <div className="text-xs text-gray-500">Base transformation scope from selected modules</div>
                    </div>
                    <span className="bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-md text-elx-primary border border-rose-200">
                      {totalEvcSum} EVC
                    </span>
                  </div>
                  
                  {/* Only show overhead row if there is overhead */}
                  {absoluteOverheadEvcs > 0 && (
                    <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md">
                      <div>
                        <span className="text-sm font-medium text-elx-primary">Resource Allocation Overhead</span>
                        <div className="text-xs text-gray-500">
                          Additional coordination complexity from {resourceAllocation} strategy ({overheadPercentage}%)
                        </div>
                      </div>
                      <span className="bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-md text-elx-primary border border-rose-200">
                        +{absoluteOverheadEvcs} EVC
                      </span>
                    </div>
                  )}
                  
                  {/* Total EVCs with overhead */}
                  <div className="flex justify-between items-center py-2 px-3 bg-elx-primary bg-opacity-10 rounded-md">
                    <div>
                      <span className="text-sm font-medium text-elx-primary">Total EVCs Required</span>
                      <div className="text-xs text-gray-500">Complete transformation resource requirements</div>
                    </div>
                    <span className="bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-md text-elx-primary border border-rose-200">
                      {totalEvcsWithOverhead} EVC
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md">
                    <div>
                      <span className="text-sm font-medium text-elx-primary">Weekly Production Capacity</span>
                      <div className="text-xs text-gray-500">{calculatorConfig.productionCapacity[productionCapacity].label} tier</div>
                    </div>
                    <span className="bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded-md text-blue-700 border border-blue-200">
                      {weeklyEVCs} EVCs/week
                    </span>
                  </div>
                  
                  {/* Calculation formula */}
                  <div className="bg-white p-4 rounded-lg mt-4 text-center">
                    <div className="text-sm text-gray-500 mb-3">Implementation Timeline Calculation</div>
                    <div className="inline-block font-mono bg-gray-50 py-3 px-5 rounded border border-gray-200 text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Total EVCs</div>
                          <div className="font-bold text-elx-primary">{totalEvcsWithOverhead}</div>
                        </div>
                        <div className="text-2xl text-gray-300">÷</div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Weekly Capacity</div>
                          <div className="font-bold text-elx-primary">{weeklyEVCs}</div>
                        </div>
                        <div className="text-2xl text-gray-300">=</div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Timeline</div>
                          <div className="font-bold text-xl text-elx-primary">{estimatedCompletionWeeks} weeks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Visual timeline */}
              <div className="mb-8">
                <h5 className="font-medium text-elx-primary mb-4">Visual Implementation Timeline</h5>
                
                <div className="relative pt-12 pb-8">
                  {/* Timeline bar */}
                  <div className="absolute top-8 left-0 w-full h-3 bg-gray-100 rounded-full"></div>
                  <div className="absolute top-8 left-0 h-3 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  
                  {/* Timeline markers */}
                  <div className="absolute top-8 left-0 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-md"></div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-700 w-24 text-center">
                      Project Start
                    </div>
                  </div>
                  
                  <div className="absolute top-8 left-[20%] -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-md"></div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-700 w-24 text-center">
                      Assessment<br />Complete
                    </div>
                  </div>
                  
                  <div className="absolute top-8 left-[45%] -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-md"></div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium text-green-700 w-24 text-center">
                      Implementation<br />Kickoff
                    </div>
                  </div>
                  
                  <div className="absolute top-8 left-[85%] -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 border-4 border-white shadow-md"></div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium text-purple-700 w-24 text-center">
                      Optimization<br />Phase
                    </div>
                  </div>
                  
                  <div className="absolute top-8 right-0 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 border-4 border-white shadow-md"></div>
                    <div className="absolute top-10 right-0 text-xs font-medium text-purple-700 w-24 text-center">
                      Transformation<br />Complete
                    </div>
                  </div>
                  
                  {/* Timeline duration */}
                  <div className="absolute bottom-0 left-0 text-xs text-gray-500">Week 0</div>
                  <div className="absolute bottom-0 right-0 text-xs text-gray-500">Week {estimatedCompletionWeeks}</div>
                </div>
              </div>
              
              {/* Business value realization */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h5 className="font-medium text-elx-primary mb-3">Business Value Realization Timeline</h5>
                
                <p className="text-sm text-gray-600 mb-4">
                  Your transformation initiative will deliver business value throughout the implementation journey, not just at completion.
                  Below is the projected value realization curve based on your selected modules and implementation approach.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h6 className="text-xs font-semibold text-gray-500 uppercase mb-1">Early Value</h6>
                    <div className="text-lg font-bold text-elx-primary mb-1">Weeks 1-{Math.max(1, Math.round(estimatedCompletionWeeks * 0.25))}</div>
                    <p className="text-xs text-gray-600">
                      Initial diagnostic insights, strategic clarity, and quick wins from operational improvements in targeted areas.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h6 className="text-xs font-semibold text-gray-500 uppercase mb-1">Main Implementation</h6>
                    <div className="text-lg font-bold text-elx-primary mb-1">Weeks {Math.max(2, Math.round(estimatedCompletionWeeks * 0.25))}-{Math.max(3, Math.round(estimatedCompletionWeeks * 0.75))}</div>
                    <p className="text-xs text-gray-600">
                      Progressive capability deployment, process improvements, and incremental realization of efficiency and effectiveness gains.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h6 className="text-xs font-semibold text-gray-500 uppercase mb-1">Full Value Realization</h6>
                    <div className="text-lg font-bold text-elx-primary mb-1">Week {Math.max(4, Math.round(estimatedCompletionWeeks * 0.75))}+</div>
                    <p className="text-xs text-gray-600">
                      Complete transformation benefits, sustainable new capabilities, and ongoing optimization for compounding returns.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-elx-accent mt-0.5 mr-2" />
                    <p>
                      <span className="font-medium text-gray-700">Note:</span> The {estimatedCompletionWeeks}-week timeline represents the 
                      implementation phase. Additional value will continue to be realized after implementation as new capabilities mature and 
                      become fully integrated into your organization.
                    </p>
                  </div>
                </div>
              </div>
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
              
              <div className="mt-6 pt-6 border-t border-elx-primary border-opacity-20 text-center">
                <button
                  onClick={() => window.location.href = 'mailto:transform@elexive.com?subject=Strategic%20Solution%20Implementation%20Request&body=I%20would%20like%20to%20schedule%20an%20executive%20briefing%20based%20on%20the%20solution%20brief%20I%20created.'}
                  className="bg-elx-primary text-white py-3 px-6 rounded-lg font-medium shadow-md hover:bg-opacity-90 transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Schedule Executive Briefing
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Or contact our transformation team directly at <span className="font-medium">transform@elexive.com</span>
                </p>
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
            Request Detailed Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedReportModal;