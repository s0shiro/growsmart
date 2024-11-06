'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { Member } from '@/lib/types'
import { updateMemberAdvanceAndMetadataById } from '../../actions'
import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useEditMemberStore } from '@/stores/useEditUsersStore'

const FormSchema = z.object({
  role: z.enum(['admin', 'technician']),
  status: z.enum(['active', 'resigned']),
})

export default function AdvanceForm() {
  const { member, updateAdvance, isLoading } = useEditMemberStore()
  const queryClient = useQueryClient()

  const roles = ['admin', 'technician']
  const status = ['active', 'resigned']

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: member?.role ?? 'technician',
      status: member?.status ?? 'active',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await updateAdvance(data)

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
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role, index) => {
                    return (
                      <SelectItem value={role} key={index}>
                        {role}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select user status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map((status, index) => {
                    return (
                      <SelectItem value={status} key={index}>
                        {status}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                status resign mean the user is no longer work here.
              </FormDescription>

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
