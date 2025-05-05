// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleCoverPage.js
// Cover page component for PDF generation

import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import modulesConfig from '../../config/modulesConfig.json';

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
  
  // Use an absolute URL to ensure the image is accessible in the PDF
  const logoUrl = `${window.location.origin}/elexive-logo-text.png`;
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={{
        backgroundColor: '#2E2266', // primary color
        height: '100%',
        width: '100%',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Logo in top left with margin */}
        <View style={{
          alignSelf: 'flex-start',
        }}>
          <Image 
            src={logoUrl}
            style={{
              width: 180,
            }}
          />
        </View>
        
        {/* Centered content */}
        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Module name in all caps with primary accent color */}
          <Text style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: '#FFBE59', // secondary accent color
            textAlign: 'center',
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            {module.name}
          </Text>
          
          {/* White text "Solution Brief" under module name */}
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            textAlign: 'center'
          }}>
            Solution Brief
          </Text>
        </View>
        
        {/* Date in bottom right corner */}
        <View style={{
          alignSelf: 'flex-end'
        }}>
          <Text style={{
            fontSize: 12,
            color: '#FFFFFF',
          }}>
            {formattedDate}
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default ModuleCoverPage;