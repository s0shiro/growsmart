'use client'

import { useState } from 'react'
import { useGetTechniciansByCoordinator } from '@/hooks/users/useGetTechniciansByCoordinator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Activity } from 'lucide-react'
import Link from 'next/link'

type Technician = {
  user_id: string
  status: string
  users: {
    email: string
    full_name: string
    job_title: string
    avatar_url: string
  }
}

export default function TechniciansPage({
  params,
}: {
  params: { id: string }
}) {
  const { data, isLoading } = useGetTechniciansByCoordinator(params.id)
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(
    null,
  )

  const technicians: Technician[] = data || []

  if (isLoading) {
    return <TechniciansListSkeleton />
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Technicians List</h1>
      {technicians.length === 0 ? (
        <Card>
          <CardContent className='py-10'>
            <p className='text-center text-muted-foreground'>
              No technicians found for this coordinator.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {technicians.map((technician) => (
            <Card key={technician.user_id}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={technician.users.avatar_url}
                      alt={technician.users.full_name}
                    />
                    <AvatarFallback>
                      {technician.users.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-sm font-medium'>
                      {technician.users.full_name}
                    </CardTitle>
                    <p className='text-sm text-muted-foreground'>
                      {technician.users.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/technicians/${technician.user_id}`}
                        className='flex items-center'
                      >
                        <Activity className='mr-2 h-4 w-4' />
                        View Activity
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm font-medium'>
                    Job Title: {technician.users.job_title}
                  </p>
                  <Badge
                    variant={
                      technician.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {technician.status.charAt(0).toUpperCase() +
                      technician.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function TechniciansListSkeleton() {
  return (
    <div>
      <Skeleton className='w-[250px] h-[36px] mb-6' />
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center space-x-4'>
                <Skeleton className='w-10 h-10 rounded-full' />
                <div>
                  <Skeleton className='w-[150px] h-[20px] mb-2' />
                  <Skeleton className='w-[200px] h-[16px]' />
                </div>
              </div>
              <Skeleton className='w-8 h-8 rounded-full' />
            </CardHeader>
            <CardContent>
              <Skeleton className='w-[120px] h-[16px] mb-2' />
              <Skeleton className='w-[80px] h-[24px]' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
