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
import { getAssociation } from '../dashboard/farmers/actions'
import { useState } from 'react'
import { QueryClient, useQuery } from '@tanstack/react-query'
import useGetCropCategory from '@/hooks/useGetCropCategory'
import { useFetchCrops, useFetchVarieties } from '@/hooks/useCrops'
import { useFetchCropsByCategoryId } from '@/hooks/useFetchCropByCategoryId'

const queryClient = new QueryClient()

const fetchAssociation = async () => {
  return await getAssociation('7ce65826-f68c-4055-bfcc-ff8f8070df08')
}

const page = () => {
  const { data: crops } = useFetchCrops('1ed7957a-4680-4d46-9a7c-bfb00404262a')
  const { data: varieties } = useFetchVarieties(
    'cb6532c9-c615-4882-a51e-c59526640195',
  )

  const { data: registeredCrops } = useFetchCropsByCategoryId(
    '8a9b1e79-ac83-417d-92ab-a9ae19c9a4f3',
  )

  console.log(registeredCrops)
  console.log(varieties)
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
}

export default page
