import { Card } from '@/components/ui/card'

const FarmerProfile = ({
  firstname,
  lastname,
  gender,
}: {
  firstname?: string
  lastname?: string
  gender?: string
}) => {
  return (
    <div>
      <Card x-chunk='dashboard-06-chunk-0'>
        <p>
          {firstname} {lastname}
        </p>
        <p>{gender}</p>
      </Card>
    </div>
  )
}

export default FarmerProfile
