// AssociationList.tsx
'use client'

import React from 'react'

const AssociationList: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div>
      <h1>Associations</h1>
      <ul>
        {data.map((association) => (
          <li key={association.id}>{association.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default AssociationList
