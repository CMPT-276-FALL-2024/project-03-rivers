// app/recipe/result/components/Instructions.tsx
"use client";

const Instructions = () => {
  const steps = [
    { step: 1, description: "Start by bringing a large pot of salted water to a boil. Add the pasta and cook according to the package instructions until al dente. Drain and set aside, reserving a cup of pasta water." },
    { step: 2, description: "In a large skillet, heat olive oil over medium heat. Add minced garlic and sauté until fragrant, about 1 minute. Be careful not to burn the garlic." },
    { step: 3, description: "Add chopped tomatoes to the skillet and cook until they start to break down and form a sauce, about 5-7 minutes. Stir occasionally to prevent sticking." },
    { step: 4, description: "Season the tomato sauce with salt, pepper, and red pepper flakes (if using). Adjust the seasoning to taste. Let the sauce simmer for a few more minutes." },
    { step: 5, description: "Add the drained pasta to the skillet and toss to combine with the sauce. If the sauce is too thick, add a little bit of the reserved pasta water to reach your desired consistency." },
    { step: 6, description: "Add fresh basil leaves to the pasta and toss again. The basil will wilt slightly from the heat, releasing its aroma into the dish." },
    { step: 7, description: "For added flavor, grate a generous amount of Parmesan cheese over the pasta and toss to combine. The cheese will melt into the sauce, adding a creamy texture." },
    { step: 8, description: "If you prefer a bit more richness, drizzle a little more olive oil over the pasta and give it one last toss before serving." },
    { step: 9, description: "Plate the pasta in individual bowls, garnishing each serving with a few fresh basil leaves and an extra sprinkle of Parmesan cheese if desired." },
    { step: 10, description: "Serve the pasta hot and enjoy your meal! This dish pairs well with a side salad and crusty bread for a complete meal." },
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
