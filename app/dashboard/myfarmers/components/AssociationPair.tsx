// AssociationPositionPair.tsx
import { Briefcase, Users, X } from 'lucide-react'
import SelectField from '../../(components)/forms/CustomSelectField'
import { Button } from '@/components/ui/button'
import { Control } from 'react-hook-form'

const positions = [
  { id: 'member', name: 'Member' },
  { id: 'president', name: 'President' },
  { id: 'vice_president', name: 'Vice President' },
  { id: 'secretary', name: 'Secretary' },
  { id: 'treasurer', name: 'Treasurer' },
  { id: 'board_member', name: 'Board Member' },
]

export const AssociationPositionPair = ({
  index,
  associations,
  value,
  onChange,
  onRemove,
  control,
}: {
  index: number
  associations: any[]
  value: { associationId: string; position: string }
  onChange: (value: { associationId: string; position: string }) => void
  onRemove: () => void
  control: Control<any>
}) => {
  return (
    <div className='flex gap-4 items-start'>
      <div className='flex-1'>
        <SelectField
          name={`associationPositions.${index}.associationId`}
          label='Association'
          placeholder='Select Association'
          options={associations}
          value={value.associationId}
          onChange={(newValue) =>
            onChange({ ...value, associationId: newValue })
          }
          icon={<Users className='h-4 w-4 text-muted-foreground' />}
        />
      </div>
      <div className='flex-1'>
        <SelectField
          name={`associationPositions.${index}.position`}
          label='Position'
          placeholder='Select Position'
          options={positions}
          value={value.position}
          onChange={(newValue) => onChange({ ...value, position: newValue })}
          icon={<Briefcase className='h-4 w-4 text-muted-foreground' />}
        />
      </div>
      <Button
        type='button'
        variant='destructive'
        size='icon'
        className='mt-8'
        onClick={onRemove}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}
