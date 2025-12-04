import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserStore } from '@/types/store-types/user-store-types'

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      role: 'user',
      users: [],
      hasHydrated: false,

      setId: (id) => set({ id }),
      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setRole: (role) => set({ role }),
      setUsers: (users) => set({ users }),
      reset: () =>
        set({ id: null, name: null, email: null, role: 'user', users: [] }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)
