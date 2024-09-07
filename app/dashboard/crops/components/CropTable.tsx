import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { FlattenedCrop } from './CropTableContainer'

interface CropTableProps {
  crops: FlattenedCrop[]
}

const CropTable: React.FC<CropTableProps> = ({ crops }) => {
  return (
    <Card>
      <ScrollArea className='h-[calc(100vh-350px)]'>
        <Table className='min-w-[800px] table-auto divide-y divide-border'>
          <TableHeader>
            <TableRow className='bg-background hover:bg-background'>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variety</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell className='whitespace-nowrap text-sm'>
                  {crop.name}
                </TableCell>
                <TableCell>{crop.category}</TableCell>
                <TableCell>{crop.variety}</TableCell>
                <TableCell>
                  <Button variant='ghost' size='icon'>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </Card>
  )
}

export default CropTable
