// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleContentPage.js
// Content page component for PDF generation

import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import modulesConfig from '../../config/modulesConfig.json';

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
  
  // Safely get variant information
  const hasVariants = module.variants && Array.isArray(module.variants) && module.variants.length > 0;
  const variantType = (!module.singleSizeOnly && hasVariants) ? module.variants[0].type : null;
  
  // Safely access variant definition - this prevents the "Cannot read properties of undefined (reading 'hasOwnProperty')" error
  const variantDefinition = (variantType && 
                            modulesConfig.variantDefinitions && 
                            modulesConfig.variantDefinitions[variantType]) 
                          ? modulesConfig.variantDefinitions[variantType] 
                          : null;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.contentPage}>
        {/* Header */}
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{module.name}</Text>
        </View>
        
        {/* Module Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Module Overview</Text>
          <View style={styles.moduleDetail}>
            <View style={styles.row}>
              <Text style={styles.moduleDetailLabel}>Pillar:</Text>
              <Text style={styles.moduleDetailText}>{module.pillar}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.moduleDetailLabel}>Category:</Text>
              <Text style={styles.moduleDetailText}>{module.category}</Text>
            </View>
            {variantType && (
              <View style={styles.row}>
                <Text style={styles.moduleDetailLabel}>Variant:</Text>
                <Text style={styles.moduleDetailText}>{variantType}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.paragraph}>{module.description}</Text>
        </View>
        
        {/* Variant Details (if applicable) */}
        {variantDefinition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engagement Model: {variantType}</Text>
            <Text style={styles.paragraph}>{variantDefinition.description}</Text>
          </View>
        )}
        
        {/* Key Outcomes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Outcomes</Text>
          <Text style={styles.paragraph}>
            • Clear understanding of current state and improvement opportunities
          </Text>
          <Text style={styles.paragraph}>
            • Actionable recommendations tailored to your specific needs
          </Text>
          <Text style={styles.paragraph}>
            • Defined roadmap for implementation with measurable milestones
          </Text>
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {formattedDate} | Elexive Ltd
        </Text>
      </View>
    </Page>
  );
};

export default ModuleContentPage;