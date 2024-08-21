'use client'

import { Input } from '@/components/ui/input'
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
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { addAssociation } from '../../actions'
import { useQueryClient } from '@tanstack/react-query'

// Define schema for association form
const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Association name must be at least 2 characters.',
  }),
})

export default function AssociationForm() {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const res = await addAssociation(data)
      const { error } = res
      if (error?.message) {
        console.log(error.message)
        toast('Failed to save association.', {
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error.message}</code>
            </pre>
          ),
        })
      } else {
        document.getElementById('create-trigger')?.click()
        toast('Successfully saved association.')
        // Refetch associations after adding a new one
        queryClient.invalidateQueries({ queryKey: ['associations'] })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Association Name</FormLabel>
              <FormControl>
                <Input placeholder='Association Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full flex gap-2 items-center'
          variant='outline'
        >
          Submit{' '}
          <Loader2 className={cn('animate-spin', { hidden: !isPending })} />
        </Button>
      </form>
    </Form>
  )
}
