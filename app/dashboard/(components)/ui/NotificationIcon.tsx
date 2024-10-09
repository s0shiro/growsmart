'use client'

import { useState, useEffect } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/hooks/use-toast'
import useUserSession from '@/hooks/useUserSession'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  created_at: string
  is_read: boolean
}

interface PageResult {
  data: Notification[]
  nextCursor: number | null
}

const supabase = createClient()

const NOTIFICATIONS_PER_PAGE = 10

const fetchNotifications = async ({
  pageParam = 0,
  userId,
}: {
  pageParam?: number
  userId: string
}): Promise<PageResult> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(
      pageParam * NOTIFICATIONS_PER_PAGE,
      (pageParam + 1) * NOTIFICATIONS_PER_PAGE - 1,
    )

  if (error) throw error

  return {
    data,
    nextCursor: data.length === NOTIFICATIONS_PER_PAGE ? pageParam + 1 : null,
  }
}

export default function NotificationIcon() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useUserSession()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['notifications', user?.id],
    queryFn: ({ pageParam = 0 }) =>
      fetchNotifications({ pageParam, userId: user?.id }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!user?.id,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false)
        .eq('user_id', user?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['notifications', user.id],
          })
          const newNotification = payload.new as Notification
          toast({
            title: 'New Notification',
            description: newNotification.message,
          })
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['notifications', user.id],
          })
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['notifications', user.id],
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, toast, user?.id])

  const notifications = data?.pages.flatMap((page) => page.data) ?? []
  const unreadCount = notifications.filter((n) => !n.is_read).length
  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((n) => !n.is_read)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center'>
              {unreadCount}
            </span>
          )}
          <span className='sr-only'>Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>Notifications</p>
            <p className='text-xs leading-none text-muted-foreground'>
              You have {unreadCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs
          defaultValue='all'
          onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>Unread</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={(id) => markAsReadMutation.mutate(id)}
              deleteNotification={(id) => deleteNotificationMutation.mutate(id)}
              isLoading={isLoading}
              error={error}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </TabsContent>
          <TabsContent value='unread'>
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={(id) => markAsReadMutation.mutate(id)}
              deleteNotification={(id) => deleteNotificationMutation.mutate(id)}
              isLoading={isLoading}
              error={error}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </TabsContent>
        </Tabs>
        <DropdownMenuSeparator />
        <div className='flex justify-between p-2'>
          <DropdownMenuItem onSelect={() => markAllAsReadMutation.mutate()}>
            <Button variant='ghost' size='sm'>
              Mark all as read
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => clearAllMutation.mutate()}>
            <Button variant='ghost' size='sm'>
              Clear all
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationList({
  notifications,
  markAsRead,
  deleteNotification,
  isLoading,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: {
  notifications: Notification[]
  markAsRead: (id: string) => void
  deleteNotification: (id: string) => void
  isLoading: boolean
  error: Error | null
  hasNextPage: boolean | undefined
  fetchNextPage: () => void
  isFetchingNextPage: boolean
}) {
  if (isLoading) {
    return <NotificationSkeleton />
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>
        Error loading notifications
      </div>
    )
  }

  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.created_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let group
      if (date.toDateString() === today.toDateString()) {
        group = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = 'Yesterday'
      } else if (date > new Date(today.setDate(today.getDate() - 7))) {
        group = 'This Week'
      } else {
        group = 'Older'
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(notification)
      return groups
    },
    {} as Record<string, Notification[]>,
  )

  return (
    <ScrollArea className='h-[300px]'>
      <DropdownMenuGroup>
        {Object.entries(groupedNotifications).map(
          ([group, groupNotifications]) => (
            <div key={group}>
              <DropdownMenuLabel>{group}</DropdownMenuLabel>
              {groupNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onSelect={() => markAsRead(notification.id)}
                >
                  <div
                    className={`flex flex-col space-y-1 ${notification.is_read ? 'opacity-50' : ''}`}
                  >
                    <div className='flex justify-between items-center'>
                      <p className='text-sm font-medium leading-none'>
                        {notification.title}
                      </p>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Delete notification</span>
                      </Button>
                    </div>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {notification.message}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ),
        )}
        {notifications.length === 0 && (
          <DropdownMenuItem disabled>
            <p className='text-sm text-muted-foreground'>No notifications</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      {hasNextPage && (
        <div className='p-2'>
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant='outline'
            className='w-full'
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </Button>
        </div>
      )}
    </ScrollArea>
  )
}

function NotificationSkeleton() {
  return (
    <div className='space-y-3'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      ))}
    </div>
  )
}
