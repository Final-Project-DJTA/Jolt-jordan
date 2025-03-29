import React, { createContext, useContext, useEffect, useState } from 'react';

// Define possible themes
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ attribute: string, defaultTheme: Theme, enableSystem: boolean, disableTransitionOnChange: boolean, children: React.ReactNode }> = ({ children, defaultTheme, enableSystem, disableTransitionOnChange }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Listen for system theme preference if enableSystem is true
  useEffect(() => {
    if (enableSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      setTheme(systemTheme);

      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [enableSystem]);

  // Apply theme to the document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`transition-all ${disableTransitionOnChange ? '' : 'transition-colors'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Hook to use theme in components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
