'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/auth'
import React, { useState } from 'react'
import { useTransition } from 'react'
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  BarChart3,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingDots from '../dashboard/(components)/ui/LoadingDots'

const initState = { message: null as string | null }

const features = [
  {
    icon: Leaf,
    title: 'Crop Monitoring',
    description: 'Track planting activities in real-time',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Comprehensive agricultural insights',
  },
  {
    icon: Users,
    title: 'Farmer Management',
    description: 'Organize farmer records efficiently',
  },
]

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [formState, setFormState] = useState<{ message: string | null }>(
    initState,
  )
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await login({ message: formState.message, formData })
      setFormState(result)
      setErrorMessage(result.message)
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Left Panel - Branding & Features */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className='hidden lg:flex lg:w-1/2 relative overflow-hidden'
      >
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-emerald-500/10' />
        <motion.div
          className='absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-20'>
          {/* Logo and Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mb-12'
          >
            <Link href='/' className='flex items-center gap-3 mb-8'>
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring' }}
              >
                <Image
                  src='/no-bg.png'
                  alt='GrowSmart Logo'
                  width={48}
                  height={48}
                />
              </motion.div>
              <span className='text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent'>
                GrowSmart
              </span>
            </Link>
            <h1 className='text-4xl xl:text-5xl font-bold tracking-tight mb-4'>
              Welcome back to{' '}
              <span className='bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent'>
                GrowSmart
              </span>
            </h1>
            <p className='text-lg text-muted-foreground'>
              Marinduque Provincial Agriculture Office's comprehensive crop
              production monitoring system.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.4 },
              },
            }}
            className='space-y-6'
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                className='flex items-start gap-4 group'
              >
                <div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors'>
                  <feature.icon className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold mb-1'>{feature.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='mt-16 pt-8 border-t border-border/50'
          >
            <p className='text-sm text-muted-foreground'>
              © 2024 Marinduque Provincial Agriculture Office
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className='flex-1 flex items-center justify-center p-6 lg:p-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className='lg:hidden text-center mb-8'
          >
            <Link href='/' className='inline-flex items-center gap-2 mb-4'>
              <Image
                src='/no-bg.png'
                alt='GrowSmart Logo'
                width={48}
                height={48}
              />
              <span className='text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent'>
                GrowSmart
              </span>
            </Link>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-card border border-border/50 rounded-2xl p-8 shadow-xl'
          >
            <div className='mb-8'>
              <h2 className='text-2xl font-bold mb-2'>Sign in</h2>
              <p className='text-sm text-muted-foreground'>
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className='space-y-2'
              >
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-foreground'
                >
                  Email
                </Label>
                <div className='relative group'>
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='you@example.com'
                    required
                    className='pl-10 h-11 w-full bg-background border-border/50 focus:border-primary transition-colors'
                  />
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors' />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className='space-y-2'
              >
                <div className='flex items-center justify-between'>
                  <Label
                    htmlFor='password'
                    className='text-sm font-medium text-foreground'
                  >
                    Password
                  </Label>
                  <Link
                    href='/forgot-password'
                    className='text-xs text-primary hover:text-primary/80 hover:underline transition-all'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative group'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='••••••••'
                    required
                    className='pl-10 pr-10 h-11 w-full bg-background border-border/50 focus:border-primary transition-colors'
                  />
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors' />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-transparent'
                    onClick={togglePasswordVisibility}
                  >
                    <motion.div
                      initial={false}
                      animate={{ scale: [1, 0.8, 1] }}
                      transition={{ duration: 0.2 }}
                      key={showPassword ? 'hide' : 'show'}
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
                      ) : (
                        <Eye className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
                      )}
                    </motion.div>
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type='submit'
                    className='w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium'
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className='flex items-center gap-1'>
                        Signing in <LoadingDots />
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        Sign in
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className='h-4 w-4' />
                        </motion.span>
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              <AnimatePresence mode='wait'>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className='p-4 text-center bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20'>
                      {errorMessage}
                    </p>
                  </motion.div>
                )}

                {searchParams?.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className='p-4 text-center bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20'>
                      {searchParams.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Bottom Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='text-center text-sm text-muted-foreground mt-6'
          >
            <Link
              href='/'
              className='hover:text-primary transition-colors inline-flex items-center gap-1'
            >
              <ArrowRight className='h-3 w-3 rotate-180' />
              Back to home
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
