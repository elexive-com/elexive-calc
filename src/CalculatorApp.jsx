import React, { useState, useEffect } from 'react';
import calculatorConfig from './config/calculatorConfig.json';
import calculatorPresets from './config/calculatorPresets.json';
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
  faCalculator, faEnvelope, faExchangeAlt, faFileAlt,
  faLayerGroup, faTasks, faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

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
  const [capacityAllocation, setCapacityAllocation] = useState(calculatorConfig.defaults.capacityAllocation);
  const [paymentOption, setPaymentOption] = useState(calculatorConfig.defaults.paymentOption);
  // Add state for EVC explainer collapse
  const [isEvcExplainerVisible, setIsEvcExplainerVisible] = useState(false);
  
  // Get defaults from config
  const { defaults, evcBase, serviceParameters } = calculatorConfig;
  
  // Initialize parameters from config
  const [parameters, setParameters] = useState(() => {
    const initialParameters = {};
    serviceParameters.forEach(param => {
      initialParameters[param.id] = param.defaultValue;
    });
    return initialParameters;
  });
  
  // Function to reset calculator to defaults
  const resetCalculator = () => {
    setIntent('');
    setSelectedModules([]);
    setCapacityAllocation("focused"); // Default to "Focused" allocation
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
    calculatorConfig.capacityAllocation[defaults.capacityAllocation].description
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
        setCapacityAllocation(preset.capacityAllocation);
        
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
    const { capacityAllocation: allocations, evcBase, modules } = calculatorConfig;
    
    // Calculate total EVCs needed based on selected modules
    let baseModuleEvcs = 0;
    if (selectedModules.length > 0) {
      // Find the selected modules and sum their EVC ranges
      const selectedModuleConfigs = modules.filter(module => 
        selectedModules.includes(module.name)
      );
      
      // Use average of min/max EVC values for each module
      baseModuleEvcs = selectedModuleConfigs.reduce((total, module) => {
        return total + ((module.evcRange.min + module.evcRange.max) / 2);
      }, 0);
    } else {
      // If no modules selected, use a minimum value of 1 EVC
      baseModuleEvcs = 1; // Minimum baseline of 1 EVC
    }
    
    // Apply capacity allocation modifier 
    const allocationMultiplier = allocations[capacityAllocation].speedModifier;
    let adjustedEvcs = baseModuleEvcs * allocationMultiplier;
    
    // Apply parameter modifiers
    Object.entries(parameters).forEach(([paramId, isEnabled]) => {
      if (isEnabled) {
        adjustedEvcs *= parameterModifiers[paramId];
      }
    });
    
    // Round to avoid weird fractional EVCs
    adjustedEvcs = Math.ceil(adjustedEvcs);
    
    // Set allocation descriptor
    setDeliverySpeed(allocations[capacityAllocation].description);
    
    // Apply volume discount based on config
    let pricePerEvc = evcBase.basePrice;
    evcBase.volumeDiscounts.forEach(({ threshold, discount }) => {
      if (adjustedEvcs > threshold) {
        pricePerEvc *= discount;
      }
    });
    
    // Apply payment option modifier
    const paymentModifier = evcBase.paymentOptions[paymentOption].priceModifier;
    pricePerEvc *= paymentModifier;
    
    // Set final values
    setMonthlyEvcs(adjustedEvcs);
    setEvcPricePerUnit(pricePerEvc);
    setTotalPrice(Math.round(adjustedEvcs * pricePerEvc));
  }, [selectedModules, capacityAllocation, parameters, paymentOption, parameterModifiers]);
  
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
          className="px-4 py-2 text-sm bg-[var(--elexive-accent-light)] hover:bg-[var(--elexive-accent)] text-[var(--elexive-primary)] font-medium rounded-lg transition-colors flex items-center"
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
      Transformation: calculatorConfig.modules.filter(module => module.pillar === "Transformation"),
      Strategy: calculatorConfig.modules.filter(module => module.pillar === "Strategy"),
      Technology: calculatorConfig.modules.filter(module => module.pillar === "Technology")
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
                  pillar === "Leadership" ? faUsers : 
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
        {Object.entries(modulesByPillar).map(([pillar, modules]) => (
          <div key={pillar} className={`${activePillar === pillar ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
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
                          EVC Range: {module.evcRange.min}-{module.evcRange.max}
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
  
  // Capacity Allocation selector
  const renderCapacityAllocationSelector = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-[var(--elexive-primary)] mb-2">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--elexive-accent)] mr-2" />
        Weekly Capacity Allocation
      </h2>
      <p className="text-gray-600 mb-6">
        Select how you'd like to allocate your weekly EVC capacity across your strategic initiatives. 
        Your allocation strategy can be adjusted as your priorities evolve.
      </p>
      
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(calculatorConfig.capacityAllocation).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setCapacityAllocation(key)}
              className={`p-5 rounded-xl transition-all duration-200 ${
                capacityAllocation === key
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
                <div className="text-xs text-[var(--elexive-primary)] font-medium mt-3">
                  Resource modifier: {details.speedModifier}x
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
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    paymentOption === option
                      ? 'bg-[var(--elexive-accent)] text-[var(--elexive-primary)] shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {details.name}
                  {details.priceModifier !== 1 && (
                    <span className="ml-1 text-xs">
                      ({(1 - details.priceModifier) * 100}% off)
                    </span>
                  )}
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
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      parameters[param.id]
                        ? 'bg-[var(--elexive-accent)] text-[var(--elexive-primary)] shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {parameters[param.id] ? (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Enabled
                      </>
                    ) : 'Disabled'}
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
    const selectedModuleDetails = calculatorConfig.modules
      .filter(module => selectedModules.includes(module.name))
      .map(module => ({
        name: module.name,
        evcRange: module.evcRange
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
              <p>Allocation modifier ({calculatorConfig.capacityAllocation[capacityAllocation].description}): {calculatorConfig.capacityAllocation[capacityAllocation].speedModifier}x</p>
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
  
  // Function to toggle EVC explainer visibility
  const toggleEvcExplainer = () => {
    setIsEvcExplainerVisible(!isEvcExplainerVisible);
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
            EVCs are Elexive's flexible service units that allow you to dynamically allocate expert resources 
            across different strategic initiatives as your priorities shift.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faExchangeAlt} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Flexibility</h3>
              <p className="text-sm text-gray-600">
                Shift resources between modules as your priorities change, without renegotiating contracts.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Expert Access</h3>
              <p className="text-sm text-gray-600">
                Each EVC represents access to our specialized consultants, tailored to your specific needs.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faChartLine} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Measurable Value</h3>
              <p className="text-sm text-gray-600">
                Track output and outcomes with clear metrics tied to each EVC investment.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-[#FFF6E8] rounded-lg border border-[var(--elexive-accent)] border-opacity-20">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-2">How We Calculate EVCs</h3>
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 mr-4">
                <img src="/evc-calculator.svg" alt="EVC Calculator" className="w-full h-full" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Each service module has a recommended EVC range based on typical client needs. 
                  Your final EVC allocation is adjusted based on your selected delivery intensity and 
                  additional service parameters.
                </p>
                <p className="text-sm font-medium text-[var(--elexive-primary)] mt-2">
                  <strong>1 EVC ≈ 0.5 consultant days</strong>, with value delivered at approximately 
                  <strong> 1.8x traditional consulting</strong> due to our specialized expertise and methodology.
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => window.open('/evc-whitepaper.pdf', '_blank')}
            className="mt-4 text-[var(--elexive-primary)] font-medium hover:underline flex items-center"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Download our detailed EVC guide
          </button>
        </>
      )}
    </div>
  );
  
  // Desktop summary sidebar
  const renderSummarySidebar = () => (
    <div className="bg-white p-5 rounded-2xl shadow-lg h-fit sticky top-4">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Your Configuration</h3>
      
      <div className="space-y-4">
        {/* Intent */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Core Intent</h4>
          <p className="font-medium">{intent || "Not selected"}</p>
        </div>
        
        {/* Selected Modules */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Modules</h4>
          {selectedModules.length > 0 ? (
            <>
              <p className="font-medium">{selectedModules.length} modules</p>
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                {selectedModules.map(module => {
                  const moduleConfig = calculatorConfig.modules.find(m => m.name === module);
                  return (
                    <div key={module} className="flex justify-between">
                      <span>{module}</span>
                      <span className="text-gray-500">{moduleConfig.evcRange.min}-{moduleConfig.evcRange.max} EVCs</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500">None selected</p>
          )}
        </div>
        
        {/* Weekly EVC Amount */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Weekly EVC Amount</h4>
          <p className="font-medium">{monthlyEvcs} EVCs</p>
        </div>
        
        {/* Capacity Allocation */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Capacity Allocation</h4>
          <p className="font-medium">{calculatorConfig.capacityAllocation[capacityAllocation].description}</p>
          <p className="text-xs text-gray-600">{calculatorConfig.capacityAllocation[capacityAllocation].label}</p>
        </div>
        
        {/* Payment Option */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
          <p className="font-medium">{evcBase.paymentOptions[paymentOption].name}</p>
          <p className="text-xs text-gray-600">
            {paymentOption === 'prepaid' 
              ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% discount` 
              : 'Standard rate'}
          </p>
        </div>
        
        {/* Parameters */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Custom Parameters</h4>
          {Object.entries(parameters).filter(([, value]) => value).length > 0 ? (
            <div className="text-xs space-y-1 mt-1">
              {calculatorConfig.serviceParameters
                .filter(param => parameters[param.id])
                .map(param => (
                  <div key={param.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>{param.label}</span>
                    </div>
                    <span className="text-gray-500">{param.modifier}x</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">None selected</p>
          )}
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Weekly Price</span>
            <span className="font-bold text-blue-600">€{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Adjusted EVCs</span>
            <span>{monthlyEvcs} EVCs</span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Price per EVC</span>
            <span>€{evcPricePerUnit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Main render function with all elements visible at once
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content area - adjusted to account for wider sidebar */}
        <div className="flex-grow space-y-6 md:max-w-[calc(100%-26rem)]">
          {renderOnboardingQuiz()}
          {renderEvcExplainer()}
          {renderModuleSelector()}
          {renderCapacityAllocationSelector()}
          {renderServiceParameters()}
          {renderPricingSummary()}
        </div>
        
        {/* Sticky sidebar - make it significantly wider */}
        <div className="md:w-96 md:min-w-[24rem] hidden md:block">
          {renderSummarySidebar()}
        </div>
      </div>
      
      {/* Mobile summary bar - always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl border-t p-4 md:hidden z-10">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Estimated Monthly</span>
            <div className="font-bold text-xl">€{totalPrice.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              {evcBase.paymentOptions[paymentOption].name}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">{monthlyEvcs} EVCs</span>
            <div className="text-sm text-gray-700">{deliverySpeed} delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;