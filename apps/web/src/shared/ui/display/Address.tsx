import { cn } from '@/shared/lib';

import { TextDisplay } from '.';

type Props = {
  address?: {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  } | null;
  format?: 'inline' | 'multiline';
  hideEmpty?: boolean;
  className?: string;
};

/**
 * AddressDisplay
 * @description Komponente zur Anzeige von Adressen
 * @param address - Adress-Objekt
 * @param format - inline oder multiline Darstellung
 * @param hideEmpty - Leere Felder ausblenden
 */
export const Address = ({ address, format = 'inline', hideEmpty = true, className }: Props) => {
  if (!address) {
    return <TextDisplay text={null} className={className} />;
  }

  const parts = [
    address.street,
    [address.postalCode, address.city].join(' '),
    address.country,
  ].filter((part): boolean => !hideEmpty || !!part);

  if (parts.length === 0) {
    return <TextDisplay text={null} className={className} />;
  }

  if (format === 'inline') {
    return <span className={cn('truncate', className)}>{parts.join(', ')}</span>;
  }

  return (
    <div className={cn('space-y-1', className)}>
      {parts.map(part => (
        <div key={part}>{part}</div>
      ))}
    </div>
  );
};
