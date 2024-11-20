'use client'

import React, { startTransition, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/hooks/use-toast'
import { updateProfile } from '@/lib/users'

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  job_title: z.string().min(2, {
    message: 'Job title must be at least 2 characters.',
  }),
})

export default function AccountForm({ profile }: { profile: any }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name,
      job_title: profile.job_title,
    },
  })

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsUpdating(true)
    // Remove async from the startTransition callback
    startTransition(() => {
      updateProfile(data, profile.id)
        .then((result) => {
          if (result.success) {
            toast({
              title: 'Profile updated',
              description: 'Your profile has been successfully updated.',
            })
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] })
          } else {
            toast({
              title: 'Error',
              description: result.error,
              variant: 'destructive',
            })
          }
        })
        .finally(() => {
          setIsUpdating(false) // Reset loading state
        })
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow-md'
    >
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onSubmit)}
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
                  Your current position in Provincial Agriculture Office.
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
  )
}
