import { Button } from '@/components/ui/button'
import React from 'react'
import DialogForm from '@/app/dashboard/(components)/DialogForm'
import AssociationForm from './AssociationForm'

export default function CreateAssociationButton() {
  return (
    <DialogForm
      id='create-trigger'
      description='This is description'
      title='Add Association'
      Trigger={<Button variant='outline'>Create+</Button>}
      form={<AssociationForm />}
    />
  )
}
