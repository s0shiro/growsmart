import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import BasicForm from './BasicForm'
import AccountForm from './AccountForm'
import AdvanceForm from './AdvanceForm'
import { Member } from '@/lib/types'

export default function EditForm({
  permission,
  updateMember,
}: {
  permission: Member
  updateMember: (updatedMember: Member) => void
}) {
  const handleUpdate = (updatedMember: Member) => {
    // Call the updateMember function passed as a prop
    updateMember(updatedMember)
  }

  return (
    <Tabs defaultValue='basic' className='w-full space-y-5'>
      <TabsList className={cn('grid w-full ', 'grid-cols-3')}>
        <TabsTrigger value='basic'>Basic</TabsTrigger>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='advance'>Advance</TabsTrigger>
      </TabsList>
      <TabsContent value='basic'>
        <BasicForm permission={permission} onUpdate={handleUpdate} />
      </TabsContent>
      <TabsContent value='account'>
        <AccountForm permission={permission} />
      </TabsContent>
      <TabsContent value='advance'>
        <AdvanceForm permission={permission} onUpdate={handleUpdate} />
      </TabsContent>
    </Tabs>
  )
}
