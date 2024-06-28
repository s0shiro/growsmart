import { Farmer, columns } from './Columns'
import DataTable from './DataTable'
import { farmers } from './data'

async function getData(): Promise<Farmer[]> {
  //TODO: Fetch data from your API here.
  return []
}

function FarmersManaged() {
  const data = farmers

  return (
    <div className='container mx-auto'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default FarmersManaged
