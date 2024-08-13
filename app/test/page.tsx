'use client'

import useFetchHarvestedStatus from '@/hooks/useFetchHarvestedStatus'
import useFetchPlantings from '@/hooks/useFetchPlantings'
import useUser from '@/hooks/useUser'
import useUserWithRole from '@/hooks/useUserWithRole'
import HarvestDetails from './Harvest'
import HarvestDetailsFormat from './Harvest'

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
  const { data, error, isLoading } = useUserSession()

  if (error) {
    console.log(error.message)
  } else {
    console.log(data)
  }
  return (
    // <div>
    //   <p>{user.data?.id}</p>
    //   {Array.isArray(data)
    //     ? data.map((user) => (
    //         <div key={user.id}>
    //           <p>{user.email}</p>
    //           <div>
    //             {user.permissions.map((permission, index) => (
    //               <div key={index}>
    //                 <div>{permission.id}</div>
    //                 <div>{permission.role}</div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       ))
    //     : null}
    // </div>
    <div className='container mx-auto'>
      {/* <HarvestDetailsFormat harvest={placeholderHarvest} /> */}

      {JSON.stringify(data)}
    </div>
  )
}

export default page
