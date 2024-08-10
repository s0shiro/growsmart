import React from 'react'
import { TabsTrigger } from '@/components/ui/tabs'

type CustomTabsTriggerProps = {
  value: string
  totalAvailableCrops?: number
  children: React.ReactNode
}

const CustomTabsTrigger: React.FC<CustomTabsTriggerProps> = ({
  value,
  totalAvailableCrops,
  children,
}) => {
  return (
    <div className='relative inline-flex items-center'>
      <TabsTrigger value={value}>{children}</TabsTrigger>
      {totalAvailableCrops !== undefined && totalAvailableCrops > 0 && (
        <span className='ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
          {totalAvailableCrops}
        </span>
      )}
    </div>
  )
}

export default CustomTabsTrigger
