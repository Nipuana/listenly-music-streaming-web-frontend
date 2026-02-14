"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  };
}
