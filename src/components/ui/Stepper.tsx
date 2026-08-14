import React from 'react';

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full my-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isPending = currentStep < step.id;

        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex items-center gap-3">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors
                  ${isCompleted ? 'bg-[#28a745]' : ''}
                  ${isActive ? 'bg-[#0a2a5e] text-white' : ''}
                  ${isPending ? 'bg-gray-100 text-gray-400' : ''}
                `}
              >
                {isCompleted ? '' : step.id}
              </div>
              <span 
                className={`text-sm font-semibold transition-colors
                  ${isCompleted ? 'text-[#28a745]' : ''}
                  ${isActive ? 'text-gray-800' : ''}
                  ${isPending ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-16 md:w-24 h-[2px] mx-4 rounded-full bg-gray-200">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-[#28a745] w-full' : 'w-0'}`} 
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
