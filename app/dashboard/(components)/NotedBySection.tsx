import { Input } from '@/components/ui/input'

interface NotedBySectionProps {
  notedByName: string
  notedByTitle: string
  setNotedByName: (name: string) => void
  setNotedByTitle: (title: string) => void
  className?: string
  nameLabel?: string // New prop for custom label
}

export function NotedBySection({
  notedByName,
  notedByTitle,
  setNotedByName,
  setNotedByTitle,
  className,
  nameLabel = 'Noted by', // Default value
}: NotedBySectionProps) {
  return (
    <div className={`print:hidden space-y-2 ${className}`}>
      <div className='sm:flex sm:space-x-4 sm:space-y-0 space-y-2'>
        <div className='flex flex-col'>
          <label
            htmlFor='notedByName'
            className='text-sm font-medium text-muted-foreground mb-1'
          >
            {nameLabel}
          </label>
          <Input
            id='notedByName'
            type='text'
            placeholder='Enter name'
            value={notedByName}
            onChange={(e) => setNotedByName(e.target.value)}
            className='w-full sm:w-64'
          />
        </div>
        <div className='flex flex-col'>
          <label
            htmlFor='notedByTitle'
            className='text-sm font-medium text-muted-foreground mb-1'
          >
            Position
          </label>
          <Input
            id='notedByTitle'
            type='text'
            placeholder='Enter title'
            value={notedByTitle}
            onChange={(e) => setNotedByTitle(e.target.value)}
            className='w-full sm:w-64'
          />
        </div>
      </div>
    </div>
  )
}
