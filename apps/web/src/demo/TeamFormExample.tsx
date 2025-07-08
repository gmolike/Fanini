// src/demo/TeamFormExample.tsx
import { TeamForm } from './ui';

import type { PersonInfo, TeamDto } from './model/types';

export const TeamFormExample = () => {
  // Example: Creating new team
  const handleCreate = (data: TeamDto) => {
    console.log('Creating team with data:', data);
    // data.verantwortlichId contains only the ID
  };

  // Example: Editing existing team
  const existingTeam: TeamDto = {
    teamName: 'Frontend Team',
    description: 'Responsible for UI development',
    verantwortlichId: '2',
    members: [],
  };

  const existingPerson: PersonInfo = {
    id: '2',
    vorname: 'Anna',
    nachname: 'Schmidt',
    gremium: 'Beirat',
  };

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Team Form Demo</h1>

      {/* Create new team */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl">Create New Team</h2>
        <TeamForm onSubmit={handleCreate} />
      </div>

      {/* Edit existing team */}
      <div>
        <h2 className="mb-4 text-xl">Edit Existing Team</h2>
        <TeamForm
          defaultValues={existingTeam}
          defaultPersonInfo={existingPerson}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
};
