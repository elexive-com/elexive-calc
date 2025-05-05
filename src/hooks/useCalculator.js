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
  // Track the recommended capacity for the current preset
  const [recommendedCapacity, setRecommendedCapacity] = useState(null);
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
  const [volumeDiscountPercentage, setVolumeDiscountPercentage] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(
    calculatorConfig.resourceAllocation[defaults.resourceAllocation].description
  );
  // New state for completion time estimate
  const [completionTimeWeeks, setCompletionTimeWeeks] = useState(0);
  const [totalModuleEvcs, setTotalModuleEvcs] = useState(0);
  
  // State for active pillar tab
  const [activePillar, setActivePillar] = useState("Transformation");
  
  // Function to toggle EVC explainer visibility
  const toggleEvcExplainer = () => {
    setIsEvcExplainerVisible(prev => !prev);
  };
  
  // Function to reset calculator to defaults
  const resetCalculator = () => {
    // First clear intent to ensure proper reset
    setIntent('');
    
    // Reset all other state
    setSelectedModules([]);
    setSelectedVariants({});
    setResourceAllocation("focused"); // Default to "Focused" allocation
    setProductionCapacity("pathfinder"); // Default to "Pathfinder" capacity
    setRecommendedCapacity(null); // Clear any recommended capacity
    setPaymentOption(defaults.paymentOption);
    
    // Reset parameters to defaults
    const resetParams = {};
    serviceParameters.forEach(param => {
      resetParams[param.id] = param.defaultValue;
    });
    setParameters(resetParams);
    
    // Reset active pillar
    setActivePillar("Transformation");
    
    // Force a recalculation to update all values
    calculatePricing();
  };
  
  // Custom function to handle intent selection and apply presets
  const handleIntentSelect = (intentName) => {
    // If "Full Custom" is selected, reset the calculator first, then set intent
    if (intentName === "Full Custom") {
      resetCalculator(); // This already clears the intent
      setIntent("Full Custom"); // Set it back to "Full Custom" after reset
      return; // Exit early
    }
    
    // For other intents, set the intent first
    setIntent(intentName);
    
    // Apply preset if this is a preset intent
    if (intentName && calculatorPresets.presets[intentName]) {
      console.log("Applying preset for:", intentName);
      const preset = calculatorPresets.presets[intentName];
      
      // Clear any existing selections first
      setSelectedModules([]);
      setSelectedVariants({});
      
      // Apply the preset modules immediately
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
        setRecommendedCapacity(preset.recommendedCapacity);
      } else {
        setRecommendedCapacity(null);
      }
      
      // Force a recalculation to update all values
      calculatePricing();
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

    // Handle parameters with evcCost
    Object.entries(parameters).forEach(([paramId, isEnabled]) => {
      if (isEnabled) {
        const paramConfig = serviceParameters.find(p => p.id === paramId);
        if (paramConfig?.evcCost) {
          if (paramConfig.evcCost.type === "absolute") {
            // For absolute costs, simply add the fixed value
            adjustedProductionCapacity += paramConfig.evcCost.value;
          } else if (paramConfig.evcCost.type === "relative") {
            // For relative costs, add the percentage of the BASE weekly EVCs
            // This is crucial - we use weeklyEVCs (base capacity) not the adjusted value
            const relativeAddition = weeklyEVCs * (paramConfig.evcCost.value / 100);
            adjustedProductionCapacity += relativeAddition;
          }
        }
      }
    });

    // Round production capacity
    adjustedProductionCapacity = Math.ceil(adjustedProductionCapacity);
    
    // Calculate output value based on resource allocation strategy
    // Using a switch statement to determine the multiplier based on resource allocation
    let outputMultiplier;
    switch (resourceAllocation) {
      case 'focused':
        // Focused has no overhead
        outputMultiplier = 1.0;
        break;
      case 'balanced':
        // Balanced has overhead defined in calculatorConfig.json
        outputMultiplier = 1.0 + (allocation.switchingOverhead / 100);
        break;
      case 'distributed':
      default:
        // Distributed has overhead defined in calculatorConfig.json
        outputMultiplier = 1.0 + (allocation.switchingOverhead / 100);
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
    
    // Modified volume discount calculation - apply discount tiers with compounding effect
    // First, calculate the total price without any volume discounts
    let totalPriceWithoutDiscount = adjustedProductionCapacity * pricePerEvc;
    
    // Sort volume discounts by threshold in ascending order to process smaller thresholds first
    const sortedDiscounts = [...evcBase.volumeDiscounts].sort((a, b) => a.threshold - b.threshold);
    
    // Keep track of tiers and their applied discount multipliers
    const tiers = [];
    
    // Build the tier structure
    for (let i = 0; i < sortedDiscounts.length; i++) {
      const { threshold, discount } = sortedDiscounts[i];
      if (adjustedProductionCapacity > threshold) {
        // Calculate EVCs in this tier
        const evcsInThisTier = (i === sortedDiscounts.length - 1)
          ? adjustedProductionCapacity - threshold // For the highest threshold, all remaining EVCs
          : Math.min(sortedDiscounts[i+1].threshold, adjustedProductionCapacity) - threshold;
        
        // Store tier info
        tiers.push({
          evcs: evcsInThisTier,
          discount: discount,
          threshold: threshold
        });
      }
    }
    
    // Add first tier (no discount) if there are EVCs below the first threshold
    if (sortedDiscounts.length > 0 && sortedDiscounts[0].threshold > 0 && adjustedProductionCapacity > 0) {
      const evcsInFirstTier = Math.min(adjustedProductionCapacity, sortedDiscounts[0].threshold);
      if (evcsInFirstTier > 0) {
        tiers.unshift({
          evcs: evcsInFirstTier,
          discount: 1.0, // No discount
          threshold: 0
        });
      }
    }
    
    // Calculate price with all applicable tiers
    let discountedPrice = 0;
    for (const tier of tiers) {
      discountedPrice += tier.evcs * pricePerEvc * tier.discount;
    }
    
    // If no tiers were applied (no EVCs or no thresholds crossed), use base price
    if (tiers.length === 0) {
      discountedPrice = totalPriceWithoutDiscount;
    }
    
    // Calculate the total volume discount percentage
    const volumeDiscount = (totalPriceWithoutDiscount - discountedPrice) / totalPriceWithoutDiscount * 100;
    setVolumeDiscountPercentage(volumeDiscount);
    
    // Apply payment option modifier to the entire amount
    const paymentModifier = evcBase.paymentOptions[paymentOption].priceModifier;
    discountedPrice *= paymentModifier;
    
    // Calculate effective price per EVC for display
    const effectiveEvcPrice = adjustedProductionCapacity > 0 
      ? discountedPrice / adjustedProductionCapacity 
      : pricePerEvc * paymentModifier;
    
    // Set final values
    setMonthlyEvcs(adjustedProductionCapacity);
    setEvcPricePerUnit(effectiveEvcPrice);
    setTotalPrice(Math.round(discountedPrice));
  }, [selectedModules, resourceAllocation, productionCapacity, parameters, paymentOption, modules, selectedVariants, serviceParameters]);
  
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
    volumeDiscountPercentage,
    deliverySpeed,
    activePillar,
    completionTimeWeeks,
    totalModuleEvcs,
    recommendedCapacity,
    
    // Config
    defaults,
    evcBase,
    serviceParameters,
    modules,
    
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