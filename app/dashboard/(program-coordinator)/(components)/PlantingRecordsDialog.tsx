import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { getStatusColor, PlantingRecord } from '../(components)/StandingTable'

interface PlantingRecordDialogProps {
  record: PlantingRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlantingRecordDialog({
  record,
  open,
  onOpenChange,
}: PlantingRecordDialogProps) {
  if (!record) return null

  //   return (
  //     <Dialog open={open} onOpenChange={onOpenChange}>
  //       <DialogContent className='sm:max-w-[425px]'>
  //         <DialogHeader>
  //           <DialogTitle>Planting Record Details</DialogTitle>
  //           <DialogDescription>
  //             Detailed information about the planting record.
  //           </DialogDescription>
  //         </DialogHeader>
  //         <div className='grid gap-4 py-4'>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Farmer:</span>
  //             <span className='col-span-3'>{`${record.farmer_id.firstname} ${record.farmer_id.lastname}`}</span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Crop:</span>
  //             <span className='col-span-3'>{record.crop_type.name}</span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Variety:</span>
  //             <span className='col-span-3'>{record.variety.name}</span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Category:</span>
  //             <span className='col-span-3'>{record.crop_categoryId.name}</span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Status:</span>
  //             <span className='col-span-3'>
  //               <Badge className={`${getStatusColor(record.status)} text-white`}>
  //                 {record.status.replace('_', ' ')}
  //               </Badge>
  //             </span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Planted:</span>
  //             <span className='col-span-3'>
  //               {new Date(record.planting_date).toLocaleDateString()}
  //             </span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Area:</span>
  //             <span className='col-span-3'>
  //               {record.area_planted.toFixed(4)} hectares
  //             </span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Quantity:</span>
  //             <span className='col-span-3'>{record.quantity}</span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Expenses:</span>
  //             <span className='col-span-3'>
  //               ₱{record.expenses.toLocaleString()}
  //             </span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Harvest:</span>
  //             <span className='col-span-3'>
  //               {new Date(record.harvest_date).toLocaleDateString()}
  //             </span>
  //           </div>
  //           <div className='grid grid-cols-4 items-center gap-4'>
  //             <span className='font-bold'>Remarks:</span>
  //             <span className='col-span-3'>{record.remarks}</span>
  //           </div>
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   )
}
