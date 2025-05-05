// filepath: /Users/rolle/git/elexive-calc/src/pdf/components/ModuleContentPage.js
// Content page component for PDF generation

import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import styles from '../utils/pdfStyles';
import modulesConfig from '../../config/modulesConfig.json';
import { getPillarColor } from '../utils/colors';

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
  
  // Get pillar-specific color
  const pillarColor = getPillarColor(module.pillar);
  
  // Use absolute URLs to ensure images are accessible in the PDF
  const moduleIconUrl = `${window.location.origin}/common-module-white.png`;
  const logoUrl = `${window.location.origin}/elexive-logo-text.png`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.contentPage}>
        {/* Decorative header strip */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: pillarColor,
        }} />
        
        {/* Small logo in top right */}
        <View style={{
          position: 'absolute',
          top: 20,
          right: 40,
        }}>
          <Image 
            src={logoUrl}
            style={{
              width: 100,
            }}
          />
        </View>
        
        {/* Main content container with extra top padding for the header strip */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 20,
        }}>
          {/* Hero section with module info */}
          <View style={{
            backgroundColor: pillarColor,
            borderRadius: 8,
            padding: 20,
            marginBottom: 30,
            position: 'relative',
            minHeight: 120,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            {/* Module icon */}
            <View style={{
              position: 'absolute',
              right: 30,
              top: 20,
              width: 80,
              height: 80,
              opacity: 0.9,
            }}>
              <Image 
                src={moduleIconUrl}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            
            {/* Module info */}
            <View style={{
              width: '75%',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                marginBottom: 5,
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                {module.pillar}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
                {module.name}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 14,
                opacity: 0.9,
              }}>
                {module.category}
              </Text>
            </View>
          </View>
          
          {/* Module description section */}
          <View style={{
            marginBottom: 30,
            backgroundColor: '#f8f9fa',
            padding: 20,
            borderRadius: 8,
            borderLeft: `4 solid ${pillarColor}`,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 10,
            }}>
              Overview
            </Text>
            <Text style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: '#444',
            }}>
              {module.description || "This module helps organizations improve their capabilities in key areas. It provides a structured approach to implementing best practices and achieving measurable outcomes."}
            </Text>
          </View>
          
          {/* Module details in a three-column layout */}
          <View style={{
            flexDirection: 'row',
            marginBottom: 30,
            gap: 15,
          }}>
            {/* Column 1: Key Features */}
            <View style={{
              flex: 1,
              backgroundColor: '#f8f9fa',
              padding: 15,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: pillarColor,
                marginBottom: 10,
              }}>
                Key Features
              </Text>
              {(module.features || ["Structured approach", "Best practices", "Expert guidance"]).map((feature, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: pillarColor,
                    marginRight: 5,
                  }}>
                    •
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    color: '#444',
                  }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Column 2: Outcomes */}
            <View style={{
              flex: 1,
              backgroundColor: '#f8f9fa',
              padding: 15,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: pillarColor,
                marginBottom: 10,
              }}>
                Expected Outcomes
              </Text>
              {(module.outcomes || ["Improved efficiency", "Enhanced capabilities", "Measurable results"]).map((outcome, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: pillarColor,
                    marginRight: 5,
                  }}>
                    •
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    color: '#444',
                  }}>
                    {outcome}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Column 3: Implementation */}
            <View style={{
              flex: 1,
              backgroundColor: '#f8f9fa',
              padding: 15,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: pillarColor,
                marginBottom: 10,
              }}>
                Implementation
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: pillarColor,
                  marginRight: 5,
                }}>
                  •
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: '#444',
                }}>
                  Duration: {module.duration || "4-6 weeks"}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: pillarColor,
                  marginRight: 5,
                }}>
                  •
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: '#444',
                }}>
                  Effort: {module.effort || "Medium"}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: pillarColor,
                  marginRight: 5,
                }}>
                  •
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: '#444',
                }}>
                  Resources: {module.resources || "2-3 team members"}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Value proposition */}
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            padding: 20,
            borderRadius: 8,
            marginBottom: 30,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 10,
            }}>
              Value Proposition
            </Text>
            <Text style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: '#444',
              fontStyle: 'italic',
            }}>
              "{module.valueProposition || "This module delivers measurable value by implementing industry best practices and proven methodologies that drive significant improvements in organizational capabilities."}"
            </Text>
          </View>
          
          {/* Next steps section with button-like elements */}
          <View style={{
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 15,
            }}>
              Next Steps
            </Text>
            
            <View style={{
              flexDirection: 'row',
              gap: 15,
            }}>
              <View style={{
                backgroundColor: pillarColor,
                padding: 15,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  Consultation
                </Text>
              </View>
              
              <View style={{
                backgroundColor: pillarColor,
                padding: 15,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  Assessment
                </Text>
              </View>
              
              <View style={{
                backgroundColor: pillarColor,
                padding: 15,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  Implementation
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Footer with date and page number */}
        <View style={{
          position: 'absolute',
          bottom: 30,
          left: 40,
          right: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingTop: 10,
        }}>
          <Text style={{
            fontSize: 9,
            color: '#888',
          }}>
            Elexive Ltd • Solution Brief
          </Text>
          <Text style={{
            fontSize: 9,
            color: '#888',
          }}>
            Generated on {formattedDate}
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default ModuleContentPage;