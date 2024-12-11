// components/association/AssistanceForm.tsx
'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useTransition } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { addAssistance } from '../actions'

const assistanceConfig = {
  'Financial Aid': { unit: '₱', showUnit: true, prefix: true },
  Equipment: { unit: 'pcs', showUnit: true, prefix: false },
  Seeds: { unit: 'kg', showUnit: true, prefix: false },
  Other: { unit: '', showUnit: false, prefix: false },
} as const

const assistanceTypes = [
  'Financial Aid',
  'Equipment',
  'Seeds',
  'Other',
] as const

const AssistanceFormSchema = z.object({
  assistance_type: z.enum(assistanceTypes),
  amount: z.number().positive('Amount must be greater than 0'),
  unit: z.string().optional(),
  date_given: z.string().min(1, 'Date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  association_id: z.string().uuid(),
})

type AssistanceFormValues = z.infer<typeof AssistanceFormSchema>

interface AssistanceFormProps {
  associationId: string
  onSuccess?: () => void
}

export default function AssistanceForm({
  associationId,
  onSuccess,
}: AssistanceFormProps) {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const [selectedType, setSelectedType] =
    useState<keyof typeof assistanceConfig>('Financial Aid')

  const form = useForm<AssistanceFormValues>({
    resolver: zodResolver(AssistanceFormSchema),
    defaultValues: {
      assistance_type: 'Financial Aid',
      date_given: new Date().toISOString().split('T')[0],
      description: '',
      association_id: associationId,
    },
  })

  function onSubmit(data: AssistanceFormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value.toString())
        })

        await addAssistance(formData)
        toast.success('Successfully recorded assistance')
        queryClient.invalidateQueries({ queryKey: ['associations'] })
        onSuccess?.()
        document.getElementById(`assistance-${associationId}`)?.click()
      } catch (error: any) {
        toast.error('Failed to record assistance', {
          description: error.message,
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='assistance_type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Assistance</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedType(value as keyof typeof assistanceConfig)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select assistance type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assistanceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {selectedType === 'Financial Aid'
                  ? 'Amount'
                  : selectedType === 'Equipment'
                    ? 'Quantity'
                    : 'Amount/Value'}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  {assistanceConfig[selectedType].prefix && (
                    <span className='absolute left-3 top-2.5'>
                      {assistanceConfig[selectedType].unit}
                    </span>
                  )}
                  <Input
                    type='number'
                    placeholder={`Enter ${selectedType === 'Financial Aid' ? 'amount' : 'quantity'}`}
                    {...field}
                    className={
                      assistanceConfig[selectedType].prefix ? 'pl-7' : ''
                    }
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {assistanceConfig[selectedType].showUnit &&
                    !assistanceConfig[selectedType].prefix && (
                      <span className='absolute right-3 top-2.5 text-muted-foreground'>
                        {assistanceConfig[selectedType].unit}
                      </span>
                    )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date_given'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Given</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the assistance provided'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full flex gap-2 items-center'
          disabled={isPending}
        >
          Record Assistance
          <Loader2 className={cn('animate-spin', { hidden: !isPending })} />
        </Button>
      </form>
    </Form>
  )
}
