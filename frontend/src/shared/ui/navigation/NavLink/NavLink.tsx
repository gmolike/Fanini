import * as React from 'react';

import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib';

import type { NavLinkProps } from './model/types';

/**
 * NavLink Komponente
 * @description Navigationslink mit aktiven States und Styling-Varianten
 */
export const NavLink: React.FC<NavLinkProps> = ({
  children,
  variant = 'default',
  size = 'default',
  icon: Icon,
  badge,
  isExternal = false,
  className,
  to,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variantClasses = {
    default: 'text-foreground hover:text-primary [&.active]:text-primary',
    primary: 'text-primary hover:text-primary/80 [&.active]:text-primary [&.active]:font-semibold',
    ghost:
      'text-muted-foreground hover:text-foreground hover:bg-accent [&.active]:bg-accent [&.active]:text-accent-foreground',
    sidebar:
      'w-full justify-start rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    default: 'px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span className="flex-1">{children}</span>
      {badge !== undefined ? (
        <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={to as string}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      >
        {content}
      </a>
    );
  }

  if (to === undefined) {
    return null;
  }

  return (
    <Link
      to={to}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      activeProps={{ className: 'active' }}
      {...props}
    >
      {content}
    </Link>
  );
};
