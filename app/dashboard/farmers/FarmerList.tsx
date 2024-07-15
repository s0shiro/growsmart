import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/users '
import { getListOfFarmers } from '@/lib/farmer'
import { MoreHorizontal } from 'lucide-react'

const FarmerList = async () => {
  const currentUser = await getCurrentUser()
  const farmers = await getListOfFarmers(currentUser?.id ?? '')

  return (
    <Card x-chunk='dashboard-06-chunk-0'>
      <CardHeader>
        <CardTitle>Farmers</CardTitle>
        <CardDescription>View farmers you monitored.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='hidden w-[100px] sm:table-cell'>
                <span className='sr-only'>Image</span>
              </TableHead>
              <TableHead>Farmer Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className='hidden md:table-cell'>Address</TableHead>
              <TableHead className='hidden md:table-cell'>
                Contact No.
              </TableHead>
              <TableHead>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers?.map(
              ({
                id,
                firstname,
                lastname,
                gender,
                municipality,
                barangay,
                phone,
              }) => (
                <TableRow key={id}>
                  <TableCell className='hidden sm:table-cell'>
                    <Avatar>
                      <AvatarImage
                        src='https://github.com/shadcn.png'
                        alt='@shadcn'
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className='font-medium'>
                    {firstname} {lastname}
                  </TableCell>
                  <TableCell className='font-medium'>{gender}</TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {barangay}, {municipality}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {phone}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default FarmerList
