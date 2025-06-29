import React, { useState } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import {
  Activity,
  Calendar,
  ChevronRight,
  FileText,
  Home,
  Image,
  Settings,
  User,
  Users,
} from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: { label: string; href: string }[];
}

type NavSection = {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Übersicht',
    items: [
      { label: 'Dashboard', href: '/app/dashboard', icon: Home },
      { label: 'Aktivitäten', href: '/app/activities', icon: Activity },
    ],
  },
  {
    title: 'Verwaltung',
    items: [
      {
        label: 'Events',
        href: '/app/events',
        icon: Calendar,
        badge: '3',
        children: [
          { label: 'Alle Events', href: '/app/events' },
          { label: 'Meine Events', href: '/app/events/my' },
          { label: 'Kalender', href: '/app/events/calendar' },
        ],
      },
      {
        label: 'Mitglieder',
        href: '/app/members',
        icon: Users,
        children: [
          { label: 'Mitgliederliste', href: '/app/members' },
          { label: 'Positionen', href: '/app/members/roles' },
        ],
      },
    ],
  },
  {
    title: 'Inhalte',
    items: [
      { label: 'Rückblicke', href: '/app/articles', icon: FileText },
      { label: 'Medien', href: '/app/media', icon: Image },
    ],
  },
  {
    title: 'Persönlich',
    items: [
      { label: 'Mein Profil', href: '/app/profile', icon: User },
      { label: 'Einstellungen', href: '/app/settings', icon: Settings },
    ],
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <aside className="bg-card w-72 flex-shrink-0 overflow-y-auto border-r">
      <div className="space-y-8 p-4">
        {navigation.map(section => (
          <div key={section.title}>
            <h3 className="text-muted-foreground mb-3 px-3 text-xs font-semibold tracking-wider uppercase">
              {section.title}
            </h3>

            <nav className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isExpanded = expandedItems.includes(item.label);
                const isItemActive = isActive(item.href);

                return (
                  <div key={item.href}>
                    <button
                      onClick={() => {
                        if (item.children) toggleExpanded(item.label);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isItemActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>

                      {item.badge ? (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      ) : null}

                      {item.children ? (
                        <ChevronRight
                          className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
                        />
                      ) : null}
                    </button>

                    {/* Untermenü */}
                    {item.children && isExpanded ? (
                      <div className="mt-1 ml-9 space-y-1">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'block rounded-md px-3 py-1.5 text-sm transition-colors',
                              isActive(child.href)
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};
