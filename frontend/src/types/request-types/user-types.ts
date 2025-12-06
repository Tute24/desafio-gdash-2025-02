import type { userType } from '../store-types/user-store-types'

export type getUsersResponse = {
  message: string
  users: userType[]
}
