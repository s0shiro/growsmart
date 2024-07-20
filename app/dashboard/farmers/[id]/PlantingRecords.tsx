import { getAllPlantingRecords } from '@/lib/planting'

const PlantingRecords = async ({ farmerID }: { farmerID: any }) => {
  const plantingRecords = await getAllPlantingRecords(farmerID)

  return (
    <div>
      <div>
        {plantingRecords?.map((crop) => (
          <p key={crop.id}>
            <p>Crop: {crop.crop_type}</p>
            <p>Variety: {crop.variety}</p>
            <p>Field: {crop.field_location}</p>
            <p>Harvest Date: {crop.harvest_date}</p>
            <p>--------------------------</p>
          </p>
        ))}
      </div>
    </div>
  )
}

export default PlantingRecords
