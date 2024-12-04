import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { SpecificSearch } from '@/app/recipe/components/specific-search';

// Mock the fetch function
global.fetch = vi.fn();

// Mock the toast function
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe('SpecificSearch Component - Full-Text Search', () => {
  const mockOnRecipesFetched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches recipes by query and displays results', async () => {
    const mockRecipes = [
      { id: 1, title: 'Pasta Recipe', image: 'pasta.jpg' },
      { id: 2, title: 'Pizza Recipe', image: 'pizza.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockRecipes }),
    });

    render(<SpecificSearch onRecipesFetched={mockOnRecipesFetched} />);

    // Add an ingredient
    const ingredientInput = screen.getByPlaceholderText('Enter an ingredient...');
    fireEvent.change(ingredientInput, { target: { value: 'tomato' } });
    const addButton = screen.getByRole('button', { name: '' });
    fireEvent.click(addButton);

    // Select a cuisine
    const cuisineSelect = screen.getByRole('combobox', { name: /cuisine/i });
    fireEvent.click(cuisineSelect);
    const italianOption = screen.getByRole('option', { name: 'Italian' });
    fireEvent.click(italianOption);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /search recipes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.spoonacular.com/recipes/complexSearch?query=tomato&cuisine=italian')
      );
    });

    expect(mockOnRecipesFetched).toHaveBeenCalledWith(mockRecipes);
  });

  it('handles API errors during search', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<SpecificSearch onRecipesFetched={mockOnRecipesFetched} />);

    // Add an ingredient
    const ingredientInput = screen.getByPlaceholderText('Enter an ingredient...');
    fireEvent.change(ingredientInput, { target: { value: 'tomato' } });
    const addButton = screen.getByRole('button', { name: '' });
    fireEvent.click(addButton);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /search recipes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.spoonacular.com/recipes/complexSearch?query=tomato')
      );
    });

    await waitFor(() => {
      expect(mockOnRecipesFetched).toHaveBeenCalledWith([]);
      expect(vi.mocked(toast)).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to fetch recipes. Please try again later.",
      });
    });
  });
});

