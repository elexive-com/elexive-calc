// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleCoverPage.js
// Cover page component for PDF generation

import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import modulesConfig from '../../config/modulesConfig.json';
import { PLACEHOLDER_IMAGES } from '../utils/pdfHelpers';

const ModuleCoverPage = ({ moduleName }) => {
  // Find the module in the configuration
  const module = modulesConfig.modules.find(m => m.name === moduleName);
  
  if (!module) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
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
  
  // Safely handle variant information
  const hasVariants = module.variants && Array.isArray(module.variants) && module.variants.length > 0;
  const showVariantTag = !module.singleSizeOnly && hasVariants;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {/* Header */}
        <View style={styles.coverHeader}>
          {/* Use base64 encoded image to avoid path resolution issues */}
          <Image 
            src={PLACEHOLDER_IMAGES.LOGO}
            style={styles.coverLogo}
          />
        </View>
        
        {/* Content */}
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>{module.name}</Text>
          <Text style={styles.coverSubtitle}>{module.heading}</Text>
          
          {/* Module variant tag (if applicable) - updated for safer rendering */}
          {showVariantTag && (
            <Text style={styles.coverVariantTag}>
              {module.variants[0].type}
            </Text>
          )}
          
          <Text style={styles.coverDescription}>{module.description}</Text>
          
          {/* Module details */}
          <View style={styles.rowWithMargin}>
            <View style={styles.columnWithFlex}>
              <Text style={styles.coverFooterText}>Pillar</Text>
              <Text style={styles.coverFooterTextBold}>
                {module.pillar}
              </Text>
            </View>
            <View style={styles.columnWithFlex}>
              <Text style={styles.coverFooterText}>Category</Text>
              <Text style={styles.coverFooterTextBold}>
                {module.category}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>
            Elexive Solution Brief — {formattedDate}
          </Text>
          {/* Use base64 encoded image to avoid path resolution issues */}
          <Image 
            src={PLACEHOLDER_IMAGES.MODULE_ICON}
            style={styles.moduleIcon}
          />
        </View>
      </View>
    </Page>
  );
};

export default ModuleCoverPage;