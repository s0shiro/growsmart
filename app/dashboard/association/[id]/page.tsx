import AssociationMembers from './components/AssociationMembersTable'

const AssociationPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <AssociationMembers associationId={params.id} />
    </div>
  )
}

export default AssociationPage
