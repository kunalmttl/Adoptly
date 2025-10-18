// src/components/pets/Stepper.tsx

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/**
 * Props for the Stepper component.
 */
interface StepperProps {
  /** An array of step objects, each with a title and description. */
  steps: { title: string; description: string }[];
  /** The number of the currently active step (1-based index). */
  currentStep: number;
}

/**
 * A vertical stepper component to guide users through a multi-step process.
 * It visually indicates completed, active, and upcoming steps.
 */
export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={step.title} className="relative flex items-start">
              {/* The vertical connector line between steps. */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-4 top-5 -ml-px mt-1 w-0.5 h-full',
                    isCompleted ? 'bg-green-400' : 'bg-neutral-200'
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="flex items-center gap-x-3">
                {/* The step number or checkmark icon. */}
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center font-semibold',
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-orange-200 text-neutral-800' : 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>

                {/* The step title and description. */}
                <div className="flex flex-col">
                  <span className={cn('text-sm font-semibold', isActive ? 'text-neutral-800' : 'text-neutral-600')}>
                    {step.title}
                  </span>
                  <span className="text-xs text-neutral-400">{step.description}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};