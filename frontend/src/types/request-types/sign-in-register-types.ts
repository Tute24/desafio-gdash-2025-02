export type SignInAndRegisterResponse = {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}
