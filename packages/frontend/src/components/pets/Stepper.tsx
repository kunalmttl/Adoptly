// # Stepper Navigation Component

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { title: string; description: string }[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li key={step.title} className="relative flex items-start">
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-4 top-5 -ml-px mt-1 w-0.5 h-full",
                    isCompleted ? "bg-green-400" : "bg-neutral-200"
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="flex items-center gap-x-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center font-semibold",
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-beige text-neutral-800"
                      : "bg-neutral-200 text-neutral-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>

                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-poppins font-semibold",
                      isActive
                        ? "text-neutral-800"
                        : isCompleted
                        ? "text-neutral-600"
                        : "text-neutral-600"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs font-montserrat text-neutral-400">
                    {step.description}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
