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
import { useQueryClient } from '@tanstack/react-query'
import { useEditMemberStore } from '@/stores/useEditUsersStore'
import { useToast } from '@/components/hooks/use-toast'
import { useGetCoordinators } from '@/hooks/users/useGetCoordinators'
import { useEffect } from 'react'

const validateCoordinator = (val: string | undefined, ctx: z.RefinementCtx) => {
  if (ctx.path.includes('role') && ctx.path[0] === 'technician' && !val) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Coordinator is required for technicians',
    })
    return false
  }
  return true
}

const FormSchema = z.object({
  role: z.enum(['admin', 'technician', 'program coordinator']),
  status: z.enum(['active', 'resigned']),
  coordinatorId: z.string().optional().superRefine(validateCoordinator),
})
interface AdvanceFormProps {
  onSuccess?: () => void
}

export default function AdvanceForm({ onSuccess }: AdvanceFormProps) {
  const { member, updateAdvance, isLoading } = useEditMemberStore()
  const { data: coordinators, isLoading: loadingCoordinators } =
    useGetCoordinators()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const roles = ['admin', 'technician', 'program coordinator']
  const status = ['active', 'resigned']

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: member?.role ?? 'technician',
      status: member?.status ?? 'active',
      coordinatorId: member?.coordinator_id ?? undefined,
    },
  })

  // Add role watch effect
  const selectedRole = form.watch('role')
  useEffect(() => {
    // Reset coordinatorId when role changes away from technician
    if (selectedRole !== 'technician') {
      form.setValue('coordinatorId', undefined)
    }
  }, [selectedRole, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await updateAdvance(data)

    if (result.success) {
      const changes = []
      if (data.role !== member?.role) {
        changes.push(`role to ${data.role}`)
      }
      if (data.status !== member?.status) {
        changes.push(`status to ${data.status}`)
      }
      if (
        data.role === 'technician' &&
        data.coordinatorId !== member?.coordinator_id
      ) {
        const coordinator = coordinators?.find(
          (c) => c.user_id === data.coordinatorId,
        )
        changes.push(`coordinator to ${coordinator?.users.full_name}`)
      }

      const message = `Successfully updated ${member?.users.full_name}'s ${changes.join(' and ')}`

      toast({
        description: message,
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['members'] })
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

        {form.watch('role') === 'technician' && (
          <FormField
            control={form.control}
            name='coordinatorId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Coordinator</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                  disabled={loadingCoordinators}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select coordinator' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingCoordinators ? (
                      <SelectItem value='loading'>Loading...</SelectItem>
                    ) : coordinators?.length === 0 ? (
                      <SelectItem value='none'>
                        No coordinators available
                      </SelectItem>
                    ) : (
                      coordinators?.map((coord) => (
                        <SelectItem key={coord.user_id} value={coord.user_id}>
                          {coord.users.full_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select which program coordinator this technician reports to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
