// ActionPopup.jsx...abhi
import React, { useState, useEffect } from 'react';
import './ActionPopup.css';
import { CheckCircle } from 'lucide-react';

const steps = [
  'Optimization between Origin and destination route',
  'Load management and inventory optimization',
  'Consolidation of formation and support required',
  'Checking vehicle availability',
  'Compiling all info'
];

const ActionPopup = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [complete, setComplete] = useState(false);
  const [progressing, setProgressing] = useState(false);

  useEffect(() => {
    let stepTimeout;

    if (currentStep < steps.length - 1) {
      setProgressing(true);
      stepTimeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setProgressing(false);
      }, 1500);
    } else if (currentStep === steps.length - 1 && !complete) {
      setTimeout(() => setComplete(true), 1500);
    }

    return () => clearTimeout(stepTimeout);
  }, [currentStep, complete]);

  useEffect(() => {
    // animation part ....abhi ..
    setCurrentStep(0);
  }, []);

  return (
    <div className="action-popup">
      <div className="popup-header">
        <span className="popup-icon">☁️</span>
        <div>
          <h2>Orchestrating Actions</h2>
          <p>Base<span style={{ color: '#8B5CF6' }}>.</span> Generating...</p>
        </div>
      </div>
      <div className="popup-body">
        {steps.map((step, index) => (
          <div className="step-wrapper" key={index}>
            <div className="step">
              <div className={`check-icon ${index <= currentStep ? 'active' : ''}`}>
                {index <= currentStep && <CheckCircle size={18} strokeWidth={2} color="green" />}
              </div>
              <p className={index <= currentStep ? 'active' : ''}>{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="progress-line-container">
                <div
                  className={`progress-line ${
                    index < currentStep
                      ? 'filled'
                      : index === currentStep && progressing
                      ? 'animating'
                      : ''
                  }`}
                />
              </div>
            )}
          </div>
          
          
        ))}
      </div>
      {complete && <div className="complete-status"> Completed ✅</div>}
    </div>
  );
};

export default ActionPopup;
