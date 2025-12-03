import RegisteredCropsTable from '@/app/dashboard/crops/components/RegisteredCropsTable'
import { Sprout } from 'lucide-react'

const CropsPage = () => {
  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 rounded-lg bg-emerald-500/10'>
            <Sprout className='h-5 w-5 text-emerald-500' />
          </div>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
              Crop Management
            </h1>
          </div>
        </div>
        <p className='text-muted-foreground mt-3 max-w-2xl'>
          Manage and organize all registered crops and their varieties. Add new
          crops, browse existing categories, and maintain your agricultural
          database.
        </p>
      </div>

      <RegisteredCropsTable />
    </div>
  )
}

export default CropsPage
