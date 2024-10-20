import FarmerProfile from '@/app/dashboard/(info)/f/[id]/FarmerProfile'

const page = async ({ params }: { params: { id: any } }) => {
  return (
    <div>
      <FarmerProfile id={params.id} />
    </div>
  )
}

export default page
