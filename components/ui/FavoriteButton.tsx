"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, X } from 'lucide-react';
import { motion } from "framer-motion";
import { useFavorites } from '@/hooks/useFavorites';
import { useBlur } from '@/app/contexts/BlurContext'; // Updated import path
import Image from 'next/image';

const FavoriteButton: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { setIsBlurred } = useBlur();

  const handleRemoveFavorite = (id: number) => {
    removeFavorite(id);
    window.dispatchEvent(new CustomEvent('favoriteRemoved'));
  };

  const handlePopoverOpen = (open: boolean) => {
    setIsBlurred(open);
  };

  return (
    <Popover onOpenChange={handlePopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-md">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-5 h-5" />
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="text-sm font-medium mb-2">Your favorite recipes</div>
        {favorites.length === 0 ? (
          <div className="text-sm text-muted-foreground">No favorite recipes yet.</div>
        ) : (
          <ul className="space-y-2">
            {favorites.map((recipe) => (
              <li key={recipe.id} className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                <Image src={recipe.image} alt={recipe.title} width={32} height={32} className="rounded-sm" />
                <span className="text-sm truncate">{recipe.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFavorite(recipe.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FavoriteButton;

