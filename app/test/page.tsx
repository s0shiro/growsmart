'use client'

import useFetchHarvestedStatus from '@/hooks/useFetchHarvestedStatus'
import useFetchPlantings from '@/hooks/useFetchPlantings'
import useUser from '@/hooks/useUser'
import useUserWithRole from '@/hooks/useUserWithRole'
import HarvestDetails from './Harvest'
import HarvestDetailsFormat from './Harvest'
import { readAssociations } from '../dashboard/association/actions'
import AssociationList from './AssociationList'
import useReadAssociation from '@/hooks/useReadAssociations'

const page = () => {
  //   const user = useUser()

  //   // const { data, isFetching } = useUserWithRole()

  //   const { data, isFetching } = useFetchHarvestedStatus()

  //   console.log(data)

  //   if (isFetching) {
  //     return <p>Loading pa timang...</p>
  //   }

  //   const placeholderHarvest = {
  //     id: '1',
  //     crop_type: 'Corn',
  //     variety: 'Sweet Corn',
  //     harvest_date: '2024-07-10',
  //     quantity: 500,
  //     field_location: 'Field A',
  //     technician_name: 'John Doe',
  //     date_planted: '2024-04-10',
  //     area_harvested: 10000,
  //     weather_condition: 'Sunny',
  //     expenses: 2000,
  //     damaged_crops: 50,
  //     damage_reason: 'Pest Infestation',
  //     notes: 'Harvest was successful overall with minimal losses.',
  //   }
  //   const { data, error, isLoading } = useUserSession()

  const { data, error, isLoading } = useReadAssociation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  // Ensure data is a plain object and not null or undefined
  const associations = data ? JSON.parse(JSON.stringify(data)) : []

  return (
    <div>
      <h1>Associations</h1>
      <ul>
        {associations.map((association: any) => (
          <li key={association.id}>{association.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default page
