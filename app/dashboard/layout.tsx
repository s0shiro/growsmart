import { readUserSession } from '@/lib/actions'
import SheetNav from './(components)/navigation/SheetNav'
import { redirect } from 'next/navigation'
import SidebarWithUserSession from './(components)/navigation/SideBarWithUserSession'
import { ScrollArea } from "@/components/ui/scroll-area"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { data: userSession } = await readUserSession()

  if (!userSession.user) {
    return redirect('/login')
  }

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar - Fixed on desktop, off-canvas on mobile */}
      <div className='hidden sm:block w-64 bg-background'>
        <SidebarWithUserSession />
      </div>

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Sticky header */}
        <div className='flex-shrink-0'>
          <SheetNav />
        </div>

        {/* Main content with ScrollArea */}
        <ScrollArea className="flex-1">
          <main className='p-2'>
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}

export default DashboardLayout