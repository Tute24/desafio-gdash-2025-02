import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email({ message: 'This is not a valid e-mail address.' }),
  password: z.string(),
})
