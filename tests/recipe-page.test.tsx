// CheckboxIngredients.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckboxIngredients } from "../app/recipe/components/nutrition-selector";
import { vi } from "vitest";

// Create a mock implementation for toast and onRecipesFetched
const mockToast = vi.fn();
const mockFetchRecipes = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  toast: mockToast,
}));

describe("CheckboxIngredients Component", () => {
  beforeEach(() => {
    render(<CheckboxIngredients onRecipesFetched={mockFetchRecipes} />);
  });

  test("renders ingredient checkboxes", () => {
    const checkboxLabels = ["Potato", "Carrot", "Broccoli", "Chicken", "Pork"];
    checkboxLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  test("shows error when submitting without ingredients", async () => {
    const submitButton = screen.getByRole("button", { name: /search recipes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "You have to select at least one ingredient.",
      });
    });
  });

  test("fetches recipes with selected ingredients", async () => {
    const ingredientCheckbox = screen.getByLabelText("Potato");
    fireEvent.click(ingredientCheckbox);

    const submitButton = screen.getByRole("button", { name: /search recipes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchRecipes).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
