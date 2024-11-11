'use client'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addHarvest } from '@/lib/harvests'
import { updateStatusWhenAddHarvest } from '@/lib/planting'
import {
  MultiFileDropzone,
  type FileState,
} from '@/app/dashboard/(components)/forms/multi-file-upload'
import { useEdgeStore } from '@/lib/edgestore'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  harvestDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for plantingDate',
  }),
  yieldQuantity: z.coerce.number().positive('Yield quantity must be positive'),
  profit: z.coerce.number(),
  areaHarvested: z.coerce.number().positive('Area harvested must be positive'),
  damagedQuantity: z.coerce.number().optional(),
  damagedReason: z.string().optional(),
})

type CropFormFieldName =
  | 'harvestDate'
  | 'yieldQuantity'
  | 'profit'
  | 'areaHarvested'
  | 'damagedQuantity'
  | 'damagedReason'

const fieldConfigs: {
  name: CropFormFieldName
  placeholder: string
  label: string
  type: string
}[] = [
  {
    name: 'harvestDate',
    placeholder: 'Harvest Date',
    label: 'Harvest Date',
    type: 'date',
  },
  {
    name: 'yieldQuantity',
    placeholder: '50',
    label: 'Total Yield (kg)',
    type: 'number',
  },
  {
    name: 'profit',
    placeholder: '10000',
    label: 'Profit',
    type: 'number',
  },
  {
    name: 'areaHarvested',
    placeholder: '0.999',
    label: 'Area Harvested (ha)',
    type: 'number',
  },
  {
    name: 'damagedQuantity',
    placeholder: '(Optional)',
    label: 'Damage Quantity (kg)',
    type: 'number',
  },
  {
    name: 'damagedReason',
    placeholder: '(Optional)',
    label: 'Damaged Reason',
    type: 'text',
  },
]

export default function HarvestForm({
  plantingID,
  farmerID,
  remainingArea,
}: {
  plantingID: string
  farmerID: string | undefined
  remainingArea: number | null
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const [fileStates, setFileStates] = useState<FileState[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const queryClient = useQueryClient()
  const { edgestore } = useEdgeStore()
  const router = useRouter()

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
    if (remainingArea !== null && data.areaHarvested > remainingArea) {
      form.setError('areaHarvested', {
        type: 'manual',
        message: `Area harvested cannot exceed the remaining area of ${remainingArea.toFixed(4)} ha`,
      })
      return
    }

    try {
      await addHarvest({
        plantingId: plantingID,
        farmerId: farmerID,
        harvestDate: data.harvestDate,
        yieldQuantity: data.yieldQuantity,
        profit: data.profit,
        areaHarvested: data.areaHarvested,
        damagedQuantity: data.damagedQuantity,
        damagedReason: data.damagedReason,
        harvestImages: urls,
      })

      // If harvest added successfully, confirm uploads
      for (const url of urls) {
        await edgestore.myPublicImages.confirmUpload({ url })
      }

      await updateStatusWhenAddHarvest(plantingID)
      document.getElementById('create-harvest')?.click()
      toast.success('Crop harvested successfully!')
      console.log('crop harvested successfully')
      await queryClient.invalidateQueries({
        queryKey: ['plantings', 'harvests'],
      })
      form.reset()
      router.push(`/dashboard/harvested/${plantingID}`)
    } catch (error) {
      console.error('Failed to submit form:', error)
      toast.error('Failed to submit harvest information')
    }
  }

  const remainingAreaWarning =
    remainingArea === null ? (
      <p className='text-yellow-600 mb-4'>
        Warning: Remaining area information is not available. Please ensure
        you're not over-harvesting.
      </p>
    ) : null

  return (
    <Card className='w-full mx-auto'>
      <CardHeader></CardHeader>
      <CardContent>
        {remainingAreaWarning}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-6'>
              <div className='bg-muted p-4 rounded-lg'>
                <h3 className='text-lg font-semibold mb-2'>Upload Images</h3>
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
                            input: { type: 'harvests' },
                            onProgressChange: async (progress) => {
                              updateFileProgress(addedFileState.key, progress)
                              if (progress === 100) {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000),
                                )
                                updateFileProgress(
                                  addedFileState.key,
                                  'COMPLETE',
                                )
                              }
                            },
                          })
                          setUrls((urls) => [...urls, res.url])
                          console.log(res)
                        } catch (err) {
                          updateFileProgress(addedFileState.key, 'ERROR')
                        }
                      }),
                    )
                  }}
                />
              </div>
              <Separator />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {fieldConfigs.map(({ name, placeholder, label, type }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            type={type}
                            {...field}
                            onChange={field.onChange}
                            className='mt-1 block w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <Button
              disabled={form.formState.isSubmitting}
              type='submit'
              className='w-full'
            >
              {form.formState.isSubmitting
                ? 'Submitting...'
                : 'Submit Harvest Information'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
