// PDF styles for react-pdf components

import { StyleSheet } from '@react-pdf/renderer';

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf',
// });  // Define colors
const colors = {
  primary: '#2E2266', // elexivePrimary
  secondary: '#FFBE59', // elexiveSecondary
  text: '#333333',
  lightText: '#666666',
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  border: '#DDDDDD',
  error: '#FF0000', // Added for error messages
  investmentBg: '#EFF6FF',
  investmentText: '#3B82F6',
  investmentTextDark: '#1E40AF',
  completionBg: '#FEF2F2',
  completionText: '#EF4444',
  completionTextDark: '#B91C1C',
  intentBg: '#F6F6F9',
  intentText: '#646464',
  intentTextDark: '#282828',
  // New colors for Service Delivery Timeline
  deliveryTimelineBg: '#F9FAFB',
  deliveryTimelineBlock: '#DBEAFE',
  deliveryTimelineText: '#2563EB',
  deliveryTimelineBorder: '#E5E7EB',
  // Strategic Approach section colors
  cardBg: '#FFFFFF',
  cardBorder: '#E5E7EB',
  pillars: {
    transformation: '#8B5CF6', // purple-600
    strategy: '#3B82F6', // blue-600
    technology: '#10B981', // green-600
    discovery: '#F59E0B', // amber-600
    catalyst: '#1E40AF', // blue-800
    default: '#4B5563', // gray-600
  }
};

// Define PDF styles
const styles = StyleSheet.create({
  // Document
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background,
    padding: 0,
  },
  
  // Error styling
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
  },
  
  // Cover page
  coverPage: {
    backgroundColor: colors.primary,
    color: colors.background,
    height: '100%',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {
    marginTop: 20,
    marginBottom: 40,
  },
  coverLogo: {
    width: 180,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.background,
  },
  coverSubtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: colors.background,
  },
  coverContent: {
    flexGrow: 1,
  },
  coverVariantTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '5 10',
    borderRadius: 4,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  coverDescription: {
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: 20,
    color: colors.background,
  },
  coverFooter: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverFooterText: {
    fontSize: 12,
    color: colors.background,
  },
  coverFooterTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
  },
  
  // Content page
  contentPage: {
    padding: 40,
    fontSize: 12,
  },
  contentHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.primary,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 10,
    color: colors.text,
  },
  moduleDetail: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
  },
  moduleDetailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: colors.primary,
  },
  moduleDetailText: {
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: colors.lightText,
  },
  
  // Shared styles
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rowWithMargin: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  columnWithFlex: {
    flexDirection: 'column',
    marginBottom: 10,
    flex: 1,
  },
  tag: {
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: '3 8',
    fontSize: 10,
    color: colors.primary,
    alignSelf: 'flex-start',
    marginRight: 5,
    marginBottom: 5,
  },
  
  // Report specific styles
  headerBanner: {
    backgroundColor: colors.primary,
    height: 40,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 11,
    color: '#505050',
    textAlign: 'center',
    marginBottom: 10,
  },
  intentContainer: {
    backgroundColor: colors.intentBg,
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  intentLabel: {
    fontSize: 10,
    color: colors.intentText,
    marginBottom: 5,
  },
  intentText: {
    fontSize: 14,
    color: colors.intentTextDark,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  investmentMetric: {
    backgroundColor: colors.investmentBg,
    borderRadius: 3,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  investmentLabel: {
    fontSize: 10,
    color: colors.investmentText,
    marginBottom: 5,
  },
  investmentValue: {
    fontSize: 18,
    color: colors.investmentTextDark,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  investmentPeriod: {
    fontSize: 11,
    color: colors.investmentText,
  },
  completionMetric: {
    backgroundColor: colors.completionBg,
    borderRadius: 3,
    padding: 10,
    flex: 1,
    marginLeft: 5,
  },
  completionLabel: {
    fontSize: 10,
    color: colors.completionText,
    marginBottom: 5,
  },
  completionValue: {
    fontSize: 18,
    color: colors.completionTextDark,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  completionTotal: {
    fontSize: 11,
    color: colors.completionText,
  },
  logoPlaceholder: {
    borderColor: '#E6E6E6',
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
    width: 100,
    height: 100,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    color: '#969696',
  },
  pageNumber: {
    fontSize: 8,
    color: '#969696',
    textAlign: 'right',
    marginRight: 15,
    marginTop: 5,
  },
  moduleIcon: {
    width: 50,
  },
  
  // Additional report page styles
  summaryLabel: {
    fontSize: 12,
    color: '#505050',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  moduleItem: {
    marginLeft: 10,
    marginBottom: 5,
    padding: 5,
    backgroundColor: colors.intentBg,
    borderRadius: 3,
  },
  moduleName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  moduleType: {
    fontSize: 10,
    color: '#505050',
    marginTop: 2,
  },
  moduleEvcs: {
    fontSize: 10,
    color: colors.investmentText,
    marginTop: 2,
  },
  resourceBar: {
    height: 15,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
  },
  resourceSegment: {
    height: '100%',
  },
  
  // New styles for reimagined Report Content Pages
  
  // Pillar Summary Cards
  pillarSummary: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F6F6F9',
    width: '100%',
    marginBottom: 10,
  },
  moduleCount: {
    fontSize: 10,
    color: '#505050',
    marginTop: 3,
  },
  
  // Timeline Visualization
  timelineContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timelineLabel: {
    fontSize: 9,
    color: '#505050',
    flex: 1,
    textAlign: 'center',
  },
  timelineBar: {
    height: 30,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  timelineSegment: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Module Detail Cards
  moduleDetailCard: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F8F8FC',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  moduleDescription: {
    fontSize: 10,
    color: '#505050',
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 1.4,
  },
  moduleSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 3,
  },
  moduleOutcomes: {
    marginTop: 5,
  },
  outcomeItem: {
    fontSize: 9,
    color: '#505050',
    marginBottom: 2,
    paddingLeft: 5,
  },
  
  // Resource Allocation
  resourceAllocationContainer: {
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F5F7FA',
    border: '1px solid #E2E8F0',
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceHeaderText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: 'medium',
  },
  resourceHeaderValue: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  singleBarContainer: {
    height: 36,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barPercentageText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'medium',
  },
  barLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 4,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#374151',
  },
  legendValue: {
    fontSize: 8,
    color: '#6B7280',
  },
  
  // Service Delivery Timeline
  deliveryTimelineContainer: {
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F5F7FA',
    border: '1px solid #E2E8F0',
  },
  deliveryTimelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTimelineLabel: {
    fontSize: 11,
    color: '#4B5563',
  },
  deliveryTimelineValue: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  deliveryTimelineBlocks: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  deliveryTimelineBlock: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  deliveryTimelineBlockInner: {
    backgroundColor: '#3B82F6',
    opacity: 0.2,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryTimelineBlockText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  deliveryTimelineEllipsis: {
    position: 'absolute',
    right: 5,
    top: 8,
    fontSize: 10,
    color: '#6B7280',
  },
  deliveryTimelineWeeks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  deliveryTimelineWeekMarker: {
    fontSize: 8,
    color: '#6B7280',
  },
  deliveryTimelineFormula: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  deliveryTimelineFormulaItem: {
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  deliveryTimelineFormulaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deliveryTimelineFormulaLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  deliveryTimelineFormulaDivider: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginHorizontal: 5,
  },
  serviceApproachNote: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  serviceApproachText: {
    fontSize: 9,
    color: '#1E40AF',
    lineHeight: 1.4,
  },
  
  // Investment Breakdown
  investmentBreakdown: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8F8FC',
    borderRadius: 5,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  investmentItemLabel: {
    fontSize: 11,
    color: '#505050',
  },
  investmentItemValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  investmentValueTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  // Value Timeline
  valueTimelineContainer: {
    marginTop: 15,
  },
  valueTimeline: {
    position: 'relative',
    marginLeft: 15,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#DDDDDD',
  },
  valuePoint: {
    position: 'relative',
    marginBottom: 25,
  },
  valueMarker: {
    position: 'absolute',
    left: -31,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  valueWeek: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  valueDescription: {
    fontSize: 10,
    color: '#505050',
  },
  
  // Appendix Styles
  evcCalculationBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8F8FC',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  evcCalculationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  evcCalculationText: {
    fontSize: 10,
    color: '#505050',
    marginBottom: 5,
  },
  engagementModelCard: {
    marginTop: 10,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#F8F8FC',
    borderRadius: 5,
  },
  engagementModelTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  engagementModelDescription: {
    fontSize: 10,
    color: '#505050',
    lineHeight: 1.4,
  },
  nextStepsList: {
    marginTop: 10,
    marginBottom: 10,
  },
  nextStep: {
    fontSize: 10,
    color: '#505050',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: colors.primary,
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Engagement model features
  engagementModelFeatures: {
    marginTop: 10,
  },
  engagementModelSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  engagementModelFeatureItem: {
    fontSize: 9,
    color: '#505050',
    marginBottom: 3,
    paddingLeft: 2,
  },
  
  // Price Calculation Table Styles
  calculationTable: {
    marginTop: 30,
    backgroundColor: '#F8F8FC',
    borderRadius: 5,
    padding: 15,
    border: '1px solid #EEEEEE',
  },
  calculationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  calculationSubtext: {
    fontSize: 9,
    color: '#505050',
    marginBottom: 15,
  },
  calculationSection: {
    marginBottom: 15,
  },
  calculationSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#EEEEEE',
    padding: 5,
    marginBottom: 8,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  calculationRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: '#F0F0F5',
    padding: 5,
    borderRadius: 3,
  },
  calculationLabel: {
    fontSize: 10,
    color: '#505050',
    flex: 2,
  },
  calculationValue: {
    fontSize: 10,
    color: '#505050',
    flex: 2,
    textAlign: 'right',
  },
  calculationTotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'right',
  },
  calculationSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 2,
  },
  calculationSubLabel: {
    fontSize: 9,
    color: '#505050',
    flex: 2,
  },
  calculationSubValue: {
    fontSize: 9,
    color: '#505050',
    flex: 1,
    textAlign: 'right',
  },
  calculationDivider: {
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  calculationSubDivider: {
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    marginVertical: 5,
    marginLeft: 15,
  },
  calculationRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 3,
    marginTop: 5,
  },
  calculationLabelTotal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  calculationGrandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  calculationNote: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#DDDDDD',
  },
  
  // Service Delivery Timeline styles
  deliveryTimelineCard: {
    backgroundColor: colors.background,
    border: `1pt solid #E5E7EB`,
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    marginBottom: 14,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  deliveryTimelineHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: `1pt solid ${colors.deliveryTimelineBorder}`,
  },
  deliveryTimelineTitle: {
    fontSize: 12,
    fontWeight: 'medium',
    color: colors.text,
  },
  deliveryTimelineWeeksValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deliveryTimelineWeeksLabel: {
    fontSize: 8,
    color: colors.lightText,
  },
  deliveryTimelineBar: {
    height: 36,
    backgroundColor: colors.deliveryTimelineBg,
    borderRadius: 4,
    border: `1pt solid ${colors.deliveryTimelineBorder}`,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 4,
  },
  deliveryTimelineBlockCard: {
    height: '100%',
    backgroundColor: '#3B82F6',
    opacity: 0.2,
    borderRight: `1pt solid ${colors.deliveryTimelineBorder}`,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryTimelineBlockCardText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  deliveryTimelineEllipsisCard: {
    position: 'absolute',
    right: 5,
    top: '35%',
  },
  deliveryTimelineEllipsisText: {
    fontSize: 9,
    fontWeight: 'medium',
    color: colors.lightText,
  },
  deliveryTimelineMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 15,
  },
  deliveryTimelineMarker: {
    fontSize: 7,
    color: '#6B7280',
  },
  deliveryFormulaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    paddingVertical: 10,
    borderRadius: 4,
    border: `1pt solid #E5E7EB`,
  },
  deliveryFormulaItem: {
    textAlign: 'center',
    padding: 5,
    paddingHorizontal: 8,
  },
  deliveryFormulaValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  deliveryFormulaLabel: {
    fontSize: 8,
    color: colors.lightText,
    marginTop: 2,
  },
  deliveryFormulaDivider: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.lightText,
    paddingHorizontal: 8,
  },
  serviceApproachNoteCard: {
    backgroundColor: colors.deliveryTimelineBg,
    borderRadius: 4,
    padding: 10,
    marginTop: 15,
    border: `1pt solid ${colors.deliveryTimelineBorder}`,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceApproachIcon: {
    fontSize: 10,
    marginRight: 5,
    marginTop: 1,
    color: colors.primary,
  },
  serviceApproachTextCard: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
    flex: 1,
  },
  
  // Strategic Approach Page Styles
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  strategicApproachColumn: {
    flex: 1,
  },
  columnHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.lightText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pillarCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    border: `1pt solid ${colors.cardBorder}`,
    marginBottom: 10,
    overflow: 'hidden',
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottom: `1pt solid ${colors.cardBorder}`,
  },
  pillarIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pillarIconText: {
    fontSize: 12,
  },
  pillarInfo: {
    flex: 1,
  },
  pillarName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pillarModuleCount: {
    fontSize: 8,
    color: colors.lightText,
  },
  pillarContent: {
    padding: 8,
    backgroundColor: '#FAFAFA',
  },
  pillarDescription: {
    fontSize: 8,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  pillarModulesLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.lightText,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pillarModulesBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  moduleBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moduleBadgeText: {
    fontSize: 6,
    color: colors.text,
  },
  velocityBar: {
    height: 16,
    position: 'relative',
    marginVertical: 10,
  },
  velocityBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  velocityBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    opacity: 0.7,
  },
  velocityBarLabel: {
    position: 'absolute',
    right: 8,
    top: 3,
    fontSize: 6,
    fontWeight: 'bold',
    color: colors.text,
  },
  resourceOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  resourceOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  resourceOptionText: {
    fontSize: 7,
    color: colors.lightText,
  },
  resourceOptionTextActive: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.lightText,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 8,
    color: colors.lightText,
    marginBottom: 6,
  },
  // Table styles for cards
  tableContainer: {
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableLabel: {
    fontSize: 9,
    color: '#4B5563',
  },
  tableValue: {
    fontSize: 9,
    fontWeight: 'semibold',
    color: '#2E2266',
  },
  tableValueHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E2266',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 7,
    fontWeight: 'medium',
  },
  cardNote: {
    fontSize: 7,
    color: colors.lightText,
    lineHeight: 1.3,
  },
  calculationNoteText: {
    fontSize: 8,
    color: '#505050',
    fontStyle: 'italic',
  }
});

export default styles;