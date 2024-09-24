import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
      <DialogContent className='sm:max-w-[700px] w-full sm:w-auto max-h-[90vh] max-w-[65vh] overflow-y-auto rounded-md p-6 sm:max-h-[650px] sm:min-w-[450px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}
