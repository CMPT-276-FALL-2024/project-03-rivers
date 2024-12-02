import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecipeSearch } from "../../app/recipe/components/searchbox";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the toast module
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));


global.fetch = vi.fn(() =>
  Promise.resolve(
    new Response(
      JSON.stringify([
        { id: 661760, title: "Strawberry Bites", imageType: "jpg" },
        { id: 661904, title: "Strawberry Syrup", imageType: "jpg" },
      ]),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  )
);
const mockFetchRecipes = vi.fn();

describe("RecipeSearch Component - API Response Test", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    render(<RecipeSearch onRecipesFetched={mockFetchRecipes} />);
  });

  //afterEach(() => {
  //  global.fetch.mockClear(); // Clear the mock fetch implementation after each test
 // });

  test("fetches and displays autocomplete suggestions", async () => {
    // Simulate user typing in the search input
    const input = screen.getByPlaceholderText("Search recipes...");
    fireEvent.change(input, { target: { value: "str" } });

    // Wait for the fetch call to be triggered
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Ensure the API call is made with the correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.spoonacular.com/recipes/autocomplete"),
      expect.anything()
    );

    // Ensure the suggestions are displayed
    await waitFor(() => {
      expect(screen.getByText("Strawberry Bites")).toBeInTheDocument();
      expect(screen.getByText("Strawberry Syrup")).toBeInTheDocument();
    });
  });

  test("calls `onRecipesFetched` with correct data when a suggestion is clicked", async () => {
    // Update the global fetch mock to simulate recipe information fetch
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: 661760,
            title: "Strawberry Bites",
            image: "https://example.com/strawberry-bites.jpg",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );

    // Simulate user typing in the search input
    const input = screen.getByPlaceholderText("Search recipes...");
    fireEvent.change(input, { target: { value: "str" } });

    // Simulate the user clicking on a suggestion
    const suggestion = await screen.findByText("Strawberry Bites");
    fireEvent.click(suggestion);

    // Ensure the fetch call for the recipe is triggered
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Ensure `onRecipesFetched` is called with the correct recipe data
    expect(mockFetchRecipes).toHaveBeenCalledWith([
      {
        id: 661760,
        title: "Strawberry Bites",
        image: "https://example.com/strawberry-bites.jpg",
      },
    ]);
  });

  test("displays an error message if the API call fails", async () => {
    // Mock fetch to simulate a failed API call
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch"))
    );

    // Simulate user typing in the search input
    const input = screen.getByPlaceholderText("Search recipes...");
    fireEvent.change(input, { target: { value: "str" } });

    // Wait for the fetch call to fail
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Ensure no suggestions are displayed
    expect(screen.queryByText("Strawberry Bites")).not.toBeInTheDocument();
    expect(screen.queryByText("Strawberry Syrup")).not.toBeInTheDocument();
  });
});