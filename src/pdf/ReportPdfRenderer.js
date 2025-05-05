import React from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import ReportCoverPage from './components/ReportCoverPage';
import ReportContentPage from './components/ReportContentPage';

/**
 * Generates a PDF report from report data
 * @param {Object} reportData - Data needed for the report
 * @returns {Promise<string>} - Promise resolving to the filename of the saved PDF
 */
export const generateReportPdf = async (reportContentRef, reportData) => {
  const {
    intent,
    totalPrice,
    completionTimeWeeks,
    totalEvcValue,
    formatNumber,
    modulesByPillar,
    resourceAllocation,
    evcPricePerUnit,
    paymentOption,
    paymentDetails,
    calculatorConfig,
    weeklyEVCs,
    parameters,
    serviceParameters,
    calculator
  } = reportData;

  try {
    // Create filename
    const today = new Date();
    const filename = `Elexive_Strategic_Solution_${today.toISOString().slice(0, 10)}.pdf`;
    
    // Get formatted date for the report
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Create PDF document using the modular components
    const MyDocument = () => (
      <Document>
        <ReportCoverPage />
        
        <ReportContentPage
          totalPrice={totalPrice}
          completionTimeWeeks={completionTimeWeeks}
          totalEvcValue={totalEvcValue}
          formatNumber={formatNumber}
          modulesByPillar={modulesByPillar}
          resourceAllocation={resourceAllocation}
          intent={intent}
          formattedDate={formattedDate}
          evcPricePerUnit={evcPricePerUnit}
          paymentOption={paymentOption}
          paymentDetails={paymentDetails}
          calculatorConfig={calculatorConfig}
          weeklyEVCs={weeklyEVCs}
          parameters={parameters}
          serviceParameters={serviceParameters}
          calculator={calculator}
        />
      </Document>
    );
    
    // Generate PDF as blob
    const blob = await pdf(<MyDocument />).toBlob();
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return filename;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};