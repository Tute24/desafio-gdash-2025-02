import { LogOut } from 'lucide-react'
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
  requestHandler: () => void
}

export function ModalComponent({
  guideText,
  dialogText,
  requestHandler,
}: ModalComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="cursor-pointer">
          <LogOut className="text-cyan-700" size={30} />
          <div className="text-cyan-700 font-semibold text-lg">{guideText}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[420px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{guideText}</DialogTitle>
          <DialogDescription className="font-semibold text-cyan-700">
            Are you sure you want to {dialogText}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'default'} className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onClick={requestHandler}
            className="cursor-pointer"
          >
            {guideText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
