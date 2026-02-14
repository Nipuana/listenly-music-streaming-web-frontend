"use client";

import { Button } from "@/components/ui/button";

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryPills({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className={
            selectedCategory === category
              ? "bg-gradient-primary text-primary-foreground shadow-lg hover:opacity-90 border-none px-6 rounded-full"
              : "bg-card/60 text-foreground-secondary hover:bg-accent/10 border-border px-6 rounded-full"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}