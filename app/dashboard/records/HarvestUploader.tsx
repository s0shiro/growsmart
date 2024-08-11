import { Input } from '@/components/ui/input'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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

const handleUpload = () => {}

const HarvestUploader = () => {
  const [uppy] = useState(() => new Uppy())

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
              className='w-full bg-input text-foreground'
            />
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <Button className='w-full mt-4 bg-primary text-primary-foreground hover:bg-primary-hover'>
        Upload
      </Button>
    </div>
  )
}

export default HarvestUploader
