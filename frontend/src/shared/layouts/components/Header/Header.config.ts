export const headerConfig = {
  base: 'sticky top-0 z-50 bg-background border-b',
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  wrapper: 'flex h-16 items-center justify-between',
  logoLink: 'flex items-center',
  nav: {
    desktop: 'hidden md:flex md:items-center md:gap-6',
    mobile: 'md:hidden',
    link: 'text-sm font-medium transition-colors hover:text-fanini-blue',
    linkActive: 'text-fanini-blue',
  },
} as const
