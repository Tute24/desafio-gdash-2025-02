export type UserStoreState = {
  id: string | null
  name: string | null
  email: string | null
  hasHydrated: boolean
}

export type UserStoreAction = {
  setId: (id: string | null) => void
  setName: (name: string | null) => void
  setEmail: (email: string | null) => void
  reset: () => void
}

export type UserStore = UserStoreState & UserStoreAction
