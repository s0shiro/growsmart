'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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

import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useEditMemberStore } from '@/stores/useEditUsersStore'
import { useEffect } from 'react'

const FormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  jobTitle: z.string().min(2, {
    message: 'Job title must be at least 2 characters.',
  }),
})

export default function BasicForm() {
  const { member, updateBasic, isLoading } = useEditMemberStore()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      // Use values instead of defaultValues
      full_name: member?.users.full_name ?? '',
      jobTitle: member?.users.job_title ?? '',
    },
  })

  // Ensure form resets when component mounts or member changes
  useEffect(() => {
    if (member) {
      form.reset({
        full_name: member.users.full_name,
        jobTitle: member.users.job_title,
      })
    }
  }, [member, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await updateBasic(data)
    if (result.success) {
      toast.success('Successfully updated')
      queryClient.invalidateQueries({ queryKey: ['members'] })
      document.getElementById('edit-member')?.click()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Full name'
                  {...field} // This already includes value and onChange
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='jobTitle'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Senior Technician' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex gap-2 items-center w-full'
          variant='outline'
          disabled={isLoading}
        >
          Update
          <Loader className={cn('animate-spin', { hidden: !isLoading })} />
        </Button>
      </form>
    </Form>
  )
}
