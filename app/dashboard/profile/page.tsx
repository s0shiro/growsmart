'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { formatDate } from '@/lib/utils'
import { User, Mail, Briefcase, Calendar } from 'lucide-react'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import AvatarUpload from './components/avatar-form'
import AccountForm from './components/account-form'
import SecurityForm from './components/security-form'

export default function UserProfile() {
  const { data: profile, isLoading, error } = useCurrentUserProfile()
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  if (isLoading) {
    return <UserProfileSkeleton />
  }

  if (error) {
    return (
      <div className='text-center text-destructive'>
        Error loading user profile
      </div>
    )
  }

  if (!profile) {
    return <div className='text-center'>No user data found</div>
  }

  return (
    <div className='w-full mx-auto space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gradient-to-r from-primary to-primary-foreground rounded-lg p-8 text-primary-foreground shadow-lg'
      >
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <AvatarUpload
            profile={profile}
            isOpen={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
          />
          <div className='text-center sm:text-left text-white'>
            <h1 className='text-3xl font-bold mb-2'>{profile.full_name}</h1>
            <p className='text-lg opacity-90 mb-2'>{profile.email}</p>
            <Badge className='bg-white text-purple-600 hover:bg-purple-100'>
              {profile.job_title}
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-8'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow-md'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <ProfileField
                icon={<User />}
                label='Full Name'
                value={profile.full_name}
              />
              <ProfileField
                icon={<Mail />}
                label='Email'
                value={profile.email}
              />
              <ProfileField
                icon={<Briefcase />}
                label='Job Title'
                value={profile.job_title}
              />
              <ProfileField
                icon={<Calendar />}
                label='Join Date'
                value={formatDate(profile.created_at)}
              />
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value='account'>
          <AccountForm profile={profile} />
        </TabsContent>
        <TabsContent value='security'>
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className='flex items-center space-x-4 p-4 bg-muted rounded-md'>
      <div className='text-primary'>{icon}</div>
      <div>
        <p className='text-sm font-medium text-muted-foreground'>{label}</p>
        <p className='text-sm font-semibold text-foreground'>{value}</p>
      </div>
    </div>
  )
}

function UserProfileSkeleton() {
  return (
    <div className='w-full space-y-8'>
      <div className='bg-gradient-to-r from-primary to-primary-foreground rounded-lg p-8 animate-pulse'>
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='w-32 h-32 bg-muted rounded-full'></div>
          <div>
            <div className='h-8 w-48 bg-muted rounded mb-2'></div>
            <div className='h-6 w-32 bg-muted rounded mb-2'></div>
            <div className='h-6 w-24 bg-muted rounded'></div>
          </div>
        </div>
      </div>
      <div className='h-10 w-full bg-muted rounded mb-6'></div>
      <div className='space-y-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-12 w-full bg-muted rounded'></div>
        ))}
      </div>
    </div>
  )
}
