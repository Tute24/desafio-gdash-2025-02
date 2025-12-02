export type GeneralStoreState = {
  statusMessage: string | null
  aiInsights: string | null
  isLoading: boolean
  hasHydrated: boolean
}

export type GeneralStoreAction = {
  setStatusMessage: (statusMessage: string | null) => void
  setAiInsights: (aiInsights: string | null) => void
  setIsLoading: (statusMessage: boolean) => void
}

export type GeneralStore = GeneralStoreAction & GeneralStoreState
