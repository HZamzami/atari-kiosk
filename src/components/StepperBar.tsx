interface StepperBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepperBar({
  currentStep,
  totalSteps,
}: StepperBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
    </div>
  );
}
