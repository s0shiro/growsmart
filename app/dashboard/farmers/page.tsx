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
import FarmerList from './FarmerList'
import CreateFarmer from './CreateFarmer'
import DailogForm from '../(components)/DialogForm'
import CreateFarmerForm from './CreateFarmerForm'
import PlantingForm from './PlantingForm'

const Main = async () => {
  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='add'>Add Farmer</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
          <TabsTrigger value='archived' className='hidden sm:flex'>
            Archived
          </TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          <DropdownMenu>
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
          </Button>

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
        </div>
      </div>
      <TabsContent value='all'>
        <FarmerList />
      </TabsContent>
      <TabsContent value='add'>
        <CreateFarmerForm />
      </TabsContent>
      <TabsContent value='draft'></TabsContent>
      <TabsContent value='archived'>
        <p>Archived</p>
      </TabsContent>
    </Tabs>
  )
}

export default Main
