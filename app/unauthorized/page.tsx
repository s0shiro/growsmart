'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function UnauthorizedPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='flex justify-center'
          >
            <div className='rounded-full bg-red-100 p-3'>
              <AlertTriangle className='w-6 h-6 text-red-600' />
            </div>
          </motion.div>
          <CardTitle className='text-2xl font-bold text-center mt-4'>
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='text-center text-gray-600'
          >
            We're unable to grant you access at this time. There seems to be an
            issue with your account permissions. Please contact your system
            administrator for further assistance.
          </motion.p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button asChild>
              <Link href='/' className='inline-flex items-center'>
                Home
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}
