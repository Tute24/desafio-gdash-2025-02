import { useGeneralStore } from '@/stores/general/general.store'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/schemas/sign-in-schema'
import { signInRequest } from '@/api/auth/sign-in-request'
import { useNavigate } from 'react-router-dom'

export type signInType = z.infer<typeof signInSchema>
export default function SignInForm() {
  const navigate = useNavigate()
  const statusMessage = useGeneralStore((store) => store.statusMessage)
  const isLoading = useGeneralStore((store) => store.isLoading)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInType>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit: SubmitHandler<signInType> = async (data) => {
    const response = await signInRequest(data)
    if (response.success) {
      navigate('/portal/dashboard')
    }
  }
  return (
    <div className="flex flex-col items-center justify-center m-auto pt-10">
      <Card className="hover:shadow-lg hover:shadow-cyan-700">
        <CardHeader>
          <CardTitle className="text-bold text-xl text-center text-cyan-700">
            Sign in to your account below:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start gap-3 font- w-full">
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <Label className="text-md text-stone-700">
                  Enter your e-mail
                </Label>
                <Input
                  className="text-md text-cyan-700"
                  type="text"
                  {...register('email')}
                  placeholder="Your e-mail here"
                  required
                />
                {errors.email && (
                  <p className="font-inter text-red-600 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row justify-between gap-10 items-baseline">
                  <Label className="text-md text-stone-700">
                    Enter your password
                  </Label>
                  <p className="cursor-pointer text-xs text-stone-700 items-center hover:underline hover:text-cyan-700">
                    Forgot your password?
                  </p>
                </div>
                <Input
                  className="text-md text-cyan-700"
                  type="password"
                  {...register('password')}
                  placeholder="Your password here"
                  required
                />
                {errors.password && (
                  <p className="font-inter text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="w-full items-center pt-3 flex flex-col">
                <Button
                  className="cursor-pointer w-full font-bold text-lg hover:bg-cyan-700"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting || isLoading ? 'Submitting' : 'Sign In'}
                </Button>
                <span className="text-red-600 text-sm pt-2">
                  {statusMessage}
                </span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 items-center font-inter">
          <p className="text-lg text-stone-700">
            Don't have an account?{' '}
            <Link to="/register">
              <span className="cursor-pointer font-bold hover:underline hover:text-cyan-700">
                Sign Up Now!
              </span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
