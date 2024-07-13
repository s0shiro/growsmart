import TechnicianNavBar from './TechnicianNavBar'

export type UserRole = 'admin' | 'technician' | 'farmer'

function DashboardNavBar({ children }: { children: React.ReactNode }) {
  const role: UserRole = 'technician' // This should come from your user's data

  const roleComponentMap = {
    technician: <TechnicianNavBar />,
  }

  return (
    <div className='flex flex-col'>
      {roleComponentMap[role]}
      {children}
    </div>
  )
}

export default DashboardNavBar
