// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleContentPage.js
// Content page component for PDF generation

import React from 'react';
import { Text, View, Image, Page, StyleSheet } from '@react-pdf/renderer';
import modulesConfig from '../../config/modulesConfig.json';
import styles from '../utils/pdfStyles';
import { getPillarColor } from '../utils/colors';

// Helper function to determine journey stage based on module configuration
const determineJourneyStage = (module) => {
  // Get the journey stage from modulesConfig based on the module's primaryJourneyStage
  const journeyStageId = module.primaryJourneyStage || 'journey-stage-3'; // Default to Build if not defined
  const stageDefinition = modulesConfig.journeyStages.find(stage => stage.id === journeyStageId);
  
  if (stageDefinition) {
    return {
      id: stageDefinition.id,
      title: stageDefinition.title,
      description: stageDefinition.description
    };
  }
  
  // Fallback to default mapping if not found in config
  if (module.category === 'Strategic Assessment') return { id: 'journey-stage-1', title: 'Discover', description: 'Understanding your current state and defining success metrics' };
  if (module.category === 'Immediate Impact') return { id: 'journey-stage-3', title: 'Build', description: 'Implementing solutions and driving organizational change' };
  if (module.category === 'Vested Value') return { id: 'journey-stage-4', title: 'Scale', description: 'Refining approaches and maximizing transformation outcomes' };
  return { id: 'journey-stage-2', title: 'Design', description: 'Developing strategies and roadmaps for transformation success' }; // Default
};

// Component for a page footer
const PageFooter = ({ formattedDate, pageNumber }) => (
  <View style={{
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  }}>
    <Text style={{
      fontSize: 9,
      color: '#888',
    }}>
      Elexive Ltd • Solution Brief
    </Text>
    <Text style={{
      fontSize: 9,
      color: '#888',
    }}>
      Generated on {formattedDate} • Page {pageNumber}
    </Text>
  </View>
);

// Component for header with logo
const PageHeader = ({ pillarColor, logoUrl }) => (
  <>
    {/* Decorative header strip */}
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 12,
      backgroundColor: pillarColor,
    }} />
    
    {/* Small logo in top right */}
    <View style={{
      position: 'absolute',
      top: 20,
      right: 40,
    }}>
      <Image 
        src={logoUrl}
        style={{
          width: 100,
        }}
      />
    </View>
  </>
);

// Create static styles to optimize rendering
const dynamicStyles = StyleSheet.create({
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  bannerSection: {
    borderRadius: 8,
    padding: 20, // Reduced padding from 25 to 20
    marginBottom: 20, // Reduced margin from 25 to 20
    position: 'relative',
  },
  moduleIcon: {
    position: 'absolute',
    right: 20, // Moved icon closer to edge
    top: 20,
    width: 70, // Slightly smaller icon
    height: 70,
    opacity: 0.9,
  },
  moduleInfo: {
    width: '75%',
  },
  pillarName: {
    color: 'white',
    fontSize: 11, // Smaller font
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3, // Reduced margin
  },
  moduleName: {
    color: 'white',
    fontSize: 24, // Smaller font
    fontWeight: 'bold',
    marginBottom: 8, // Reduced margin
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3, // Reduced padding
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12, // Reduced margin
  },
  categoryText: {
    color: 'white',
    fontSize: 12, // Smaller font
    fontWeight: 'medium',
  },
  journeySection: {
    marginTop: 8, // Reduced margin
  },
  journeyLabel: {
    color: 'white',
    fontSize: 11, // Smaller font
    marginBottom: 6, // Reduced margin
    opacity: 0.9,
  },
  journeyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 3, // Reduced margin
  },
  stageItem: {
    alignItems: 'center',
    marginRight: 18, // Reduced margin
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    top: 10,
    left: -23,
    width: 18, // Shorter line
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  stageCircle: {
    width: 18, // Smaller circle
    height: 18,
    borderRadius: 9,
    marginBottom: 4, // Reduced margin
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIndicator: {
    width: 7, // Smaller indicator
    height: 7,
    borderRadius: 3.5,
  },
  stageName: {
    fontSize: 9, // Smaller font
  },
  summarySection: {
    marginBottom: 20, // Reduced margin
    backgroundColor: '#f8f9fa',
    padding: 15, // Reduced padding from 20 to 15
    borderRadius: 8,
    borderLeft: '4 solid',
  },
  sectionTitle: {
    fontSize: 16, // Smaller font
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12, // Reduced margin
  },
  infoBlock: {
    marginBottom: 12, // Reduced margin
  },
  infoHeading: {
    fontSize: 13, // Smaller font
    fontWeight: 'bold',
    marginBottom: 3, // Reduced margin
  },
  infoText: {
    fontSize: 11, // Smaller font
    lineHeight: 1.5, // Reduced line height
    color: '#444',
  },
  benefitsSection: {
    marginBottom: 20, // Reduced margin
  },
  benefitsContainer: {
    backgroundColor: '#f0f4f8',
    padding: 15, // Reduced padding from 20 to 15
    borderRadius: 8,
    marginBottom: 10, // Reduced margin
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6, // Reduced margin
  },
  benefitNumber: {
    width: 20, // Smaller circle
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6, // Reduced margin
  },
  benefitNumberText: {
    fontSize: 9, // Smaller font
    color: 'white',
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 11, // Smaller font
    color: '#444',
    lineHeight: 1.5, // Reduced line height
    flex: 1,
  },
  // Page 2 styles
  engagementSection: {
    marginBottom: 20, // Reduced margin
  },
  variantsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 18, // Reduced margin
  },
  variantCard: {
    flex: 1,
    padding: 15, // Reduced padding from 20 to 15
    borderRadius: 8,
  },
  variantHeader: {
    color: 'white',
    fontSize: 14, // Smaller font
    fontWeight: 'bold',
    marginBottom: 10, // Reduced margin
    backgroundColor: '#2E2266',
    padding: 8, // Reduced padding from 10 to 8
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  variantTagline: {
    fontSize: 11, // Smaller font
    color: '#555',
    marginBottom: 8, // Reduced margin
    fontStyle: 'italic',
  },
  variantDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8, // Reduced padding from 10 to 8
    borderRadius: 5,
    marginBottom: 12, // Reduced margin
  },
  variantDescriptionText: {
    fontSize: 10, // Smaller font
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 1.4, // Reduced line height
  },
  variantDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantDetailLabel: {
    fontSize: 10, // Smaller font
    color: '#666',
  },
  variantDetailValue: {
    fontSize: 13, // Smaller font
    fontWeight: 'bold',
    color: '#333',
  },
  ctaSection: {
    marginBottom: 15, // Reduced margin
  },
  ctaBox: {
    backgroundColor: '#f8f9fa',
    padding: 15, // Reduced padding from 20 to 15
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ctaTitle: {
    fontSize: 15, // Smaller font
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8, // Reduced margin
  },
  ctaText: {
    fontSize: 11, // Smaller font
    color: '#444',
    textAlign: 'center',
    marginBottom: 12, // Reduced margin
    lineHeight: 1.5, // Reduced line height
    maxWidth: '80%',
  },
  ctaButton: {
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 5,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 13, // Smaller font
    fontWeight: 'bold',
  },
});

const ModuleContentPage = ({ moduleName }) => {
  // Find the module in the configuration
  const module = modulesConfig.modules.find(m => m.name === moduleName);
  
  if (!module) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <Text style={styles.errorText}>Module not found: {moduleName}</Text>
        </View>
      </Page>
    );
  }
  
  // Format date for the footer
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).replace(/\//g, '.');
  
  // Get pillar-specific color
  const pillarColor = getPillarColor(module.pillar);
  
  // Get journey stage information
  const journeyStage = determineJourneyStage(module);
  
  // Define journey stages for visualization from the centralized config
  const journeyStages = modulesConfig.journeyStages.map(stage => ({
    id: stage.id,
    title: stage.title
  }));
  
  // Use absolute URLs to ensure images are accessible in the PDF
  const moduleIconUrl = `${window.location.origin}/common-module-white.png`;
  const logoUrl = `${window.location.origin}/elexive-logo-text.png`;

  // Truncate description if it's too long to prevent layout issues
  const truncateText = (text, maxLength = 140) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      {/* PAGE 1: Top Banner, Executive Summary & Strategic Impact */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader pillarColor={pillarColor} logoUrl={logoUrl} />
          
          {/* Main content container with extra top padding for the header strip */}
          <View style={dynamicStyles.contentContainer}>
            {/* 1. TOP BANNER SECTION */}
            <View style={[dynamicStyles.bannerSection, { backgroundColor: pillarColor }]}>
              {/* Module icon */}
              <View style={dynamicStyles.moduleIcon}>
                <Image 
                  src={moduleIconUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
              
              {/* Module info */}
              <View style={dynamicStyles.moduleInfo}>
                {/* Pillar name as small header */}
                <Text style={dynamicStyles.pillarName}>
                  {module.pillar}
                </Text>
                
                {/* Module name as large title */}
                <Text style={dynamicStyles.moduleName}>
                  {module.name}
                </Text>
                
                {/* Module type with badge styling */}
                <View style={dynamicStyles.categoryBadge}>
                  <Text style={dynamicStyles.categoryText}>
                    {module.category}
                  </Text>
                </View>
                
                {/* Transformation Journey visualization */}
                <View style={dynamicStyles.journeySection}>
                  <Text style={dynamicStyles.journeyLabel}>
                    Transformation Journey:
                  </Text>
                  
                  <View style={dynamicStyles.journeyRow}>
                    {journeyStages.map((stage, index) => {
                      const isActive = stage.id === journeyStage.id;
                      const isSecondary = module.secondaryJourneyStages && 
                        module.secondaryJourneyStages.includes(stage.id);
                      
                      return (
                        <View key={stage.id} style={dynamicStyles.stageItem}>
                          {/* Connector line */}
                          {index > 0 && (
                            <View style={dynamicStyles.connectorLine} />
                          )}
                          
                          {/* Stage circle */}
                          <View style={[
                            dynamicStyles.stageCircle, 
                            { 
                              backgroundColor: isActive 
                                ? 'white' 
                                : isSecondary 
                                  ? 'rgba(255, 255, 255, 0.6)' 
                                  : 'rgba(255, 255, 255, 0.3)' 
                            }
                          ]}>
                            {isActive && (
                              <View style={[
                                dynamicStyles.stageIndicator,
                                { backgroundColor: pillarColor }
                              ]} />
                            )}
                          </View>
                          
                          {/* Stage name */}
                          <Text style={[
                            dynamicStyles.stageName,
                            { 
                              color: isActive 
                                ? 'white' 
                                : isSecondary 
                                  ? 'rgba(255, 255, 255, 0.9)' 
                                  : 'rgba(255, 255, 255, 0.7)',
                              fontWeight: isActive 
                                ? 'bold' 
                                : isSecondary 
                                  ? 'medium' 
                                  : 'normal'
                            }
                          ]}>
                            {stage.title}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
            
            {/* 2. EXECUTIVE SUMMARY SECTION */}
            <View style={[dynamicStyles.summarySection, { borderLeftColor: pillarColor }]}>
              <Text style={dynamicStyles.sectionTitle}>
                Executive Summary
              </Text>
              
              {/* What is this module */}
              <View style={dynamicStyles.infoBlock}>
                <Text style={[dynamicStyles.infoHeading, { color: pillarColor }]}>
                  What is this module?
                </Text>
                <Text style={dynamicStyles.infoText}>
                  {truncateText(module.description, 160) || "No description available."}
                </Text>
              </View>
              
              {/* Who is it for */}
              <View style={dynamicStyles.infoBlock}>
                <Text style={[dynamicStyles.infoHeading, { color: pillarColor }]}>
                  Who is it for?
                </Text>
                <Text style={dynamicStyles.infoText}>
                  {truncateText(module.whoIsItFor, 120) || "No target audience specified."}
                </Text>
              </View>
              
              {/* Why it matters now */}
              <View>
                <Text style={[dynamicStyles.infoHeading, { color: pillarColor }]}>
                  Why it matters now?
                </Text>
                <Text style={dynamicStyles.infoText}>
                  {truncateText(module.fix, 160) || "No solution approach specified."}
                </Text>
              </View>
            </View>
            
            {/* 3. STRATEGIC IMPACT CLUSTER */}
            <View style={dynamicStyles.benefitsSection}>
              <Text style={dynamicStyles.sectionTitle}>
                Strategic Impact
              </Text>
              
              {/* Key Benefits */}
              <View style={dynamicStyles.benefitsContainer}>
                <Text style={[dynamicStyles.infoHeading, { color: '#333', marginBottom: 8 }]}>
                  Key Benefits
                </Text>
                
                {/* Limit benefits to 4 to ensure they fit on page */}
                {(module.benefits || ["No benefits specified"]).slice(0, 4).map((benefit, index) => (
                  <View key={index} style={dynamicStyles.benefitRow}>
                    <View style={[
                      dynamicStyles.benefitNumber,
                      { backgroundColor: pillarColor }
                    ]}>
                      <Text style={dynamicStyles.benefitNumberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={dynamicStyles.benefitText}>
                      {truncateText(benefit, 100)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          <PageFooter formattedDate={formattedDate} pageNumber={1} />
        </View>
      </Page>
      
      {/* PAGE 2: Engagement Models & Call to Action */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader pillarColor={pillarColor} logoUrl={logoUrl} />
          
          {/* Main content container with padding */}
          <View style={dynamicStyles.contentContainer}>
            {/* ENGAGEMENT MODELS */}
            <View style={dynamicStyles.engagementSection}>
              <Text style={dynamicStyles.sectionTitle}>
                Engagement Models
              </Text>
              
              <View style={dynamicStyles.variantsRow}>
                {/* Only show variants that are available in the configuration */}
                {module.variants && module.variants.map((variant, index) => {
                  const isInsightPrimer = variant.type === "Insight Primer";
                  const color = isInsightPrimer ? '#3498db' : '#2ecc71';
                  const bgColor = isInsightPrimer ? '#e6f2ff' : '#e6fff2';
                  
                  // Find the variant definition to get additional information
                  const variantDef = modulesConfig.variantDefinitions[variant.type];
                  
                  return (
                    <View key={index} style={[dynamicStyles.variantCard, { backgroundColor: bgColor }]}>
                      <Text style={dynamicStyles.variantHeader}>
                        {variant.type}
                      </Text>
                      
                      {/* Add tagline if available */}
                      {variantDef?.tagline && (
                        <Text style={dynamicStyles.variantTagline}>
                          {truncateText(variantDef.tagline, 80)}
                        </Text>
                      )}
                      
                      <View style={dynamicStyles.variantDescription}>
                        <Text style={dynamicStyles.variantDescriptionText}>
                          {truncateText(variantDef?.description || variant.description, 120) || "No description available."}
                        </Text>
                      </View>
                      
                      <View style={dynamicStyles.variantDetailsRow}>
                        <View>
                          <Text style={dynamicStyles.variantDetailLabel}>
                            Type
                          </Text>
                          <Text style={dynamicStyles.variantDetailValue}>
                            {isInsightPrimer ? "Fixed-scope" : "Continuous"}
                          </Text>
                        </View>
                        
                        <View>
                          <Text style={dynamicStyles.variantDetailLabel}>
                            Value Units
                          </Text>
                          <Text style={[dynamicStyles.variantDetailValue, { color }]}>
                            {variant.evcValue || 0} EVCs
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            
            {/* If there are more than 4 benefits, show the remaining ones on page 2 */}
            {module.benefits && module.benefits.length > 4 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={dynamicStyles.sectionTitle}>
                  Additional Benefits
                </Text>
                
                <View style={dynamicStyles.benefitsContainer}>
                  {module.benefits.slice(4).map((benefit, index) => (
                    <View key={index} style={dynamicStyles.benefitRow}>
                      <View style={[
                        dynamicStyles.benefitNumber,
                        { backgroundColor: pillarColor }
                      ]}>
                        <Text style={dynamicStyles.benefitNumberText}>
                          {index + 5}
                        </Text>
                      </View>
                      <Text style={dynamicStyles.benefitText}>
                        {benefit}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* WHAT TO DO NOW (CTA) */}
            <View style={dynamicStyles.ctaSection}>
              <Text style={dynamicStyles.sectionTitle}>
                Next Steps
              </Text>
              
              {/* CTA box */}
              <View style={dynamicStyles.ctaBox}>
                <Text style={dynamicStyles.ctaTitle}>
                  Ready to get started?
                </Text>
                <Text style={dynamicStyles.ctaText}>
                  {truncateText(module.callToAction, 120) || "Add this module to your transformation journey and take the next step toward enhanced business capabilities."}
                </Text>
                <View style={[dynamicStyles.ctaButton, { backgroundColor: pillarColor }]}>
                  <Text style={dynamicStyles.ctaButtonText}>
                    Contact us at transform@elexive.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <PageFooter formattedDate={formattedDate} pageNumber={2} />
        </View>
      </Page>
    </>
  );
};

export default ModuleContentPage;