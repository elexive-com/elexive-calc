// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ReportContentPage.js
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import { getColorFromCssVar } from '../utils/colors';
import { formatNumberWithDecimals } from '../utils/pdfHelpers';
import ModuleContentPage from './ModuleContentPage';

// Define colors object for consistent use throughout the component
const colors = {
  primary: getColorFromCssVar('--elexive-primary', '#2E2266'),
  secondary: getColorFromCssVar('--elexive-secondary', '#FFBE59'),
  accent: getColorFromCssVar('--elexive-accent', '#D99000'),
  blue: '#3B82F6'
};

/**
 * The completely reimagined content pages of the PDF report
 * Creates a professional, comprehensive solution brief for executive decision-makers
 * Structure now aligns with DetailedReportModal.jsx for consistency across the application
 */
const ReportContentPage = ({ 
  totalPrice, 
  completionTimeWeeks, 
  totalEvcValue, 
  formatNumber, 
  modulesByPillar, 
  resourceAllocation,
  intent,
  formattedDate,
  evcPricePerUnit,
  paymentOption,
  paymentDetails,
  calculatorConfig,
  weeklyEVCs,
  parameters,
  serviceParameters,
  calculator
}) => {
  // Use calculator functions for business logic when available 
  const totalModules = calculator ? calculator.calculateTotalModules(modulesByPillar) : 
    Object.values(modulesByPillar || {}).flat().length;
    
  // Calculate total EVC sum of all selected modules
  const totalEvcSum = Object.values(modulesByPillar || {}).flat().reduce((sum, module) => sum + module.evcValue, 0);
  
  // Generate pillar names for narrative - this is UI-specific formatting
  const pillarNames = Object.keys(modulesByPillar || {});
  const pillarNarrative = pillarNames.map((pillar, index, array) => {
    if (index === 0) return ` ${pillar}`;
    if (index === array.length - 1) return ` and ${pillar}`;
    return `, ${pillar}`;
  }).join('');

  // Get variant display name
  const getVariantDisplayName = (variantType) => {
    return variantType === 'insightPrimer' ? 'Insight Primer' : 'Integrated Execution';
  };
  
  // Helper to get icon for module type - UI-specific formatting
  const getModuleTypeIcon = (type) => {
    return type === 'insightPrimer' ? '💡' : '⚙️';
  };
  
  // Helper function to format decimal numbers - UI-specific formatting
  const formatDecimal = (num) => {
    return Number(num).toFixed(1).replace(/\.0$/, '');
  };
  
  // Get pillar icon - simplified for PDF use
  const getPillarIcon = (pillar) => {
    // Find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars?.find(
      p => p.label?.toLowerCase() === pillar.toLowerCase()
    );
    
    if (pillarConfig && pillarConfig.icon) {
      return pillarConfig.icon;
    }
    
    // Fallback to default icons if not found in config
    switch(pillar.toLowerCase()) {
      case 'transformation': return '👥';
      case 'strategy': return '📈';
      case 'technology': return '🛡️';
      case 'discovery': return '🌐';
      default: return '🧩';
    }
  };
  
  // Get pillar color
  const getPillarColor = (pillar) => {
    // Try to find the pillar in the configuration
    const pillarConfig = calculatorConfig.pillars?.find(
      p => p.label?.toLowerCase() === pillar.toLowerCase()
    );
    
    if (pillarConfig) {
      // If the pillar is found in the config, return a color class based on the pillar's id
      switch(pillarConfig.id?.toLowerCase()) {
        case 'transformation': return '#8B5CF6'; // purple-600
        case 'strategy': return '#3B82F6'; // blue-600
        case 'technology': return '#10B981'; // green-600
        case 'discovery': return '#F59E0B'; // amber-600
        case 'catalyst': return '#1E40AF'; // blue-800
        default: return '#4B5563'; // gray-600
      }
    }
    
    // Fallback to legacy color mapping if not found in config
    switch(pillar.toLowerCase()) {
      case 'transformation': return '#8B5CF6'; // purple-600
      case 'strategy': return '#3B82F6'; // blue-600
      case 'technology': return '#10B981'; // green-600
      case 'discovery': return '#F59E0B'; // amber-600
      case 'catalyst': return '#1E40AF'; // blue-800
      default: return '#4B5563'; // gray-600
    }
  };
  
  // Create a comprehensive EVC calculation table
  const renderPriceCalculationTable = () => {
    // Use calculator functions for business logic if available
    const totalEvcSum = calculator ? 
      Object.values(calculator.calculateModuleEvcsByPillar(modulesByPillar) || {})
        .reduce((sum, evc) => sum + evc, 0) : 
      Object.values(modulesByPillar || {})
        .flat()
        .reduce((sum, module) => sum + module.evcValue, 0);
    
    // Get the resource allocation overhead percentage from calculator config
    const overheadPercentage = calculatorConfig?.resourceAllocation?.[resourceAllocation]?.switchingOverhead || 10;
    
    // Calculate the absolute EVC overhead for resource allocation
    const absoluteOverheadEvcs = calculator ? 
      calculator.calculateOverheadEvcs(totalEvcSum, resourceAllocation) : 
      Math.ceil((totalEvcSum * overheadPercentage) / 100);
    
    // Total EVCs needed including overhead
    const totalEvcsWithOverhead = totalEvcSum + absoluteOverheadEvcs;
    
    // Calculate parameter costs using calculator function if available
    const parameterCosts = calculator ? 
      calculator.calculateParameterEvcCosts(parameters, serviceParameters, weeklyEVCs) : 
      serviceParameters
        .filter(param => parameters?.[param.id])
        .map(param => {
          const evcCost = calculateEvcCost(param);
          return {
            name: param.label,
            description: param.productionImpact || param.description,
            modifier: param.modifier,
            evcCost: evcCost
          };
        });
    
    // Only define this function if we're not using the calculator's version
    function calculateEvcCost(param) {
      if (!param?.evcCost) return null;
      
      const { type, value } = param.evcCost;
      
      if (type === 'absolute') {
        return value;
      } else if (type === 'relative') {
        return Math.ceil((weeklyEVCs * value) / 100);
      }
      
      return null;
    }

    return (
      <View style={styles.calculationTable}>
        <Text style={styles.calculationTitle}>Complete EVC Calculation Breakdown</Text>
        <Text style={styles.calculationSubtext}>
          This table provides a comprehensive view of all elements that impact your pricing 
          and explains how EVCs are both produced and consumed in your solution.
        </Text>
        
        <View style={styles.calculationSection}>
          <Text style={styles.calculationSectionTitle}>EVC Sources (Production)</Text>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Weekly Production Capacity:</Text>
            <Text style={styles.calculationValue}>{formatDecimal(weeklyEVCs)} EVCs/week × {completionTimeWeeks} weeks</Text>
            <Text style={styles.calculationTotal}>{totalEvcValue} EVCs</Text>
          </View>
          
          {/* Add payment option if applicable */}
          {paymentOption === 'prepaid' && paymentDetails?.priceModifier < 1 && (
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Prepayment Reservation Discount:</Text>
              <Text style={styles.calculationValue}>{((1 - paymentDetails.priceModifier) * 100).toFixed(0)}% discount</Text>
              <Text style={styles.calculationTotal}>Applied</Text>
            </View>
          )}
          
          {/* Add volume discount if applicable */}
          {calculator && calculator.volumeDiscountPercentage > 0 && (
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Volume Efficiency Discount:</Text>
              <Text style={styles.calculationValue}>{calculator.volumeDiscountPercentage.toFixed(1)}% discount</Text>
              <Text style={styles.calculationTotal}>Applied</Text>
            </View>
          )}
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRowHighlight}>
            <Text style={styles.calculationLabel}>Total EVC Production:</Text>
            <Text style={styles.calculationTotal}>{totalEvcValue} EVCs</Text>
          </View>
        </View>
        
        <View style={styles.calculationSection}>
          <Text style={styles.calculationSectionTitle}>EVC Consumption (Module Requirements)</Text>
          
          {Object.entries(modulesByPillar || {}).map(([pillar, modules], index) => {
            // Use calculator function for pillar totals if available
            const evcsByPillar = calculator ? 
              calculator.calculateModuleEvcsByPillar(modulesByPillar) : 
              {};
            const pillarTotal = evcsByPillar[pillar] || 
              modules.reduce((sum, module) => sum + module.evcValue, 0);
            
            return (
              <View key={`pillar-${index}`}>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>{pillar} Pillar ({modules.length} modules):</Text>
                  <Text style={styles.calculationTotal}>{pillarTotal} EVCs</Text>
                </View>
                
                {modules.map((module, moduleIndex) => (
                  <View key={`module-${moduleIndex}`} style={{
                    ...styles.calculationSubRow,
                    borderLeftColor: getPillarColor(pillar),
                    borderLeftWidth: 2,
                    paddingLeft: 8,
                    marginLeft: 5
                  }}>
                    <Text style={styles.calculationSubLabel}>• {module.name}</Text>
                    <Text style={styles.calculationValue}>
                      {getModuleTypeIcon(module.selectedVariant || 'insightPrimer')}
                    </Text>
                    <Text style={styles.calculationSubValue}>{module.evcValue} EVCs</Text>
                  </View>
                ))}
                
                {index < Object.entries(modulesByPillar || {}).length - 1 && (
                  <View style={styles.calculationSubDivider} />
                )}
              </View>
            );
          })}
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Base Module Requirements:</Text>
            <Text style={styles.calculationTotal}>{totalEvcSum} EVCs</Text>
          </View>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Resource Allocation Overhead:</Text>
            <Text style={styles.calculationValue}>
              {overheadPercentage}% of module total 
              ({calculatorConfig?.resourceAllocation?.[resourceAllocation]?.overheadLabel || 'standard'})
            </Text>
            <Text style={styles.calculationTotal}>+{absoluteOverheadEvcs} EVCs</Text>
          </View>
          
          {/* Show parameter impacts if any */}
          {parameterCosts.length > 0 && parameterCosts.map((param, index) => (
            <View key={`param-${index}`} style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>{param.name}:</Text>
              <Text style={styles.calculationValue}>{param.modifier}x multiplier</Text>
              <Text style={styles.calculationTotal}>
                {param.evcCost ? `+${param.evcCost} EVCs` : 'Applied'}
              </Text>
            </View>
          ))}
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRowHighlight}>
            <Text style={styles.calculationLabel}>Total EVC Consumption:</Text>
            <Text style={styles.calculationTotal}>{totalEvcsWithOverhead} EVCs</Text>
          </View>
        </View>
        
        <View style={styles.calculationSection}>
          <Text style={styles.calculationSectionTitle}>Financial Summary</Text>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Base EVC Price:</Text>
            <Text style={styles.calculationValue}>€{formatNumberWithDecimals(evcPricePerUnit, 2)} per EVC</Text>
          </View>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Total EVC Value:</Text>
            <Text style={styles.calculationValue}>{totalEvcValue} EVCs</Text>
          </View>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Payment Model:</Text>
            <Text style={styles.calculationValue}>{paymentDetails?.name || 'Standard'}</Text>
          </View>
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Weekly Investment:</Text>
            <Text style={styles.calculationTotal}>€{formatNumberWithDecimals(totalPrice)}</Text>
          </View>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Implementation Period:</Text>
            <Text style={styles.calculationTotal}>{completionTimeWeeks} weeks</Text>
          </View>
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRowTotal}>
            <Text style={styles.calculationLabelTotal}>Total Investment:</Text>
            <Text style={styles.calculationGrandTotal}>€{formatNumberWithDecimals(totalPrice * completionTimeWeeks)}</Text>
          </View>
        </View>
        
        <View style={styles.calculationNote}>
          <Text style={styles.calculationNoteText}>
            Note: This calculation provides a transparent view of how your investment translates into 
            transformation resources through our EVC framework. The resource allocation overhead reflects 
            the coordination complexity associated with your selected implementation approach.
            {totalEvcValue !== totalEvcsWithOverhead && 
              ` The difference between EVC production and consumption represents optimization potential.`}
          </Text>
        </View>
      </View>
    );
  };

  // Calculate the absolute EVC overhead for resource allocation
  const overheadPercentage = calculatorConfig.resourceAllocation[resourceAllocation]?.switchingOverhead || 0;
  const absoluteOverheadEvcs = Math.ceil((totalEvcSum * overheadPercentage) / 100);

  // Split modules by pillar into reasonable chunks for pagination
  // This is UI-specific layout logic and makes sense to keep in the component
  const splitModulesByPillar = () => {
    const pages = [];
    let currentPage = [];
    let currentModuleCount = 0;
    
    Object.entries(modulesByPillar || {}).forEach(([pillar, modules]) => {
      // If adding this pillar would exceed our target modules per page, create a new page
      if (currentModuleCount > 0 && currentModuleCount + modules.length > 4) {
        pages.push([...currentPage]);
        currentPage = [];
        currentModuleCount = 0;
      }
      
      currentPage.push([pillar, modules]);
      currentModuleCount += modules.length;
    });
    
    // Add any remaining content
    if (currentPage.length > 0) {
      pages.push([...currentPage]);
    }
    
    return pages;
  };
  
  const modulePages = splitModulesByPillar();

  return (
    <>
      {/* Executive Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Executive Summary</Text>
        </View>
        
        <View style={styles.contentPage}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              This Strategic Solution Brief outlines a comprehensive business transformation plan 
              tailored to your organization's specific needs and objectives. Based on your selections, 
              we've designed a {completionTimeWeeks}-week implementation roadmap that addresses
              {pillarNarrative} priorities using our proven Elastic Value Credit (EVC) framework.
            </Text>

            {intent && (
              <View style={styles.intentContainer}>
                <Text style={styles.intentLabel}>BUSINESS OBJECTIVE</Text>
                <Text style={styles.intentText}>{intent}</Text>
              </View>
            )}
          </View>

          {/* Investment Overview */}
          <Text style={styles.sectionTitle}>Investment Overview</Text>
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={{...styles.columnWithFlex, marginRight: 10}}>
                <Text style={styles.summaryLabel}>Weekly Investment:</Text>
                <Text style={styles.summaryValue}>€{formatNumberWithDecimals(totalPrice)}</Text>
              </View>
              <View style={{...styles.columnWithFlex, marginLeft: 10}}>
                <Text style={styles.summaryLabel}>Implementation Timeline:</Text>
                <Text style={styles.summaryValue}>{completionTimeWeeks} weeks</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={{...styles.columnWithFlex, marginRight: 10}}>
                <Text style={styles.summaryLabel}>Total Elastic Value Credits:</Text>
                <Text style={styles.summaryValue}>{totalEvcValue} EVCs</Text>
              </View>
              <View style={{...styles.columnWithFlex, marginLeft: 10}}>
                <Text style={styles.summaryLabel}>Selected Modules:</Text>
                <Text style={styles.summaryValue}>{totalModules}</Text>
              </View>
            </View>
          </View>

          {/* Solution Scope */}
          <Text style={styles.sectionTitle}>Solution Scope</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              This solution encompasses {totalModules} strategic modules across {pillarNames.length} key business pillars. 
              Each module has been selected to address specific aspects of your transformation journey, 
              with resources optimally allocated to maximize business impact and accelerate time-to-value.
            </Text>

            {/* Pillar Summary Visualization */}
            {Object.entries(modulesByPillar || {}).map(([pillar, modules], index) => (
              <View key={index} style={{...styles.row, marginTop: 15}}>
                <View style={styles.pillarSummary}>
                  <Text style={styles.pillarTitle}>{pillar}</Text>
                  <Text style={styles.moduleCount}>{modules.length} modules</Text>
                  <Text style={styles.moduleEvcs}>
                    {modules.reduce((sum, module) => sum + module.evcValue, 0)} EVCs
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Service Delivery Timeline */}
          <Text style={{...styles.sectionTitle, marginTop: 5, marginBottom: 3}}>Service Delivery Timeline</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Your service delivery timeline is based on our Elastic Value Credit (EVC) framework, which measures transformation 
              resource requirements. This visualization shows how your service capacity and scope requirements create a predictable
              delivery timeline.
            </Text>

            {/* EVC delivery blocks visualization */}              <View style={styles.deliveryTimelineCard}>
              <View style={styles.deliveryTimelineHeaderCard}>
                <Text style={styles.deliveryTimelineTitle}>Continuous Service Delivery</Text>
                <Text style={styles.deliveryTimelineWeeksValue}>
                  {completionTimeWeeks}
                  <Text style={styles.deliveryTimelineWeeksLabel}> weeks</Text>
                </Text>
              </View>
              
              <View style={styles.deliveryTimelineBar}>
                <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
                  {Array.from({ length: Math.min(completionTimeWeeks, 20) }).map((_, index) => (
                    <View 
                      key={index} 
                      style={{
                        ...styles.deliveryTimelineBlockCard,
                        width: `${100 / Math.min(completionTimeWeeks, 20)}%`,
                      }}
                    >
                      {(completionTimeWeeks <= 12 || index % 2 === 0 || index === completionTimeWeeks - 1) && (
                        <Text style={styles.deliveryTimelineBlockCardText}>
                          {weeklyEVCs}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
                {completionTimeWeeks > 20 && (
                  <View style={styles.deliveryTimelineEllipsisCard}>
                    <Text style={styles.deliveryTimelineEllipsisText}>...</Text>
                  </View>
                )}
              </View>
              
              {/* Week markers */}
              <View style={styles.deliveryTimelineMarkers}>
                <Text style={styles.deliveryTimelineMarker}>Week 1</Text>
                {completionTimeWeeks <= 10 ? (
                  // If 10 or fewer weeks, show all week markers
                  Array.from({ length: completionTimeWeeks - 2 }).map((_, index) => (
                    <Text key={index} style={styles.deliveryTimelineMarker}>Week {index + 2}</Text>
                  ))
                ) : (
                  // Otherwise, show some markers strategically
                  <>
                    <Text style={styles.deliveryTimelineMarker}>Week {Math.round(completionTimeWeeks * 0.25)}</Text>
                    <Text style={styles.deliveryTimelineMarker}>Week {Math.round(completionTimeWeeks * 0.5)}</Text>
                    <Text style={styles.deliveryTimelineMarker}>Week {Math.round(completionTimeWeeks * 0.75)}</Text>
                  </>
                )}
                <Text style={styles.deliveryTimelineMarker}>Week {completionTimeWeeks}</Text>
              </View>
              
              {/* Formula visualization */}
              <View style={styles.deliveryFormulaContainer}>
                <View style={styles.deliveryFormulaItem}>
                  <Text style={[styles.deliveryFormulaValue, {color: colors.primary}]}>{totalEvcValue}</Text>
                  <Text style={styles.deliveryFormulaLabel}>Total EVCs</Text>
                </View>
                <Text style={styles.deliveryFormulaDivider}>÷</Text>
                <View style={styles.deliveryFormulaItem}>
                  <Text style={[styles.deliveryFormulaValue, {color: colors.blue}]}>{weeklyEVCs}</Text>
                  <Text style={styles.deliveryFormulaLabel}>EVCs/week</Text>
                </View>
                <Text style={styles.deliveryFormulaDivider}>=</Text>
                <View style={styles.deliveryFormulaItem}>
                  <Text style={[styles.deliveryFormulaValue, {color: '#374151'}]}>{completionTimeWeeks}</Text>
                  <Text style={styles.deliveryFormulaLabel}>weeks</Text>
                </View>
              </View>
            </View>
            
            {/* Service approach context */}
            <View style={styles.serviceApproachNoteCard}>
              <Text style={{...styles.serviceApproachIcon, marginTop: 2}}>ℹ</Text>
              <Text style={styles.serviceApproachTextCard}>
                Our service model delivers consistent value through a weekly EVC capacity of {weeklyEVCs}. 
                With your selected {resourceAllocation} resource allocation strategy, we'll deliver the complete {totalEvcValue} EVC scope over {completionTimeWeeks} weeks, 
                enabling continuous transformation without disrupting your operations.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page 1</Text>
        </View>
      </Page>
      
      {/* Strategic Approach Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Strategic Approach</Text>
        </View>
        
        <View style={styles.contentPage}>
          <View style={styles.twoColumnLayout}>
            {/* Strategic Pillars */}
            <View style={styles.strategicApproachColumn}>
              <Text style={styles.columnHeading}>Strategic Pillars</Text>
              
              {Object.entries(modulesByPillar || {}).map(([pillar, modules]) => (
                <View key={`pillar-${pillar}`} style={styles.pillarCard}>
                  <View style={styles.pillarHeader}>
                    <View style={[styles.pillarIcon, { backgroundColor: `${getPillarColor(pillar)}20` }]}>
                      <Text style={[styles.pillarIconText, { color: getPillarColor(pillar) }]}>{getPillarIcon(pillar)}</Text>
                    </View>
                    <View style={styles.pillarInfo}>
                      <Text style={styles.pillarName}>{pillar}</Text>
                      <Text style={styles.pillarModuleCount}>{modules.length} modules selected</Text>
                    </View>
                  </View>
                  
                  <View style={styles.pillarContent}>
                    <Text style={styles.pillarDescription}>
                      {pillar === 'Transformation' ? 
                        'Focus on people, processes, and organizational change management to enable successful business transformation.' :
                      pillar === 'Strategy' ? 
                        'Establish clear direction, market positioning, and competitive differentiation to drive business outcomes.' :
                      pillar === 'Technology' ? 
                        'Implement and optimize technological capabilities to support business innovation and efficiency.' :
                      'Explore new opportunities and build foundational knowledge to inform strategic decisions.'}
                    </Text>
                    
                    <Text style={styles.pillarModulesLabel}>Key Modules</Text>
                    <View style={styles.pillarModulesBadges}>
                      {modules.slice(0, 3).map((module, idx) => (
                        <View key={`module-badge-${idx}`} style={styles.moduleBadge}>
                          <Text style={styles.moduleBadgeText}>{module.name}</Text>
                        </View>
                      ))}
                      {modules.length > 3 && (
                        <View style={styles.moduleBadge}>
                          <Text style={styles.moduleBadgeText}>+{modules.length - 3} more</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            {/* Delivery Framework */}
            <View style={styles.strategicApproachColumn}>
              <Text style={styles.columnHeading}>Delivery Framework</Text>
              
              <View style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <View style={[styles.pillarIcon, { backgroundColor: '#F3E8FF' }]}>
                    <Text style={[styles.pillarIconText, { color: '#9333EA' }]}>🚀</Text>
                  </View>
                  <View style={styles.pillarInfo}>
                    <Text style={styles.pillarName}>Transformation Velocity</Text>
                    <Text style={styles.pillarModuleCount}>
                      {calculatorConfig.productionCapacity ? 
                       calculatorConfig.productionCapacity[resourceAllocation]?.label || 'Professional' : 'Professional'} 
                       ({weeklyEVCs} EVCs/week)
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pillarContent}>
                  <Text style={styles.pillarDescription}>
                    {resourceAllocation === 'pathfinder' ? 
                      'Focused exploration and initial implementation for targeted challenges. This approach provides a controlled pace suitable for organizations starting their transformation journey or addressing specific pain points.' :
                    resourceAllocation === 'roadster' ? 
                      'Balanced approach delivering consistent progress without disrupting operations. This mid-tier velocity is ideal for organizations that need meaningful change while maintaining operational stability.' :
                    resourceAllocation === 'jetpack' ? 
                      'Accelerated transformation with significant business impact and rapid results. This high-velocity approach enables organizations to quickly respond to market pressures and drive competitive advantage.' :
                      'Enterprise-grade transformation with maximum velocity for critical initiatives. This approach dedicates significant resources to drive comprehensive change across the organization for maximum strategic impact.'}
                  </Text>
                  
                  <View style={styles.velocityBar}>
                    <View style={styles.velocityBarBackground} />
                    <View 
                      style={[
                        styles.velocityBarFill, 
                        { 
                          width: resourceAllocation === 'pathfinder' ? '25%' : 
                                 resourceAllocation === 'roadster' ? '50%' : 
                                 resourceAllocation === 'jetpack' ? '75%' : '100%' 
                        }
                      ]} 
                    />
                    <Text style={styles.velocityBarLabel}>{weeklyEVCs} EVCs/week</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <View style={[styles.pillarIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={[styles.pillarIconText, { color: '#2563EB' }]}>📊</Text>
                  </View>
                  <View style={styles.pillarInfo}>
                    <Text style={styles.pillarName}>Resource Allocation</Text>
                    <Text style={styles.pillarModuleCount}>
                      {calculatorConfig.resourceAllocation ? 
                       calculatorConfig.resourceAllocation[resourceAllocation]?.description || 'Balanced approach' : 
                       'Balanced approach'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.pillarContent}>
                  <Text style={styles.pillarDescription}>
                    {resourceAllocation === 'focused' ? 
                      'Laser-focused approach with minimal context switching for maximum efficiency on a single strategic priority. This approach minimizes coordination overhead and delivers the fastest possible results for your highest-priority initiative.' :
                    resourceAllocation === 'balanced' ? 
                      'Strategic balance between key priorities and operational initiatives with moderate coordination overhead. This approach enables parallel work on multiple interconnected initiatives with efficient resource sharing and knowledge transfer.' :
                      'Distributed approach addressing multiple concurrent initiatives across your organization. This approach enables broad transformation across multiple business units or functions with specialized expertise for each area.'}
                  </Text>
                  
                  <View style={styles.resourceOptions}>
                    <View style={[
                      styles.resourceOption, 
                      resourceAllocation === 'focused' ? styles.resourceOptionActive : {}
                    ]}>
                      <Text style={[
                        styles.resourceOptionText,
                        resourceAllocation === 'focused' ? styles.resourceOptionTextActive : {}
                      ]}>Focused</Text>
                    </View>
                    <View style={[
                      styles.resourceOption, 
                      resourceAllocation === 'balanced' ? styles.resourceOptionActive : {}
                    ]}>
                      <Text style={[
                        styles.resourceOptionText,
                        resourceAllocation === 'balanced' ? styles.resourceOptionTextActive : {}
                      ]}>Balanced</Text>
                    </View>
                    <View style={[
                      styles.resourceOption, 
                      resourceAllocation === 'distributed' ? styles.resourceOptionActive : {}
                    ]}>
                      <Text style={[
                        styles.resourceOptionText,
                        resourceAllocation === 'distributed' ? styles.resourceOptionTextActive : {}
                      ]}>Distributed</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page 2</Text>
        </View>
      </Page>

      {/* Selected Modules Pages - Now dynamically split across multiple pages if needed */}
      {modulePages.map((pageContent, pageIndex) => (
        <Page key={`modules-page-${pageIndex}`} size="A4" style={styles.page}>
          <View style={styles.headerBanner}>
            <Text style={styles.headerTitle}>
              Selected Modules {modulePages.length > 1 ? `(${pageIndex + 1}/${modulePages.length})` : ''}
            </Text>
          </View>
          
          <View style={styles.contentPage}>
            {pageIndex === 0 && (
              <Text style={styles.paragraph}>
                The following modules have been selected to address your specific business needs. 
                Each module represents a focused workstream with defined outcomes and dedicated resources.
              </Text>
            )}
            
            {/* Modules by Pillar */}
            {pageContent.map(([pillar, modules], pillarIndex) => (
              <View key={pillarIndex} style={{...styles.section, marginTop: 15}}>
                <Text style={styles.pillarTitle}>{pillar}</Text>
                
                {modules.map((module, moduleIndex) => (
                  <View key={moduleIndex} style={{
                    ...styles.moduleDetailCard,
                    borderLeftColor: getPillarColor(pillar) // Apply pillar-specific color
                  }}>
                    <View style={styles.row}>
                      <Text style={styles.moduleName}>{module.name}</Text>
                      <Text style={styles.moduleEvcs}>{module.evcValue} EVCs</Text>
                    </View>
                    
                    <View style={styles.row}>
                      <Text style={styles.moduleType}>
                        {getModuleTypeIcon(module.selectedVariant || 'insightPrimer')} {module.selectedVariant === 'insightPrimer' ? 'Insight Primer' : 'Integrated Execution'}
                      </Text>
                    </View>
                    
                    {module.description && (
                      <Text style={styles.moduleDescription}>{module.description}</Text>
                    )}
                    
                    {module.outcomes && (
                      <View style={styles.moduleOutcomes}>
                        <Text style={styles.moduleSubtitle}>Key Outcomes:</Text>
                        {module.outcomes.map((outcome, i) => (
                          <Text key={i} style={styles.outcomeItem}>• {outcome}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.coverFooterText}>
              CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
            </Text>
            <Text style={styles.pageNumber}>Page {pageIndex + 3}</Text>
          </View>
        </Page>
      ))}

      {/* Resource Allocation Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Resource Allocation & Investment</Text>
        </View>
        
        <View style={styles.contentPage}>
          {/* Resource Allocation Section */}
          <Text style={styles.sectionTitle}>Strategic Resource Allocation</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Your solution includes a carefully balanced allocation of resources across key business pillars.
              This allocation is designed to optimize business impact while maintaining strategic alignment
              with your transformation objectives.
            </Text>
            
            {/* Resource Allocation Visualization - Modern Single Bar Approach */}
            <View style={styles.resourceAllocationContainer}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceHeaderText}>Resource allocation by strategic pillar</Text>
                <Text style={styles.resourceHeaderValue}>{totalEvcValue} Total EVCs</Text>
              </View>
              
              {/* Single bar showing proportional allocation of EVCs across all pillars */}
              <View style={styles.singleBarContainer}>
                {Object.entries(modulesByPillar || {}).map(([pillar, modules], index) => {
                  const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                  const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(2);
                  
                  return (
                    <View 
                      key={pillar}
                      style={{
                        height: '100%',
                        width: `${pillarPercentage}%`,
                        backgroundColor: getPillarColor(pillar),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {parseFloat(pillarPercentage) > 10 && (
                        <Text style={styles.barPercentageText}>{Math.round(parseFloat(pillarPercentage))}%</Text>
                      )}
                    </View>
                  );
                })}
                
                {/* Add resource allocation overhead if it exists */}
                {absoluteOverheadEvcs > 0 && (
                  <View 
                    style={{
                      height: '100%',
                      width: `${(absoluteOverheadEvcs / totalEvcValue * 100).toFixed(2)}%`,
                      backgroundColor: '#6B7280', // gray-500
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {(absoluteOverheadEvcs / totalEvcValue * 100) > 5 && (
                      <Text style={styles.barPercentageText}>
                        {Math.round(absoluteOverheadEvcs / totalEvcValue * 100)}%
                      </Text>
                    )}
                  </View>
                )}
              </View>
              
              {/* Legend - Color blocks with labels */}
              <View style={styles.barLegendContainer}>
                {Object.entries(modulesByPillar || {}).map(([pillar, modules]) => {
                  const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                  const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(0);
                  
                  return (
                    <View key={pillar} style={styles.legendItem}>
                      <View style={[styles.legendColorBox, { backgroundColor: getPillarColor(pillar) }]} />
                      <View>
                        <Text style={styles.legendLabel}>{pillar}</Text>
                        <Text style={styles.legendValue}>{pillarTotal} EVCs ({pillarPercentage}%)</Text>
                      </View>
                    </View>
                  );
                })}
                
                {/* Add legend item for coordination overhead */}
                {absoluteOverheadEvcs > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: '#6B7280' }]} />
                    <View>
                      <Text style={styles.legendLabel}>Coordination Overhead</Text>
                      <Text style={styles.legendValue}>
                        {absoluteOverheadEvcs} EVCs ({Math.round(absoluteOverheadEvcs / totalEvcValue * 100)}%)
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Investment Structure */}
          <Text style={styles.sectionTitle}>Investment Structure</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Your investment is structured using our Elastic Value Credit (EVC) framework, which provides 
              flexibility and ensures resource optimization throughout the engagement. The total investment 
              is calculated based on the selected modules, resource allocation, and implementation timeline.
            </Text>
            
            {/* Investment cards in a two-column layout */}
            <View style={styles.cardRow}>
              {/* Investment Summary Card */}
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Investment Summary</Text>
                <Text style={styles.cardDescription}>
                  Your total investment is structured to provide predictable costs aligned with the scope and scale 
                  of your transformation initiative.
                  {paymentOption === 'prepaid' ? 
                    ` With the prepaid model, you benefit from reduced overall costs through our reservation discount of ${((1 - paymentDetails?.priceModifier) * 100).toFixed(0)}%.` : 
                    ' The standard billing model provides maximum financial flexibility with no upfront commitment.'}
                </Text>
                
                {/* Investment breakdown table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Weekly Investment</Text>
                    <Text style={styles.tableValue}>€{formatNumberWithDecimals(totalPrice)}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Monthly Investment</Text>
                    <Text style={styles.tableValue}>€{formatNumberWithDecimals(totalPrice * 4)}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Quarterly Investment</Text>
                    <Text style={styles.tableValue}>€{formatNumberWithDecimals(totalPrice * 13)}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Total Projected Cost</Text>
                    <Text style={[styles.tableValueHighlight, {fontSize: 14}]}>€{formatNumberWithDecimals(totalPrice * completionTimeWeeks)}</Text>
                  </View>
                </View>
              </View>
              
              {/* Value-Based Pricing Model Card */}
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Value-Based Pricing Model</Text>
                <Text style={styles.cardDescription}>
                  Our pricing is based on Elastic Value Credits (EVCs), a standardized unit of consulting value that ensures 
                  you pay only for the actual transformation resources you receive. Your selected {calculatorConfig?.productionCapacity?.[resourceAllocation]?.label || 'Professional'} tier 
                  provides {weeklyEVCs} EVCs weekly, calibrated to your organization's transformation needs.
                </Text>
                
                {/* Pricing components table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Weekly Production Capacity</Text>
                    <Text style={styles.tableValue}>{weeklyEVCs} EVCs</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Base Price per EVC</Text>
                    <Text style={styles.tableValue}>€{formatNumberWithDecimals(evcPricePerUnit, 2)}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Implementation Period</Text>
                    <Text style={styles.tableValue}>{completionTimeWeeks} weeks</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Payment Model</Text>
                    <Text style={styles.tableValue}>{paymentDetails?.name || 'Standard'}</Text>
                  </View>
                  {paymentOption === 'prepaid' && paymentDetails?.priceModifier < 1 && (
                    <View style={styles.tableRow}>
                      <Text style={styles.tableLabel}>Prepaid Reservation Discount</Text>
                      <Text style={styles.tableValue}>{((1 - paymentDetails.priceModifier) * 100).toFixed(0)}%</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {/* The comprehensive price calculation table is now moved to its own appendix */}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 3}</Text>
        </View>
      </Page>

      {/* Value Realization Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Value Realization & Next Steps</Text>
        </View>
        
        <View style={styles.contentPage}>
          {/* Value Realization */}
          <Text style={styles.sectionTitle}>Value Realization Timeline</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Our approach ensures value is delivered incrementally throughout the engagement.
              The following timeline illustrates the expected value realization points across
              the implementation journey.
            </Text>
            
            {/* Value Realization Timeline */}
            <View style={styles.valueTimelineContainer}>
              <View style={styles.valueTimeline}>
                <View style={styles.valuePoint}>
                  <View style={styles.valueMarker} />
                  <Text style={styles.valueWeek}>Week 2</Text>
                  <Text style={styles.valueDescription}>Initial assessment completed</Text>
                </View>
                
                <View style={styles.valuePoint}>
                  <View style={styles.valueMarker} />
                  <Text style={styles.valueWeek}>Week 4</Text>
                  <Text style={styles.valueDescription}>Strategic roadmap defined</Text>
                </View>
                
                <View style={styles.valuePoint}>
                  <View style={styles.valueMarker} />
                  <Text style={styles.valueWeek}>Week 8</Text>
                  <Text style={styles.valueDescription}>First implementation milestone</Text>
                </View>
                
                <View style={styles.valuePoint}>
                  <View style={styles.valueMarker} />
                  <Text style={styles.valueWeek}>Week {completionTimeWeeks}</Text>
                  <Text style={styles.valueDescription}>Full solution implementation</Text>
                </View>
              </View>
            </View>
          </View>

          {/* EVC Framework Explanation */}
          <Text style={styles.sectionTitle}>Understanding the EVC Framework</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Elastic Value Credits (EVCs) are Elexive's proprietary resource allocation framework that 
              provides flexibility and transparency in consulting engagements. Each EVC represents a 
              standardized unit of consulting value delivery capacity that encapsulates a balanced mix 
              of expertise, time, and deliverable value.
            </Text>
            
            <View style={styles.evcCalculationBox}>
              <Text style={styles.evcCalculationTitle}>How EVCs Are Calculated:</Text>
              <Text style={styles.evcCalculationText}>
                1. Base module value is established based on complexity and scope
              </Text>
              <Text style={styles.evcCalculationText}>
                2. Engagement type modifier is applied (Insight Primer or Integrated Execution)
              </Text>
              <Text style={styles.evcCalculationText}>
                3. Custom parameters and business context factors are incorporated
              </Text>
              <Text style={styles.evcCalculationText}>
                4. Volume discounts are applied for larger engagements
              </Text>
            </View>
          </View>

          {/* Next Steps */}
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              To move forward with this transformation plan or to further refine the proposal:
            </Text>
            
            <View style={styles.nextStepsList}>
              <Text style={styles.nextStep}>
                1. Schedule a detailed solution review with an Elexive transformation consultant
              </Text>
              <Text style={styles.nextStep}>
                2. Arrange stakeholder alignment sessions to validate the approach
              </Text>
              <Text style={styles.nextStep}>
                3. Develop a detailed implementation plan with specific milestones and metrics
              </Text>
              <Text style={styles.nextStep}>
                4. Formalize the engagement with a tailored statement of work
              </Text>
            </View>
            
            <Text style={styles.contactInfo}>
              Contact us at solutions@elexive.com or visit elexive.com to schedule your consultation.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 4}</Text>
        </View>
      </Page>

      {/* Engagement Models Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Appendix: Engagement Models</Text>
        </View>
        
        <View style={styles.contentPage}>
          {/* Engagement Models Explanation */}
          <Text style={styles.sectionTitle}>Engagement Models</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Elexive offers two primary engagement models, each designed to meet different 
              business needs and transformation objectives:
            </Text>
            
            <View style={styles.engagementModelCard}>
              <Text style={styles.engagementModelTitle}>💡 Insight Primer</Text>
              <Text style={styles.engagementModelDescription}>
                The Insight Primer model focuses on assessment, analysis, and strategic 
                recommendations. It is ideal for organizations seeking expert guidance and 
                decision support without full implementation services. This model delivers 
                actionable insights, strategic roadmaps, and implementation frameworks that 
                can be executed by your internal teams or other partners.
              </Text>
              
              <View style={styles.engagementModelFeatures}>
                <Text style={styles.engagementModelSubtitle}>Key Features:</Text>
                <Text style={styles.engagementModelFeatureItem}>• Expert assessment of current state</Text>
                <Text style={styles.engagementModelFeatureItem}>• Strategic roadmap development</Text>
                <Text style={styles.engagementModelFeatureItem}>• Implementation frameworks and approaches</Text>
                <Text style={styles.engagementModelFeatureItem}>• Knowledge transfer to internal teams</Text>
                <Text style={styles.engagementModelFeatureItem}>• Advisory support during implementation</Text>
              </View>
            </View>
            
            <View style={styles.engagementModelCard}>
              <Text style={styles.engagementModelTitle}>⚙️ Integrated Execution</Text>
              <Text style={styles.engagementModelDescription}>
                The Integrated Execution model provides end-to-end transformation support, 
                from strategy development through implementation and optimization. This model 
                includes dedicated implementation teams, change management support, and ongoing 
                optimization services. Ideal for organizations seeking comprehensive transformation 
                partner to drive and execute strategic initiatives.
              </Text>
              
              <View style={styles.engagementModelFeatures}>
                <Text style={styles.engagementModelSubtitle}>Key Features:</Text>
                <Text style={styles.engagementModelFeatureItem}>• End-to-end implementation support</Text>
                <Text style={styles.engagementModelFeatureItem}>• Dedicated transformation teams</Text>
                <Text style={styles.engagementModelFeatureItem}>• Change management and adoption services</Text>
                <Text style={styles.engagementModelFeatureItem}>• Ongoing optimization and refinement</Text>
                <Text style={styles.engagementModelFeatureItem}>• Integrated program management</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 5}</Text>
        </View>
      </Page>

      {/* EVC Calculation Details Appendix */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Appendix: EVC Calculation Details</Text>
        </View>
        
        <View style={styles.contentPage}>
          <Text style={styles.paragraph}>
            This appendix provides a comprehensive breakdown of the Elastic Value Credit (EVC) calculation
            that forms the basis of your solution pricing. The EVC framework ensures transparency and 
            flexibility in resource allocation throughout your transformation journey.
          </Text>
          
          {/* Render the comprehensive price calculation table */}
          {renderPriceCalculationTable()}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 5}</Text>
        </View>
      </Page>

      {/* Module Appendix Pages */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Appendix: Detailed Module Specifications</Text>
        </View>
        
        <View style={styles.contentPage}>
          <Text style={styles.paragraph}>
            This appendix provides detailed specifications for each selected module. 
            The modules are organized by pillar to facilitate a comprehensive understanding 
            of your transformation solution.
          </Text>
          
          <Text style={styles.note}>
            Note: The following pages contain one module per page with complete specifications, 
            outcomes, and implementation details.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 6}</Text>
        </View>
      </Page>

      {/* Individual Module Pages */}
      {Object.entries(modulesByPillar || {}).sort(([pillarA], [pillarB]) => pillarA.localeCompare(pillarB)).map(([pillar, modules]) => (
        modules.map((module, moduleIndex) => {
          // Enhance the module with data from modulesConfig
          const configModule = require('../../config/modulesConfig.json').modules.find(m => m.name === module.name);
          const enhancedModule = configModule ? {
            ...configModule,
            ...module,
            // Preserve arrays from module if they exist, otherwise use from configModule
            outcomes: module.outcomes || configModule.outcomes,
            keyActivities: module.keyActivities || configModule.keyActivities,
            deliverables: module.deliverables || configModule.deliverables
          } : module;

          return (
            <ModuleContentPage
              key={`module-detail-${pillar}-${moduleIndex}`}
              module={enhancedModule}
              pillar={pillar}
              pageNumber={modulePages.length + 7 + Object.entries(modulesByPillar || {})
                .sort(([pillarA], [pillarB]) => pillarA.localeCompare(pillarB))
                .slice(0, Object.keys(modulesByPillar || {}).sort().indexOf(pillar))
                .reduce((count, [_, pillarModules]) => count + pillarModules.length, 0) + moduleIndex}
              totalPages={modulePages.length + 6 + Object.values(modulesByPillar || {}).flat().length}
              getVariantDisplayName={getVariantDisplayName}
              getModuleTypeIcon={getModuleTypeIcon}
            />
          );
        })
      ))}
    </>
  );
};

export default ReportContentPage;