import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthStore } from '@/types/store-types/auth-store-types'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      hasHydrated: false,

      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)
