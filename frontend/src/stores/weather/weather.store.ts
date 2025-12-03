import type { Weatherstore } from '@/types/store-types/weather-store-types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useWeatherStore = create<Weatherstore>()(
  persist(
    (set) => ({
      current: null,
      daily: [],
      geo: null,
      hasHydrated: false,

      setCurrent: (current) => set({ current }),
      setDaily: (daily) => set({ daily }),
      setGeo: (geo) => set({ geo }),
    }),
    {
      name: 'weather-store',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)
