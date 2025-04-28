import React from 'react';
import './App.css';
import './custom.css';
import CalculatorApp from './CalculatorApp';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-elx-bg">
      <Header />
      <div className="elx-content flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-elx-heading font-bold text-elx-primary mb-6">Elexive Calculator</h1>
        <CalculatorApp />
        <footer className="mt-8 text-center text-elx-primary text-sm opacity-80">
          <p>© 2025 Elexive Calculator</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
