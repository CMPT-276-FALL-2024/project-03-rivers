import { useState, useEffect } from 'react';

export interface FavoriteRecipe {
  id: number;
  title: string;
  image: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const addFavorite = (recipe: FavoriteRecipe) => {
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const isFavorite = (id: number) => favorites.some(fav => fav.id === id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

