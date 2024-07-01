import AdminNavBar from './(role-base-navbar)/AdminNavBar'
import FarmerNavBar from './(role-base-navbar)/FarmerNavBar'
import TechnicianNavBar from './(role-base-navbar)/TechnicianNavBar'

export type UserRole = 'admin' | 'technician' | 'farmer'

function DashboardNavBar({ children }: { children: React.ReactNode }) {
  const role: UserRole = 'technician' // This should come from your user's data

  const roleComponentMap = {
    admin: <AdminNavBar />,
    technician: <TechnicianNavBar />,
    farmer: <FarmerNavBar />,
  }

  return (
    <div className='flex flex-col'>
      {roleComponentMap[role]}
      {children}
    </div>
  )
}

export default DashboardNavBar
