import React from 'react';
import './App.css';
import './custom.css';
import CalculatorApp from './CalculatorApp';
import Header from './components/Header';
import EnvironmentBadge from './components/EnvironmentBadge';
import { TabProvider } from './contexts/TabContext';

function App() {
  return (
    <TabProvider>
      <div className="min-h-screen bg-elx-bg">
        <Header />
        <EnvironmentBadge />
        <div className="elx-content flex flex-col items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[1100px] mx-auto">
            <CalculatorApp />
          </div>
          <footer className="mt-8 text-center text-elx-primary text-sm opacity-80">
            <p>© 2025 Elexive Calculator</p>
          </footer>
        </div>
      </div>
    </TabProvider>
  );
}

export default App;
