export type AuthStoreState = {
  token: string | null
  hasHydrated: boolean
}

export type AuthStoreAction = {
  setToken: (token: string | null) => void
}

export type AuthStore = AuthStoreState & AuthStoreAction
