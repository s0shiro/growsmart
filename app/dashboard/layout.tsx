import { readUserSession } from '@/lib/actions'
import SheetNav from './(components)/SheetNav'
import { redirect } from 'next/navigation'
import SidebarWithUserSession from './(components)/SideBarWithUserSession'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { data: userSession } = await readUserSession()

  if (!userSession.user) {
    return redirect('/login')
  }

  return (
    <div className='relative min-h-screen bg-muted'>
      {/* Sidebar - Fixed on desktop, off-canvas on mobile */}
      <div className='fixed inset-y-0 left-0 z-40 w-64 bg-background sm:block hidden'>
        <SidebarWithUserSession />
      </div>

      {/* Main content area */}
      <div className='sm:ml-64 flex flex-col min-h-screen'>
        {/* Sticky header */}
        <div className='sticky top-0 z-30 bg-background shadow'>
          <SheetNav />
        </div>

        {/* Main content */}
        <div className='flex-1 p-6 overflow-x-auto'>
          <main className='flex-1 bg-muted/20 rounded-lg p-4'>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
