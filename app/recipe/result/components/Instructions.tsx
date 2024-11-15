// app/recipe/result/components/Instructions.tsx
"use client";

const Instructions = () => {
  const steps = [
    { step: 1, description: "Boil water and cook pasta until al dente." },
    { step: 2, description: "In a pan, sauté garlic and add tomatoes." },
    { step: 3, description: "Add basil, olive oil, and mix with pasta." },
    { step: 4, description: "Serve with grated cheese on top." },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.step} className="flex items-start space-x-4">
            {/* Step Indicator */}
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              {step.step}
            </div>
            {/* Step Description */}
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
