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
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <SidebarWithUserSession />
      <SheetNav />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
