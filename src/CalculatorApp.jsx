import React, { useState, useEffect } from 'react';
import calculatorConfig from './config/calculatorConfig.json';
import calculatorPresets from './config/calculatorPresets.json';
import modulesConfig from './config/modulesConfig.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBullseye, faPuzzlePiece, 
  faMoneyBillWave, faGears, faCheck, faBuilding, 
  faRocket, faLightbulb, faShieldAlt, faServer,
  faNetworkWired, faDatabase, faUsers,
  faRobot, 
  faArrowRight, faChartBar,
  faInfoCircle, faPlus, faMinus,
  faSlidersH, faCoins, faCreditCard, faCheckCircle,
  faCalculator, faEnvelope, faExchangeAlt, 
  faLayerGroup, faTasks, faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

// Helper function to get discount label
const getDiscountLabel = (priceModifier) => {
  if (priceModifier !== 1) {
    return (
      <span className="ml-1 text-xs">
        ({((1.00 - priceModifier) * 100).toFixed(0)}% off)
      </span>
    );
  }
  return null;
};

// Helper function to get icon for module
const getModuleIcon = (pillar, name) => {
  const iconMap = {
    'Transformation': {
      default: faUsers,
      'Crisis Ready': faShieldAlt,
      'Smart Influence': faChartLine,
      'Leading Change': faRocket,
      'Culture Core': faBuilding,
      'AI-Augmented Leadership': faRobot
    },
    'Strategy': {
      default: faLightbulb,
      'Market Edge': faChartLine,
      'Revenue Levers': faMoneyBillWave,
      'Brand Core': faBullseye,
      'Model Shift': faPuzzlePiece
    },
    'Technology': {
      default: faServer,
      'AI Impact': faRobot,
      'Digital Fortress': faShieldAlt,
      'Data Advantage': faDatabase,
      'Distributed Cloud': faNetworkWired
    }
  };

  return iconMap[pillar]?.[name] || iconMap[pillar]?.default || faGears;
};

const CalculatorApp = () => {
  // State for user selections
  const [intent, setIntent] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState(calculatorConfig.defaults.resourceAllocation);
  const [paymentOption, setPaymentOption] = useState(calculatorConfig.defaults.paymentOption);
  const [selectedEvcTier, setSelectedEvcTier] = useState('Standard');
  // Add state for EVC explainer collapse
  const [isEvcExplainerVisible, setIsEvcExplainerVisible] = useState(false);
  
  // Get defaults from config
  const { defaults, evcBase, serviceParameters, evcTiers } = calculatorConfig;
  
  // Get module definitions from modulesConfig
  const { modules, variantDefinitions, pillarIcons } = modulesConfig;
  
  // Toggle function for EVC explainer visibility
  const toggleEvcExplainer = () => {
    setIsEvcExplainerVisible(prev => !prev);
  };
  
  // Initialize parameters from config
  const [parameters, setParameters] = useState(() => {
    const initialParameters = {};
    serviceParameters.forEach(param => {
      initialParameters[param.id] = param.defaultValue;
    });
    return initialParameters;
  });
  
  // Additional state for producer-consumer model
  const [weeklyProductionCapacity, setWeeklyProductionCapacity] = useState(defaults.weeklyCapacity || 10);
  const [monthlyOutputValue, setMonthlyOutputValue] = useState(0);
  
  // Function to reset calculator to defaults
  const resetCalculator = () => {
    setIntent('');
    setSelectedModules([]);
    setResourceAllocation("focused"); // Default to "Focused" allocation
    setPaymentOption(defaults.paymentOption);
    
    // Reset parameters to defaults
    const resetParams = {};
    serviceParameters.forEach(param => {
      resetParams[param.id] = param.defaultValue;
    });
    setParameters(resetParams);
    
    // Force a recalculation to set EVCs to minimum (1)
    setTimeout(() => {
      calculatePricing();
    }, 50);
  };

  // Calculated values
  const [totalPrice, setTotalPrice] = useState(0);
  const [monthlyEvcs, setMonthlyEvcs] = useState(0);
  const [evcPricePerUnit, setEvcPricePerUnit] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(
    calculatorConfig.resourceAllocation[defaults.resourceAllocation].description
  );
  
  // Custom function to handle intent selection and apply presets
  const handleIntentSelect = (intentName) => {
    setIntent(intentName);
    
    // Apply preset if this is a preset intent
    if (intentName && intentName !== "Full Custom" && calculatorPresets.presets[intentName]) {
      console.log("Applying preset for:", intentName);
      const preset = calculatorPresets.presets[intentName];
      
      // Clear any existing selections first
      setSelectedModules([]);
      
      // Apply the preset modules with a slight delay to ensure UI updates
      setTimeout(() => {
        console.log("Setting modules to:", preset.modules);
        setSelectedModules([...preset.modules]);
        
        // Apply the preset capacity allocation
        setResourceAllocation(preset.resourceAllocation || preset.capacityAllocation);
        
        // Apply the preset payment option
        setPaymentOption(preset.paymentOption);
        
        // Apply the preset parameters
        const newParameters = { ...parameters };
        for (const [paramId, value] of Object.entries(preset.parameters)) {
          newParameters[paramId] = value;
        }
        setParameters(newParameters);
      }, 50);
    }
  };
  
  // Function to toggle payment option - references setPaymentOption
  const togglePaymentOption = (option) => {
    if (option !== paymentOption) {
      setPaymentOption(option);
      // Recalculate pricing when payment option changes
      calculatePricing();
    }
  };
  
  // Function to update parameters - references setParameters
  const updateParameter = (paramId, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [paramId]: value
    }));
  };
  
  // State for active pillar tab - moved from renderModuleSelector to component level
  const [activePillar, setActivePillar] = useState("Transformation");
  
  // Create parameter modifiers map for easy lookup
  const parameterModifiers = serviceParameters.reduce((acc, param) => {
    acc[param.id] = param.modifier;
    return acc;
  }, {});
  
  // Calculate pricing whenever selections change
  const calculatePricing = React.useCallback(() => {
    const { resourceAllocation: allocations, evcBase, evcTiers } = calculatorConfig;
    
    // Calculate total EVCs needed based on selected modules (consumer side)
    let baseModuleEvcs = 0;
    if (selectedModules.length > 0) {
      // Find the selected modules and sum their EVC values from modulesConfig instead of calculatorConfig
      const selectedModuleConfigs = modules.filter(module => 
        selectedModules.includes(module.name)
      );
      
      // Use average of min/max EVC values for each module from variants
      baseModuleEvcs = selectedModuleConfigs.reduce((total, module) => {
        const minEvc = module.variants[0].evcValue;
        const maxEvc = module.variants[1] ? module.variants[1].evcValue : minEvc;
        return total + ((minEvc + maxEvc) / 2);
      }, 0);
    } else {
      // If no modules selected, use a minimum value of 1 EVC
      baseModuleEvcs = 1; // Minimum baseline of 1 EVC
    }
    
    // Store the consumer-side raw EVCs
    const rawConsumerEVCs = baseModuleEvcs;
    
    // Get resource allocation strategy
    const allocation = allocations[resourceAllocation];
    
    // Set production capacity (producer side)
    // Base production capacity is equal to the consumer demand unless modified by parameters
    let productionCapacity = rawConsumerEVCs;
    
    // Apply service parameter modifiers to production capacity
    Object.entries(parameters).forEach(([paramId, isEnabled]) => {
      if (isEnabled) {
        productionCapacity *= parameterModifiers[paramId];
      }
    });
    
    // Round production capacity
    productionCapacity = Math.ceil(productionCapacity);
    
    // Calculate output multiplier based on allocation strategy
    const outputMultiplier = allocation.outputMultiplier;
    
    // Calculate total output (what customer receives)
    const outputValue = Math.ceil(rawConsumerEVCs * outputMultiplier);
    
    // Store the values for display
    setWeeklyProductionCapacity(productionCapacity);
    setMonthlyOutputValue(outputValue * 4); // 4 weeks output
    
    // Set allocation descriptor
    setDeliverySpeed(allocation.description);
    
    // Select EVC tier based on weekly production
    let selectedTier = evcTiers.find(tier => 
      productionCapacity >= tier.minWeeklyCommitment
    );
    
    // If no tier matches, use the first one (presumably the default/standard tier)
    if (!selectedTier) {
      selectedTier = evcTiers[0];
    }
    
    setSelectedEvcTier(selectedTier.name);
    
    // Apply tier price multiplier
    let pricePerEvc = evcBase.basePrice * selectedTier.priceMultiplier;
    
    // Apply volume discount based on config
    evcBase.volumeDiscounts.forEach(({ threshold, discount }) => {
      if (productionCapacity > threshold) {
        pricePerEvc *= discount;
      }
    });
    
    // Apply payment option modifier
    const paymentModifier = evcBase.paymentOptions[paymentOption].priceModifier;
    pricePerEvc *= paymentModifier;
    
    // Set final values
    setMonthlyEvcs(productionCapacity);
    setEvcPricePerUnit(pricePerEvc);
    setTotalPrice(Math.round(productionCapacity * pricePerEvc));
  }, [selectedModules, resourceAllocation, parameters, paymentOption, parameterModifiers, modules]);
  
  // Use the memoized callback in useEffect
  useEffect(() => {
    calculatePricing();
  }, [calculatePricing]);
  
  // Toggle modules selection
  const toggleModule = (module) => {
    setSelectedModules(
      selectedModules.includes(module)
        ? selectedModules.filter(m => m !== module)
        : [...selectedModules, module]
    );
  };
  
  // Onboarding Quiz
  const renderOnboardingQuiz = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 relative">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mr-2" />
        What's your primary objective?
      </h2>
      <p className="text-gray-600 mb-6">Select your strategic goal to tailor your solution</p>
      
      {/* Primary Objective Options - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {calculatorConfig.intents.map((intentOption) => (
          <button
            key={intentOption.name}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              intent === intentOption.name
                ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow-md'
                : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
            }`}
            onClick={() => handleIntentSelect(intentOption.name)}
          >
            {/* Preset label at the top */}
            {(intentOption.name === "Visionary Growth" || 
              intentOption.name === "Turnaround" || 
              intentOption.name === "Reinvention") && (
              <div className="flex justify-start mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0E3] text-[var(--elexive-secondary)]">
                  Preset
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <FontAwesomeIcon 
                icon={
                  intentOption.name === "Visionary Growth" ? faChartLine :
                  intentOption.name === "Turnaround" ? faArrowRight :
                  intentOption.name === "Reinvention" ? faRocket :
                  intentOption.name === "Full Custom" ? faGears :
                  faRocket
                } 
                className="text-[var(--elexive-primary)] mr-2" 
              />
              <h3 className="font-bold text-lg text-[var(--elexive-primary)]">{intentOption.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{intentOption.description}</p>
          </button>
        ))}
      </div>
      
      {/* Reset Calculator Button - positioned on its own row at the bottom */}
      <div className="flex justify-end mt-3">
        <button
          onClick={resetCalculator}
          className="px-4 py-2 text-sm border border-[var(--elexive-accent)] bg-[var(--elexive-accent-light)] hover:bg-[var(--elexive-accent)] text-[var(--elexive-primary)] font-medium rounded-lg transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faArrowRight} className="mr-2 rotate-180" />
          Reset Calculator
        </button>
      </div>
    </div>
  );
  
  // Strategic Module Selector
  const renderModuleSelector = () => {
    // Group modules by pillar
    const modulesByPillar = {
      Transformation: modules.filter(module => module.pillar === "Transformation"),
      Strategy: modules.filter(module => module.pillar === "Strategy"),
      Technology: modules.filter(module => module.pillar === "Technology")
    };
    
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
          <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2" />
          Select Service Modules
        </h2>
        <p className="text-gray-600 mb-4">Choose the components that match your strategic needs</p>
        
        {/* Pillar Tabs */}
        <div className="flex border-b mb-6">
          {Object.keys(modulesByPillar).map((pillar) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`px-4 py-2 font-medium text-sm flex items-center ${
                activePillar === pillar 
                  ? 'border-b-2 border-[var(--elexive-accent)] text-[var(--elexive-primary)]' 
                  : 'text-gray-500 hover:text-[var(--elexive-primary)]'
              }`}
            >
              <FontAwesomeIcon 
                icon={
                  pillar === "Transformation" ? faUsers : 
                  pillar === "Strategy" ? faLightbulb : 
                  faServer
                } 
                className="mr-2" 
              />
              {pillar}
            </button>
          ))}
        </div>
        
        {/* Display modules by pillar */}
        {Object.entries(modulesByPillar).map(([pillar, pillarModules]) => (
          <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillarModules.map((module) => (
                <div
                  key={module.name}
                  onClick={() => toggleModule(module.name)}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedModules.includes(module.name)
                      ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                      : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
                  }`}
                >
                  {/* Category label moved to top row */}
                  <div className="flex justify-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      module.category === "Immediate Impact" 
                        ? 'bg-[#ECE9F3] text-[var(--elexive-primary)]' 
                        : 'bg-[#FFF0E3] text-[var(--elexive-secondary)]'
                    }`}>
                      {module.category}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded-md mr-3 mt-1 flex-shrink-0 flex items-center justify-center ${
                      selectedModules.includes(module.name) ? 'bg-[var(--elexive-accent)]' : 'bg-gray-200'
                    }`}>
                      {selectedModules.includes(module.name) && (
                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <FontAwesomeIcon 
                          icon={getModuleIcon(module.pillar, module.name)} 
                          className="text-[var(--elexive-primary)] mr-2" 
                        />
                        <h3 className="font-semibold">{module.name}</h3>
                      </div>
                      <p className="text-xs font-medium text-[var(--elexive-primary)] mb-1">{module.heading}</p>
                      <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          <FontAwesomeIcon icon={faChartBar} className="mr-1" />
                          EVC Range: {module.variants[0].evcValue}-{module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Resource Allocation selector
  const renderResourceAllocationSelector = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
        Weekly Resource Allocation
      </h2>
      <p className="text-gray-600 mb-6">
        Select how you'd like to distribute your EVC production capacity across your strategic initiatives.
        Different allocation strategies impact your total output value.
      </p>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(calculatorConfig.resourceAllocation).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setResourceAllocation(key)}
              className={`p-5 rounded-xl transition-all duration-200 ${
                resourceAllocation === key
                  ? 'bg-[#FFF6E8] border-2 border-[var(--elexive-accent)] shadow'
                  : 'bg-gray-50 border border-gray-200 hover:border-[var(--elexive-accent)] hover:shadow'
              }`}
            >
              <div className="flex flex-col items-center">
                <FontAwesomeIcon 
                  icon={
                    key === "focused" ? faBullseye : 
                    key === "balanced" ? faProjectDiagram : 
                    faTasks
                  } 
                  className="text-[var(--elexive-primary)] text-2xl mb-3" 
                />
                <h3 className="font-bold text-lg text-[var(--elexive-primary)]">{details.description}</h3>
                <div className="text-sm bg-[var(--elexive-accent-light)] rounded-full px-3 py-1 my-2">
                  {details.label}
                </div>
                <p className="text-sm text-gray-600 text-center mt-1">{details.valueProposition}</p>
                <div className="mt-3 px-3 py-1 bg-[#ECE9F3] rounded-lg text-xs text-center">
                  <span className="font-medium text-[var(--elexive-primary)]">
                    Output multiplier: {details.outputMultiplier}x
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Service Parameters
  const renderServiceParameters = () => {
    // Safety check: if serviceParameters is undefined or null, provide an empty array as fallback
    const serviceParams = calculatorConfig.serviceParameters || [];
    
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-4">
          <FontAwesomeIcon icon={faSlidersH} className="text-[var(--elexive-accent)] mr-2" />
          Service Parameters
        </h2>
        
        <div className="space-y-6">
          {/* Payment Option */}
          <div>
            <label className="block text-[var(--elexive-primary)] font-medium mb-2">
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              Payment Option
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(calculatorConfig.evcBase.paymentOptions).map(([option, details]) => (
                <button
                  key={option}
                  onClick={() => togglePaymentOption(option)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 border ${
                    paymentOption === option
                      ? 'bg-[var(--elexive-accent)] text-[var(--elexive-primary)] shadow-md border-[var(--elexive-accent)]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-[var(--elexive-accent-light)]'
                  }`}
                >
                  {details.name}
                  {getDiscountLabel(details.priceModifier)}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              {paymentOption === 'prepaid' 
                ? 'Prepaid option offers a discount on the standard rate'
                : 'Standard monthly billing with no long-term commitment'}
            </p>
          </div>
          
          {/* Custom Service Parameters - Using serviceParams variable to reference it */}
          <div>
            <label className="block text-[var(--elexive-primary)] font-medium mb-2">
              <FontAwesomeIcon icon={faGears} className="mr-2" />
              Additional Parameters
            </label>
            <div className="space-y-3">
              {serviceParams.map((param) => (
                <div key={param.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[var(--elexive-primary)]">{param.label}</span>
                    <p className="text-xs text-gray-500">{param.description}</p>
                  </div>
                  <button
                    onClick={() => updateParameter(param.id, !parameters[param.id])}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 border min-w-[120px] w-[120px] flex items-center justify-center ${
                      parameters[param.id]
                        ? 'bg-[var(--elexive-accent)] text-[var(--elexive-primary)] shadow-sm border-[var(--elexive-accent)]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-[var(--elexive-accent-light)]'
                    }`}
                  >
                    {parameters[param.id] ? (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        <span>Enabled</span>
                      </>
                    ) : <span>Disabled</span>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Final Pricing Summary
  const renderPricingSummary = () => {
    // Get selected modules with their EVC ranges for display
    const selectedModuleDetails = modules
      .filter(module => selectedModules.includes(module.name))
      .map(module => ({
        name: module.name,
        evcRange: {
          min: module.variants[0].evcValue,
          max: module.variants[1] ? module.variants[1].evcValue : module.variants[0].evcValue
        }
      }));
      
    // Get payment option details
    const paymentDetails = evcBase.paymentOptions[paymentOption];
    
    return (
      <>
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-4">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--elexive-accent)] mr-2" />
          Your Custom Solution
        </h2>
        
        <div className="mb-6">
          <div className="flex justify-between text-lg mb-2">
            <span className="font-medium">Weekly Price:</span>
            <span className="font-bold text-[var(--elexive-primary)]">€{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span><FontAwesomeIcon icon={faChartBar} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Weekly EVCs:</span>
            <span>{monthlyEvcs} EVCs</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span><FontAwesomeIcon icon={faCoins} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Price per EVC:</span>
            <span>€{evcPricePerUnit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span><FontAwesomeIcon icon={faCreditCard} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Payment Option:</span>
            <span>{paymentDetails.name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span><FontAwesomeIcon icon={faRocket} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Delivery Speed:</span>
            <span>{deliverySpeed}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span><FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-secondary)] opacity-80 mr-1" />Core Intent:</span>
            <span>{intent}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-[var(--elexive-primary)]">
            <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2" />
            Selected Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedModuleDetails.map((module) => (
              <div key={module.name} className="text-sm bg-[#FFF6E8] p-3 rounded border border-[var(--elexive-accent)] border-opacity-20">
                <div className="font-medium text-[var(--elexive-primary)]">{module.name}</div>
                <div className="text-xs text-gray-600 mt-1">EVC Range: {module.evcRange.min}-{module.evcRange.max}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-[#ECE9F3] p-3 rounded-lg">
            <h4 className="text-sm font-medium text-[var(--elexive-primary)]">
              <FontAwesomeIcon icon={faCalculator} className="mr-1" />
              EVC Calculation
            </h4>
            <div className="text-xs text-gray-600 mt-1">
              <p>Base EVC from modules: {selectedModuleDetails.reduce((sum, module) => sum + (module.evcRange.min + module.evcRange.max)/2, 0).toFixed(1)} EVCs</p>
              <p>Resource allocation ({calculatorConfig.resourceAllocation[resourceAllocation].description}): {calculatorConfig.resourceAllocation[resourceAllocation].outputMultiplier}x</p>
              {Object.entries(parameters)
                .filter(([, enabled]) => enabled)
                .map(([paramId]) => {
                  const param = calculatorConfig.serviceParameters.find(p => p.id === paramId);
                  return (
                    <p key={paramId}>
                      {param.label} modifier: {param.modifier}x
                    </p>
                  );
                })
              }
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-[var(--elexive-primary)]">
            <FontAwesomeIcon icon={faSlidersH} className="text-[var(--elexive-accent)] mr-2" />
            Custom Parameters
          </h3>
          <div className="space-y-1 text-sm">
            {calculatorConfig.serviceParameters
              .filter(param => parameters[param.id])
              .map(param => (
                <div key={param.id} className="flex">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[var(--elexive-accent)] mr-2" />
                  <span className="text-[var(--elexive-primary)]">{param.label}</span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-[#FFF6E8] p-4 rounded-xl mb-8 border border-[var(--elexive-accent)] border-opacity-20">
          <p className="text-sm font-medium text-[var(--elexive-primary)]">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-[var(--elexive-accent)] mr-2" />
            Price Breakdown
          </p>
          <p className="text-xs text-[var(--elexive-primary)] opacity-80 mt-1">
            Base price: €{evcBase.basePrice}/EVC × 
            {paymentDetails.priceModifier !== 1 
              ? ` ${paymentDetails.priceModifier} (${paymentDetails.name}) = €${(evcBase.basePrice * paymentDetails.priceModifier).toFixed(2)}/EVC`
              : ` 1.0 (Standard rate) = €${evcBase.basePrice}/EVC`
          }
          </p>
          {monthlyEvcs > 30 && (
            <p className="text-xs text-[var(--elexive-primary)] opacity-80">
              Volume discount: €{evcPricePerUnit.toFixed(2)}/EVC × {monthlyEvcs} EVCs = €{totalPrice.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-[var(--elexive-primary)] opacity-80 mt-2">
            This is a non-binding estimate based on your selections. Contact us for a detailed proposal.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
            className="px-6 py-3 bg-[var(--elexive-secondary)] text-white rounded-lg font-medium hover:bg-[var(--elexive-secondary)] hover:opacity-90 transition-colors shadow-md"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Request Detailed Proposal
          </button>
        </div>
      </div>
      </>
    );
  };
  
  // EVC Explainer Component with collapsible functionality
  const renderEvcExplainer = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 
        className="text-2xl font-bold text-[var(--elexive-primary)] mb-2 flex items-center justify-between cursor-pointer"
        onClick={toggleEvcExplainer}
      >
        <div>
          <FontAwesomeIcon icon={faCalculator} className="text-[var(--elexive-accent)] mr-2" />
          Understanding Elastic Value Credits (EVCs)
        </div>
        <FontAwesomeIcon 
          icon={isEvcExplainerVisible ? faMinus : faPlus} 
          className="text-[var(--elexive-accent)]" 
        />
      </h2>
      
      {isEvcExplainerVisible && (
        <>
          <p className="text-gray-600 mb-4">
            EVCs represent our producer-consumer model where production resources are converted into 
            strategic output value for your business.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Production Resources</h3>
              <p className="text-sm text-gray-600">
                Advisory services, AI tools, and specialized data resources that generate your weekly EVC capacity.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Output Value</h3>
              <p className="text-sm text-gray-600">
                Strategic module implementations and deliverables that consume your EVC production capacity.
              </p>
            </div>
          </div>
          
          <div className="bg-[#ECE9F3] p-4 rounded-lg mb-4">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-2">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              The EVC Value Exchange
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-center p-3">
                <div className="text-sm mb-1 font-medium text-[var(--elexive-primary)]">Production Resources</div>
                <div className="text-xs text-gray-600 mb-2">Weekly Commitment</div>
                <div className="text-2xl font-bold text-[var(--elexive-accent)]">{weeklyProductionCapacity} EVCs</div>
              </div>
              
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xl mb-1" />
                <div className="text-xs text-gray-500">Converts to</div>
              </div>
              
              <div className="text-center p-3">
                <div className="text-sm mb-1 font-medium text-[var(--elexive-primary)]">Output Value</div>
                <div className="text-xs text-gray-600 mb-2">Monthly Deliverables</div>
                <div className="text-2xl font-bold text-[var(--elexive-secondary)]">{monthlyOutputValue} EVCs</div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-2">How Resource Allocation Works</h3>
            <p className="text-sm text-gray-700">
              Your resource allocation strategy determines how efficiently your EVC production capacity 
              is converted into output value:
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Focused (1.0x):</span>
                  <span className="text-gray-600"> Concentrated effort on fewer priorities yields 1-to-1 output.</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faProjectDiagram} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Balanced (1.5x):</span>
                  <span className="text-gray-600"> More parallel work increases total output through resource synergies.</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faTasks} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Distributed (2.25x):</span>
                  <span className="text-gray-600"> Maximum output across multiple initiatives through scale efficiencies.</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-4">
              <FontAwesomeIcon icon={faGears} className="text-[var(--elexive-accent)] mr-2" />
              EVC Production Resources
            </h3>
            <p className="text-gray-600 mb-4">
              These resources work together to produce your weekly EVC capacity
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {calculatorConfig.evcProducers.map((producer) => (
                <div key={producer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon 
                      icon={
                        producer.id === "advisorHours" ? faUsers :
                        producer.id === "aiTools" ? faRobot :
                        faDatabase
                      } 
                      className="text-[var(--elexive-primary)] mr-2" 
                    />
                    <h3 className="font-semibold">{producer.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{producer.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Default Allocation:</span>
                    <span className="font-medium">{Math.round(producer.defaultAllocation * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">Production Value:</span>
                    <span className="font-medium">{producer.productionValue}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  // Desktop summary sidebar with improved UX and typography - no gradients, single accent colors
  const renderSummarySidebar = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-4">
      <h3 className="font-bold text-xl mb-5 text-[var(--elexive-primary)]">Your Configuration</h3>
      
      <div className="space-y-4">
        {/* Intent */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Core Intent
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{intent || "Not selected"}</p>
        </div>
        
        {/* Selected Modules */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Selected Modules
          </h4>
          {selectedModules.length > 0 ? (
            <>
              <p className="font-medium text-base text-[var(--elexive-primary)] mb-2.5">{selectedModules.length} modules</p>
              <div className="space-y-1.5">
                {selectedModules.map(moduleName => {
                  const moduleConfig = modules.find(m => m.name === moduleName);
                  const evcMin = moduleConfig?.variants[0]?.evcValue || 0;
                  const evcMax = moduleConfig?.variants[1]?.evcValue || evcMin;
                  return (
                    <div key={moduleName} className="flex justify-between items-center bg-[var(--elexive-accent-light)] bg-opacity-20 py-1.5 px-2.5 rounded">
                      <span className="text-[var(--elexive-primary)] text-xs font-medium">{moduleName}</span>
                      <span className="text-[var(--elexive-primary)] text-[10px] bg-white px-1.5 py-0.5 rounded-full font-medium">
                        {evcMin}-{evcMax} EVCs
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--elexive-primary)] italic">None selected</p>
          )}
        </div>
        
        {/* Weekly EVC Amount */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Weekly EVC Amount
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{monthlyEvcs} EVCs</p>
        </div>
        
        {/* Resource Allocation */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Resource Allocation
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{calculatorConfig.resourceAllocation[resourceAllocation].description}</p>
          <span className="inline-block mt-1.5 text-[10px] bg-[var(--elexive-accent-light)] bg-opacity-50 text-[var(--elexive-primary)] px-2 py-0.5 rounded-full font-medium">
            {calculatorConfig.resourceAllocation[resourceAllocation].label}
          </span>
        </div>
        
        {/* EVC Production & Output */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faExchangeAlt} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            EVC Production & Output
          </h4>
          <div className="flex justify-between items-center mt-1 bg-[var(--elexive-accent-light)] bg-opacity-30 p-2.5 rounded">
            <div className="text-center px-1">
              <p className="font-bold text-lg text-[var(--elexive-primary)]">{weeklyProductionCapacity}</p>
              <p className="text-[10px] text-[var(--elexive-primary)] mt-0.5 font-medium">Weekly production</p>
            </div>
            <div className="flex items-center px-1">
              <FontAwesomeIcon icon={faArrowRight} className="text-[var(--elexive-accent)]" />
            </div>
            <div className="text-center px-1">
              <p className="font-bold text-lg text-[var(--elexive-primary)]">{monthlyOutputValue}</p>
              <p className="text-[10px] text-[var(--elexive-primary)] mt-0.5 font-medium">Monthly output</p>
            </div>
          </div>
        </div>
        
        {/* EVC Tier */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faCoins} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            EVC Tier
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{selectedEvcTier}</p>
          <p className="text-[11px] text-[var(--elexive-primary)] mt-1 font-medium">
            {evcTiers.find(tier => tier.name === selectedEvcTier)?.description || "Standard tier"}
          </p>
        </div>
        
        {/* Payment Option */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3.5 shadow-sm">
          <h4 className="text-[13px] uppercase tracking-wide font-medium text-[var(--elexive-primary)] mb-2 flex items-center">
            <FontAwesomeIcon icon={faCreditCard} className="text-[var(--elexive-accent)] mr-2 text-xs" />
            Payment Method
          </h4>
          <p className="font-medium text-base text-[var(--elexive-primary)]">{evcBase.paymentOptions[paymentOption].name}</p>
          <span className="text-[11px] bg-[var(--elexive-accent-light)] bg-opacity-30 px-2 py-0.5 rounded-full inline-block mt-1.5 font-medium text-[var(--elexive-primary)]">
            {paymentOption === 'prepaid' 
              ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% discount`
              : 'Standard monthly billing'}
          </span>
        </div>
        
        {/* Pricing Summary - Enhanced design with single colors */}
        <div className="mt-5">
          <div className="bg-[var(--elexive-primary)] p-0.5 rounded-xl">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="text-center font-semibold text-base text-[var(--elexive-primary)] mb-3">Pricing Summary</h4>
              
              <div className="bg-[var(--elexive-accent-light)] bg-opacity-50 p-3.5 rounded-lg mb-3.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-[var(--elexive-primary)] font-medium">Weekly Price:</span>
                  <span className="font-bold text-xl text-[var(--elexive-primary)]">€{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[var(--elexive-primary)] font-medium">
                  <span>Price per EVC:</span>
                  <span className="font-medium">€{evcPricePerUnit.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
                className="w-full py-2.5 bg-[var(--elexive-accent)] text-[var(--elexive-primary)] rounded-lg font-medium hover:opacity-90 transition-opacity text-sm shadow-sm"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Request Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Onboarding Quiz, Module Selector, and all other components */}
        <div className="lg:col-span-2">
          {renderOnboardingQuiz()}
          {renderEvcExplainer()}
          {renderModuleSelector()}
          {renderResourceAllocationSelector()}
          {renderServiceParameters()}
          {renderPricingSummary()}
        </div>
        
        {/* Right Column - Summary Sidebar */}
        <div className="lg:block">
          {renderSummarySidebar()}
        </div>
      </div>
      
      {/* Mobile View - Request Proposal Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--elexive-secondary)] text-white rounded-full px-6 py-3 font-medium shadow-md hover:opacity-90 transition-opacity lg:hidden">
        <button
          onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
          className="flex items-center"
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Request Detailed Proposal
        </button>
      </div>
    </div>
  );
};

export default CalculatorApp;