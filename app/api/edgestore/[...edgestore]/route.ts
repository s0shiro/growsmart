import { initEdgeStore } from '@edgestore/server'
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from '@edgestore/server/adapters/next/app'
import { z } from 'zod'
import { readUserSession } from '@/lib/actions'
import { createClient } from '@/utils/supabase/server'

type Context = {
  userId: string
  userRole: 'admin' | 'technician'
}

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const { id, role } = await getUserSession(req)

  return {
    userId: id,
    userRole: role,
  }
}

async function getUserSession(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  return {
    id: user.id,
    role: user.user_metadata.role as 'admin' | 'technician',
  }
}

const es = initEdgeStore.context<Context>().create()

const edgeStoreRouter = es.router({
  // Define your edge store routes here
  myPublicImages: es
    .imageBucket({
      //limit the size of the image to 1MB
      maxSize: 1024 * 1024, // 1MB
    })
    // Define the path for the route
    .input(z.object({ type: z.enum(['post', 'profile', "avatar"]) }))
    //eg. post/cute.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    //path eg. /userId/cute.jpg
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [{ userId: { path: 'owner' } }, { userRole: { eq: 'admin' } }],
    }),
})

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
})

export { handler as GET, handler as POST }

export type EdgeStoreRouter = typeof edgeStoreRouter
