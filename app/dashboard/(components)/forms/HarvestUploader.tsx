import { Input } from '@/components/ui/input'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Tus from '@uppy/tus'
import { supabaseBrowser } from '@/utils/supabase/browser'
import useUser from '@/hooks/useUser'
import useForm from '@/hooks/useForm'
import { toast } from 'sonner'
import { updateStatusWhenAddHarvest } from '@/lib/planting'

const fieldConfigs = [
  {
    name: 'harvestDate',
    placeholder: 'Harvest Date',
    label: 'Harvest Date',
    type: 'date',
  },
  {
    name: 'yieldQuantity',
    placeholder: 'Yield',
    label: 'Yield',
    type: 'number',
  },
  { name: 'profit', placeholder: 'Profit', label: 'Profit', type: 'number' },
  {
    name: 'areaHarvested',
    placeholder: 'Area Harvested',
    label: 'Area',
    type: 'number',
  },
  {
    name: 'damagedQuantity',
    placeholder: 'Damage Quantity',
    label: 'Damaged',
    type: 'number',
  },
  { name: 'damagedReason', placeholder: 'Pest', label: 'Reason', type: 'text' },
]

const HarvestUploader = ({
  farmerID,
  plantingID,
}: {
  farmerID: string
  plantingID: string
}) => {
  const supabase = supabaseBrowser()
  const { data: user } = useUser()

  const [formData, handleChange] = useForm({
    harvestDate: '',
    yieldQuantity: '',
    profit: '',
    areaHarvested: '',
    damagedQuantity: '',
    damagedReason: '',
  })

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 4,
        allowedFileTypes: ['image/*'],
        maxFileSize: 5 * 1000 * 1000, // 5MB
      },
    }).use(Tus, {
      endpoint:
        process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/upload/resumable',
      onBeforeRequest: async (req: any) => {
        const { data } = await supabase.auth.getSession()
        req.setHeader('Authorization', `Bearer ${data.session?.access_token}`)
      },
      allowedMetaFields: [
        'bucketName',
        'objectName',
        'contentType',
        'cacheControl',
      ],
    }),
  )

  uppy.on('file-added', (file) => {
    file.meta = {
      ...file.meta,
      bucketName: 'crops-images',
      contentType: file.type,
    }
  })

  //TODO: fix the error of cant upload multiple photos
  const handleUpload = async () => {
    const randomUUID = crypto.randomUUID()

    // Loop through all files and set metadata for each
    uppy.getFiles().forEach((file) => {
      const uniqueFileName = `${user?.id}/${farmerID}/${plantingID}/${randomUUID}/${file.name}`
      uppy.setFileMeta(file.id, {
        objectName: uniqueFileName,
      })
    })

    await uppy.upload().then(async () => {
      console.log(
        `Harvest Date: ${formData.harvestDate}, Yield Quantity: ${formData.yieldQuantity}, Profit: ${formData.profit}, Area Harvested: ${formData.areaHarvested}, Damaged Quantity: ${formData.damagedQuantity}, Damaged Reason: ${formData.damagedReason}`,
      ) // Debugging

      if (
        formData.harvestDate.trim() ||
        formData.yieldQuantity.trim() ||
        formData.profit.trim() ||
        formData.areaHarvested.trim() ||
        formData.damagedQuantity.trim() ||
        formData.damagedReason.trim()
      ) {
        const { error } = await supabase
          .from('harvests_report')
          .update({
            harvest_date: formData.harvestDate,
            yield_quantity: formData.yieldQuantity,
            profit: formData.profit,
            area_harvested: formData.areaHarvested,
            damaged_quantity: formData.damagedQuantity,
            damaged_reason: formData.damagedReason,
          })
          .eq('id', randomUUID)

        if (error) {
          console.error('Error updating fields:', error) // Debugging
          toast.error('Failed to add description.')
        } else {
          console.log('Update successful') // Debugging
          await updateStatusWhenAddHarvest(plantingID)
        }
      } else {
        console.log('Some fields are empty.') // Debugging
      }
    })
  }

  return (
    <div className='p-4 bg-card text-card-foreground rounded shadow'>
      {/* Dashboard Section */}
      <Dashboard uppy={uppy} hideUploadButton className='mb-4' />

      {/* Input Fields Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {fieldConfigs.map(({ name, placeholder, label, type }) => (
          <div key={name} className='flex flex-col'>
            <label className='text-sm font-medium mb-1'>{label}</label>
            <Input
              name={name}
              placeholder={placeholder}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              className='w-full bg-input text-foreground'
            />
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <Button
        className='w-full mt-4 bg-primary text-primary-foreground hover:bg-primary-hover'
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  )
}

export default HarvestUploader
