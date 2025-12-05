import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useGeneralStore } from '@/stores/general/general.store'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { updateUserSchema } from '@/schemas/update-user-schema'
import { useState } from 'react'
import { CircleX, Pencil } from 'lucide-react'
import { Label } from '../ui/label'
import { updateUserRequest } from '@/api/user/update-user-request'
import { LoadingSpinner } from '../spinners/loading-spinner'

export type updateUserType = z.infer<typeof updateUserSchema>

export interface UpdateUserFormProps {
  name: string | undefined
  email: string | undefined
}

export function UpdateUserForm({ name, email }: UpdateUserFormProps) {
  const statusMessage = useGeneralStore((store) => store.statusMessage)
  const isLoading = useGeneralStore((store) => store.isLoading)
  const [enableNameUpdate, setEnableNameUpdate] = useState(false)
  const [enableEmailUpdate, setEnableEmailUpdate] = useState(false)
  const [activePasswordUpdate, setActivePasswordUpdate] = useState(false)
  const {
    register,
    handleSubmit,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<updateUserType>({
    defaultValues: {
      name: name,
      email: email,
    },
    resolver: zodResolver(updateUserSchema),
  })

  const onSubmit: SubmitHandler<updateUserType> = async (data) => {
    const response = await updateUserRequest(data)

    if (response.success) {
      window.alert('user successfully updated')
    }
  }
  return (
    <div className="flex flex-col items-center justify-center m-auto pt-10">
      <Card className="hover:shadow-lg hover:shadow-cyan-700 w-[360px] sm:w-[420px]">
        <CardHeader>
          <CardTitle className="text-bold text-xl text-center whitespace-nowrap text-cyan-700">
            Update your user infos below:
          </CardTitle>
          <CardDescription className="text-center whitespace-nowrap">
            You can update your name, e-mail and/or password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start gap-3 font- w-full">
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row justify-between">
                      <Label className="text-md text-stone-700">
                        Update your name
                      </Label>
                      <Button
                        onClick={() => {
                          if (enableNameUpdate) {
                            setEnableNameUpdate(false)
                            resetField('name', { defaultValue: name })
                          } else {
                            clearErrors()
                            setEnableNameUpdate(true)
                          }
                        }}
                        variant={'ghost'}
                        className="cursor-pointer"
                        type="button"
                        data-testid="pencil1"
                      >
                        <Pencil size={30} className="text-green-600" />
                      </Button>
                    </div>
                    <Input
                      className="text-md text-cyan-700 font-bold"
                      type="text"
                      {...register('name')}
                      disabled={!enableNameUpdate}
                    />
                  </div>
                </div>
                {errors.name && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row justify-between">
                      <Label className="text-md text-stone-700">
                        Update your e-mail
                      </Label>
                      <Button
                        onClick={() => {
                          if (enableEmailUpdate) {
                            setEnableEmailUpdate(false)
                            resetField('email', { defaultValue: email })
                          } else {
                            clearErrors()
                            setEnableEmailUpdate(true)
                          }
                        }}
                        variant={'ghost'}
                        className="cursor-pointer"
                        type="button"
                        data-testid="pencil2"
                      >
                        <Pencil size={30} className="text-green-600" />
                      </Button>
                    </div>
                    <Input
                      className="text-md text-cyan-700 font-bold"
                      type="text"
                      {...register('email')}
                      disabled={!enableEmailUpdate}
                    />
                  </div>
                </div>
                {errors.email && (
                  <p className="font-inter text-red-600 text-sm wrap-break-words">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {activePasswordUpdate && (
                <>
                  <div className="flex flex-col gap-2 items-start justify-start w-full">
                    <div className="flex flex-row gap-2 w-full">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row justify-between">
                          <Label className="text-md text-stone-700">
                            Update your password
                          </Label>
                          <Button
                            variant={'ghost'}
                            className="cursor-pointer"
                            onClick={() => {
                              clearErrors()
                              setActivePasswordUpdate(false)
                            }}
                            type="button"
                          >
                            <CircleX className="text-red-600" size={30} />
                          </Button>
                        </div>
                        <Input
                          className="text-md text-cyan-700 font-bold w-full"
                          type="password"
                          {...register('passwordUpdate.password')}
                          placeholder="Update your password"
                        />
                      </div>
                    </div>
                    {errors.passwordUpdate?.password && (
                      <p className="font-inter text-red-600 text-sm wrap-break-words">
                        {errors.passwordUpdate.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-start justify-start w-full">
                    <div className="flex flex-row justify-between gap-10 items-baseline">
                      <Label className="text-md text-stone-700">
                        Confirm your password update
                      </Label>
                    </div>
                    <Input
                      className="text-md text-cyan-700"
                      type="password"
                      {...register('passwordUpdate.confirmPassword')}
                      placeholder="Confirm your password"
                    />
                    {errors.passwordUpdate?.confirmPassword && (
                      <p className="font-inter text-red-600 text-sm wrap-break-words">
                        {errors.passwordUpdate.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="w-full items-center pt-3 flex flex-col gap-3">
                <Button
                  className="cursor-pointer w-full font-bold text-lg items-center text-center"
                  type="button"
                  disabled={isSubmitting || isLoading || activePasswordUpdate}
                  onClick={() => {
                    clearErrors()
                    setActivePasswordUpdate(true)
                  }}
                >
                  {'I want to update my password'}
                </Button>
                <Button
                  className="cursor-pointer w-full font-bold text-lg hover:bg-cyan-700 items-center text-center"
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isLoading ||
                    (!activePasswordUpdate &&
                      !enableEmailUpdate &&
                      !enableNameUpdate)
                  }
                >
                  {isSubmitting || isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    'Submit Update'
                  )}
                </Button>
                <span className="text-sm wrap-break-words pt-2">
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
