export type SignInRegisterUpdateResponse = {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  }
}
