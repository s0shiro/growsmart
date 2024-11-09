'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { createClient } from '@/utils/supabase/client'
import { verifyPassword } from '@/lib/users'

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

export default function SecurityForm() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    try {
      setIsUpdating(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('No user found')

      // Verify password using admin client
      const { valid } = await verifyPassword(
        user.email,
        values.current_password,
      )

      if (!valid) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.new_password,
      })

      if (updateError) throw updateError

      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated.',
      })
      passwordForm.reset()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
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
                  <Input type='password' placeholder='********' {...field} />
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
                  <Input type='password' placeholder='********' {...field} />
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
                  <Input type='password' placeholder='********' {...field} />
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
  )
}
