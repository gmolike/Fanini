import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: { id: string; name: string; email: string }) => {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      return response.json()
    },

    onMutate: async newUserData => {
      await queryClient.cancelQueries({ queryKey: ['user', newUserData.id] })
      await queryClient.cancelQueries({ queryKey: ['users'] })

      const previousUser = queryClient.getQueryData(['user', newUserData.id])
      const previousUsers = queryClient.getQueryData(['users'])

      queryClient.setQueryData(['user', newUserData.id], newUserData)

      queryClient.setQueryData(['users'], (old: User[] | undefined) => {
        if (!old) return []
        return old.map(user => (user.id === newUserData.id ? { ...user, ...newUserData } : user))
      })

      return { previousUser, previousUsers }
    },

    onError: (err, newUserData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', newUserData.id], context.previousUser)
      }
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },

    onSettled: variables => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
