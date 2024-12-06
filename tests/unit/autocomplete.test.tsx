import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RecipeSearch } from '@/app/recipe/components/searchbox';


// Mock the fetch function
global.fetch = vi.fn();

describe('RecipeSearch Autocomplete Functionality', () => {
  const mockOnRecipesFetched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays suggestions when query is valid', async () => {
    const mockSuggestions = [
      { id: 1, title: 'Spaghetti Carbonara', imageType: 'jpg' },
      { id: 2, title: 'Chicken Parmesan', imageType: 'jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions,
    });

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const input = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(input, { target: { value: 'Spaghetti' } });

    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Chicken Parmesan')).toBeInTheDocument();
    });
  });

  it('does not display suggestions for short queries', async () => {
    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const input = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(input, { target: { value: 'S' } });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);

    const input = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(input, { target: { value: 'Spaghetti' } });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching suggestions:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});

