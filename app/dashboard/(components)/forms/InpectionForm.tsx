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
import { Textarea } from '@/components/ui/textarea'
import { recordInspection } from '@/lib/inspection'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { useSession } from '@/stores/useSession'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const DamageSeverityEnum = {
  MINIMAL: 'Minimal (0-25%)',
  MODERATE: 'Moderate (26-50%)',
  SEVERE: 'Severe (51-75%)',
  TOTAL: 'Total Loss (76-100%)',
} as const

const DamageTypesEnum = {
  PEST: 'Pest Infestation',
  DISEASE: 'Plant Disease',
  WEATHER: 'Weather Damage',
  FLOOD: 'Flood Damage',
  DROUGHT: 'Drought Impact',
  SOIL: 'Soil Problems',
  OTHER: 'Other',
} as const

const GrowthStagesEnum = {
  SEEDLING: 'Seedling',
  VEGETATIVE: 'Vegetative',
  REPRODUCTIVE: 'Reproductive',
  MATURITY: 'Maturity',
} as const

const FormSchema = z.object({
  dateOfInspection: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  damagedArea: z.coerce.number().positive(),
  damageSeverity: z.enum(
    Object.values(DamageSeverityEnum) as [string, ...string[]],
  ),
  damageType: z.enum(Object.values(DamageTypesEnum) as [string, ...string[]]),
  growthStage: z.enum(Object.values(GrowthStagesEnum) as [string, ...string[]]),
  isPriority: z.boolean().default(false),
  findings: z.string().optional(),
})

function InspectionForm({
  plantingID,
  farmerID,
}: {
  plantingID: string
  farmerID: string
}) {
  const user = useSession((state) => state.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPriority: false,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await recordInspection({
        plantingID,
        farmerID,
        technicianID: user?.id as string,
        dateOfInspection: data.dateOfInspection,
        damagedArea: data.damagedArea,
        damageSeverity: data.damageSeverity,
        damageType: data.damageType,
        growthStage: data.growthStage,
        isPriority: data.isPriority,
        findings: data.findings,
      })

      toast({
        title: 'Inspection Recorded!',
        description: `Visited at ${formatDate(data.dateOfInspection)}`,
      })

      document.getElementById('create-visit')?.click()
      await queryClient.invalidateQueries({
        queryKey: ['crop-planting-record', plantingID],
      })
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='dateOfInspection'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Of Inspection</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='damageSeverity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Damage Severity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select severity' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DamageSeverityEnum).map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
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
            name='damageType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Damage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select damage type' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DamageTypesEnum).map((type) => (
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
            name='growthStage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select growth stage' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GrowthStagesEnum).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
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
            name='damagedArea'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Damaged Area (ha)</FormLabel>
                <FormControl>
                  <Input type='number' step='0.01' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isPriority'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Priority Case</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='findings'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Findings</FormLabel>
                <FormControl>
                  <Textarea {...field} className='h-32 resize-none' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          variant='outline'
          className='w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default InspectionForm
