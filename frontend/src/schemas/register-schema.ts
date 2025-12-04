import z from 'zod'

export const passwordSchema = z
  .string()
  .min(8, {
    message:
      'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
  })
  .regex(/[A-Z]/, {
    message: 'Password must include at least one uppercase letter.',
  })
  .regex(/[0-9]/, {
    message: 'Password must include at least one number.',
  })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must include at least one special character.',
  })

export const registerSchema = z
  .object({
    name: z.string({ message: 'Not a valid name.' }).min(2),
    email: z.email({ message: 'Not a valid e-mail address.' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must be the same.',
  })
