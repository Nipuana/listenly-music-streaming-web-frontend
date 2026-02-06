"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchFilters({ searchTerm, onSearchChange }: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
        <Input
          type="text"
          placeholder="Search songs, artists, or albums..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-card/60 backdrop-blur-md border-border focus-visible:ring-secondary h-12 text-foreground"
        />
      </div>
      <Button
        variant="outline"
        className="border-border bg-card/60 hover:bg-accent/10 h-12 px-6"
      >
        <SlidersHorizontal className="w-5 h-5 text-primary mr-2" />
        Filters
      </Button>
    </div>
  );
}