import React, { useState } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumberClick = (number) => {
    if (display === '0' || resetDisplay) {
      setDisplay(number);
      setResetDisplay(false);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperationClick = (op) => {
    if (previousValue === null) {
      setPreviousValue(display);
    } else if (!resetDisplay) {
      // Perform calculation when chaining operations
      const result = calculate();
      setPreviousValue(result);
      setDisplay(result);
    }
    
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = () => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return display;
    }

    return result.toString();
  };

  const handleEquals = () => {
    if (previousValue === null || resetDisplay) return;
    
    const result = calculate();
    setDisplay(result);
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handlePlusMinus = () => {
    setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
  };

  const handlePercent = () => {
    const num = parseFloat(display) / 100;
    setDisplay(num.toString());
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-xl shadow-lg">
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="text-right text-3xl font-mono text-white overflow-hidden">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {/* First row */}
        <button 
          onClick={handleClear} 
          className="p-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          AC
        </button>
        <button 
          onClick={handlePlusMinus} 
          className="p-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          +/-
        </button>
        <button 
          onClick={handlePercent} 
          className="p-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          %
        </button>
        <button 
          onClick={() => handleOperationClick('÷')} 
          className="p-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-colors"
        >
          ÷
        </button>
        
        {/* Second row */}
        <button 
          onClick={() => handleNumberClick('7')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          7
        </button>
        <button 
          onClick={() => handleNumberClick('8')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          8
        </button>
        <button 
          onClick={() => handleNumberClick('9')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          9
        </button>
        <button 
          onClick={() => handleOperationClick('×')} 
          className="p-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-colors"
        >
          ×
        </button>
        
        {/* Third row */}
        <button 
          onClick={() => handleNumberClick('4')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          4
        </button>
        <button 
          onClick={() => handleNumberClick('5')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          5
        </button>
        <button 
          onClick={() => handleNumberClick('6')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          6
        </button>
        <button 
          onClick={() => handleOperationClick('-')} 
          className="p-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-colors"
        >
          -
        </button>
        
        {/* Fourth row */}
        <button 
          onClick={() => handleNumberClick('1')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          1
        </button>
        <button 
          onClick={() => handleNumberClick('2')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          2
        </button>
        <button 
          onClick={() => handleNumberClick('3')} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          3
        </button>
        <button 
          onClick={() => handleOperationClick('+')} 
          className="p-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-colors"
        >
          +
        </button>
        
        {/* Fifth row */}
        <button 
          onClick={() => handleNumberClick('0')} 
          className="col-span-2 p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          0
        </button>
        <button 
          onClick={handleDecimal} 
          className="p-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          .
        </button>
        <button 
          onClick={handleEquals} 
          className="p-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default CalculatorApp;