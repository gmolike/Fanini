// features/public/organization-detail/ui/MemberSection.tsx
import { motion } from 'framer-motion';
import { Mail, Phone, User, Users } from 'lucide-react';

import type { GremiumMember } from '@/entities/public/organization';

import { Badge } from '@/shared/shadcn';
import { GlassCard, HoverCard } from '@/shared/ui';

type MemberSectionProps = {
  members: GremiumMember[];
};

export const MemberSection = ({ members }: MemberSectionProps) => {
  return (
    <GlassCard className="mb-8 p-8">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
        <Users className="h-6 w-6 text-[var(--color-fanini-blue)]" />
        Mitglieder
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HoverCard>
              <div className="rounded-xl border p-6">
                <div className="flex items-start gap-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {member.role}
                    </Badge>
                    {member.description ? (
                      <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                        {member.description}
                      </p>
                    ) : null}
                    <div className="mt-4 space-y-2 text-sm">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-fanini-blue)]"
                        >
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </a>
                      ) : null}
                      {member.phone ? (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-fanini-blue)]"
                        >
                          <Phone className="h-4 w-4" />
                          {member.phone}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </HoverCard>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};
