import { Card, CardContent } from '@/components/ui/card'
import { getCountOfFarmers } from '@/lib/farmer'
import { getCurrentUser } from '@/lib/users '

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default async function Dashboard() {
  const user = await getCurrentUser()
  const farmersCount = await getCountOfFarmers(user?.id ?? '')
  return (
    <div>
      <Card className='w-[340px]'>
        <CardContent>
          <div className='w-full flex h-full justify-center items-center'>
            <div>
              <h4 className='text-lg'>Farmers</h4>
              <h2 className='text-6xl font-semibold my-8 text-center'>
                {farmersCount}
              </h2>
            </div>
          </div>
        </CardContent>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline'>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input id='name' value='Pedro Duarte' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='username' className='text-right'>
                  Username
                </Label>
                <Input id='username' value='@peduarte' className='col-span-3' />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type='submit'>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Card>

      <p>I'm fuccked up, idk what to do with this shit.</p>
    </div>
  )
}
