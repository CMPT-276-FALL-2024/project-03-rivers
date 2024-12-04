import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RecipeSearch } from '@/app/recipe/components/searchbox';

// Mock the fetch function
global.fetch = vi.fn();

describe('RecipeSearch Component', () => {
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

    const mockOnRecipesFetched = vi.fn();
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

    const mockOnRecipesFetched = vi.fn();
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
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});

