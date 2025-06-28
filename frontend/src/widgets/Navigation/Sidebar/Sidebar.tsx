import { NavLink } from '@/shared/ui/navigation/NavLink'
import { Calendar, Home, Settings, User, Users } from 'lucide-react'
import * as React from 'react'

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: Home,
  },
  {
    label: 'Events',
    href: '/app/events',
    icon: Calendar,
  },
  {
    label: 'Mitglieder',
    href: '/app/members',
    icon: Users,
  },
  {
    label: 'Mein Profil',
    href: '/app/profile',
    icon: User,
  },
] as const

/**
 * Sidebar Komponente
 * @description Seitennavigation für den Mitgliederbereich
 */
export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Mitgliederbereich</h2>

        <nav className="space-y-1">
          {sidebarItems.map(item => (
            <NavLink key={item.href} to={item.href} variant="sidebar" icon={item.icon}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t mt-6 pt-4">
          <NavLink to="/app/profile" variant="sidebar" icon={Settings}>
            Profil
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
