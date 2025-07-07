// src/pages/team/ui/CreateTeamPage.tsx
import { useRouter } from '@tanstack/react-router';
import { TeamForm } from '@/features/team/ui/TeamForm';
import type { TeamFormDto } from '@/entities/team/model/types';

/**
 * Create Team Page - Allows users to create a new team
 */
export const CreateTeamPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: TeamFormDto) => {
    console.log('Team data:', data);
    // API call hier

    // Navigate nach Erfolg
    await router.navigate({ to: '/teams' });
  };

  const handleCancel = () => {
    router.history.back();
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <TeamForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};
