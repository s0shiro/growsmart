import { useState } from 'react'
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
import {
  MultiFileDropzone,
  type FileState,
} from '@/app/dashboard/(components)/forms/multi-file-upload'
import { useEdgeStore } from '@/lib/edgestore'
import { recordInspection } from '@/lib/inspection'

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
  inspectionImages: z.array(z.string()).optional(),
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
  const [fileStates, setFileStates] = useState<FileState[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const { edgestore } = useEdgeStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPriority: false,
    },
  })

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates)
      const fileState = newFileStates.find((fileState) => fileState.key === key)
      if (fileState) {
        fileState.progress = progress
      }
      return newFileStates
    })
  }

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
        visitationImages: urls,
      })

      // Confirm uploads
      for (const url of urls) {
        await edgestore.myPublicImages.confirmUpload({ url })
      }

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
      toast({
        title: 'Error',
        description: 'Failed to submit inspection. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 max-w-4xl mx-auto'
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='col-span-full bg-muted p-4 rounded-lg mb-6'>
            <h3 className='text-lg font-semibold mb-2'>
              Upload Inspection Images
            </h3>
            <MultiFileDropzone
              value={fileStates}
              dropzoneOptions={{
                maxFiles: 10,
              }}
              onChange={(files) => {
                setFileStates(files)
              }}
              onFilesAdded={async (addedFiles) => {
                setFileStates([...fileStates, ...addedFiles])
                await Promise.all(
                  addedFiles.map(async (addedFileState) => {
                    try {
                      const res = await edgestore.myPublicImages.upload({
                        file: addedFileState.file,
                        options: {
                          temporary: true,
                        },
                        input: { type: 'inspections' },
                        onProgressChange: async (progress) => {
                          updateFileProgress(addedFileState.key, progress)
                          if (progress === 100) {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000),
                            )
                            updateFileProgress(addedFileState.key, 'COMPLETE')
                          }
                        },
                      })
                      setUrls((urls) => [...urls, res.url])
                    } catch (err) {
                      updateFileProgress(addedFileState.key, 'ERROR')
                    }
                  }),
                )
              }}
            />
          </div>

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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select severity' />
                    </SelectTrigger>
                  </FormControl>
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select damage type' />
                    </SelectTrigger>
                  </FormControl>
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select growth stage' />
                    </SelectTrigger>
                  </FormControl>
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
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Priority Case</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='findings'
            render={({ field }) => (
              <FormItem className='col-span-full'>
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
          type='submit'
          className='w-full sm:w-auto'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default InspectionForm
