import DashboardNavBar from './(components)/DashboardNavBar'
import DashboardSideBar from './(components)/DashboardSideBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='grid min-h-screen w-full lg:grid-cols-[280px_1fr]'>
      {/* Dashboard Sidebar */}
      <DashboardSideBar />
      {/* Dashboard NavBar */}
      <DashboardNavBar>
        <main className='flex flex-col gap-4 p-4 lg:gap-6'>{children}</main>
      </DashboardNavBar>
    </div>
  )
}
