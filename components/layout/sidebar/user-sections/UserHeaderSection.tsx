"use client";

import React from "react";
import { Music2 } from "lucide-react";

interface UserHeaderSectionProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function UserHeaderSection({ collapsed, setCollapsed }: UserHeaderSectionProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 focus:outline-none hover:bg-accent rounded-xl transition-all duration-300" title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-primary border border-primary/20">
              <Music2 className="w-6 h-6 text-primary" />
            </div>
          </button>
          <div 
            className="transition-all duration-300 ease-in-out overflow-hidden"
            style={{ 
              opacity: collapsed ? 0 : 1, 
              transform: collapsed ? 'translateX(-20px)' : 'translateX(0)',
              width: collapsed ? '0px' : 'auto',
              marginLeft: collapsed ? '0px' : '12px'
            }}
          >
            <h1 className="text-xl font-bold bg-(--gradient-primary) bg-clip-text text-gradient-primary whitespace-nowrap">Listenly</h1>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold whitespace-nowrap">Music Streaming</p>
          </div>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="ml-auto p-2 focus:outline-none hover:bg-accent rounded-lg transition-all duration-300"
          style={{
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? 'scale(0.8)' : 'scale(1)',
            width: collapsed ? '0px' : 'auto',
            overflow: 'hidden'
          }}
          title="Collapse sidebar"
        >
          <span className="text-lg">←</span>
        </button>
      </div>
    </div>
  );
}