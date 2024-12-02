import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Nutrition from "../../app/recipe/result/nutrition/page"; // Adjusted import to match your file structure

// Mock `useSearchParams` from Next.js for the recipe ID
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn(() => "12345"), // Mock the recipe ID
  }),
  useRouter: () => ({
    push: vi.fn(), // Mock the router push function
  }),
}));

// Mock the `fetch` API globally
global.fetch = vi.fn();

describe("NutritionPage Component", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      global.fetch = vi.fn() as unknown as ReturnType<typeof vi.fn>;
    });

    it("renders static nutrition information correctly", async () => {
        (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              title: "Strawberry Bites",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        );

    render(<Nutrition />);

    // Wait for the recipe name to load
    await waitFor(() => {
      expect(screen.getByText("Strawberry Bites Nutrition")).toBeInTheDocument();
    });

    // Check if macronutrients section renders correctly
    expect(screen.getByText("Macronutrients")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();

    // Check other static sections
    expect(screen.getByText("Minerals")).toBeInTheDocument();
    expect(screen.getByText("Vitamins")).toBeInTheDocument();
  });

  it("renders calorie card with fetched data", async () => {
    // Mock the API response for the calorie card
    global.fetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            title: "Strawberry Bites",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            calories: 222,
            numberOfServings: 1,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    render(<Nutrition />);

    // Wait for the calorie data to load
    await waitFor(() => {
      expect(screen.getByText("222kcal")).toBeInTheDocument();
      expect(screen.getByText("Number of servings: 1")).toBeInTheDocument();
    });
  });

  it("handles error state in calorie card", async () => {
    // Mock the API error for the calorie card
    global.fetch.mockRejectedValueOnce(new Error("API error"));

    render(<Nutrition />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Failed to load calorie information. Please try again later.")
      ).toBeInTheDocument();
    });
  });
});
