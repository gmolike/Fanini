// src/widgets/Layout/Header.tsx
import { Link } from '@tanstack/react-router'
import { Bell, User } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu'

export const Header = () => {
  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between flex-shrink-0">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">F</span>
        </div>
        <div className="hidden sm:block">
          <div className="font-heading text-xl font-bold text-primary">Faninitiative</div>
          <div className="text-xs text-muted-foreground -mt-1">Spandau e.V.</div>
        </div>
      </Link>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/app/profile">Mein Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/">Einstellungen</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Abmelden</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
