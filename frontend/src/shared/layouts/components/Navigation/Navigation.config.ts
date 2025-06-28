import { Home, Calendar, Users, Settings, Info } from 'lucide-react'

export const navigationConfig = {
  items: [
    { label: 'Dashboard', path: '/app', icon: Home },
    { label: 'Events', path: '/app/events', icon: Calendar },
    { label: 'Mitglieder', path: '/app/members', icon: Users },
    { label: 'Einstellungen', path: '/app/settings', icon: Settings },
  ],
  publicItems: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Über uns', path: '/about', icon: Info },
    { label: 'Events', path: '/events', icon: Calendar },
  ],
  variants: {
    default: {
      container: 'p-4',
      list: 'space-y-2',
      item: 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
      itemActive: 'bg-accent text-accent-foreground',
      icon: 'h-5 w-5',
    },
    compact: {
      container: 'p-2',
      list: 'space-y-1',
      item: 'flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-accent',
      itemActive: 'bg-accent text-accent-foreground',
      icon: 'h-5 w-5',
    },
  },
} as const
