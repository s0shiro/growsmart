'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import Side from './navigation/Side'
import SheetNav from './navigation/SheetNav'

interface UserData {
  id: string
  email: string | undefined
  fullName: string
  role: string
  status: string
  lastSignInAt: string | undefined
}

interface DashboardLayoutClientProps {
  children: React.ReactNode
  userData: UserData
}

const DashboardLayoutClient = ({
  children,
  userData,
}: DashboardLayoutClientProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <Side
        userSession={userData}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Sticky header */}
        <div className='sticky top-0 z-10 bg-background border-b border-border'>
          <div className='flex items-center h-16 px-4'>
            {isMobile ? (
              <Button variant='ghost' className='mr-2' onClick={toggleSidebar}>
                <Menu className='h-6 w-6' />
              </Button>
            ) : (
              <Button variant='ghost' className='mr-2' onClick={toggleSidebar}>
                {isSidebarOpen ? (
                  <ChevronLeft className='h-6 w-6' />
                ) : (
                  <ChevronRight className='h-6 w-6' />
                )}
              </Button>
            )}
            <SheetNav />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className='flex-1 overflow-auto p-2 md:p-8 lg:p-6'>
          <main className='bg-background rounded-lg max-w-5xl mx-auto'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayoutClient