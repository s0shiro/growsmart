import ListOfAssociations from './components/AssociationTable'
import CreateAssociationButton from './components/create/AssociationFormButton'

const AssociationPage = () => {
  return (
    <div className='space-y-5 w-full overflow-y-auto px-3'>
      <div className='flex justify-end gap-2'>
        <CreateAssociationButton />
      </div>
      <ListOfAssociations />
    </div>
  )
}

export default AssociationPage
