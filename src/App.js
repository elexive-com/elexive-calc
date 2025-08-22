import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalculatorApp from './CalculatorApp';
import StyleTest from './StyleTest';
import DiagnosticTest from './DiagnosticTest';
import Header from './components/Header';
import EnvironmentBadge from './components/EnvironmentBadge';
import { TabProvider } from './contexts/TabContext';
import { RouterProvider } from './contexts/RouterContext';

function App() {
  return (
    <BrowserRouter>
      <TabProvider>
        <RouterProvider>
          <div className="min-h-screen bg-elx-bg">
            <Header />
            <EnvironmentBadge />
            <div className="elx-content flex flex-col items-center justify-center p-0 sm:p-4">
              <div className="w-full max-w-[1100px] mx-auto">
                <Routes>
                  <Route path="/" element={<CalculatorApp />} />
                  <Route path="/calculator" element={<CalculatorApp />} />
                  <Route path="/modules" element={<CalculatorApp />} />
                  <Route path="/journey" element={<CalculatorApp />} />
                  <Route path="/style-test" element={<StyleTest />} />
                  <Route path="/diagnostic" element={<DiagnosticTest />} />
                  {/* Catch-all route for any unmatched paths */}
                  <Route path="*" element={<CalculatorApp />} />
                </Routes>
              </div>
              <footer className="mt-8 text-center text-elx-primary text-sm opacity-80">
                <p>© 2025 Elexive Calculator</p>
              </footer>
            </div>
          </div>
        </RouterProvider>
      </TabProvider>
    </BrowserRouter>
  );
}

export default App;
