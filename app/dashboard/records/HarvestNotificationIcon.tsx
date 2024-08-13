import React from 'react'
import { Bell } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type HarvestNotificationIconProps = {
  totalAvailableCrops: number
}

const HarvestNotificationIcon: React.FC<HarvestNotificationIconProps> = ({
  totalAvailableCrops,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='relative inline-flex items-center'>
            <Bell className='text-muted-foreground' size={24} />
            {totalAvailableCrops > 0 && (
              <span className='absolute top-0 right-0 h-4 w-4 rounded-full ring-2 ring-white bg-red-600 text-white text-xs font-bold flex items-center justify-center'>
                {totalAvailableCrops}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {totalAvailableCrops > 0
            ? `You have ${totalAvailableCrops} crops ready for harvest`
            : 'No crops ready for harvest'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default React.memo(HarvestNotificationIcon)
