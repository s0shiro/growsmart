import { Button } from '@/components/ui/button'
import React from 'react'
import CreateForm from './CreateForm'
import DialogForm from '@/app/dashboard/(components)/DialogForm'

export default function CreateMember() {
  return (
    <DialogForm
      id='create-trigger'
      description='This is description'
      title='Create Member'
      Trigger={<Button variant='outline'>+ Add User</Button>}
      form={<CreateForm />}
    />
  )
}
