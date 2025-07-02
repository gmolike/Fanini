import { useState } from 'react';

import { type BoardMember, useBoardMembers } from '@/entities/public/organization';

import { LoadingState } from '@/shared/ui/feedback';

import { MemberCard } from './MemberCard';
import { MemberDetailModal } from './MemberDetailModal';

/**
 * BoardView Feature
 * @description Zeigt Vorstandsmitglieder mit Detailansicht
 */
export const BoardView = () => {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const boardQuery = useBoardMembers();

  return (
    <LoadingState query={boardQuery}>
      {response => (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.data.map(member => (
              <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
            ))}
          </div>

          <MemberDetailModal
            member={selectedMember}
            open={!!selectedMember}
            onClose={() => {
              setSelectedMember(null);
            }}
          />
        </>
      )}
    </LoadingState>
  );
};
