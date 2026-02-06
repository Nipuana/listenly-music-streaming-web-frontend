"use client";

import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LibraryHeaderProps {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
}

export function LibraryHeader({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
}: LibraryHeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                {title}
              </h1>
              <p className="text-sm text-foreground-muted">{subtitle}</p>
            </div>
          </div>

          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/80 border-none"
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}