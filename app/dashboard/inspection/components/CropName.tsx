import { useFetchCropName } from '@/hooks/useUtils'

const CropName = ({ cropId }: { cropId: string }) => {
  const { data: cropName, isLoading, error } = useFetchCropName(cropId)

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error loading crop name</span>

  return <span>{cropName ? cropName.name : 'No crop name found'}</span>
}

export default CropName
