import {
  Card,
  CardContent,
  CardDescription,
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

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const FarmerProfile = ({
  firstname,
  lastname,
  gender,
  municipality,
  barangay,
  phone,
}: {
  firstname?: string
  lastname?: string
  gender?: string
  municipality?: string
  barangay?: string
  phone?: string
}) => {
  return (
    <div>
      <Card x-chunk='dashboard-06-chunk-0'>
        <div className='flex justify-center p-4'>
          <Avatar className='size-48'>
            <AvatarImage
              src='https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000'
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <CardHeader className='text-center sm:text-left'>
          <CardTitle>Farmer Details</CardTitle>
          <CardDescription className='inline-block sm:block'>
            Details and information about the farmer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            {/* <TableHeader>
              <TableRow>
                <TableHead>Attribute</TableHead>
                <TableHead>Information</TableHead>
              </TableRow>
            </TableHeader> */}
            <TableBody>
              <TableRow>
                <TableCell>Fullname</TableCell>
                <TableCell className='font-medium'>
                  {firstname} {lastname}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell className='font-medium'>{gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell className='font-medium'>
                  {barangay}, {municipality}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact No.</TableCell>
                <TableCell className='font-medium'>{phone}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FarmerProfile
