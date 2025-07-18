// apps/web/src/features/intern/member/ui/MemberBreadcrumb.tsx
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';

import { useMemberDetail } from '@/entities/intern/member';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * MemberBreadcrumb Component
 *
 * @description Breadcrumb-Navigation für Member-Bereich
 * @returns {JSX.Element} Breadcrumb navigation
 */
export const Breadcrumb = () => {
  const location = useLocation();
  const { pathname } = location;
  const params = useParams({ strict: false });

  // Member-Daten für Detail/Edit Pages
  const { memberId } = params;
  const memberQuery = useMemberDetail({
    memberId: memberId ?? '',
  });

  const items: BreadcrumbItem[] = [{ label: 'Start', href: '/intern' }];

  // Basis-Navigation
  if (pathname.includes('/member')) {
    items.push({ label: 'Mitglieder', href: '/intern/member/list' });
  }

  // Spezifische Seiten
  if (pathname.includes('/member/dashboard')) {
    items.push({ label: 'Dashboard' });
  } else if (pathname.includes('/member/list')) {
    items.push({ label: 'Liste' });
  } else if (pathname.includes('/member/create')) {
    items.push({ label: 'Neues Mitglied' });
  } else if (pathname.includes('/member/detail/') && memberId) {
    if (memberQuery.data?.data) {
      const member = memberQuery.data.data;
      items.push({
        label: `${member.vorname} ${member.nachname}`,
        href: `/intern/member/detail/${memberId}`,
      });
    } else {
      items.push({ label: 'Profil' });
    }
  } else if (pathname.includes('/member/edit/') && memberId) {
    if (memberQuery.data?.data) {
      const member = memberQuery.data.data;
      items.push({
        label: `${member.vorname} ${member.nachname}`,
        href: `/intern/member/detail/${memberId}`,
      });
      items.push({ label: 'Bearbeiten' });
    } else {
      items.push({ label: 'Bearbeiten' });
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 && <Home className="text-muted-foreground mr-2 h-4 w-4" />}
          {index > 0 && <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />}

          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
