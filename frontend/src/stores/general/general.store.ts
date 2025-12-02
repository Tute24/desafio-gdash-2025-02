import type { GeneralStore } from '@/types/store-types/general-store-types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      statusMessage: null,
      aiInsights: null,
      isLoading: false,
      hasHydrated: false,

      setStatusMessage: (statusMessage) => set({ statusMessage }),
      setAiInsights: (aiInsights) => set({ aiInsights }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'general-store',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)
