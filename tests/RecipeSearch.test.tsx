import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeSearch } from '../app/recipe/components/searchbox';
import '@testing-library/jest-dom/extend-expect';
import { expect, test, describe, beforeEach, jest } from "bun:test";

// モックの設定
global.fetch = jest.fn();

describe('RecipeSearch', () => {
  const mockOnRecipesFetched = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles input change', () => {
    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);
    const input = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(input, { target: { value: 'pasta' } });
    expect(input).toHaveValue('pasta');
  });

  it('fetches suggestions on input', async () => {
    const mockSuggestions = [
      { id: 1, title: 'Pasta Carbonara', imageType: 'jpg' },
      { id: 2, title: 'Pasta Alfredo', imageType: 'jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuggestions,
    });

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);
    const input = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(input, { target: { value: 'pasta' } });

    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Pasta Alfredo')).toBeInTheDocument();
    });
  });

  it('handles search button click', async () => {
    const mockRecipes = [
      { id: 1, title: 'Spaghetti Carbonara', image: 'spaghetti.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockRecipes }),
    });

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);
    const input = screen.getByPlaceholderText('Search recipes...');
    const searchButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'spaghetti' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnRecipesFetched).toHaveBeenCalledWith(mockRecipes);
    });
  });

  it('handles API error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<RecipeSearch onRecipesFetched={mockOnRecipesFetched} />);
    const input = screen.getByPlaceholderText('Search recipes...');
    const searchButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'error' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnRecipesFetched).toHaveBeenCalledWith([]);
    });
  });
});

