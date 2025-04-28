import React from 'react';
import './App.css';
import './custom.css';
import CalculatorApp from './CalculatorApp';
import Header from './components/Header';
import { TabProvider } from './contexts/TabContext';

function App() {
  return (
    <TabProvider>
      <div className="min-h-screen bg-elx-bg">
        <Header />
        <div className="elx-content flex flex-col items-center justify-center p-4">
          <CalculatorApp />
          <footer className="mt-8 text-center text-elx-primary text-sm opacity-80">
            <p>© 2025 Elexive Calculator</p>
          </footer>
        </div>
      </div>
    </TabProvider>
  );
}

export default App;
