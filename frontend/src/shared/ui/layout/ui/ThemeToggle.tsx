// frontend/src/shared/ui/layout/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react';

import { Monitor, Moon, Sun } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Funktionen zum Anwenden des Themes
    const applyDarkTheme = () => {
      root.classList.add('dark');
    };

    const applyLightTheme = () => {
      root.classList.remove('dark');
    };

    if (theme === 'system') {
      // System-Präferenz nutzen
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        applyDarkTheme();
      } else {
        applyLightTheme();
      }

      // Listener für Änderungen
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          applyDarkTheme();
        } else {
          applyLightTheme();
        }
      };
      mediaQuery.addEventListener('change', handleChange);

      localStorage.removeItem('theme');

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      // Manuell gesetztes Theme
      if (theme === 'dark') {
        applyDarkTheme();
      } else {
        applyLightTheme();
      }
      localStorage.setItem('theme', theme);

      // Expliziter return für alle Code-Pfade
      return undefined;
    }
  }, [theme]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Theme umschalten</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme('light');
          }}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Hell</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('dark');
          }}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dunkel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme('system');
          }}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
