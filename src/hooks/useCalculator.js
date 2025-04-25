import { useState, useCallback, useEffect } from 'react';
import calculatorConfig from '../config/calculatorConfig.json';
import calculatorPresets from '../config/calculatorPresets.json';
import modulesConfig from '../config/modulesConfig.json';

export default function useCalculator() {
  // State for user selections
  const [intent, setIntent] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [resourceAllocation, setResourceAllocation] = useState(calculatorConfig.defaults.resourceAllocation);
  const [paymentOption, setPaymentOption] = useState(calculatorConfig.defaults.paymentOption);
  const [isEvcExplainerVisible, setIsEvcExplainerVisible] = useState(false);
  
  // Get defaults from config
  const { defaults, evcBase, serviceParameters } = calculatorConfig;
  
  // Get module definitions from modulesConfig
  const { modules } = modulesConfig;
  
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
  const [totalPrice, setTotalPrice] = useState(0);
  const [monthlyEvcs, setMonthlyEvcs] = useState(0);
  const [evcPricePerUnit, setEvcPricePerUnit] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(
    calculatorConfig.resourceAllocation[defaults.resourceAllocation].description
  );
  
  // State for active pillar tab
  const [activePillar, setActivePillar] = useState("Transformation");
  
  // Create parameter modifiers map for easy lookup
  const parameterModifiers = serviceParameters.reduce((acc, param) => {
    acc[param.id] = param.modifier;
    return acc;
  }, {});

  // Function to toggle EVC explainer visibility
  const toggleEvcExplainer = () => {
    setIsEvcExplainerVisible(prev => !prev);
  };
  
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
  
  // Function to toggle payment option
  const togglePaymentOption = (option) => {
    if (option !== paymentOption) {
      setPaymentOption(option);
      // Recalculate pricing when payment option changes
      calculatePricing();
    }
  };
  
  // Function to update parameters
  const updateParameter = (paramId, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [paramId]: value
    }));
  };
  
  // Toggle modules selection
  const toggleModule = (module) => {
    setSelectedModules(
      selectedModules.includes(module)
        ? selectedModules.filter(m => m !== module)
        : [...selectedModules, module]
    );
  };
  
  // Calculate pricing whenever selections change
  const calculatePricing = useCallback(() => {
    const { resourceAllocation: allocations, evcBase } = calculatorConfig;
    
    // Calculate total EVCs needed based on selected modules (consumer side)
    let baseModuleEvcs = 0;
    if (selectedModules.length > 0) {
      // Find the selected modules and sum their EVC values based on the selected variant
      const selectedModuleConfigs = modules.filter(module => 
        selectedModules.includes(module.name)
      );
      
      // Instead of average, use specific variant EVC value based on user selection
      baseModuleEvcs = selectedModuleConfigs.reduce((total, module) => {
        // Default to first variant (Insight Primer) if no specific selection
        let variantType = selectedVariants[module.name];
        
        // If no variant is selected yet, default to insightPrimer
        if (!variantType) {
          variantType = 'insightPrimer';
        }
        
        // Find the corresponding EVC value based on the variant type
        const variantIndex = variantType === 'insightPrimer' ? 0 : 1;
        const evcValue = module.variants[variantIndex]?.evcValue || module.variants[0].evcValue;
        
        return total + evcValue;
      }, 0);
    } else {
      // If no modules selected, use a minimum value of 1 EVC
      baseModuleEvcs = 1;
    }
    
    // Store the consumer-side raw EVCs
    const rawConsumerEVCs = baseModuleEvcs;
    
    // Get resource allocation strategy
    const allocation = allocations[resourceAllocation];
    
    // Set production capacity (producer side)
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
    
    // Calculate base price per EVC
    let pricePerEvc = evcBase.basePrice;
    
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
  }, [selectedModules, resourceAllocation, parameters, paymentOption, parameterModifiers, modules, selectedVariants]);
  
  // Use the memoized callback in useEffect
  useEffect(() => {
    calculatePricing();
  }, [calculatePricing]);

  return {
    // State
    intent,
    selectedModules,
    selectedVariants,
    setSelectedVariants,
    resourceAllocation,
    paymentOption,
    isEvcExplainerVisible,
    parameters,
    weeklyProductionCapacity,
    monthlyOutputValue,
    totalPrice,
    monthlyEvcs,
    evcPricePerUnit,
    deliverySpeed,
    activePillar,
    
    // Config
    defaults,
    evcBase,
    serviceParameters,
    modules,
    parameterModifiers,
    
    // Functions
    toggleEvcExplainer,
    resetCalculator,
    handleIntentSelect,
    togglePaymentOption,
    updateParameter,
    toggleModule,
    setActivePillar,
    setResourceAllocation,
    calculatePricing
  };
}