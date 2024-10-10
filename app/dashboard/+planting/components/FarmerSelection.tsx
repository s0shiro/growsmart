'use client'

import React, { useState } from 'react'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Farmer {
  id: string
  firstname: string
  lastname: string
  avatar?: string
  rsbsa_number: number
}

interface FarmerSelectionProps {
  control: any
  farmers: Farmer[]
  isLoading?: boolean
}

export default function FarmerSelection({
  control,
  farmers,
  isLoading = false,
}: FarmerSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFarmers = farmers.filter((farmer) =>
    `${farmer.firstname} ${farmer.lastname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )

  return (
    <FormField
      control={control}
      name='farmerId'
      render={({ field }) => (
        <div className='space-y-4'>
          <label
            htmlFor='farmer-search'
            className='text-sm font-medium text-foreground'
          >
            Select Farmer
          </label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              id='farmer-search'
              type='text'
              placeholder='Search farmers...'
              className='pl-10 bg-background text-foreground border-input'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Card className='overflow-hidden bg-card'>
            <ScrollArea className='h-72'>
              <CardContent className='p-0'>
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-4 p-4'
                    >
                      <Skeleton className='h-10 w-10 rounded-full' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-[200px]' />
                        <Skeleton className='h-4 w-[100px]' />
                      </div>
                    </div>
                  ))
                ) : filteredFarmers.length === 0 ? (
                  <div className='p-4 text-center text-muted-foreground'>
                    No farmers found
                  </div>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <div
                      key={farmer.id}
                      className={`flex items-center space-x-4 p-4 transition-colors hover:bg-accent cursor-pointer ${
                        field.value === farmer.id ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => field.onChange(farmer.id)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={farmer.avatar}
                          alt={`${farmer.firstname} ${farmer.lastname}`}
                        />
                        <AvatarFallback className='bg-primary text-primary-foreground'>
                          {farmer.firstname[0]}
                          {farmer.lastname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium text-card-foreground'>{`${farmer.firstname} ${farmer.lastname}`}</p>
                        <p className='text-xs text-muted-foreground'>
                          RSBSA: {farmer.rsbsa_number}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}
    />
  )
}
