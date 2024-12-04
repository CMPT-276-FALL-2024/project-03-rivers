import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecipeDetail from '@/app/recipe/components/RecipeDetail';


// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({ get: () => '123' })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock the useFavorites hook
vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn(),
  }),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the fetch function
global.fetch = vi.fn();

// Mock next/image to remove legacy prop warning
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />;
  },
}));

describe('RecipeDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches recipe details by ID and displays them', async () => {
    const mockRecipe = {
      id: 123,
      title: 'Delicious Recipe',
      image: 'http://example.com/image.jpg',
      instructions: 'Step 1: Cook. Step 2: Eat.',
      extendedIngredients: [
        { name: 'Ingredient 1', amount: 1, unit: 'cup' },
        { name: 'Ingredient 2', amount: 2, unit: 'tbsp' },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipe,
    });

    render(<RecipeDetail />);

    await screen.findByText('Delicious Recipe');
    expect(screen.getByText('Ingredient 1: 1 cup')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 2: 2 tbsp')).toBeInTheDocument();
    expect(screen.getByText('Step 1: Cook. Step 2: Eat.')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.spoonacular.com/recipes/123/information')
    );
  });

  it('handles API errors when fetching recipe details', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<RecipeDetail />);

    await screen.findByText('Loading');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.spoonacular.com/recipes/123/information')
    );

    await screen.findByText('Failed to fetch recipe details');
  });
});

