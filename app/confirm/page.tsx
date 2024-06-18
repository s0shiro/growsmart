export default function Signup({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div>
      <div className='w-full px-8 mx-auto mt-8 sm:max-w-lg'>
        <p className='text-foreground'>{searchParams.message}</p>
      </div>
    </div>
  )
}
