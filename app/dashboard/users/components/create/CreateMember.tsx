import { Button } from '@/components/ui/button'
import React from 'react'
import CreateForm from './CreateForm'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import { UserPlus } from 'lucide-react'

export default function CreateMember() {
  return (
    <DialogForm
      id='create-member'
      description='Add a new user to the system'
      title='Create User'
      Trigger={
        <Button>
          <UserPlus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      }
      form={<CreateForm />}
    />
  )
}
