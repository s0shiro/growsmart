import React from 'react'

import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'

import EditForm from './EditorForm'
import { Member } from '@/lib/types'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import { useEditMemberStore } from '@/stores/useEditUsersStore'

interface EditMemberProps {
  permission: Member
}

export default function EditMember({ permission }: EditMemberProps) {
  const { setMember, setDialogOpen } = useEditMemberStore()

  const handleClick = () => {
    useEditMemberStore.getState().reset()
    setMember(permission)
    setDialogOpen(true)
  }
  return (
    <DialogForm
      id='edit-member'
      description='Make changes to member information. Click save when you are done.'
      title={`User: ${permission.users.full_name}`}
      Trigger={
        <button
          onClick={handleClick}
          className='relative flex cursor-pointer select-none items-center justify-start rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground'
        >
          <Pencil1Icon className='h-4 w-4' />
        </button>
      }
      form={
        <EditForm
          permission={permission}
          onSuccess={() => setDialogOpen(false)}
        />
      }
    />
  )
}
