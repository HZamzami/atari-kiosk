interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({
  steps,
  currentStep,
}: StepperProps) {
  return (
    <div className="flex justify-between items-center px-[18px]">
      {steps.map((step, index) => {
        if (index === 0) return null; // Skip index 0

        return (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-[#0077B6] text-white"
                  : "bg-[#B0BEC5] text-[#607D8B]"
              }`}
            >
              {index}
            </div>
            {/* <span className="mt-2 text-sm">{step}</span> */}
          </div>
        );
      })}
    </div>
  );
}
