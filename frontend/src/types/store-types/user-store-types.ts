export type userType = {
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export type UserStoreState = {
  id: string | null
  name: string | null
  email: string | null
  users: userType[]
  hasHydrated: boolean
}

export type UserStoreAction = {
  setId: (id: string | null) => void
  setName: (name: string | null) => void
  setEmail: (email: string | null) => void
  setUsers: (user: userType[]) => void
  reset: () => void
}

export type UserStore = UserStoreState & UserStoreAction
