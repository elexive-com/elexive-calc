import React, { useState, useEffect } from 'react';
import calculatorConfig from './config/calculatorConfig.json';

const CalculatorApp = () => {
  // State for user selections
  const [intent, setIntent] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [evcTarget, setEvcTarget] = useState(calculatorConfig.defaults.evcTarget);
  const [effortIntensity, setEffortIntensity] = useState(calculatorConfig.defaults.effortIntensity);
  const [paymentOption, setPaymentOption] = useState(calculatorConfig.defaults.paymentOption);
  
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
  
  // Calculated values
  const [totalPrice, setTotalPrice] = useState(0);
  const [monthlyEvcs, setMonthlyEvcs] = useState(0);
  const [evcPricePerUnit, setEvcPricePerUnit] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(
    calculatorConfig.intensityLevels[defaults.effortIntensity].description
  );
  
  // Create module modifiers map for easy lookup
  const moduleEvcModifiers = calculatorConfig.modules.reduce((acc, module) => {
    acc[module.name] = module.modifier;
    return acc;
  }, {});
  
  // Create parameter modifiers map for easy lookup
  const parameterModifiers = serviceParameters.reduce((acc, param) => {
    acc[param.id] = param.modifier;
    return acc;
  }, {});
  
  // Calculate pricing whenever selections change
  useEffect(() => {
    calculatePricing();
  }, [selectedModules, evcTarget, effortIntensity, parameters, paymentOption]);
  
  const calculatePricing = () => {
    const { intensityLevels, evcBase, modules } = calculatorConfig;
    
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
      baseModuleEvcs = evcTarget; // Fallback to slider value if no modules selected
    }
    
    // Apply intensity modifier 
    const intensityMultiplier = intensityLevels[effortIntensity].speedModifier;
    let adjustedEvcs = baseModuleEvcs * intensityMultiplier;
    
    // Apply parameter modifiers
    Object.entries(parameters).forEach(([paramId, isEnabled]) => {
      if (isEnabled) {
        adjustedEvcs *= parameterModifiers[paramId];
      }
    });
    
    // Round to avoid weird fractional EVCs
    adjustedEvcs = Math.ceil(adjustedEvcs);
    
    // Set delivery speed descriptor
    setDeliverySpeed(intensityLevels[effortIntensity].description);
    
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
  };
  
  // Toggle modules selection
  const toggleModule = (module) => {
    setSelectedModules(
      selectedModules.includes(module)
        ? selectedModules.filter(m => m !== module)
        : [...selectedModules, module]
    );
  };
  
  // Toggle parameters
  const toggleParameter = (param) => {
    setParameters({
      ...parameters,
      [param]: !parameters[param]
    });
  };
  
  // Onboarding Quiz
  const renderOnboardingQuiz = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">What's your primary objective?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {calculatorConfig.intents.map((intentOption) => (
          <button
            key={intentOption.name}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              intent === intentOption.name
                ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
            onClick={() => setIntent(intentOption.name)}
          >
            <h3 className="font-bold text-lg mb-2">{intentOption.name}</h3>
            <p className="text-gray-600 text-sm">{intentOption.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
  
  // Strategic Module Selector
  const renderModuleSelector = () => {
    // Group modules by pillar
    const modulesByPillar = {
      Leadership: calculatorConfig.modules.filter(module => module.pillar === "Leadership"),
      Strategy: calculatorConfig.modules.filter(module => module.pillar === "Strategy"),
      Technology: calculatorConfig.modules.filter(module => module.pillar === "Technology")
    };
    
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Service Modules</h2>
        <p className="text-gray-600 mb-4">Choose the components that match your strategic needs</p>
        
        {/* Pillar Tabs */}
        <div className="flex border-b mb-6">
          {Object.keys(modulesByPillar).map((pillar, index) => (
            <button
              key={pillar}
              className={`px-4 py-2 font-medium text-sm ${
                index === 0 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {pillar}
            </button>
          ))}
        </div>
        
        {/* Display modules by pillar */}
        {Object.entries(modulesByPillar).map(([pillar, modules]) => (
          <div key={pillar} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{pillar} Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
                <div
                  key={module.name}
                  onClick={() => toggleModule(module.name)}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedModules.includes(module.name)
                      ? 'bg-blue-100 border-2 border-blue-500 shadow'
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded-md mr-3 mt-1 flex-shrink-0 ${
                      selectedModules.includes(module.name) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      {selectedModules.includes(module.name) && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold">{module.name}</h3>
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{module.category}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{module.heading}</p>
                      <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>EVC Range: {module.evcRange.min}-{module.evcRange.max}</span>
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
  
  // Output Capacity Slider
  const renderCapacitySlider = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Output Capacity</h2>
      <p className="text-gray-600 mb-6">Set your monthly Elastic Value Credit (EVC) target</p>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Low Capacity</span>
          <span className="text-gray-600">High Capacity</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={evcTarget}
          onChange={(e) => setEvcTarget(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="mt-4 text-center">
          <span className="text-3xl font-bold text-blue-600">{evcTarget} EVCs</span>
          <p className="text-gray-500 text-sm mt-1">Equivalent to {evcTarget / 2} advisor days per month</p>
        </div>
      </div>
    </div>
  );
  
  // Effort / Intensity Slider
  const renderIntensitySlider = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Delivery Intensity</h2>
      <p className="text-gray-600 mb-6">Control weekly EVC burn rate and delivery speed</p>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Steady Pace</span>
          <span>Balanced</span>
          <span>Accelerated</span>
        </div>
        <div className="flex items-center space-x-4">
          {Object.entries(calculatorConfig.intensityLevels).map(([level, details]) => (
            <button
              key={level}
              onClick={() => setEffortIntensity(parseInt(level))}
              className={`flex-1 py-4 rounded-xl transition-all duration-200 ${
                effortIntensity === parseInt(level)
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-center">
                <div className="font-bold mb-1">{details.description}</div>
                <div className="text-xs opacity-80">{details.label}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Speed modifier: <span className="font-medium">{calculatorConfig.intensityLevels[effortIntensity].speedModifier}x</span></p>
        </div>
      </div>
    </div>
  );
  
  // Service Parameters
  const renderServiceParameters = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Parameters</h2>
      <p className="text-gray-600 mb-6">Fine-tune delivery assumptions</p>
      
      {/* Payment Options */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Payment Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(evcBase.paymentOptions).map(([optionKey, option]) => (
            <div
              key={optionKey}
              onClick={() => setPaymentOption(optionKey)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                paymentOption === optionKey
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                  paymentOption === optionKey ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentOption === optionKey && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  <p className="text-xs text-gray-500">{option.description}</p>
                  <p className="text-xs font-medium mt-1 text-blue-600">
                    Price modifier: {option.priceModifier < 1 ? `-${(100 - option.priceModifier * 100).toFixed(0)}%` : 'Standard rate'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Parameters */}
      <div className="space-y-4 mb-4">
        <h3 className="font-medium mb-3">Delivery Parameters</h3>
        {calculatorConfig.serviceParameters.map((param) => (
          <div key={param.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
            <div>
              <h3 className="font-medium">{param.label}</h3>
              <p className="text-sm text-gray-500">{param.description}</p>
              <p className="text-xs text-gray-500 mt-1">EVC Modifier: {param.modifier}x</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={parameters[param.id]}
                onChange={() => toggleParameter(param.id)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
  
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
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Custom Solution</h2>
        
        <div className="mb-6">
          <div className="flex justify-between text-lg mb-2">
            <span className="font-medium">Monthly Price:</span>
            <span className="font-bold text-blue-600">€{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Monthly EVCs:</span>
            <span>{monthlyEvcs} EVCs</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Price per EVC:</span>
            <span>€{evcPricePerUnit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Payment Option:</span>
            <span>{paymentDetails.name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Delivery Speed:</span>
            <span>{deliverySpeed}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Core Intent:</span>
            <span>{intent}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Selected Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedModuleDetails.map((module) => (
              <div key={module.name} className="text-sm bg-blue-50 p-3 rounded">
                <div className="font-medium">{module.name}</div>
                <div className="text-xs text-gray-600 mt-1">EVC Range: {module.evcRange.min}-{module.evcRange.max}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium">EVC Calculation</h4>
            <div className="text-xs text-gray-600 mt-1">
              <p>Base EVC from modules: {selectedModuleDetails.reduce((sum, module) => sum + (module.evcRange.min + module.evcRange.max)/2, 0).toFixed(1)} EVCs</p>
              <p>Intensity modifier ({deliverySpeed}): {calculatorConfig.intensityLevels[effortIntensity].speedModifier}x</p>
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
          <h3 className="font-semibold mb-2">Custom Parameters</h3>
          <div className="space-y-1 text-sm">
            {calculatorConfig.serviceParameters
              .filter(param => parameters[param.id])
              .map(param => (
                <div key={param.id} className="flex">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{param.label}</span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-8">
          <p className="text-sm text-blue-800 font-medium">
            Price Breakdown
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Base price: €{evcBase.basePrice}/EVC × 
            {paymentDetails.priceModifier !== 1 
              ? ` ${paymentDetails.priceModifier} (${paymentDetails.name}) = €${(evcBase.basePrice * paymentDetails.priceModifier).toFixed(2)}/EVC`
              : ` 1.0 (Standard rate) = €${evcBase.basePrice}/EVC`
            }
          </p>
          {monthlyEvcs > 30 && (
            <p className="text-xs text-blue-700">
              Volume discount: €{evcPricePerUnit.toFixed(2)}/EVC × {monthlyEvcs} EVCs = €{totalPrice.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-blue-700 mt-2">
            This is a non-binding estimate based on your selections. Contact us for a detailed proposal.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => window.location.href = 'mailto:sales@elexive.com?subject=Pricing%20Inquiry'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Request Detailed Proposal
          </button>
        </div>
      </div>
    );
  };
  
  // Desktop summary sidebar
  const renderSummarySidebar = () => (
    <div className="bg-white p-5 rounded-2xl shadow-lg h-fit sticky top-4">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Your Configuration</h3>
      
      <div className="space-y-4">
        {/* Intent */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Core Intent</h4>
          <p className="font-medium">{intent || "Not selected"}</p>
        </div>
        
        {/* Selected Modules */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Selected Modules</h4>
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
        
        {/* EVC Target */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Monthly EVC Target</h4>
          <p className="font-medium">{evcTarget} EVCs</p>
        </div>
        
        {/* Intensity */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Delivery Intensity</h4>
          <p className="font-medium">{calculatorConfig.intensityLevels[effortIntensity].description}</p>
          <p className="text-xs text-gray-600">Speed: {calculatorConfig.intensityLevels[effortIntensity].speedModifier}x</p>
        </div>
        
        {/* Payment Option */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
          <p className="font-medium">{evcBase.paymentOptions[paymentOption].name}</p>
          <p className="text-xs text-gray-600">
            {paymentOption === 'prepaid' 
              ? `${((1 - evcBase.paymentOptions[paymentOption].priceModifier) * 100).toFixed(0)}% discount` 
              : 'Standard rate'}
          </p>
        </div>
        
        {/* Parameters */}
        <div>
          <h4 className="text-sm font-medium text-gray-500">Custom Parameters</h4>
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
            <span className="text-sm font-medium text-gray-500">Monthly Price</span>
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
        {/* Main content area */}
        <div className="flex-grow space-y-6">
          {renderOnboardingQuiz()}
          {renderModuleSelector()}
          {renderCapacitySlider()}
          {renderIntensitySlider()}
          {renderServiceParameters()}
          {renderPricingSummary()}
        </div>
        
        {/* Sticky sidebar */}
        <div className="md:w-80 hidden md:block">
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