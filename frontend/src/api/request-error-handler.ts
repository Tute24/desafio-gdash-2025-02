import axios from 'axios'

export interface RequestErrorHandlerProps {
  error: unknown
  setStatusMessage?: (statusMessage: string) => void
}

export type ExceptionError = {
  message: string
  error: string
  statusCode: 401
}

export default function RequestErrorHandler({
  error,
  setStatusMessage,
}: RequestErrorHandlerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isExceptionError(data: any): data is ExceptionError {
    return (
      data &&
      typeof data.message === 'string' &&
      typeof data.error === 'string' &&
      typeof data.statusCode === 'number'
    )
  }
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data
    if (isExceptionError(errorData)) {
      if (setStatusMessage) setStatusMessage(errorData.message)
      console.log(errorData.error, errorData.statusCode)
    } else {
      console.log('Something went wrong with the axios request.', error)
    }
  } else {
    console.log('Something went wrong.', error)
  }
}
