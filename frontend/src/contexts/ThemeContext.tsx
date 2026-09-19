"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "sayido_dashboard_theme";

/**
 * Returns true if the pathname is an authenticated/dashboard route
 * where dark mode is supported (Visitor & Vendor sites).
 */
export const isDashboardRoute = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname.startsWith("/visitor-") ||
    pathname.startsWith("/vendor-") ||
    pathname.startsWith("/guest-list") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-of-use") ||
    pathname.startsWith("/profile")
  );
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize stored theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
      }
    } catch {
      // localStorage may not be available in some environments
    }
    setMounted(true);
  }, []);

  // Synchronize DOM .dark class based on route and stored preference
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const isDashboard = isDashboardRoute(pathname);

    // If on a visitor or vendor dashboard route and theme is dark, apply .dark
    if (isDashboard && theme === "dark") {
      root.classList.add("dark");
    } else {
      // Otherwise (public routes or light theme), strictly remove .dark
      root.classList.remove("dark");
    }
  }, [pathname, theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isDark = mounted && theme === "dark" && isDashboardRoute(pathname);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
