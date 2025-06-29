import { useEffect, useState } from 'react';

import { Moon, Sun, Monitor } from 'lucide-react';

import { Button } from '@/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.setAttribute('data-theme', systemTheme);
      localStorage.removeItem('theme');
    } else {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
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
