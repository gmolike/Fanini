/**
 * @module dataTable/headers/Simple
 * @description Einfacher Header ohne Funktionalität
 */

/**
 * Simple Header Component
 *
 * @description Rendert einen einfachen Text-Header ohne Interaktionsmöglichkeiten
 *
 * @param props - Header Properties
 * @returns Rendered header
 */
export const Simple = ({ label }: { label: string }) => (
  <span className="text-xs font-medium tracking-wider uppercase">{label}</span>
);
