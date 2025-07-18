// apps/web/src/features/intern/member/detail/hooks/useSafePermissions.ts

import { type UserPermissions, useUserPermissions } from '@/entities/intern/member';

export const useSafePermissions = () => {
  const query = useUserPermissions();

  // Default permissions
  const defaultPermissions: UserPermissions = {
    userId: '',
    role: 'MITGLIED',
    permissions: [],
    dataAccess: {
      members: {
        read: false,
        write: false,
        sensitivityLevel: 'none',
      },
    },
  };

  // Safe data with fallback
  const safeData: UserPermissions = query.data ?? defaultPermissions;

  return {
    ...query,
    data: safeData,
    // Helper getters
    userRole: safeData.role,
    userId: safeData.userId,
    canRead: safeData.dataAccess.members.read,
    canWrite: safeData.dataAccess.members.write,
    sensitivityLevel: safeData.dataAccess.members.sensitivityLevel,
  };
};
