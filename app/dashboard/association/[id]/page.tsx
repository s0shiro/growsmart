import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import AssistanceTable from '../components/AssistanceTable'
import AssociationMembers from './components/AssociationMembersTable'

const AssociationPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className='text-3xl font-bold'>Association Details</h1>
      <p className='text-muted-foreground'>
        View and manage association information
      </p>

      <Tabs defaultValue='members' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='members'>Members</TabsTrigger>
          <TabsTrigger value='assistance'>Assistance Records</TabsTrigger>
        </TabsList>
        <TabsContent value='members' className='space-y-4'>
          <Suspense fallback={<MembersSkeleton />}>
            <AssociationMembers associationId={params.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value='assistance' className='space-y-4'>
          <Suspense fallback={<AssistanceSkeleton />}>
            <AssistanceTable associationId={params.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const MembersSkeleton = () => (
  <div className='space-y-2'>
    <Skeleton className='h-4 w-[250px]' />
    <Skeleton className='h-4 w-[200px]' />
    <Skeleton className='h-4 w-[300px]' />
  </div>
)

const AssistanceSkeleton = () => (
  <div className='space-y-2'>
    <Skeleton className='h-4 w-[300px]' />
    <Skeleton className='h-4 w-[250px]' />
    <Skeleton className='h-4 w-[200px]' />
  </div>
)

export default AssociationPage
