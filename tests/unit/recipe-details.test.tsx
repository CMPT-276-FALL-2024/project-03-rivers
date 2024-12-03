import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter, useSearchParams } from 'next/navigation';

import RecipeDetails from '@/app/recipe/result/page';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock recipe data
const mockRecipe = {
  id: 1,
  title: 'Spaghetti Carbonara',
  servings: 2,
  extendedIngredients: [
    { id: 1, name: 'Spaghetti', amount: 200, unit: 'g' },
    { id: 2, name: 'Eggs', amount: 2, unit: '' },
    { id: 3, name: 'Pancetta', amount: 100, unit: 'g' },
  ],
  instructions: 'Cook spaghetti. Mix eggs and cheese. Combine and serve.',
};

// Mock the fetch function
global.fetch = vi.fn();

describe('RecipeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockRecipe,
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams({ id: '1' }));
    (useRouter as jest.Mock).mockReturnValue({ push: vi.fn() });
  });

  it('displays recipe details correctly', async () => {
    render(<RecipeDetails />);

    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Servings: 2')).toBeInTheDocument();
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      expect(screen.getByText('200 g')).toBeInTheDocument();
      expect(screen.getByText('Cook spaghetti. Mix eggs and cheese. Combine and serve.')).toBeInTheDocument();
    });
  });

  it('adjusts ingredient amounts based on the number of people', async () => {
    render(<RecipeDetails />);

    await waitFor(() => {
      const servingsInput = screen.getByLabelText('Adjust servings:');
      fireEvent.change(servingsInput, { target: { value: '4' } });
    });

    await waitFor(() => {
      expect(screen.getByText('400 g')).toBeInTheDocument(); // Spaghetti amount doubled
      expect(screen.getByText('4')).toBeInTheDocument(); // Eggs amount doubled
      expect(screen.getByText('200 g')).toBeInTheDocument(); // Pancetta amount doubled
    });
  });

  it('handles click on "Nutrition Page" button', async () => {
    const mockPush = vi.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<RecipeDetails />);

    await waitFor(() => {
      const nutritionButton = screen.getByText('Nutrition Page');
      fireEvent.click(nutritionButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/nutrition/1');
  });

  it('handles click on "Add to Calendar" button', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<RecipeDetails />);

    await waitFor(() => {
      const calendarButton = screen.getByText('Add to Calendar');
      fireEvent.click(calendarButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Recipe added to calendar successfully!')).toBeInTheDocument();
    });
  });

  it('handles error when adding to calendar fails', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to add to calendar' }),
    });

    render(<RecipeDetails />);

    await waitFor(() => {
      const calendarButton = screen.getByText('Add to Calendar');
      fireEvent.click(calendarButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to add recipe to calendar. Please try again.')).toBeInTheDocument();
    });
  });
});

