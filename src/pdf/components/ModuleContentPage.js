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

const applyOpacity = (hex, alpha) => {
  if (!hex || hex[0] !== '#') return hex;
  let r;
  let g;
  let b;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    return hex;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroHeading: {
    fontSize: 13,
    color: '#FFFFFF',
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
    padding: 16,
    marginBottom: 12,
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
    padding: 14,
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
    padding: 16,
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

  if (!module && moduleName) {
    const pages = [];

    const addPage = sections => {
      const filtered = sections.filter(Boolean);
      if (filtered.length > 0) {
        pages.push(filtered);
      }
    };

    const heroSection = (
      <View
        key="hero"
        style={[
          standaloneStyles.hero,
          {
            backgroundColor: theme.primary,
          },
        ]}
        wrap={false}
      >
        <View style={standaloneStyles.heroLeft}>
          <Text style={[standaloneStyles.pillarLabel, { color: theme.accent }]}>
            {moduleData.pillar}
          </Text>
          <Text style={standaloneStyles.heroTitle}>{moduleData.name}</Text>
          {moduleData.heading && (
            <Text style={standaloneStyles.heroHeading}>
              {moduleData.heading}
            </Text>
          )}
          {valueHeadlines.length > 0 && (
            <View style={standaloneStyles.heroList}>
              {valueHeadlines.map((headline, idx) => (
                <View
                  key={`headline-${idx}`}
                  style={standaloneStyles.heroListItem}
                >
                  <Text style={standaloneStyles.heroBullet}>•</Text>
                  <Text style={standaloneStyles.heroListText}>{headline}</Text>
                </View>
              ))}
            </View>
          )}
          {quickFacts.length > 0 && (
            <View style={standaloneStyles.quickFactGrid}>
              {quickFacts.map((fact, idx) => (
                <View key={`fact-${idx}`} style={standaloneStyles.quickFact}>
                  <Text
                    style={[
                      standaloneStyles.quickFactLabel,
                      { color: theme.accent },
                    ]}
                  >
                    {fact.label}
                  </Text>
                  <Text style={standaloneStyles.quickFactValue}>
                    {fact.value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={standaloneStyles.heroRight}>
          <View
            style={[
              standaloneStyles.heroIconWrap,
              { borderColor: applyOpacity('#FFFFFF', 0.45) },
            ]}
          >
            <Image src={moduleIconUrl} style={standaloneStyles.heroIcon} />
          </View>
          {moduleData.callToAction && (
            <Text style={standaloneStyles.heroCTA}>
              {moduleData.callToAction}
            </Text>
          )}
        </View>
      </View>
    );

    // Page 1: Hero section only
    addPage([heroSection]);

    // Page 2: Benefits, Summary, Who is it for
    addPage([
      moduleData.benefits && moduleData.benefits.length > 0 && (
        <View key="benefits" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Strategic Benefits</Text>
          {renderList(moduleData.benefits)}
        </View>
      ),
      (moduleData.executiveSummary || moduleData.description) && (
        <View key="summary" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Executive Summary</Text>
          {moduleData.executiveSummary && (
            <Text style={standaloneStyles.paragraph}>
              {moduleData.executiveSummary}
            </Text>
          )}
          {moduleData.description && (
            <Text style={standaloneStyles.paragraph}>
              {moduleData.description}
            </Text>
          )}
        </View>
      ),
      moduleData.whoIsItFor && (
        <View key="ideal-exec" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Right For You If</Text>
          <Text style={standaloneStyles.paragraph}>
            {moduleData.whoIsItFor}
          </Text>
        </View>
      ),
    ]);

    // Page 3: Challenge and Approach
    addPage([
      (businessChallenge.problem || businessChallenge.marketContext) && (
        <View key="challenge" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Business Challenge</Text>
          {businessChallenge.problem && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>The Challenge</Text>
              <Text style={standaloneStyles.paragraph}>
                {businessChallenge.problem}
              </Text>
            </View>
          )}
          {businessChallenge.marketContext && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>Market Context</Text>
              <Text style={standaloneStyles.paragraph}>
                {businessChallenge.marketContext}
              </Text>
            </View>
          )}
        </View>
      ),
      (approach.methodology ||
        approach.framework ||
        approach.differentiators) && (
        <View key="approach" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>
            What Makes Us Different
          </Text>
          {approach.differentiators && (
            <Text style={standaloneStyles.paragraph}>
              {approach.differentiators}
            </Text>
          )}
        </View>
      ),
      (expectedOutcomes.outcomes ||
        expectedOutcomes.metrics ||
        expectedOutcomes.timeline) && (
        <View key="outcomes" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>
            Expected Outcomes & Success Metrics
          </Text>
          {expectedOutcomes.outcomes &&
            expectedOutcomes.outcomes.length > 0 &&
            renderList(expectedOutcomes.outcomes)}
          {expectedOutcomes.metrics && expectedOutcomes.metrics.length > 0 && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>Key Metrics</Text>
              {renderList(expectedOutcomes.metrics)}
            </View>
          )}
          {expectedOutcomes.timeline && (
            <Text style={standaloneStyles.paragraph}>
              Timeline: {expectedOutcomes.timeline}
            </Text>
          )}
        </View>
      ),
      moduleData.fix && (
        <View key="how-we-help" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>
            How Elexive Unlocks Value
          </Text>
          <Text style={standaloneStyles.paragraph}>{moduleData.fix}</Text>
        </View>
      ),
      moduleData.businessValue && (
        <View key="kpi" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>KPI Impact</Text>
          <Text style={standaloneStyles.paragraph}>
            {moduleData.businessValue}
          </Text>
        </View>
      ),
    ]);

    addPage([
      (implementation.phases || implementation.keyMilestones) && (
        <View key="implementation" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Implementation Roadmap</Text>
          {implementation.phases &&
            implementation.phases.map((phase, idx) => (
              <View key={`phase-${idx}`} style={standaloneStyles.subCard}>
                <Text style={standaloneStyles.subTitle}>
                  {phase.name}
                  {phase.duration ? ` • ${phase.duration}` : ''}
                </Text>
                {renderList(phase.activities)}
              </View>
            ))}
          {implementation.keyMilestones &&
            implementation.keyMilestones.length > 0 && (
              <View style={standaloneStyles.subCard}>
                <Text style={standaloneStyles.subTitle}>Key Milestones</Text>
                {renderList(implementation.keyMilestones)}
              </View>
            )}
        </View>
      ),
      caseStudy && (
        <View key="case-study" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Success Story</Text>
          {caseStudy.clientType && (
            <Text style={standaloneStyles.paragraph}>
              Client: {caseStudy.clientType}
            </Text>
          )}
          {caseStudy.challenge && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>Challenge</Text>
              <Text style={standaloneStyles.paragraph}>
                {caseStudy.challenge}
              </Text>
            </View>
          )}
          {caseStudy.solution && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>Solution</Text>
              <Text style={standaloneStyles.paragraph}>
                {caseStudy.solution}
              </Text>
            </View>
          )}
          {caseStudy.results && (
            <View style={standaloneStyles.subCard}>
              <Text style={standaloneStyles.subTitle}>Results</Text>
              <Text style={standaloneStyles.paragraph}>
                {caseStudy.results}
              </Text>
            </View>
          )}
        </View>
      ),
      moduleData.variants && moduleData.variants.length > 0 && (
        <View key="engagement" style={standaloneStyles.card} wrap={false}>
          <Text style={standaloneStyles.cardTitle}>Engagement Models</Text>
          {moduleData.variants.map((variant, idx) => {
            const variantDef =
              modulesConfig.variantDefinitions?.[variant.type] || {};
            return (
              <View
                key={`variant-${idx}`}
                style={standaloneStyles.variantBlock}
              >
                <Text style={standaloneStyles.subTitle}>{variant.type}</Text>
                {(variantDef.tagline || variant.description) && (
                  <Text style={standaloneStyles.paragraph}>
                    {variantDef.tagline || variant.description}
                  </Text>
                )}
                <Text style={standaloneStyles.paragraph}>
                  Value Units:{' '}
                  {variant.isFlexible
                    ? `Starting from ${variant.minEvcPerWeek || 0} EVCs/week`
                    : `${variant.evcValue || 0} EVCs`}
                </Text>
                {variant.duration && (
                  <Text style={standaloneStyles.paragraph}>
                    Duration: {variant.duration}
                  </Text>
                )}
                {variant.deliverables && variant.deliverables.length > 0 && (
                  <View style={standaloneStyles.subCard}>
                    <Text style={standaloneStyles.subTitle}>
                      Key Deliverables
                    </Text>
                    {renderList(variant.deliverables)}
                  </View>
                )}
                {variant.scalingFactors &&
                  Array.isArray(variant.scalingFactors) &&
                  variant.scalingFactors.length > 0 && (
                    <View style={standaloneStyles.subCard}>
                      <Text style={standaloneStyles.subTitle}>
                        Scaling Factors
                      </Text>
                      {renderList(variant.scalingFactors)}
                    </View>
                  )}
              </View>
            );
          })}
        </View>
      ),
      <View key="next-steps" style={standaloneStyles.card} wrap={false}>
        <Text style={standaloneStyles.cardTitle}>Next Steps</Text>
        <Text style={standaloneStyles.paragraph}>
          {moduleData.callToAction ||
            'Add this module to your transformation roadmap and align stakeholders on investment and execution scope.'}
        </Text>
        <Text style={standaloneStyles.paragraph}>
          Contact us at{' '}
          <Text style={{ fontWeight: 'bold' }}>sales@elexive.com</Text> to align
          this module with your objectives.
        </Text>
      </View>,
    ]);

    const totalPages = pages.length + 1;

    return pages.map((sections, index) => (
      <Page key={`standalone-${index}`} size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <PageHeader pillarColor={pillarColor} logoUrl={logoUrl} />
          <View style={standaloneStyles.pageBody}>
            {sections.map((section, idx) => (
              <View key={`section-${index}-${idx}`} wrap={false}>
                {section}
              </View>
            ))}
          </View>
        </View>
        <PageFooter
          formattedDate={formattedDate}
          pageNumber={index + 2}
          totalPages={totalPages}
        />
      </Page>
    ));
  }

  return (
    <Page size="A4" style={styles.page}>
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
          {(businessChallenge.problem || businessChallenge.marketContext) && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Business Challenge</Text>
              {businessChallenge.problem && (
                <View style={dynamicStyles.card}>
                  <Text style={dynamicStyles.subheading}>The Challenge</Text>
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
          {approach.differentiators && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                What Makes Us Different
              </Text>
              <Text style={dynamicStyles.paragraph}>
                {approach.differentiators}
              </Text>
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
      </View>
      <PageFooter
        formattedDate={formattedDate}
        pageNumber={pageNumber || 2}
        totalPages={totalPages || 2}
      />
    </Page>
  );
};

export default ModuleContentPage;

const standaloneStyles = StyleSheet.create({
  pageBody: {
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 40,
    gap: 16,
  },
  hero: {
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 20,
  },
  heroRight: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pillarLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  heroHeading: {
    fontSize: 11.5,
    color: '#374151',
    lineHeight: 1.5,
    marginTop: 6,
    marginBottom: 10,
  },
  heroList: {
    marginTop: 8,
    gap: 4,
  },
  heroListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroBullet: {
    fontSize: 10,
    color: '#FFFFFF',
    marginRight: 4,
    marginTop: 1,
  },
  heroListText: {
    fontSize: 11,
    lineHeight: 1.45,
    color: '#FFFFFF',
    flex: 1,
  },
  quickFactGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickFact: {
    width: '45%',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  quickFactLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  quickFactValue: {
    fontSize: 11,
    color: '#1F2937',
    lineHeight: 1.4,
  },
  heroIconWrap: {
    width: 110,
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    width: 72,
    height: 72,
  },
  heroCTA: {
    fontSize: 10,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  card: {
    padding: 18,
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paragraph: {
    fontSize: 10.8,
    color: '#374151',
    lineHeight: 1.5,
  },
  subCard: {
    marginTop: 8,
    paddingTop: 8,
    gap: 6,
  },
  subTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  variantBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 6,
  },
});
