import { readUserSession } from '@/lib/actions'
import AnimatedLandingPage from './AnimatedLandingPage'

export default async function LandingPage() {
  const { data: userSession } = await readUserSession()

  return <AnimatedLandingPage userSession={userSession} />
}
