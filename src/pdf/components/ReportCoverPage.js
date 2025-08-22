// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ReportCoverPage.js
// Cover page component for PDF report generation

import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';

/**
 * The cover page of the PDF report
 * Simplified to just show the logo against primary background color with "Solution Brief" text
 */
const ReportCoverPage = () => {
  // Use an absolute URL to ensure the image is accessible in the PDF
  const logoUrl = `${window.location.origin}/elexive-logo-text.png`;

  return (
    <Page size="A4" style={styles.page}>
      <View
        style={{
          backgroundColor: '#2E2266', // primary color
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Logo at the top */}
        <Image
          src={logoUrl}
          style={{
            width: 200,
            marginBottom: 50,
          }}
        />

        {/* "Solution Brief" text in the middle */}
        <Text
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#FFBE59', // secondary accent color
            textAlign: 'center',
          }}
        >
          Solution Brief
        </Text>
      </View>
    </Page>
  );
};

export default ReportCoverPage;
