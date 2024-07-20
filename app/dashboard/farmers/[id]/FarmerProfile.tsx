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
          <Avatar className='w-45 h-45'>
            <AvatarImage
              src='https://scontent.fmnl25-4.fna.fbcdn.net/v/t39.30808-1/451418027_2164615280578350_86385005731237855_n.jpg?stp=dst-jpg_p200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=q_hkkOSRs_8Q7kNvgE9oXMz&_nc_ht=scontent.fmnl25-4.fna&oh=00_AYD-1c-y97DsoNV1DoSFARyqv284AHwZOSpoC6XSAy7L6g&oe=66A166C2'
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
