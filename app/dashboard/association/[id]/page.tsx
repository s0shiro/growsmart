import AssociationMembers from './components/Association MembersTable'

const AssociationPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <AssociationMembers associationId={params.id} />
    </div>
  )
}

export default AssociationPage
