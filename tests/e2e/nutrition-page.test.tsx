import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecipeDetail from '@/app/recipe/components/RecipeDetail';
import Nutrition from '@/app/nutrition/result/page';


// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn((param) => {
      if (param === 'id') return '123456';
      return null;
    }),
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock the fetch function
global.fetch = vi.fn();

// Mock the components used in Nutrition
vi.mock('./components/image-card', () => ({
  ImageCard: () => <div data-testid="image-card">Image Card</div>,
}));

vi.mock('./components/nutrition-card', () => ({
  NutritionFactsCard: () => <div data-testid="nutrition-facts-card">Nutrition Facts Card</div>,
}));

vi.mock('./components/calories-card', () => ({
  CaloriesCard: () => <div data-testid="calories-card">Calories Card</div>,
}));

vi.mock('./components/NutritionExplanationDialog', () => ({
  NutritionExplanationDialog: () => <div data-testid="nutrition-explanation-dialog">Nutrition Explanation Dialog</div>,
}));

describe('Go to Nutrition Page Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Unit Test
  it('navigates to the nutrition page when "Go to Nutrition Page" button is clicked', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    const mockRecipe = {
      id: 123456,
      title: 'Test Recipe',
      image: 'test-image.jpg',
      instructions: 'Test instructions',
      extendedIngredients: [
        { name: 'Ingredient 1', amount: 1, unit: 'cup' },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipe,
    });

    render(<RecipeDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    const nutritionButton = screen.getByRole('button', { name: /go to nutrition page/i });
    fireEvent.click(nutritionButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/recipe/result/nutrition?id=123456');
  });

  // Integration Test
  it('renders the nutrition page with correct components', async () => {
    const mockRecipeData = {
      title: 'Test Recipe',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipeData,
    });

    render(<Nutrition />);

    await waitFor(() => {
      expect(screen.getByText('Test Recipe Nutrition')).toBeInTheDocument();
      expect(screen.getByTestId('image-card')).toBeInTheDocument();
      expect(screen.getByTestId('nutrition-facts-card')).toBeInTheDocument();
      expect(screen.getByTestId('calories-card')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /back to previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to calendar/i })).toBeInTheDocument();
  });
});

