import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter, useSearchParams } from 'next/navigation';

import RecipeDetail from '@/app/recipe/result/page';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams({ id: '1' })),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the GoogleCalendarIntegration component
vi.mock('@/components/GoogleCalendarIntegration', () => ({
  GoogleCalendarIntegration: vi.fn(() => null),
}));

// Mock the fetch function
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: 1,
      title: 'Spaghetti Carbonara',
      image: '/placeholder.svg?height=400&width=600',
      servings: 2,
      extendedIngredients: [
        { id: 1, name: 'Spaghetti', amount: 200, unit: 'g' },
        { id: 2, name: 'Eggs', amount: 2, unit: '' },
        { id: 3, name: 'Pancetta', amount: 100, unit: 'g' },
      ],
      instructions: 'Cook spaghetti. Mix eggs and cheese. Combine and serve.',
    }),
  })
);

describe('RecipeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays recipe details correctly', async () => {
    render(<RecipeDetail />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Spaghetti Carbonara/i })).toBeInTheDocument();
      expect(screen.getByText(/Spaghetti: 200 g/i)).toBeInTheDocument();
      expect(screen.getByText(/Eggs: 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Pancetta: 100 g/i)).toBeInTheDocument();
    });
  });

  it('adjusts ingredient amounts based on the number of people', async () => {
    render(<RecipeDetail />);

    await waitFor(() => {
      const servingsInput = screen.getByLabelText(/adjust servings/i);
      fireEvent.change(servingsInput, { target: { value: '4' } });
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Spaghetti: 400 g/i)).toBeInTheDocument();
      expect(screen.getByText(/Eggs: 4/i)).toBeInTheDocument();
      expect(screen.getByText(/Pancetta: 200 g/i)).toBeInTheDocument();
    });
  });

  it('handles click on "Nutrition Page" button', async () => {
    const mockPush = vi.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<RecipeDetail />);

    await waitFor(() => {
      const nutritionButton = screen.getByRole('button', { name: /go to nutrition page/i });
      fireEvent.click(nutritionButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/recipe/result/nutrition?id=1');
  });

  it('handles click on "Add to Calendar" button', async () => {
    render(<RecipeDetail />);

    await waitFor(async () => {
      const dateButton = screen.getByRole('button', { name: /pick date/i });
      fireEvent.click(dateButton);
      
      // Wait for calendar to appear and select a date
      const dateCell = await screen.findByRole('button', { name: /15/i });
      fireEvent.click(dateCell);

      const timeSelect = screen.getByRole('combobox', { name: /pick time/i });
      fireEvent.click(timeSelect);
      
      // Select time
      const timeOption = await screen.findByRole('option', { name: '12:00' });
      fireEvent.click(timeOption);

      const addToCalendarButton = screen.getByRole('button', { name: /add to calendar/i });
      fireEvent.click(addToCalendarButton);
    });

    // Add expectations for calendar integration here
  });

});

