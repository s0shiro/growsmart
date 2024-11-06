import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import BasicForm from './BasicForm'
import AccountForm from './AccountForm'
import AdvanceForm from './AdvanceForm'
import { Member } from '@/lib/types'
import { useEffect } from 'react'
import { useEditMemberStore } from '@/stores/useEditUsersStore'

export default function EditForm({ permission }: { permission: Member }) {
  const { setMember, reset } = useEditMemberStore()

  useEffect(() => {
    setMember(permission)
    return () => reset()
  }, [permission, setMember, reset])

  return (
    <Tabs defaultValue='basic' className='w-full space-y-5'>
      <TabsList className={cn('grid w-full grid-cols-3')}>
        <TabsTrigger value='basic'>Basic</TabsTrigger>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='advance'>Advance</TabsTrigger>
      </TabsList>
      <TabsContent value='basic'>
        <BasicForm />
      </TabsContent>
      <TabsContent value='account'>
        <AccountForm />
      </TabsContent>
      <TabsContent value='advance'>
        <AdvanceForm />
      </TabsContent>
    </Tabs>
  )
}
