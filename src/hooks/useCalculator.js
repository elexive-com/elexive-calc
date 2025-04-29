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
  // Initial state for production capacity - changed from 'seedling' to 'roadster'
  const [productionCapacity, setProductionCapacity] = useState('roadster');
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
  // New state for completion time estimate
  const [completionTimeWeeks, setCompletionTimeWeeks] = useState(0);
  const [totalModuleEvcs, setTotalModuleEvcs] = useState(0);
  
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
    setSelectedVariants({});
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
      setSelectedVariants({});
      
      // Apply the preset modules with a slight delay to ensure UI updates
      setTimeout(() => {
        console.log("Setting modules to:", preset.modules);
        
        // Handle both old format (array of strings) and new format (array of objects)
        if (preset.modules && preset.modules.length > 0) {
          // Check if we're using the new format (objects with name and variant)
          if (typeof preset.modules[0] === 'object' && preset.modules[0].name) {
            // New format with objects
            const moduleNames = preset.modules.map(module => module.name);
            setSelectedModules(moduleNames);
            
            // Extract variants from the preset modules
            const newVariants = {};
            preset.modules.forEach(module => {
              // Map preset variant names to the format expected by the UI
              // "Insight Primer" becomes "insightPrimer", "Integrated Execution" becomes "integratedExecution"
              const variantType = module.variant === "Insight Primer" ? 
                'insightPrimer' : 'integratedExecution';
              newVariants[module.name] = variantType;
            });
            setSelectedVariants(newVariants);
          } else {
            // Old format with just strings
            setSelectedModules([...preset.modules]);
            
            // Create default variants for the preset modules (set all to 'insightPrimer' by default)
            const newVariants = {};
            preset.modules.forEach(moduleName => {
              newVariants[moduleName] = 'insightPrimer';
            });
            setSelectedVariants(newVariants);
          }
        }
        
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
        
        // Apply the recommended production capacity if specified
        if (preset.recommendedCapacity) {
          setProductionCapacity(preset.recommendedCapacity);
        }
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
  
  // Set production capacity with validation for resource allocation
  const setProductionCapacityWithValidation = (capacity) => {
    // Update production capacity
    setProductionCapacity(capacity);
    
    // Validate current resource allocation against new capacity
    if (capacity === 'pathfinder' && resourceAllocation !== 'focused') {
      // Pathfinder can only use Laser Beam (focused)
      setResourceAllocation('focused');
    } else if (capacity === 'roadster') {
      // Roadster can only use Laser Beam (focused) - modified to always set to focused
      setResourceAllocation('focused');
    } else if (capacity === 'jetpack' && resourceAllocation === 'distributed') {
      // Jetpack cannot use Omni-Channel (distributed)
      setResourceAllocation('balanced'); // Default to Smart Campaign
    }
    // Rocketship can use any resource allocation, so no changes needed
  };
  
  // Calculate pricing whenever selections change
  const calculatePricing = useCallback(() => {
    const { resourceAllocation: allocations, productionCapacity: capacities, evcBase } = calculatorConfig;
    
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
      // When no modules are selected, set EVCs to 0 (previously was minimum of 1 EVC)
      baseModuleEvcs = 0;
    }
    
    // Store the total module EVCs for completion time calculation
    setTotalModuleEvcs(baseModuleEvcs);
    
    // Get resource allocation strategy
    const allocation = allocations[resourceAllocation];
    
    // Get production capacity tier
    const capacityTier = capacities[productionCapacity];
    const weeklyEVCs = capacityTier.weeklyEVCs;
    
    // Apply service parameter modifiers to production capacity
    let adjustedProductionCapacity = weeklyEVCs;
    Object.entries(parameters).forEach(([paramId, isEnabled]) => {
      if (isEnabled) {
        adjustedProductionCapacity *= parameterModifiers[paramId];
      }
    });
    
    // Round production capacity
    adjustedProductionCapacity = Math.ceil(adjustedProductionCapacity);
    
    // Calculate output value based on resource allocation strategy
    // Using a switch statement to determine the multiplier based on resource allocation
    let outputMultiplier;
    switch (resourceAllocation) {
      case 'focused':
        outputMultiplier = 1.0;
        break;
      case 'balanced':
        outputMultiplier = 1.0;
        break;
      case 'distributed':
      default:
        outputMultiplier = 1.0;
        break;
    }
    
    // Calculate total output (what customer receives)
    const outputValue = Math.ceil(adjustedProductionCapacity * outputMultiplier);
    
    // Calculate estimated completion time in weeks
    if (outputValue === 0) {
      // Prevent division by zero
      setCompletionTimeWeeks(0);
    } else {
      // Calculate using weekly output value, not monthly
      // baseModuleEvcs represents total EVCs needed for all modules
      // outputValue represents weekly output (not monthly)
      const estimatedWeeks = baseModuleEvcs / outputValue;
      // Make sure we always show at least 1 week even for very small projects
      const minimumWeeks = 1;
      setCompletionTimeWeeks(Math.max(minimumWeeks, Math.ceil(estimatedWeeks)));
    }
    
    // Store the values for display
    setWeeklyProductionCapacity(adjustedProductionCapacity);
    setMonthlyOutputValue(outputValue * 4); // 4 weeks output
    
    // Set allocation descriptor
    setDeliverySpeed(allocation.description);
    
    // Calculate base price per EVC
    let pricePerEvc = evcBase.basePrice;
    
    // Apply volume discount based on config
    evcBase.volumeDiscounts.forEach(({ threshold, discount }) => {
      if (adjustedProductionCapacity > threshold) {
        pricePerEvc *= discount;
      }
    });
    
    // Apply payment option modifier
    const paymentModifier = evcBase.paymentOptions[paymentOption].priceModifier;
    pricePerEvc *= paymentModifier;
    
    // Set final values
    setMonthlyEvcs(adjustedProductionCapacity);
    setEvcPricePerUnit(pricePerEvc);
    setTotalPrice(Math.round(adjustedProductionCapacity * pricePerEvc));
  }, [selectedModules, resourceAllocation, productionCapacity, parameters, paymentOption, parameterModifiers, modules, selectedVariants]);
  
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
    productionCapacity,
    setProductionCapacity: setProductionCapacityWithValidation,
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
    completionTimeWeeks,
    totalModuleEvcs,
    
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