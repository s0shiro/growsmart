import { useTransition } from 'react'
import { deleteMemberById } from '../actions'
import { toast } from 'sonner'

const DeleteUser = ({
  userId,
  onDelete,
}: {
  userId: string
  onDelete: (userId: string) => void
}) => {
  const [isPending, startTransition] = useTransition()

  const onSubmit = () => {
    startTransition(async () => {
      const resultString = await deleteMemberById(userId)
      if (resultString) {
        const result = JSON.parse(resultString)

        if (result.error?.message) {
          toast('Failed to delete.')
        }
      } else {
        toast('Success to delete.')
        onDelete(userId) // Call the onDelete callback
      }
    })
  }

  return (
    <form action={onSubmit}>
      <button className='cursor-pointer'>Delete</button>
    </form>
  )
}

export default DeleteUser
