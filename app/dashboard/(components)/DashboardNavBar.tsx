import AdminNavBar from './(RoleBaseNavBar)/AdminNavBar'
import FarmerNavBar from './(RoleBaseNavBar)/FarmerNavBar'
import TechnicianNavBar from './(RoleBaseNavBar)/TechnicianNavBar'

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
