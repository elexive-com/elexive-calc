// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ReportContentPage.js
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import { getColorFromCssVar } from '../utils/colors';

/**
 * The completely reimagined content pages of the PDF report
 * Creates a professional, comprehensive solution brief for executive decision-makers
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
  // Get colors from utility function instead of hardcoding
  const elexivePrimary = getColorFromCssVar('--elexive-primary', '#2E2266');
  
  // Use calculator functions for business logic when available 
  const totalModules = calculator ? calculator.calculateTotalModules(modulesByPillar) : 
    Object.values(modulesByPillar || {}).flat().length;
  
  // Generate pillar names for narrative - this is UI-specific formatting
  const pillarNames = Object.keys(modulesByPillar || {});
  const pillarNarrative = pillarNames.map((pillar, index, array) => {
    if (index === 0) return ` ${pillar}`;
    if (index === array.length - 1) return ` and ${pillar}`;
    return `, ${pillar}`;
  }).join('');

  // Helper to get icon for module type - UI-specific formatting
  const getModuleTypeIcon = (type) => {
    return type === 'insightPrimer' ? '💡' : '⚙️';
  };
  
  // Helper function to format decimal numbers - UI-specific formatting
  const formatDecimal = (num) => {
    return Number(num).toFixed(1).replace(/\.0$/, '');
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
                  <View key={`module-${moduleIndex}`} style={styles.calculationSubRow}>
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
            <Text style={styles.calculationValue}>€{formatNumber(evcPricePerUnit)} per EVC</Text>
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
            <Text style={styles.calculationTotal}>€{formatNumber(totalPrice)}</Text>
          </View>
          
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Implementation Period:</Text>
            <Text style={styles.calculationTotal}>{completionTimeWeeks} weeks</Text>
          </View>
          
          <View style={styles.calculationDivider} />
          <View style={styles.calculationRowTotal}>
            <Text style={styles.calculationLabelTotal}>Total Investment:</Text>
            <Text style={styles.calculationGrandTotal}>€{formatNumber(totalPrice * completionTimeWeeks)}</Text>
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
                <Text style={styles.summaryValue}>€{formatNumber(totalPrice)}</Text>
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

          {/* Implementation Approach */}
          <Text style={styles.sectionTitle}>Implementation Approach</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Our implementation approach balances strategic depth with operational efficiency. 
              The {completionTimeWeeks}-week roadmap is structured to deliver incremental value 
              throughout the engagement while maintaining alignment with your business objectives.
            </Text>

            {/* Timeline Visualization */}
            <View style={styles.timelineContainer}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineLabel}>Weeks 1-4</Text>
                <Text style={styles.timelineLabel}>Weeks 5-8</Text>
                <Text style={styles.timelineLabel}>Weeks 9-{Math.min(12, completionTimeWeeks)}</Text>
                {completionTimeWeeks > 12 && (
                  <Text style={styles.timelineLabel}>Weeks 13-{completionTimeWeeks}</Text>
                )}
              </View>
              <View style={styles.timelineBar}>
                <View style={{...styles.timelineSegment, backgroundColor: '#4F46E5', flex: 1}}>
                  <Text style={styles.timelineText}>Assessment</Text>
                </View>
                <View style={{...styles.timelineSegment, backgroundColor: '#F59E0B', flex: 1}}>
                  <Text style={styles.timelineText}>Design</Text>
                </View>
                <View style={{...styles.timelineSegment, backgroundColor: '#10B981', flex: 1}}>
                  <Text style={styles.timelineText}>Implementation</Text>
                </View>
                {completionTimeWeeks > 12 && (
                  <View style={{...styles.timelineSegment, backgroundColor: '#6366F1', flex: 1}}>
                    <Text style={styles.timelineText}>Optimization</Text>
                  </View>
                )}
              </View>
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
                  <View key={moduleIndex} style={styles.moduleDetailCard}>
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
            <Text style={styles.pageNumber}>Page {pageIndex + 2}</Text>
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
            
            {/* Resource Allocation Visualization */}
            {resourceAllocation && (
              <View style={styles.resourceAllocationContainer}>
                {Object.entries(resourceAllocation).map(([pillar, percentage], index) => {
                  // Ensure percentage is a valid number
                  const validPercentage = typeof percentage === 'number' ? percentage : 0;
                  
                  return (
                    <View key={index} style={styles.resourceRow}>
                      <Text style={styles.resourceLabel}>{pillar}:</Text>
                      <View style={styles.resourceBarContainer}>
                        <View 
                          style={{
                            ...styles.resourceProgressBar, 
                            width: validPercentage + '%',
                            backgroundColor: index === 0 ? elexivePrimary : 
                                             index === 1 ? '#4F46E5' : 
                                             index === 2 ? '#10B981' : '#F59E0B'
                          }}
                        />
                        <Text style={styles.resourcePercentage}>{validPercentage}%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Investment Structure */}
          <Text style={styles.sectionTitle}>Investment Structure</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Your investment is structured using our Elastic Value Credit (EVC) framework, which provides 
              flexibility and ensures resource optimization throughout the engagement. The total investment 
              is calculated based on the selected modules, resource allocation, and implementation timeline.
            </Text>
            
            <View style={styles.investmentBreakdown}>
              <View style={styles.investmentRow}>
                <Text style={styles.investmentItemLabel}>Total Elastic Value Credits:</Text>
                <Text style={styles.investmentItemValue}>{totalEvcValue} EVCs</Text>
              </View>
              
              <View style={styles.investmentRow}>
                <Text style={styles.investmentItemLabel}>Weekly Investment:</Text>
                <Text style={styles.investmentItemValue}>€{formatNumber(totalPrice)}</Text>
              </View>
              
              <View style={styles.investmentRow}>
                <Text style={styles.investmentItemLabel}>Implementation Timeline:</Text>
                <Text style={styles.investmentItemValue}>{completionTimeWeeks} weeks</Text>
              </View>
              
              <View style={styles.investmentRow}>
                <Text style={styles.investmentItemLabel}>Total Investment:</Text>
                <Text style={styles.investmentValueTotal}>
                  €{formatNumber(totalPrice * completionTimeWeeks)}
                </Text>
              </View>
            </View>
            
            {/* Add the comprehensive price calculation table */}
            {renderPriceCalculationTable()}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.
          </Text>
          <Text style={styles.pageNumber}>Page {modulePages.length + 2}</Text>
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
          <Text style={styles.pageNumber}>Page {modulePages.length + 3}</Text>
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
          <Text style={styles.pageNumber}>Page {modulePages.length + 4}</Text>
        </View>
      </Page>
    </>
  );
};

export default ReportContentPage;