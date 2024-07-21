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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { getAllPlantingRecords } from '@/lib/planting'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PlantingRecords = async ({ farmerID }: { farmerID: any }) => {
  const plantingRecords = await getAllPlantingRecords(farmerID)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planting Records</CardTitle>
        <CardDescription>
          View planting records for the selected farmer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop Type</TableHead>
              <TableHead className='hidden sm:table-cell'>Variety</TableHead>
              <TableHead>Planting Date</TableHead>
              <TableHead className='hidden sm:table-cell'>
                Field Location
              </TableHead>
              <TableHead className='hidden sm:table-cell'>
                Area Planted
              </TableHead>
              <TableHead className='hidden sm:table-cell'>Quantity</TableHead>
              <TableHead className='hidden sm:table-cell'>
                Weather Condition
              </TableHead>
              <TableHead className='hidden sm:table-cell'>Expenses</TableHead>
              <TableHead>Harvest Date</TableHead>
              <TableHead>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plantingRecords?.map(
              ({
                id,
                crop_type,
                variety,
                planting_date,
                field_location,
                area_planted,
                quantity,
                weather_condition,
                expenses,
                harvest_date,
              }) => (
                <TableRow key={id}>
                  <TableCell>{crop_type}</TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {variety}
                  </TableCell>
                  <TableCell>{planting_date}</TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {field_location}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {area_planted}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {quantity}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {weather_condition}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {expenses}
                  </TableCell>
                  <TableCell>{harvest_date}</TableCell>

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
                        <DropdownMenuSeparator />

                        {/* TODO: create a dialog form that record the harvest data */}
                        <DropdownMenuItem>Report Harvest</DropdownMenuItem>
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

export default PlantingRecords
