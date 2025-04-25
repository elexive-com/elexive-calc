import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, faMinus, faPlus, 
  faUsers, faPuzzlePiece, faExchangeAlt,
  faArrowRight, faBullseye, faProjectDiagram,
  faTasks, faGears, faRobot, faDatabase
} from '@fortawesome/free-solid-svg-icons';
import calculatorConfig from '../config/calculatorConfig.json';

const EvcExplainer = ({ 
  isVisible, 
  toggleVisibility, 
  weeklyProductionCapacity, 
  monthlyOutputValue 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 
        className="text-2xl font-bold text-[var(--elexive-primary)] mb-2 flex items-center justify-between cursor-pointer"
        onClick={toggleVisibility}
      >
        <div>
          <FontAwesomeIcon icon={faCalculator} className="text-[var(--elexive-accent)] mr-2" />
          Understanding Elastic Value Credits (EVCs)
        </div>
        <FontAwesomeIcon 
          icon={isVisible ? faMinus : faPlus} 
          className="text-[var(--elexive-accent)]" 
        />
      </h2>
      
      {isVisible && (
        <>
          <p className="text-gray-600 mb-4">
            EVCs represent our producer-consumer model where input resources are converted into 
            strategic output value for your business.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faUsers} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Input Resources</h3>
              <p className="text-sm text-gray-600">
                Advisory services, AI tools, and specialized data resources that generate your weekly EVC capacity.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--elexive-accent-light)] flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faPuzzlePiece} className="text-[var(--elexive-accent)] text-xl" />
              </div>
              <h3 className="font-bold text-[var(--elexive-primary)] mb-1">Output Value</h3>
              <p className="text-sm text-gray-600">
                Strategic module implementations and deliverables that consume your EVC production capacity.
              </p>
            </div>
          </div>
          
          <div className="bg-[#ECE9F3] p-4 rounded-lg mb-4">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-2">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              The EVC Value Exchange
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-center p-3">
                <div className="text-sm mb-1 font-medium text-[var(--elexive-primary)]">Input Resources</div>
                <div className="text-xs text-gray-600 mb-2">Weekly Commitment</div>
                <div className="text-2xl font-bold text-[var(--elexive-accent)]">{weeklyProductionCapacity} EVCs</div>
              </div>
              
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-xl mb-1" />
                <div className="text-xs text-gray-500">Converts to</div>
              </div>
              
              <div className="text-center p-3">
                <div className="text-sm mb-1 font-medium text-[var(--elexive-primary)]">Output Value</div>
                <div className="text-xs text-gray-600 mb-2">Monthly Deliverables</div>
                <div className="text-2xl font-bold text-[var(--elexive-secondary)]">{monthlyOutputValue} EVCs</div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-2">How Resource Allocation Works</h3>
            <p className="text-sm text-gray-700">
              Your resource allocation strategy determines how efficiently your EVC production capacity 
              is converted into output value:
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faBullseye} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Focused (1.0x):</span>
                  <span className="text-gray-600"> Concentrated effort on fewer priorities yields 1-to-1 output.</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faProjectDiagram} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Balanced (1.5x):</span>
                  <span className="text-gray-600"> More parallel work increases total output through resource synergies.</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faTasks} className="text-[var(--elexive-accent)] mt-1 mr-2" />
                <div>
                  <span className="font-medium">Distributed (2.25x):</span>
                  <span className="text-gray-600"> Maximum output across multiple initiatives through scale efficiencies.</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-[var(--elexive-primary)] mb-4">
              <FontAwesomeIcon icon={faGears} className="text-[var(--elexive-accent)] mr-2" />
              EVC Input Resources
            </h3>
            <p className="text-gray-600 mb-4">
              These resources work together to produce your weekly EVC capacity
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {calculatorConfig.evcProducers.map((producer) => (
                <div key={producer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon 
                      icon={
                        producer.id === "advisorHours" ? faUsers :
                        producer.id === "aiTools" ? faRobot :
                        faDatabase
                      } 
                      className="text-[var(--elexive-primary)] mr-2" 
                    />
                    <h3 className="font-semibold">{producer.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{producer.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Default Allocation:</span>
                    <span className="font-medium">{Math.round(producer.defaultAllocation * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">Production Value:</span>
                    <span className="font-medium">{producer.productionValue}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EvcExplainer;