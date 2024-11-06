import React from 'react'

import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'

import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import EditForm from './EditorForm'
import { Member } from '@/lib/types'

interface EditMemberProps {
  permission: Member
}

export default function EditMember({ permission }: EditMemberProps) {
  return (
    <DialogForm
      id='edit-member'
      description='Make changes to member information. Click save when you are done.'
      title={`Edit Member - ${permission.users.full_name}`}
      Trigger={
        <Button variant='outline' size='icon' className='h-8 w-8'>
          <Pencil1Icon className='h-4 w-4' />
        </Button>
      }
      form={<EditForm permission={permission} />}
    />
  )
}
