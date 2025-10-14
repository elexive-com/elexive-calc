// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleContentPage.js
// Solution brief content for module PDF exports

import React from 'react';
import { Text, View, Image, Page, StyleSheet } from '@react-pdf/renderer';
import modulesConfig from '../../config/modulesConfig.json';
import styles from '../utils/pdfStyles';
import { getPillarColor } from '../utils/colors';

// Pillar theme map aligns with the interactive layout
const pillarThemes = {
  Transformation: {
    accent: '#D99000',
    chipBg: 'rgba(217,144,0,0.14)',
    chipBorder: 'rgba(217,144,0,0.32)',
    factBg: 'rgba(217,144,0,0.12)',
  },
  Strategy: {
    accent: '#C85A30',
    chipBg: 'rgba(200,90,48,0.14)',
    chipBorder: 'rgba(200,90,48,0.32)',
    factBg: 'rgba(200,90,48,0.12)',
  },
  Technology: {
    accent: '#1F776D',
    chipBg: 'rgba(31,119,109,0.14)',
    chipBorder: 'rgba(31,119,109,0.32)',
    factBg: 'rgba(31,119,109,0.12)',
  },
  Discovery: {
    accent: '#2E2266',
    chipBg: 'rgba(46,34,102,0.16)',
    chipBorder: 'rgba(46,34,102,0.32)',
    factBg: 'rgba(46,34,102,0.12)',
  },
  Catalyst: {
    accent: '#0A4DA1',
    chipBg: 'rgba(10,77,161,0.16)',
    chipBorder: 'rgba(10,77,161,0.32)',
    factBg: 'rgba(10,77,161,0.12)',
  },
};

const defaultTheme = pillarThemes.Discovery;

// Footer rendered on each page
const PageFooter = ({ formattedDate, pageNumber, totalPages }) => (
  <View style={footerStyles.container}>
    <Text style={footerStyles.meta}>Elexive Ltd • Solution Brief</Text>
    <Text style={footerStyles.meta}>
      Generated on {formattedDate} • Page {pageNumber} of {totalPages}
    </Text>
  </View>
);

// Header renders a pillar strip and logo
const PageHeader = ({ pillarColor, logoUrl }) => (
  <>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 12,
        backgroundColor: pillarColor,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 18,
        right: 40,
      }}
    >
      <Image src={logoUrl} style={{ width: 100 }} />
    </View>
  </>
);

const dynamicStyles = StyleSheet.create({
  contentContainer: {
    paddingTop: 42,
    paddingBottom: 24,
  },
  heroContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: 600,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  heroHeading: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#6B7280',
    marginBottom: 6,
  },
  valueHeadlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  valueChip: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 10.5,
    fontWeight: 600,
  },
  quickFacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  factCard: {
    width: '33%',
    paddingRight: 12,
    marginBottom: 12,
  },
  factLabel: {
    fontSize: 8.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#6B7280',
    marginBottom: 4,
  },
  factValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 1.4,
  },
  heroRight: {
    width: 180,
    borderRadius: 18,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPillar: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroIcon: {
    width: 110,
    height: 110,
    marginBottom: 16,
  },
  heroCTA: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 11.5,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  subheading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 10,
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletSymbol: {
    fontSize: 10,
    color: '#9CA3AF',
    marginRight: 5,
  },
  bulletText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    flex: 1,
  },
  timeline: {
    marginTop: 6,
    fontSize: 11,
    color: '#374151',
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -10,
    marginRight: -10,
  },
  variantCard: {
    width: '50%',
    padding: 10,
  },
  variantInner: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  variantHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  variantTagline: {
    fontSize: 10.5,
    color: '#4B5563',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  variantMeta: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 6,
  },
  highlightBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#1F2937',
    marginBottom: 6,
  },
});

const footerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  meta: {
    fontSize: 9,
    color: '#6B7280',
  },
});

const renderList = (items, fallback) => {
  if (!items || items.length === 0) {
    return fallback ? (
      <Text style={dynamicStyles.paragraph}>{fallback}</Text>
    ) : null;
  }

  return (
    <View style={dynamicStyles.bulletList}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={dynamicStyles.bulletItem}>
          <Text style={dynamicStyles.bulletSymbol}>•</Text>
          <Text style={dynamicStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const ModuleContentPage = ({
  module,
  pillar,
  pageNumber,
  totalPages,
  getVariantDisplayName: _getVariantDisplayName,
  getModuleTypeIcon: _getModuleTypeIcon,
  moduleName,
}) => {
  let moduleData = module;

  if (!moduleData && moduleName) {
    moduleData = modulesConfig.modules.find(m => m.name === moduleName);
    pillar = moduleData?.pillar;
    pageNumber = pageNumber || 2;
    totalPages = totalPages || 2;
  }

  if (!moduleData) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <Text style={styles.errorText}>Module not found</Text>
        </View>
      </Page>
    );
  }

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '.');

  const pillarColor = getPillarColor(pillar || moduleData.pillar);
  const theme = pillarThemes[moduleData.pillar] || defaultTheme;

  const moduleIconUrl = `${window.location.origin}/common-module-white.png`;
  const logoUrl = `${window.location.origin}/elexive-logo-text.png`;

  const valueHeadlines =
    moduleData.businessValue
      ?.split(',')
      .map(item => item.trim())
      .filter(Boolean) || [];

  const variantTypes =
    moduleData.variants?.map(variant => variant.type).filter(Boolean) || [];

  const variantDurations = Array.from(
    new Set(
      (moduleData.variants || [])
        .map(variant => variant.duration)
        .filter(Boolean)
    )
  );

  const timelineSummary =
    moduleData.expectedOutcomes?.timeline ||
    (variantDurations.length > 0 ? variantDurations.join(' • ') : null);

  const quickFacts = [
    moduleData.category && {
      label: 'Module Type',
      value: moduleData.category,
    },
    variantTypes.length > 0 && {
      label: 'Engagement Models',
      value: variantTypes.join(' • '),
    },
    timelineSummary && {
      label: 'Timeline',
      value: timelineSummary,
    },
  ].filter(Boolean);

  const businessChallenge = moduleData.businessChallenge || {};
  const approach = moduleData.approach || {};
  const expectedOutcomes = moduleData.expectedOutcomes || {
    outcomes: moduleData.outcomes,
  };
  const implementation = moduleData.implementation || {};
  const caseStudy = moduleData.caseStudy || null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.contentPage}>
        <PageHeader pillarColor={pillarColor} logoUrl={logoUrl} />

        <View style={dynamicStyles.contentContainer}>
          {/* Hero */}
          <View style={dynamicStyles.heroContainer}>
            <View style={dynamicStyles.heroLeft}>
              <View style={dynamicStyles.chipRow}>
                <Text
                  style={[
                    dynamicStyles.chip,
                    {
                      backgroundColor: theme.chipBg,
                      color: theme.accent,
                      borderWidth: 1,
                      borderColor: theme.chipBorder,
                    },
                  ]}
                >
                  {moduleData.pillar}
                </Text>
                {moduleData.category && (
                  <Text
                    style={[
                      dynamicStyles.chip,
                      { backgroundColor: '#F3F4F6', color: '#374151' },
                    ]}
                  >
                    {moduleData.category}
                  </Text>
                )}
              </View>

              <Text style={dynamicStyles.heroTitle}>{moduleData.name}</Text>
              {moduleData.heading && (
                <Text style={dynamicStyles.heroHeading}>
                  {moduleData.heading}
                </Text>
              )}

              <Text style={dynamicStyles.sectionLabel}>Value Headlines</Text>
              <View style={dynamicStyles.valueHeadlineRow}>
                {valueHeadlines.length > 0 ? (
                  valueHeadlines.map((headline, index) => (
                    <Text
                      key={`${headline}-${index}`}
                      style={[
                        dynamicStyles.valueChip,
                        {
                          backgroundColor: theme.chipBg,
                          color: theme.accent,
                          borderWidth: 1,
                          borderColor: theme.chipBorder,
                        },
                      ]}
                    >
                      {headline}
                    </Text>
                  ))
                ) : (
                  <Text style={dynamicStyles.paragraph}>
                    Define measurable outcomes to quantify this engagement.
                  </Text>
                )}
              </View>

              {quickFacts.length > 0 && (
                <View style={dynamicStyles.quickFacts}>
                  {quickFacts.map((fact, index) => (
                    <View
                      key={`${fact.label}-${index}`}
                      style={dynamicStyles.factCard}
                    >
                      <Text style={dynamicStyles.factLabel}>{fact.label}</Text>
                      <Text style={dynamicStyles.factValue}>{fact.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View
              style={[
                dynamicStyles.heroRight,
                {
                  backgroundColor: pillarColor,
                },
              ]}
            >
              <Text style={dynamicStyles.heroPillar}>{moduleData.pillar}</Text>
              <Image src={moduleIconUrl} style={dynamicStyles.heroIcon} />
              {moduleData.callToAction && (
                <Text style={dynamicStyles.heroCTA}>
                  {moduleData.callToAction}
                </Text>
              )}
            </View>
          </View>

          {/* Executive Summary */}
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Executive Summary</Text>
            {moduleData.executiveSummary && (
              <Text style={dynamicStyles.paragraph}>
                {moduleData.executiveSummary}
              </Text>
            )}
            {moduleData.description && (
              <Text style={dynamicStyles.paragraph}>
                {moduleData.description}
              </Text>
            )}
            {moduleData.fix && (
              <View style={dynamicStyles.highlightBox}>
                <Text style={dynamicStyles.highlightTitle}>
                  How Elexive Unlocks Value
                </Text>
                <Text style={dynamicStyles.paragraph}>{moduleData.fix}</Text>
              </View>
            )}
            {moduleData.whoIsItFor && (
              <View style={dynamicStyles.card}>
                <Text style={dynamicStyles.subheading}>Who This Supports</Text>
                <Text style={dynamicStyles.paragraph}>
                  {moduleData.whoIsItFor}
                </Text>
              </View>
            )}
          </View>

          {/* Business Challenge */}
          {(businessChallenge.problem ||
            businessChallenge.opportunity ||
            businessChallenge.marketContext) && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                Business Challenge & Opportunity
              </Text>
              {businessChallenge.problem && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>Core Challenge</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {businessChallenge.problem}
                  </Text>
                </View>
              )}
              {businessChallenge.opportunity && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>Opportunity</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {businessChallenge.opportunity}
                  </Text>
                </View>
              )}
              {businessChallenge.marketContext && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>Market Context</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {businessChallenge.marketContext}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Approach */}
          {(approach.methodology ||
            approach.framework ||
            approach.differentiators) && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                Our Approach & Methodology
              </Text>
              {approach.methodology && (
                <Text style={dynamicStyles.paragraph}>
                  {approach.methodology}
                </Text>
              )}
              {approach.framework && (
                <View style={dynamicStyles.highlightBox}>
                  <Text style={dynamicStyles.highlightTitle}>
                    Primary Framework
                  </Text>
                  <Text style={dynamicStyles.paragraph}>
                    {approach.framework}
                  </Text>
                </View>
              )}
              {approach.differentiators && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>
                    What Makes It Different
                  </Text>
                  <Text style={dynamicStyles.paragraph}>
                    {approach.differentiators}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Expected Outcomes */}
          {(expectedOutcomes.outcomes ||
            expectedOutcomes.metrics ||
            expectedOutcomes.timeline) && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                Expected Outcomes & Success Metrics
              </Text>
              {renderList(expectedOutcomes.outcomes, null)}
              {expectedOutcomes.metrics &&
                expectedOutcomes.metrics.length > 0 && (
                  <View style={dynamicStyles.card}>
                    <Text style={dynamicStyles.subheading}>Key Metrics</Text>
                    {renderList(expectedOutcomes.metrics)}
                  </View>
                )}
              {expectedOutcomes.timeline && (
                <Text style={dynamicStyles.timeline}>
                  Timeline: {expectedOutcomes.timeline}
                </Text>
              )}
            </View>
          )}

          {/* Benefits */}
          {moduleData.benefits && moduleData.benefits.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Strategic Benefits</Text>
              <View style={dynamicStyles.card}>
                {renderList(moduleData.benefits)}
              </View>
            </View>
          )}

          {/* Implementation */}
          {(implementation.phases && implementation.phases.length > 0) ||
          (implementation.keyMilestones &&
            implementation.keyMilestones.length > 0) ? (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                Implementation Roadmap
              </Text>
              {implementation.phases &&
                implementation.phases.map((phase, index) => (
                  <View
                    key={`${phase.name}-${index}`}
                    style={dynamicStyles.card}
                  >
                    <Text style={dynamicStyles.subheading}>
                      {phase.name} {phase.duration ? `• ${phase.duration}` : ''}
                    </Text>
                    {renderList(phase.activities)}
                  </View>
                ))}
              {implementation.keyMilestones &&
                implementation.keyMilestones.length > 0 && (
                  <View style={dynamicStyles.highlightBox}>
                    <Text style={dynamicStyles.highlightTitle}>
                      Key Milestones
                    </Text>
                    {renderList(implementation.keyMilestones)}
                  </View>
                )}
            </View>
          ) : null}

          {/* Case Study */}
          {caseStudy && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Success Story</Text>
              {caseStudy.clientType && (
                <Text style={dynamicStyles.paragraph}>
                  Client: {caseStudy.clientType}
                </Text>
              )}
              {caseStudy.challenge && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>Challenge</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {caseStudy.challenge}
                  </Text>
                </View>
              )}
              {caseStudy.solution && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>Solution</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {caseStudy.solution}
                  </Text>
                </View>
              )}
              {caseStudy.results && (
                <View style={dynamicStyles.highlightBox}>
                  <Text style={dynamicStyles.highlightTitle}>Results</Text>
                  <Text style={dynamicStyles.paragraph}>
                    {caseStudy.results}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Engagement Models */}
          {moduleData.variants && moduleData.variants.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Engagement Models</Text>
              <View style={dynamicStyles.variantGrid}>
                {moduleData.variants.map((variant, index) => {
                  const variantDef =
                    modulesConfig.variantDefinitions?.[variant.type] || {};
                  const isPrimer = variant.type === 'Insight Primer';
                  const accent = isPrimer ? '#2563EB' : '#0EA5E9';
                  return (
                    <View
                      key={`${variant.type}-${index}`}
                      style={dynamicStyles.variantCard}
                    >
                      <View style={dynamicStyles.variantInner}>
                        <Text
                          style={[
                            dynamicStyles.variantHeader,
                            { color: accent },
                          ]}
                        >
                          {variant.type}
                        </Text>
                        {variantDef.tagline && (
                          <Text style={dynamicStyles.variantTagline}>
                            {variantDef.tagline}
                          </Text>
                        )}
                        <Text style={dynamicStyles.variantMeta}>
                          {variantDef.description || variant.description}
                        </Text>
                        {variant.duration && (
                          <Text style={dynamicStyles.variantMeta}>
                            Duration: {variant.duration}
                          </Text>
                        )}
                        <Text style={dynamicStyles.variantMeta}>
                          Value Units:{' '}
                          {variant.isFlexible
                            ? `Starting from ${variant.minEvcPerWeek || 0} EVCs/week`
                            : `${variant.evcValue || 0} EVCs`}
                        </Text>
                        {variant.deliverables &&
                          variant.deliverables.length > 0 && (
                            <>
                              <Text
                                style={[
                                  dynamicStyles.subheading,
                                  { marginTop: 10 },
                                ]}
                              >
                                Key Deliverables
                              </Text>
                              {renderList(variant.deliverables)}
                            </>
                          )}
                        {variant.scalingFactors &&
                          Array.isArray(variant.scalingFactors) &&
                          variant.scalingFactors.length > 0 && (
                            <>
                              <Text
                                style={[
                                  dynamicStyles.subheading,
                                  { marginTop: 6 },
                                ]}
                              >
                                Scaling Factors
                              </Text>
                              {renderList(variant.scalingFactors)}
                            </>
                          )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Next Steps */}
          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.highlightBox}>
              <Text style={dynamicStyles.highlightTitle}>Next Steps</Text>
              <Text style={dynamicStyles.paragraph}>
                {moduleData.callToAction ||
                  'Add this module to your transformation roadmap and align stakeholders on investment and execution scope.'}
              </Text>
              <Text style={dynamicStyles.paragraph}>
                Contact us at{' '}
                <Text style={{ fontWeight: 'bold' }}>sales@elexive.com</Text> to
                align this module with your objectives.
              </Text>
            </View>
          </View>
        </View>

        <PageFooter
          formattedDate={formattedDate}
          pageNumber={pageNumber || 2}
          totalPages={totalPages || 2}
        />
      </View>
    </Page>
  );
};

export default ModuleContentPage;
