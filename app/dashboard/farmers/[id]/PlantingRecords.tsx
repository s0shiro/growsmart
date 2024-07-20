import { getAllPlantingRecords } from '@/lib/planting'

const PlantingRecords = async ({ farmerID }: { farmerID: any }) => {
  const plantingRecords = await getAllPlantingRecords(farmerID)

  console.log(plantingRecords)
  return (
    <div>
      <div>
        {plantingRecords?.map((crop) => (
          <p key={crop.id}>
            <p>Crop: {crop.crop_type}</p>
            <p>Variety: {crop.variety}</p>
            <p>--------------------------</p>
          </p>
        ))}
      </div>
    </div>
  )
}

export default PlantingRecords
