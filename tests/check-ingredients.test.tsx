// check-ingredients.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import * as toastModule from "@/hooks/use-toast";
import { CheckboxIngredients } from "@/app/recipe/components/ingredients-selector";

// Mock the toast module
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve(new Response(
    JSON.stringify([{ id: 1, title: "Mock Recipe", image: "mock-image.jpg" }]),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  ))
);

const mockFetchRecipes = vi.fn();

describe("CheckboxIngredients Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<CheckboxIngredients onRecipesFetched={mockFetchRecipes} />);
  });

  test("renders ingredient checkboxes", () => {
    const checkboxLabels = ["Potato", "Carrot", "Broccoli", "Chicken", "Pork"];
    checkboxLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  // test("shows error when submitting without ingredients", async () => {
  //   const submitButton = screen.getByRole("button", { name: /search recipes/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(toastModule.toast).toHaveBeenCalledWith({
  //       title: "Error",
  //       description: "You have to select at least one ingredient.",
  //     });
  //   });

  //   console.log("Toast call count:", toastModule.toast.mock.calls.length);
  //   console.log("Toast calls:", toastModule.toast.mock.calls);
  // });

  test("fetches recipes with selected ingredients", async () => {
    const ingredientCheckbox = screen.getByLabelText("Potato");
    fireEvent.click(ingredientCheckbox);

    const submitButton = screen.getByRole("button", { name: /search recipes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchRecipes).toHaveBeenCalledWith([{ id: 1, title: "Mock Recipe", image: "mock-image.jpg" }]);
    });
  });
});

//test
