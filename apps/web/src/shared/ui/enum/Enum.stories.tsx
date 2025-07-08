// frontend/src/shared/ui/enum/Enum.stories.tsx
import { createEnumVariantConfig, EnumBadge, EnumLabel } from './index';

import type { Meta, StoryObj } from '@storybook/react';

// Beispiel Enums
const EventStatus = {
  DRAFT: 'Entwurf',
  PLANNED: 'Geplant',
  APPROVED: 'Genehmigt',
  ACTIVE: 'Aktiv',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Abgesagt',
} as const;

const MemberRole = {
  ADMIN: 'Administrator',
  BOARD: 'Vorstand',
  MEMBER: 'Mitglied',
  GUEST: 'Gast',
} as const;

// Configs
const eventStatusConfig = createEnumVariantConfig(EventStatus, {
  DRAFT: 'default',
  PLANNED: 'info',
  APPROVED: 'success',
  ACTIVE: 'warning',
  COMPLETED: 'default',
  CANCELLED: 'error',
});

const memberRoleConfig = createEnumVariantConfig(MemberRole, {
  ADMIN: 'purple',
  BOARD: 'success',
  MEMBER: 'default',
  GUEST: 'outline',
});

const meta = {
  title: 'enum',
  component: EnumBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EnumBadge>;

export default meta;

export const StatusBadges: StoryObj<typeof EnumBadge> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(EventStatus).map(key => (
        <EnumBadge key={key} value={key as keyof typeof EventStatus} config={eventStatusConfig} />
      ))}
    </div>
  ),
};

export const RoleBadges: StoryObj<typeof EnumBadge> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(MemberRole).map(key => (
        <EnumBadge key={key} value={key as keyof typeof MemberRole} config={memberRoleConfig} />
      ))}
    </div>
  ),
};

export const Sizes: StoryObj<typeof EnumBadge> = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-20">Small:</span>
        <EnumBadge value="ACTIVE" config={eventStatusConfig} size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20">Medium:</span>
        <EnumBadge value="ACTIVE" config={eventStatusConfig} size="md" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20">Large:</span>
        <EnumBadge value="ACTIVE" config={eventStatusConfig} size="lg" />
      </div>
    </div>
  ),
};

export const Labels: StoryObj<typeof EnumBadge> = {
  render: () => (
    <div className="space-y-2">
      <div>
        Status: <EnumLabel value="APPROVED" config={eventStatusConfig} />
      </div>
      <div>
        Rolle: <EnumLabel value="BOARD" config={memberRoleConfig} className="font-semibold" />
      </div>
      <div>
        Unbekannt: <EnumLabel value={null} config={eventStatusConfig} fallback="N/A" />
      </div>
    </div>
  ),
};
