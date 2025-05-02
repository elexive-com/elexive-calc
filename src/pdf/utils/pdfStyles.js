// PDF styles for react-pdf components

import { StyleSheet } from '@react-pdf/renderer';

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf',
// });

// Define colors
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
});

export default styles;