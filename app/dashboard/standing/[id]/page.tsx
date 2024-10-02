'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGetInspectionsById } from '@/hooks/crop/useGetInspectionsById'
import {
  Plus,
  Calendar,
  AlertTriangle,
  Clipboard,
  Eye,
  Edit2,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import InspectionForm from '@/app/dashboard/standing/components/InpectionForm'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import { format } from 'date-fns'

type Visit = {
  id: string
  date: string | null
  findings: string | null
  damaged: number | null
  damaged_reason: string | null
}

export default function VisitHistory({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useGetInspectionsById(params.id)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedVisit(data[0])
    }
  }, [data])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Card className='w-96'>
          <CardHeader>
            <CardTitle className='text-destructive'>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold'>Visitation History</h1>
          <p className='text-muted-foreground mt-1'>
            Track and manage crop visits
          </p>
        </div>
        {data[0]?.planting_records?.status !== 'harvested' && (
          <DialogForm
            id='create-visit'
            title='Record Visit'
            description={`Record visit data for planting ${params.id}`}
            Trigger={
              <Button size='lg' className='shadow-lg'>
                <Plus className='mr-2 h-5 w-5' /> New Visit
              </Button>
            }
            form={<InspectionForm plantingID={params.id} />}
          />
        )}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-1 shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl'>Visit List</CardTitle>
            <CardDescription>Select a visit to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[calc(100vh-300px)]'>
              <AnimatePresence>
                {data?.map((visit: Visit) => (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`mb-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedVisit?.id === visit.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => setSelectedVisit(visit)}
                    >
                      <CardHeader className='p-4'>
                        <CardTitle className='text-lg font-medium flex items-center justify-between'>
                          <span className='flex items-center'>
                            <Calendar className='mr-2 h-5 w-5 text-primary' />
                            {visit.date
                              ? format(new Date(visit.date), 'MMM d, yyyy')
                              : 'No Date'}
                          </span>
                          <Badge
                            variant={visit.damaged ? 'destructive' : 'default'}
                          >
                            {visit.damaged ? 'Issues Found' : 'Healthy'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </motion.div>
                )) || (
                  <Card className='p-4 text-center text-muted-foreground'>
                    No visits recorded
                  </Card>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className='lg:col-span-2 shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl'>Visit Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVisit ? (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedVisit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-6'
                >
                  <div className='flex justify-between items-center'>
                    <h2 className='text-3xl font-semibold'>
                      {selectedVisit.date
                        ? format(new Date(selectedVisit.date), 'MMMM d, yyyy')
                        : 'No Date'}
                    </h2>
                    <Badge
                      variant={
                        selectedVisit.damaged ? 'destructive' : 'default'
                      }
                      className='text-lg px-3 py-1'
                    >
                      {selectedVisit.damaged ? 'Issues Found' : 'Healthy'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center'>
                          <Clipboard className='mr-2 h-5 w-5 text-primary' />
                          Findings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-muted-foreground'>
                          {selectedVisit.findings || 'No findings recorded'}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center'>
                          <AlertTriangle className='mr-2 h-5 w-5 text-primary' />
                          Damage Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-muted-foreground'>
                          <strong>Quantity:</strong>{' '}
                          {selectedVisit.damaged || 'N/A'}
                        </p>
                        <p className='text-muted-foreground mt-2'>
                          <strong>Reason:</strong>{' '}
                          {selectedVisit.damaged_reason || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className='flex justify-end space-x-4'>
                    {data &&
                      data[0]?.planting_records?.status !== 'harvested' && (
                        <Button variant='default' className='shadow-sm'>
                          <Edit2 className='mr-2 h-4 w-4' /> Update Visit
                        </Button>
                      )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className='flex flex-col items-center justify-center h-64 text-muted-foreground'>
                <Eye className='h-12 w-12 mb-4' />
                <p className='text-lg'>
                  Select a visit from the list to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
