'use client'

import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { formatDate } from '@/lib/utils'
import {
  Camera,
  Upload,
  User,
  Mail,
  Briefcase,
  Calendar,
  Lock,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/hooks/use-toast'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'

// Mock function to update user profile
const updateUserProfile = async (data: any) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  job_title: z.string().min(2, {
    message: 'Job title must be at least 2 characters.',
  }),
})

const passwordFormSchema = z
  .object({
    current_password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    new_password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirm_password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

export default function UserProfile() {
  const { data: profile, isLoading, error } = useCurrentUserProfile()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      job_title: '',
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] })
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      })
      setIsUpdating(false)
    },
    onError: () => {
      toast({
        title: 'Error',
        description:
          'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      })
      setIsUpdating(false)
    },
  })

  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        full_name: profile.full_name,
        job_title: profile.job_title,
      })
    }
  }, [profile, profileForm])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAvatarFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: 1,
    multiple: false,
  })

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true)
    updateProfileMutation.mutate(values)
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsUpdating(true)
    updateProfileMutation.mutate(values)
  }

  function onAvatarSubmit() {
    if (avatarFile) {
      setIsUpdating(true)
      // In a real application, you would upload the file to your server or a file storage service here
      // For this example, we'll just simulate the upload
      setTimeout(() => {
        updateProfileMutation.mutate({
          avatar_url: URL.createObjectURL(avatarFile),
        })
        setIsAvatarDialogOpen(false)
      }, 1000)
    }
  }

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
          <Dialog
            open={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
          >
            <DialogTrigger asChild>
              <div className='relative cursor-pointer group'>
                <Avatar className='w-32 h-32 border-4 border-white shadow-md'>
                  <AvatarImage
                    src={profile.avatar_url || undefined}
                    alt={profile.full_name}
                  />
                  <AvatarFallback className='bg-purple-600 text-2xl'>
                    {profile.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Camera className='text-white' />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogDescription>
                  Drop an image file or click to select one.
                </DialogDescription>
              </DialogHeader>
              <div
                {...getRootProps()}
                className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors dark:border-muted/25 dark:hover:border-muted/50'
              >
                <input {...getInputProps()} />
                <div className='flex flex-col items-center gap-2'>
                  <Upload className='h-8 w-8 text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>
                    Drop an item here
                  </p>
                  <p className='text-xs text-muted-foreground'>or</p>
                  <Button variant='outline' size='sm' type='button'>
                    Browse files
                  </Button>
                </div>
              </div>
              {avatarFile && (
                <div className='mt-4 text-sm text-muted-foreground'>
                  Selected file: {avatarFile.name}
                </div>
              )}
              <Button
                onClick={onAvatarSubmit}
                disabled={!avatarFile || isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Avatar'}
              </Button>
            </DialogContent>
          </Dialog>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow-md'
          >
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={profileForm.control}
                  name='full_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John Doe' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name='job_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Software Engineer' {...field} />
                      </FormControl>
                      <FormDescription>
                        Your current position in the company.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </TabsContent>
        <TabsContent value='security'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow-md'
          >
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={passwordForm.control}
                  name='current_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name='new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name='confirm_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='********'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </Form>
          </motion.div>
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
