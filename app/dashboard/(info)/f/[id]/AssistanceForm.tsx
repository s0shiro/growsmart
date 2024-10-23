import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'
import { recordAssistance } from '@/lib/farmer.assistance'
import { useToast } from '@/components/hooks/use-toast'

const FormSchema = z.object({
  assistanceType: z.enum(['Farm Inputs', 'Farm Machinery']),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(256, 'Description must be 256 characters or less'),
  quantity: z.coerce.number().positive('Quantity must be a positive number'),
  dateReceived: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for Date Received',
  }),
})

export default function Assistanceform({
  farmerID = '',
}: {
  farmerID: string
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      assistanceType: 'Farm Inputs',
      description: '',
      dateReceived: new Date().toISOString().split('T')[0],
    },
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await recordAssistance({
        farmerID: farmerID,
        assistanceType: data.assistanceType,
        description: data.description,
        quantity: data.quantity,
        dateReceived: data.dateReceived,
      })

      toast({
        title: 'Assistance Added! 🎉',
        description: `Assistance recorded your farmer on ${data.dateReceived}.`,
      })
      document.getElementById('add-assistance')?.click()
      queryClient.invalidateQueries(['assistances'])
      form.reset()
    } catch (error) {
      console.error('Error adding assistance:', error)
      toast({
        title: 'Error',
        description: 'Failed to record assistance. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='assistanceType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assistance Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Assistance Type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Farm Inputs'>Farm Inputs</SelectItem>
                    <SelectItem value='Farm Machinery'>
                      Farm Machinery
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input
                    placeholder='Enter details (e.g. Seeds, Fertilizer, Tractor)'
                    {...field}
                    maxLength={256}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='quantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='dateReceived'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Received</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
