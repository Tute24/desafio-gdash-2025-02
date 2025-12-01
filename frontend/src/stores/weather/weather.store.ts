import type { Weatherstore } from '@/types/weather-store-types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useWeatherStore = create<Weatherstore>()(
  persist(
    (set) => ({
      currentWeather: null,
      dailyWeather: [],
      geo: null,
      hasHydrated: false,

      setCurrentWeather: (currentWeather) => set({ currentWeather }),
      setDailyWeather: (dailyWeather) => set({ dailyWeather }),
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
