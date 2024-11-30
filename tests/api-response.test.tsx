// api-response.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecipeSearch } from "../app/recipe/components/searchbox"; // Adjust this import path to your actual component
import { vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve(
    new Response(
      JSON.stringify([
        { id: 1, title: "Mock Recipe 1", image: "mock-image-1.jpg" },
        { id: 2, title: "Mock Recipe 2", image: "mock-image-2.jpg" },
      ]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  )
);

const mockOnRecipesFetched = vi.fn();

describe("API Response and Rendering Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches and displays recipes based on API response", async () => {
    render(
        <RecipeSearch
          onRecipesFetched={mockOnRecipesFetched}
        />
      ); // Render the component that triggers the API call

    // Simulate user interaction (e.g., search or button click)
    const searchInput = screen.getByPlaceholderText("Search recipes...");
    fireEvent.change(searchInput, { target: { value: "Strawberry" } });

    const searchButton = screen.getByRole("button", { name: /search recipes/i });
    fireEvent.click(searchButton);

    // Wait for the API call to complete and the UI to update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("query=Strawberry")
      );

      // Assert the UI displays the recipes
      expect(screen.getByText("Mock Recipe 1")).toBeInTheDocument();
      expect(screen.getByText("Mock Recipe 2")).toBeInTheDocument();

      // Ensure images are rendered
      expect(screen.getByAltText("Mock Recipe 1")).toHaveAttribute(
        "src",
        "mock-image-1.jpg"
      );
      expect(screen.getByAltText("Mock Recipe 2")).toHaveAttribute(
        "src",
        "mock-image-2.jpg"
      );
    });
  });
});
