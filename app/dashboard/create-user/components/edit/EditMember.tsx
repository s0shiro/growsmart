import React from 'react'

import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'

import DialogForm from '@/app/dashboard/(components)/DialogForm'
import EditForm from './EditorForm'

export default function EditMember() {
  return (
    <DialogForm
      id='update-trigger'
      description='this is description'
      title='Edit Member'
      Trigger={
        <Button variant='outline'>
          <Pencil1Icon />
          Edit
        </Button>
      }
      form={<EditForm />}
    />
  )
}
