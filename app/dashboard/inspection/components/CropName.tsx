import { useFetchCropName } from '@/hooks/useUtils'

const CropName = ({ cropId }: { cropId: string }) => {
  if (cropId === 'all') {
    return <span>All</span>
  }

  const { data: cropName, isLoading, error } = useFetchCropName(cropId)

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error loading crop name</span>

  return <span>{cropName ? cropName.name : 'Unknown'}</span>
}

export default CropName
