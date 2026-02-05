"use client";

import React from "react";
import { Music2 } from "lucide-react";

interface HeaderSectionProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function HeaderSection({ collapsed, setCollapsed }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {collapsed ? (
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 focus:outline-none hover:bg-accent rounded-xl transition-all" title="Expand sidebar">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-primary border border-primary/20">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-primary border border-primary/20">
              <Music2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-(--gradient-primary) bg-clip-text text-gradient-primary">Listenly</h1>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-2 focus:outline-none hover:bg-accent rounded-lg transition-all" title="Collapse sidebar">
            <span className="text-lg">←</span>
          </button>
        </div>
      )}
    </div>
  );
}