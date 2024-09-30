'use client'

import { createEdgeStoreProvider } from '@edgestore/react'
import { EdgeStoreRouter } from '@/app/api/edgestore/[...edgestore]/route'

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    //kung ilang sabay sabay na file ang iuupload
    maxConcurrentUploads: 2,
  })
