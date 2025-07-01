// widgets/public/organization/board/List.tsx
import { useState } from 'react';
import type { BoardMember } from '@/entities/public/organization';
import { Card } from './Card';
import { DetailModal } from './DetailModal';

type ListProps = {
  members: BoardMember[];
};

/**
 * Liste der Vorstandsmitglieder
 * @param members - Array der Vorstandsmitglieder
 */
export const List = ({ members }: ListProps) => {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map(member => (
          <Card key={member.id} member={member} onSelect={setSelectedMember} />
        ))}
      </div>

      <DetailModal
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
};
