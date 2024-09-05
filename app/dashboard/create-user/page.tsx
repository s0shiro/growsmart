import React from 'react'
import MemberTable from './components/MemberTable'
import CreateMember from './components/create/CreateMember'

export default function Members() {
  return (
    <div className='space-y-5 w-full overflow-y-auto'>
      <div className='flex justify-end'>
        <div className='flex gap-2'>
          <CreateMember />
        </div>
      </div>
      <MemberTable />
    </div>
  )
}
