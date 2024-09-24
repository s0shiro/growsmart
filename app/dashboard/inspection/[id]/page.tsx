'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGetInspectionsById } from '@/hooks/crop/useGetInspectionsById'

type Inspection = {
  id: string
  date: string | null // Allow date to be null
  findings: string | null // Allow findings to be null
  damaged: number | null // Allow damaged to be null
  damaged_reason: string | null // Allow damaged_reason to be null
}

export default function InspectionHistory({
  params,
}: {
  params: { id: string }
}) {
  const { data, error, isLoading } = useGetInspectionsById(params.id)
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedInspection(data[0])
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='flex w-full h-screen'>
      {/* Left Pane: Inspection List */}
      <motion.div
        className='w-1/3 p-4 border-r h-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className='text-xl font-semibold mb-4'>Inspection History</h2>
        {data?.map((inspection: Inspection) => (
          <Card
            key={inspection.id}
            className={`mb-4 cursor-pointer ${
              selectedInspection?.id === inspection.id ? 'bg-muted' : ''
            }`}
            onClick={() => setSelectedInspection(inspection)}
          >
            <CardHeader>
              <CardTitle>
                {inspection.date
                  ? new Date(inspection.date).toLocaleDateString()
                  : 'No Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Damaged: {inspection.damaged ?? 'N/A'}
              </p>
              <p className='text-sm text-muted-foreground'>
                Reason: {inspection.damaged_reason ?? 'N/A'}
              </p>
            </CardContent>
          </Card>
        )) || <div>No inspections available</div>}
      </motion.div>

      {/* Right Pane: Inspection Details */}
      <motion.div
        className='w-2/3 p-6 h-full overflow-y-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {selectedInspection ? (
          <div>
            <h2 className='text-2xl font-semibold mb-4'>Inspection Details</h2>
            <div className='mb-4'>
              <strong>Date:</strong>{' '}
              {selectedInspection.date
                ? new Date(selectedInspection.date).toLocaleDateString()
                : 'N/A'}
            </div>
            <div className='mb-4'>
              <strong>Findings:</strong>
              <p>{selectedInspection.findings}</p>
            </div>
            <div className='mb-4'>
              <strong>Damaged Quantity:</strong> {selectedInspection.damaged}
            </div>
            <div className='mb-4'>
              <strong>Damaged Reason:</strong>{' '}
              {selectedInspection.damaged_reason}
            </div>
            <Button variant='outline'>Update Inspection</Button>
          </div>
        ) : (
          <div>Select an inspection from the list</div>
        )}
      </motion.div>
    </div>
  )
}
