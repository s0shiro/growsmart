import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { ReactNode } from 'react'

export default function DialogForm({
  Trigger,
  id,
  title,
  form,
  description,
}: {
  title: string
  description: string
  Trigger: ReactNode
  id: string
  form: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild id={id}>
        {Trigger}
      </DialogTrigger>
      {/* className='sm:max-w-[700px] w-full sm:w-auto max-h-[90vh] rounded-md sm:max-h-[650px] sm:min-w-[450px]' */}
      <DialogContent>
        <ScrollArea className='h-full max-h-[calc(90vh-4rem)]'>
          <div className='pr-5'>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {form}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
