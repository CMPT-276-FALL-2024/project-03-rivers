import { expect, test } from "bun:test";
import { render, screen } from '@testing-library/react';
import CheckIngredients from '../app/recipe/components/CheckIngredients';

test('CheckIngredients component renders correctly', () => {
  render(<CheckIngredients ingredients={['Salt', 'Pepper', 'Olive Oil']} />);
  expect(screen.getByText('Salt')).toBeInTheDocument();
  expect(screen.getByText('Pepper')).toBeInTheDocument();
  expect(screen.getByText('Olive Oil')).toBeInTheDocument();
});

