"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMounted: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode; user?: any }> = ({ children, user }) => {
  // Initialize from localStorage, default to false if not set
  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-collapsed');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  const [isMounted, setIsMounted] = useState(false);

  // Mark as mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Force sidebar to be expanded for non-admin users
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && collapsed) {
      setCollapsedState(false);
    }
  }, [user, collapsed]);

  // Update localStorage whenever collapsed state changes
  const setCollapsed = (newCollapsed: boolean) => {
    // Prevent collapsing for non-admin users
    if (user && user.role?.toLowerCase() !== 'admin' && newCollapsed) {
      return;
    }
    setCollapsedState(newCollapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
    }
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, isMounted }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    // Return default values if not in provider (e.g., during SSR)
    return { collapsed: false, setCollapsed: () => {}, isMounted: false };
  }
  return context;
};