[v0-no-op-code-block-prefix]import { expect, test } from "bun:test";
import { render, screen } from '@testing-library/react';
import { CheckboxIngredients } from '../app/recipe/components/ingredients-selector';

test('CheckboxIngredients component renders correctly', () => {
  const ingredients = ['Salt', 'Pepper', 'Olive Oil'];
  render(<CheckboxIngredients ingredients={ingredients} />);
  
  ingredients.forEach(ingredient => {
    expect(screen.getByText(ingredient)).toBeInTheDocument();
  });
});



