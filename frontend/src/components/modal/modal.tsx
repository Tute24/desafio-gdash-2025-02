// import { LogOut } from 'lucide-react'
import { LoadingSpinner } from '../spinners/loading-spinner'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../ui/dialog'

export interface ModalComponentProps {
  guideText: string
  dialogText: string
  isLoading: boolean
  requestHandler: () => void
  buttonLayout: React.ReactNode
}

export function ModalComponent({
  guideText,
  dialogText,
  isLoading,
  requestHandler,
  buttonLayout,
}: ModalComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttonLayout}</DialogTrigger>
      <DialogContent className="max-w-[420px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{guideText}</DialogTitle>
          <DialogDescription className="font-semibold text-cyan-700">
            Are you sure you want to {dialogText}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={'default'}
              className="cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onClick={requestHandler}
            className="cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : guideText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
