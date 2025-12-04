import { useGeneralStore } from '@/stores/general/general.store'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type z from 'zod'
import { registerSchema } from '@/schemas/register-schema'
import { registerRequest } from '@/api/auth/register-request'
import { useNavigate } from 'react-router-dom'

export type registerType = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const navigate = useNavigate()
  const statusMessage = useGeneralStore((store) => store.statusMessage)
  const isLoading = useGeneralStore((store) => store.isLoading)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerType>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit: SubmitHandler<registerType> = async (data) => {
    const response = await registerRequest(data)
    if (response.success) {
      navigate('/portal/dashboard')
    }
  }
  return (
    <div className="flex flex-col items-center justify-center m-auto pt-10">
      <Card className="hover:shadow-lg hover:shadow-cyan-700 w-[360px] sm:w-[420px]">
        <CardHeader>
          <CardTitle className="text-bold text-xl text-center whitespace-nowrap text-cyan-700">
            Create an account below:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start gap-3 font- w-full">
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <Label className="text-md text-stone-700">
                  Enter your name
                </Label>
                <Input
                  className="text-md text-cyan-700"
                  type="text"
                  {...register('name')}
                  placeholder="Your name here"
                />
                {errors.name && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <Label className="text-md text-stone-700">
                  Enter your e-mail
                </Label>
                <Input
                  className="text-md text-cyan-700"
                  type="text"
                  {...register('email')}
                  placeholder="Your e-mail here"
                />
                {errors.email && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row justify-between gap-10 items-baseline">
                  <Label className="text-md text-stone-700">
                    Enter your password
                  </Label>
                </div>
                <Input
                  className="text-md text-cyan-700"
                  type="password"
                  {...register('password')}
                  placeholder="Your password here"
                />
                {errors.password && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row justify-between gap-10 items-baseline">
                  <Label className="text-md text-stone-700">
                    Confirm your password
                  </Label>
                </div>
                <Input
                  className="text-md text-cyan-700"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Your password here"
                />
                {errors.confirmPassword && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="w-full items-center pt-3 flex flex-col">
                <Button
                  className="cursor-pointer w-full font-bold text-lg hover:bg-cyan-700"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting || isLoading ? 'Submitting' : 'Register'}
                </Button>
                <span className="text-red-600 text-sm wrap-break-words pt-2">
                  {statusMessage}
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
