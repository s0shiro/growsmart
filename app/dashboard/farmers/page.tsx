import { File, ListFilter, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DailogForm from '../(components)/DialogForm'
import CreateFarmerForm from './CreateFarmerForm'
import FarmersTable from './FarmesTable'
import { readUserSession } from '@/lib/actions'

const Main = async () => {
  const { data: userSession } = await readUserSession()

  const isTechnician = userSession.user?.user_metadata.role === 'technician'

  return (
    <Tabs defaultValue='farmers'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='farmers'>Farmers</TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 gap-1'>
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' variant='outline' className='h-8 gap-1'>
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Export
            </span>
          </Button> */}

          {isTechnician && (
            <DailogForm
              id='create-trigger'
              title='Add Farmer'
              // Trigger={<Button variant='outline'>Add Farmer+</Button>}
              description='Add farmer to your list.'
              Trigger={
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add Farmer
                  </span>
                </Button>
              }
              form={<CreateFarmerForm />}
            />
          )}
        </div>
      </div>
      <TabsContent value='farmers'>
        <FarmersTable />
      </TabsContent>
    </Tabs>
  )
}

export default Main
