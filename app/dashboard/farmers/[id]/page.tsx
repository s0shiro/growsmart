import FarmerList from '../FarmerList'
import FarmerProfileTabs from './Tabs'

const page = async ({ params }: { params: { id: any } }) => {
  return (
    <div>
      <FarmerProfileTabs id={params.id} />
    </div>
  )
}

export default page
