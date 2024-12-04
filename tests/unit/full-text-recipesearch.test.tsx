import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RecipeSearch } from '@/app/recipe/components/searchbox';

// Mock the fetch function
global.fetch = vi.fn();

describe('RecipeSearch Component - Full-Text Search', () => {
  const mockOnRecipesFetched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches recipes by query and displays results', async () => {
    const mockRecipes = [
      { id: 1, title: 'Spaghetti Carbonara', image: 'spaghetti.jpg' },
      { id: 2, title: 'Chicken Parmesan', image: 'chicken.jpg' },
      { id: 3, title: 'Vegetable Stir Fry', image: 'stirfry.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockRecipes }),
    });

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const searchInput = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(searchInput, { target: { value: 'Italian food' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.spoonacular.com/recipes/complexSearch?query=Italian%20food')
      );
    });

    expect(mockOnRecipesFetched).toHaveBeenCalledWith(mockRecipes);
  });

  it('handles API errors during search', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const searchInput = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(searchInput, { target: { value: 'Italian food' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.spoonacular.com/recipes/complexSearch?query=Italian%20food')
      );
    });

    expect(mockOnRecipesFetched).toHaveBeenCalledWith([]);
  });

  it('fetches recipe by ID when a suggestion is selected', async () => {
    const mockSuggestion = { id: 1, title: 'Spaghetti Carbonara', imageType: 'jpg' };
    const mockRecipe = { id: 1, title: 'Spaghetti Carbonara', image: 'spaghetti.jpg' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockSuggestion],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipe,
      });

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const searchInput = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(searchInput, { target: { value: 'Spaghetti' } });

    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Spaghetti Carbonara'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.spoonacular.com/recipes/1/information')
      );
    });

    expect(mockOnRecipesFetched).toHaveBeenCalledWith([mockRecipe]);
  });
});

