import FarmerProfileTabs from './FarmerTabs'

const page = async ({ params }: { params: { id: any } }) => {
  return (
    <div>
      <FarmerProfileTabs id={params.id} />
    </div>
  )
}

export default page
