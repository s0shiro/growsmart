import { readAssociationById } from '../actions'
import AssociationDetailsTable from './components/AssociationDetailsTable'

type Association = {
  created_at: string
  id: string
  name: string | null
}

type AssociationError = {
  error: string
}

type AssociationResponse = Association | AssociationError

const AssociationPage = async ({ params }: { params: { id: string } }) => {
  const association: AssociationResponse = await readAssociationById(params.id)

  if ('error' in association) {
    return <div>Error: {association.error}</div>
  }

  return (
    <div>
      {params.id ? (
        <AssociationDetailsTable
          associationId={params.id}
          associationName={association.name || ''}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default AssociationPage
