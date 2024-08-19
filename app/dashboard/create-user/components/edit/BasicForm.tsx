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
import { Member } from '@/lib/types'
import { updateMemberBasicById } from '../../actions'
import { useTransition } from 'react'

const FormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

export default function BasicForm({
  permission,
  onUpdate,
}: {
  permission: Member
  onUpdate: (updatedMember: Member) => void
}) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      full_name: permission.users.full_name,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = JSON.parse(
        await updateMemberBasicById(permission.user_id, data),
      )

      if (error?.message) {
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error.message}</code>
            </pre>
          ),
        })
      } else {
        toast('Successfully updated.')
        // Call the onUpdate function with the updated member data
        onUpdate({
          ...permission,
          users: { ...permission.users, full_name: data.full_name },
        })
      }
    })
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
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex gap-2 items-center w-full'
          variant='outline'
        >
          Update <Loader className={cn(' animate-spin', 'hidden')} />
        </Button>
      </form>
    </Form>
  )
}
