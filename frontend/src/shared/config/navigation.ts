// frontend/src/shared/config/navigation.ts
export type NavigationItem = {
  name: string;
  href: string;
  children?: NavigationItem[];
};

export const navigationItems: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  {
    name: 'Über uns',
    href: '/about',
    children: [
      { name: 'Gremien', href: '/about' },
      { name: 'Satzung', href: '/satzung' },
      { name: 'Historie', href: '/historie' },
    ],
  },
  { name: 'News', href: '/newsletter' },
  {
    name: 'Dokumente',
    href: '/dokumente',
    children: [
      { name: 'Alle Dokumente', href: '/dokumente' },
      { name: 'Vereinsstruktur', href: '/dokumente/struktur' },
      { name: 'FAQ & Guides', href: '/dokumente/faq' },
    ],
  },
  {
    name: 'Kreativ',
    href: '/kreativ',
    children: [
      { name: 'Künstler', href: '/kreativ' },
      { name: 'Galerie', href: '/kreativ/galerie' },
    ],
  },
  { name: 'Kontakt', href: '/kontakt' },
];
