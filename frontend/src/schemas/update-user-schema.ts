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

export const updatePasswordSchema = z
  .object({
    password: passwordSchema.optional(),
    confirmPassword: z.string().optional(),
  })
  .optional()
  .superRefine((data, ctx) => {
    if (!data) return
    if (data.password && !data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Password and Confirm Password must not be empty.',
      })
    }

    if (!data.password && data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password and Confirm Password must not be empty.',
      })
    }

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords must be the same.',
      })
    }
  })

export const updateUserSchema = z.object({
  name: z
    .string({ message: 'Not a valid name.' })
    .nonempty({ message: 'Name cannot be empty.' })
    .min(2, { message: 'Name must have at least 2 characters.' })
    .optional(),
  email: z.email({ message: 'Not a valid e-mail address.' }).optional(),
  passwordUpdate: updatePasswordSchema.optional(),
})
