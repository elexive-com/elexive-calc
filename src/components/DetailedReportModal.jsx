import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faChartPie, 
  faCreditCard, faRocket, 
  faPuzzlePiece, faCalculator, faSlidersH,
  faCheckCircle, faEnvelope, faLightbulb, faTools,
  faTimes, faFileExport, faSpinner,
  faCalendarAlt, faMoneyBillWave,
  faBuilding, faHandshake, faUsers,
  faShieldAlt, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DetailedReportModal = ({ isOpen, onClose, calculator }) => {
  const [isExporting, setIsExporting] = useState(false);
  const reportContentRef = useRef(null);
  
  if (!isOpen) return null;

  const { 
    totalPrice,
    monthlyEvcs,
    evcPricePerUnit,
    paymentOption,
    deliverySpeed,
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
  
  // Get payment option details
  const paymentDetails = evcBase.paymentOptions[paymentOption];
  
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
  
  // Calculate total EVC value from all modules
  const totalEvcValue = selectedModuleDetails.reduce((sum, module) => sum + module.evcValue, 0);
  
  // Calculate estimated annual value
  const annualValue = totalPrice * 52;
  
  // PDF export function
  const exportToPdf = async () => {
    setIsExporting(true);
    
    try {
      // Get CSS variables for consistent styling
      const styles = getComputedStyle(document.documentElement);
      const elexivePrimary = styles.getPropertyValue('--elexive-primary').trim() || '#2E2266';
      
      // Create a PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Define page dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      // Capture the report content using html2canvas
      const reportContent = reportContentRef.current;
      const canvas = await html2canvas(reportContent, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to maintain aspect ratio
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Add title page
      pdf.setFillColor(elexivePrimary);
      pdf.rect(0, 0, pdfWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.text('Executive Solution Brief', pdfWidth / 2, 25, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.text('Strategic Transformation Plan', pdfWidth / 2, 60, { align: 'center' });
      
      // Add date
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Generated on ${formattedDate}`, pdfWidth / 2, 70, { align: 'center' });
      
      // Add intent if available
      if (intent) {
        pdf.setFillColor(246, 246, 249);
        pdf.roundedRect(margin, 80, pdfWidth - (margin * 2), 25, 3, 3, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text("BUSINESS OBJECTIVE", margin + 5, 88);
        
        pdf.setFontSize(14);
        pdf.setTextColor(40, 40, 40);
        pdf.setFont('helvetica', 'bold');
        pdf.text(intent, margin + 5, 96);
      }
      
      // Add key metrics
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin, 115, (pdfWidth - (margin * 2) - 5) / 2, 40, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(59, 130, 246);
      pdf.text("INVESTMENT", margin + 5, 123);
      pdf.setFontSize(18);
      pdf.setTextColor(30, 64, 175);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`€${formatNumber(totalPrice)}`, margin + 5, 135);
      pdf.setFontSize(11);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Weekly", margin + 5, 143);
      
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(pdfWidth/2 + 2.5, 115, (pdfWidth - (margin * 2) - 5) / 2, 40, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(239, 68, 68);
      pdf.text("ESTIMATED COMPLETION", pdfWidth/2 + 7.5, 123);
      pdf.setFontSize(18);
      pdf.setTextColor(185, 28, 28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${completionTimeWeeks} weeks`, pdfWidth/2 + 7.5, 135);
      pdf.setFontSize(11);
      pdf.setTextColor(239, 68, 68);
      pdf.text(`${totalEvcValue} EVCs total`, pdfWidth/2 + 7.5, 143);
      
      // Add company logo placeholder
      pdf.setDrawColor(230, 230, 230);
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(pdfWidth / 2 - 25, 165, 50, 50, 3, 3, 'FD');
      pdf.setFontSize(14);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Elexive', pdfWidth / 2, 195, { align: 'center' });
      
      // Add report content on new page
      pdf.addPage();
      
      // Split the content into multiple pages if needed
      const maxContentHeight = pdfHeight - (margin * 2);
      if (contentHeight <= maxContentHeight) {
        // Content fits on one page
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      } else {
        // Content needs multiple pages
        const pageCount = Math.ceil(contentHeight / maxContentHeight);
        
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Calculate source and destination dimensions
          const srcY = (canvas.height / pageCount) * i;
          const srcHeight = canvas.height / pageCount;
          
          // Add portion of the image to this page
          pdf.addImage(
            imgData, 
            'PNG', 
            margin, 
            margin, 
            contentWidth, 
            maxContentHeight, 
            '', 
            'FAST',
            0,
            srcY / canvas.height,
            1,
            srcHeight / canvas.height
          );
        }
      }
      
      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          'CONFIDENTIAL: This report was generated by the Elexive Calculator for your organization.',
          pdfWidth / 2,
          pdfHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          `Page ${i} of ${pageCount}`, 
          pdfWidth - margin, 
          pdfHeight - 5, 
          { align: 'right' }
        );
      }
      
      // Save the PDF
      pdf.save(`Elexive_Strategic_Solution_${today.toISOString().slice(0, 10)}.pdf`);
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
        {/* Header with title - moved to top */}
        <div className="bg-white shadow-sm z-20 border-b">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-elx-primary flex items-center">
              <FontAwesomeIcon icon={faBuilding} className="text-elx-accent mr-3" />
              Strategic Solution Brief
              {intent && <span className="ml-3 text-sm font-normal text-gray-500">|</span>}
              {intent && <span className="ml-3 text-sm font-normal text-gray-500">{intent}</span>}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
        </div>
        
        {/* Content area with overflow - single scrollable view */}
        <div className="overflow-y-auto flex-grow p-6 min-h-[300px]" ref={reportContentRef}>
          {/* Executive Summary Section */}
          <div className="space-y-6 mb-10">
            <h3 className="text-xl font-bold text-elx-primary mb-4 flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-elx-accent mr-3" />
              Executive Summary
            </h3>
            
            {/* Executive Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-blue-500 mb-1 text-sm font-medium">INVESTMENT</div>
                <div className="text-2xl font-bold text-blue-800 mb-1">€{formatNumber(totalPrice)}</div>
                <div className="text-blue-600 text-sm">Weekly investment</div>
                <div className="text-blue-800 text-xs mt-2 font-medium">€{formatNumber(annualValue)} annually</div>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="text-amber-500 mb-1 text-sm font-medium">PRODUCTION CAPACITY</div>
                <div className="text-2xl font-bold text-amber-800 mb-1">{monthlyEvcs} EVCs</div>
                <div className="text-amber-600 text-sm">Weekly capacity</div>
                <div className="text-amber-800 text-xs mt-2 font-medium">{calculatorConfig.productionCapacity[productionCapacity].label}</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-green-500 mb-1 text-sm font-medium">COMPLETION TIME</div>
                <div className="text-2xl font-bold text-green-800 mb-1">{completionTimeWeeks} weeks</div>
                <div className="text-green-600 text-sm">Estimated timeline</div>
                <div className="text-green-800 text-xs mt-2 font-medium">{totalEvcValue} EVCs total work</div>
              </div>
            </div>
            
            {/* Executive Summary Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-lg font-bold text-elx-primary mb-4">Solution Overview</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 mb-2">STRATEGIC PILLARS</h5>
                  <div className="space-y-3">
                    {Object.keys(modulesByPillar).map(pillar => (
                      <div key={pillar} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPillarColorClass(pillar)}`}>
                          <FontAwesomeIcon icon={getPillarIcon(pillar)} />
                        </div>
                        <div>
                          <div className="font-medium text-elx-primary">{pillar}</div>
                          <div className="text-xs text-gray-500">{modulesByPillar[pillar].length} modules</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-500 mb-2">DELIVERY APPROACH</h5>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faRocket} />
                      </div>
                      <div>
                        <div className="font-medium text-elx-primary">Delivery Speed</div>
                        <div className="text-sm text-gray-600">{deliverySpeed}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {calculatorConfig.resourceAllocation[resourceAllocation].description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faCreditCard} />
                      </div>
                      <div>
                        <div className="font-medium text-elx-primary">Payment Structure</div>
                        <div className="text-sm text-gray-600">{paymentDetails.name}</div>
                        {paymentOption === 'prepaid' && (
                          <div className="text-xs text-green-600 mt-1 font-medium">
                            {((1 - paymentDetails.priceModifier) * 100).toFixed(0)}% discount applied
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Parameters */}
              {serviceParameters.filter(param => parameters[param.id]).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h5 className="text-sm font-semibold text-gray-500 mb-3">KEY PARAMETERS</h5>
                  <div className="flex flex-wrap gap-2">
                    {serviceParameters
                      .filter(param => parameters[param.id])
                      .map(param => (
                        <span key={param.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-elx-primary bg-opacity-10 text-elx-primary">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-elx-accent" />
                          {param.label}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Solution Components Preview */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-lg font-bold text-elx-primary mb-4">Key Solution Components</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(modulesByPillar).map(([pillar, modules]) => (
                  <div key={pillar} className={`rounded-xl border p-4 ${
                    pillar === 'Transformation' ? 'border-purple-200' :
                    pillar === 'Strategy' ? 'border-blue-200' :
                    pillar === 'Technology' ? 'border-green-200' :
                    'border-amber-200'
                  }`}>
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${getPillarColorClass(pillar)}`}>
                        <FontAwesomeIcon icon={getPillarIcon(pillar)} />
                      </div>
                      <h5 className="font-bold text-lg text-elx-primary">{pillar}</h5>
                    </div>
                    
                    <div className="space-y-3">
                      {modules.map(module => (
                        <div key={module.name} className="border-l-2 pl-3 border-gray-200">
                          <div className="font-medium text-elx-primary text-sm">{module.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <FontAwesomeIcon 
                              icon={getVariantIcon(module.selectedVariant)} 
                              className="mr-1 text-xs"
                            />
                            {getVariantDisplayName(module.selectedVariant)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Solution Components Section */}
          <div className="space-y-6 mb-10">
            <h3 className="text-xl font-bold text-elx-primary mb-4 flex items-center">
              <FontAwesomeIcon icon={faPuzzlePiece} className="text-elx-accent mr-3" />
              Solution Components
            </h3>
            
            {Object.entries(modulesByPillar).map(([pillar, modules]) => (
              <div key={pillar} className="mb-8">
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPillarColorClass(pillar)}`}>
                    <FontAwesomeIcon icon={getPillarIcon(pillar)} />
                  </div>
                  <h4 className="text-lg font-bold text-elx-primary">{pillar}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map(module => (
                    <div key={module.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          module.category === 'Immediate Impact' 
                            ? 'bg-amber-50 text-amber-700' 
                            : module.category === 'Strategic Assessment'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                        }`}>
                          {module.category}
                        </span>
                        <span className="elx-evc-label">{module.evcValue} EVCs</span>
                      </div>
                      
                      <h5 className="font-bold text-elx-primary mt-3 mb-1">{module.name}</h5>
                      <p className="text-sm text-gray-600 font-medium mb-3">{module.heading}</p>
                      <p className="text-xs text-gray-500 mb-4">{module.description}</p>
                      
                      <div className="pt-3 border-t border-gray-100 flex items-center">
                        <div className={`px-2.5 py-1 rounded flex items-center text-xs font-medium ${
                          module.selectedVariant === 'insightPrimer' 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-green-50 text-green-600'
                        }`}>
                          <FontAwesomeIcon icon={getVariantIcon(module.selectedVariant)} className="mr-1" />
                          {getVariantDisplayName(module.selectedVariant)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Financial Details Section */}
          <div className="space-y-6 mb-10">
            <h3 className="text-xl font-bold text-elx-primary mb-4 flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-elx-accent mr-3" />
              Financial Details
            </h3>
            
            {/* Financial summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-elx-accent mr-2" />
                  Investment Summary
                </h4>
                
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Weekly Investment</td>
                      <td className="py-2 text-right font-medium text-elx-primary">€{formatNumber(totalPrice)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Monthly Investment</td>
                      <td className="py-2 text-right font-medium text-elx-primary">€{formatNumber(totalPrice * 4)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Quarterly Investment</td>
                      <td className="py-2 text-right font-medium text-elx-primary">€{formatNumber(totalPrice * 13)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Annual Investment</td>
                      <td className="py-2 text-right font-bold text-elx-primary">€{formatNumber(annualValue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                  <FontAwesomeIcon icon={faCalculator} className="text-elx-accent mr-2" />
                  Value Calculation
                </h4>
                
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Base EVC per Week</td>
                      <td className="py-2 text-right font-medium text-elx-primary">{monthlyEvcs} EVCs</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Price per EVC</td>
                      <td className="py-2 text-right font-medium text-elx-primary">€{evcPricePerUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Payment Option</td>
                      <td className="py-2 text-right font-medium text-elx-primary">{paymentDetails.name}</td>
                    </tr>
                    {paymentOption === 'prepaid' && (
                      <tr>
                        <td className="py-2 text-gray-600">Discount Applied</td>
                        <td className="py-2 text-right font-medium text-green-600">
                          {((1 - paymentDetails.priceModifier) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* EVC Breakdown */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faChartPie} className="text-elx-accent mr-2" />
                EVC Distribution by Pillar
              </h4>
              
              <div className="space-y-4">
                {Object.entries(modulesByPillar).map(([pillar, modules]) => {
                  const pillarTotal = modules.reduce((sum, module) => sum + module.evcValue, 0);
                  const pillarPercentage = (pillarTotal / totalEvcValue * 100).toFixed(0);
                  
                  return (
                    <div key={pillar} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={getPillarIcon(pillar)} className={`mr-2 ${
                            pillar === 'Transformation' ? 'text-purple-600' :
                            pillar === 'Strategy' ? 'text-blue-600' :
                            pillar === 'Technology' ? 'text-green-600' :
                            'text-amber-600'
                          }`} />
                          <span className="text-gray-800 font-medium">{pillar}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-2">{pillarTotal} EVCs</span>
                          <span className="text-xs text-gray-500">{pillarPercentage}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${
                          pillar === 'Transformation' ? 'bg-purple-600' :
                          pillar === 'Strategy' ? 'bg-blue-600' :
                          pillar === 'Technology' ? 'bg-green-600' :
                          'bg-amber-600'
                        }`} style={{ width: `${pillarPercentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Modifier factors */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faSlidersH} className="text-elx-accent mr-2" />
                Production Modifiers
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Base Weekly Capacity</span>
                  <span className="text-sm font-medium text-elx-primary">
                    {calculatorConfig.productionCapacity[productionCapacity].weeklyEVCs} EVCs
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Resource Allocation Multiplier</span>
                  <span className="text-sm font-medium text-elx-primary">
                    {calculatorConfig.resourceAllocation[resourceAllocation].outputMultiplier}x
                  </span>
                </div>
                
                {Object.entries(parameters)
                  .filter(([, enabled]) => enabled)
                  .map(([paramId]) => {
                    const param = serviceParameters.find(p => p.id === paramId);
                    return (
                      <div key={paramId} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{param.label}</span>
                        <span className="text-sm font-medium text-elx-primary">{param.modifier}x</span>
                      </div>
                    );
                  })
                }
                
                <div className="flex justify-between py-2 font-medium">
                  <span className="text-elx-primary">Final Weekly Production</span>
                  <span className="text-elx-primary">{monthlyEvcs} EVCs</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Implementation Plan Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-elx-primary mb-4 flex items-center">
              <FontAwesomeIcon icon={faRocket} className="text-elx-accent mr-3" />
              Implementation Plan
            </h3>
            
            {/* Timeline Summary */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-elx-accent mr-2" />
                Project Timeline
              </h4>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-elx-primary text-white font-bold text-2xl flex items-center justify-center">
                  {completionTimeWeeks}
                </div>
                <div className="ml-4">
                  <div className="text-elx-primary font-medium">Weeks to Implementation</div>
                  <div className="text-sm text-gray-600">Based on your selected modules and capacity</div>
                </div>
              </div>
              
              <div className="relative pt-10">
                {/* Timeline bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 h-2 bg-elx-primary rounded-full" style={{ width: '100%' }}></div>
                
                {/* Timeline markers */}
                <div className="absolute top-0 left-0 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-elx-primary"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium">Start</div>
                </div>
                
                <div className="absolute top-0 left-1/3 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-elx-primary"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium">Discovery</div>
                </div>
                
                <div className="absolute top-0 left-2/3 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-elx-primary"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium">Implementation</div>
                </div>
                
                <div className="absolute top-0 right-0 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-elx-primary"></div>
                  <div className="absolute top-6 right-0 text-xs font-medium">Completion</div>
                </div>
              </div>
            </div>
            
            {/* Delivery Team Structure */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-elx-accent mr-2" />
                Delivery Approach
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Resource Allocation Strategy</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-elx-primary mb-1">{calculatorConfig.resourceAllocation[resourceAllocation].label}</div>
                    <p className="text-sm text-gray-600">{calculatorConfig.resourceAllocation[resourceAllocation].description}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Engagement Model</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-elx-primary mb-1">{deliverySpeed}</div>
                    <p className="text-sm text-gray-600">Utilizing {calculatorConfig.productionCapacity[productionCapacity].label} capacity level</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-elx-primary bg-opacity-5 rounded-xl p-5 border border-elx-primary border-opacity-20">
              <h4 className="text-base font-bold text-elx-primary flex items-center mb-4">
                <FontAwesomeIcon icon={faHandshake} className="text-elx-accent mr-2" />
                Next Steps
              </h4>
              
              <ol className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-elx-primary text-white font-medium flex items-center justify-center">1</div>
                  <div className="ml-4">
                    <h6 className="font-medium text-elx-primary">Request a Detailed Proposal</h6>
                    <p className="text-sm text-gray-600">Receive a customized proposal with a detailed implementation plan tailored to your specific business needs.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-elx-primary text-white font-medium flex items-center justify-center">2</div>
                  <div className="ml-4">
                    <h6 className="font-medium text-elx-primary">Kick-off Meeting</h6>
                    <p className="text-sm text-gray-600">Meet with our senior consultants to align on objectives, timeline, and success metrics.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-elx-primary text-white font-medium flex items-center justify-center">3</div>
                  <div className="ml-4">
                    <h6 className="font-medium text-elx-primary">Begin Implementation</h6>
                    <p className="text-sm text-gray-600">Start executing on your strategic transformation with our expert guidance and support.</p>
                  </div>
                </li>
              </ol>
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