import React from 'react';
import './App.css';
import './custom.css';
import CalculatorApp from './CalculatorApp';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Elexive Calculator</h1>
      <CalculatorApp />
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 Elexive Calculator</p>
      </footer>
    </div>
  );
}

export default App;
