import { Bell } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const NotificationIcon: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  // Create Supabase client
  const supabase = createClient()

  useEffect(() => {
    // Create a subscription to listen for inserts in the 'notifications' table
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('New notification received:', payload)
          setUnreadCount((prevCount) => prevCount + 1) // Increment unread count on new notification
          setNotifications((prevNotifications) => [
            payload.new,
            ...prevNotifications,
          ]) // Add new notification to the list
        },
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe() // Unsubscribe when component unmounts
    }
  }, [supabase])

  // Handle notification icon click (reset unread count)
  const handleNotificationClick = () => {
    setUnreadCount(0)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className='relative inline-flex items-center cursor-pointer'
                onClick={handleNotificationClick} // Reset count when icon is clicked
              >
                <Bell className='text-muted-foreground' size={24} />
                {unreadCount > 0 && (
                  <span className='absolute top-0 right-0 h-4 w-4 rounded-full ring-2 ring-white bg-red-600 text-white text-xs font-bold flex items-center justify-center'>
                    {unreadCount}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    <div className='font-bold'>{notification.title}</div>
                    <div>{notification.message}</div>
                    <div className='text-sm text-gray-500'>
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
