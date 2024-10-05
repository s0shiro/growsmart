import FarmerProfileTabs from './FarmerTabs'
import FarmerProfile from '@/app/dashboard/(info)/f/[id]/FarmerProfile'


const page = async ({ params }: { params: { id: any } }) => {
  return (
    <div>
      {/*<FarmerProfileTabs id={params.id} />*/}
      <FarmerProfile id={params.id} />
    </div>
  )
}

export default page
