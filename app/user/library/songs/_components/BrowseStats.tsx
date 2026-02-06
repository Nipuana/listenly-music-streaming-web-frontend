"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
}

interface BrowseStatsProps {
  stats: StatItem[];
}

export function BrowseStats({ stats }: BrowseStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-card backdrop-blur-md border-border shadow-md text-center hover:shadow-shadow-primary transition-all"
        >
          <CardContent className="pt-8 pb-8">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-foreground-muted font-medium uppercase tracking-widest">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}