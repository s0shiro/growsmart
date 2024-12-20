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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useEditMemberStore } from '@/stores/useEditUsersStore'
import { useToast } from '@/components/hooks/use-toast'

const FormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().optional(),
    confirm: z.string().optional(),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Passowrd doesn't match",
    path: ['confirm'],
  })

interface AccountFormProps {
  onSuccess?: () => void
}

export default function AccountForm({ onSuccess }: AccountFormProps) {
  const { member, updateAccount, isLoading } = useEditMemberStore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: member?.users.email ?? '',
      password: '',
      confirm: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await updateAccount({
      password: data.password,
      confirm: data.confirm,
    })

    if (result.success) {
      toast({ description: 'Password updated successfully.✅' })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      // Explicitly set password fields to empty
      form.setValue('password', '')
      form.setValue('confirm', '')
      onSuccess?.()
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='email@gmail.com'
                  type='email'
                  {...field}
                  //   onChange={field.onChange}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='******'
                  type='password'
                  {...field}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='******'
                  type='password'
                  {...field}
                  onChange={field.onChange}
                />
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
