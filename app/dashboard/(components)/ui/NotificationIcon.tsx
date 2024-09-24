import { Bell } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState } from 'react'

//TODO: please implement this HAHAHAHA
const NotificationIcon: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='relative inline-flex items-center'>
            <Bell className='text-muted-foreground' size={24} />
            {unreadCount > 0 && (
              <span className='absolute top-0 right-0 h-4 w-4 rounded-full ring-2 ring-white bg-red-600 text-white text-xs font-bold flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {unreadCount > 0
            ? `You have ${unreadCount} new notifications`
            : 'No new notifications'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NotificationIcon
