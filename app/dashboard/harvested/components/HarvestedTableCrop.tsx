import useFetchHarvestedStatus from '@/hooks/useFetchHarvestedStatus'
import ReusableCropTable from '../../(components)/ReusableCropTable'

const HarvestedTableCrops = () => {
  // Action handlers for the crop actions
  const handleViewDetails = (crop: any) => {
    console.log('Viewing details for:', crop)
    // Add logic to view details
  }

  const handleEditCrop = (crop: any) => {
    console.log('Editing crop:', crop)
    // Add logic to edit crop
  }

  const handleDeleteCrop = (crop: any) => {
    console.log('Deleting crop:', crop)
    // Add logic to delete crop
  }

  // Define crop actions
  const cropActions = [
    {
      label: 'View Details',
      onClick: handleViewDetails,
    },
    {
      label: 'Edit',
      onClick: handleEditCrop,
    },
    {
      label: 'Delete',
      onClick: handleDeleteCrop,
    },
  ]

  // Fetch harvested crops using your hook
  const { data, isLoading, error } = useFetchHarvestedStatus()

  // Transform the result to match the expected return type for the ReusableCropTable
  const fetchHarvestedData = () => {
    return {
      data: Array.isArray(data) ? data : null, // Ensure `data` is an array or null
      isLoading,
      error,
    }
  }

  return (
    <ReusableCropTable
      status='harvested'
      useFetchData={fetchHarvestedData} // Pass the transformed fetch function
      tableTitle='Harvested Crops'
      actions={cropActions} // Pass the actions array
    />
  )
}

export default HarvestedTableCrops
