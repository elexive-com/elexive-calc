import React from 'react';
import { 
  faChartLine, faBullseye, faPuzzlePiece, 
  faMoneyBillWave, faGears, faCheck, faBuilding, 
  faRocket, faLightbulb, faShieldAlt, faServer,
  faNetworkWired, faDatabase, faUsers,
  faRobot, faArrowRight, faMap, faCompass,
  faGlobe, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import modulesConfig from '../config/modulesConfig.json';

// Helper function to get discount label
export const getDiscountLabel = (priceModifier) => {
  if (priceModifier !== 1) {
    return (
      <span className="ml-1 text-xs">
        ({((1.00 - priceModifier) * 100).toFixed(0)}% off)
      </span>
    );
  }
  return null;
};

// Helper function to get icon from string name
export const getIcon = (iconName) => {
  // Import all FontAwesome icons that are used in the app
  const iconMap = {
    faChartLine, faBullseye, faPuzzlePiece, 
    faMoneyBillWave, faGears, faCheck, faBuilding, 
    faRocket, faLightbulb, faShieldAlt, faServer,
    faNetworkWired, faDatabase, faUsers,
    faRobot, faArrowRight, faMap, faCompass,
    faGlobe, faLayerGroup
  };
  
  // Return the icon if it exists, otherwise return a default
  return iconMap[iconName] || faPuzzlePiece;
};

// Helper function to get icon for module
export const getModuleIcon = (pillar, name) => {
  // Import all FontAwesome icons that are used in the app
  const iconMap = {
    faChartLine, faBullseye, faPuzzlePiece, 
    faMoneyBillWave, faGears, faCheck, faBuilding, 
    faRocket, faLightbulb, faShieldAlt, faServer,
    faNetworkWired, faDatabase, faUsers,
    faRobot, faArrowRight, faMap, faCompass,
    faGlobe, faLayerGroup
  };
  
  // Find the module in the modules array from modulesConfig
  const moduleConfig = modulesConfig.modules.find(module => 
    module.name === name && module.pillar === pillar
  );
  
  // If the module is found, use its icon
  if (moduleConfig && moduleConfig.icon) {
    return iconMap[moduleConfig.icon] || faGears;
  }
  
  // If module not found, use the pillar icon as default
  const defaultPillarIcon = modulesConfig.pillarIcons[pillar];
  return iconMap[defaultPillarIcon] || faGears;
};