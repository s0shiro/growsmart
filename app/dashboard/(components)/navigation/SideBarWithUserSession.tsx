import { readUserSession } from '@/lib/actions'
import Side from './Side'

const SidebarWithUserSession = async () => {
  const { data: userSession } = await readUserSession()
  return <Side userSession={userSession} />
}

export default SidebarWithUserSession
