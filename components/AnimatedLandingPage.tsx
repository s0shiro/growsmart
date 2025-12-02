'use client'

import { Button } from '@/components/ui/button'
import {
  Menu,
  ArrowRight,
  Facebook,
  Leaf,
  BarChart3,
  Users,
  Cloud,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from 'next-themes'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
}

// Animated section wrapper component
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedLandingPageProps {
  userSession: { user: any } | null
}

export default function AnimatedLandingPage({
  userSession,
}: AnimatedLandingPageProps) {
  const featuresRef = useRef(null)
  const aboutRef = useRef(null)
  const ctaRef = useRef(null)
  const { theme, setTheme } = useTheme()

  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: '-100px',
  })
  const aboutInView = useInView(aboutRef, { once: true, margin: '-100px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' })

  const features = [
    {
      icon: Leaf,
      title: 'Crop Tracking',
      description:
        'Monitor planting activities from seeding to harvest with real-time updates.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description:
        'Gain insights with comprehensive reports and data visualization.',
    },
    {
      icon: Users,
      title: 'Farmer Management',
      description:
        'Keep track of farmer records and their agricultural activities.',
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Securely store and access data anywhere, anytime.',
    },
  ]

  const aboutItems = [
    'Efficient crop production monitoring',
    'Real-time farmer activity tracking',
    'Data-driven agricultural decisions',
    'Sustainable farming practices support',
  ]

  const tags = [
    'Organic Farming',
    'Hydroponics',
    'Vertical Farming',
    'Farm Management',
    'Crop Monitoring',
    'Data Analytics',
    'Farmer Support',
    'Sustainable Practices',
  ]

  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-filter backdrop-blur-lg border-b border-border/50'
      >
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' className='flex items-center space-x-2'>
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src='/no-bg.png'
                alt='GrowSmart Logo'
                width={36}
                height={36}
              />
            </motion.div>
            <span className='text-xl font-semibold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent'>
              GrowSmart
            </span>
          </Link>
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='#features'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              Features
            </Link>
            <Link
              href='#about'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              About
            </Link>
          </nav>
          <div className='flex items-center space-x-3'>
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='relative'
              >
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <Sun className='h-5 w-5' />
                    ) : (
                      <Moon className='h-5 w-5' />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </motion.div>

            {userSession?.user ? (
              <Link href='/dashboard'>
                <Button variant='default' size='sm'>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href='/login' className='hidden sm:block'>
                  <Button variant='ghost' size='sm'>
                    Sign In
                  </Button>
                </Link>
                <Link href='/login'>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size='sm'>Get Started</Button>
                  </motion.div>
                </Link>
              </>
            )}
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Menu</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden'>
        {/* Animated background gradient */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-20'
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className='relative z-10 container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/50 backdrop-blur-sm mb-8'
            >
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
              </span>
              <span className='text-sm text-muted-foreground'>
                Marinduque Provincial Agriculture Office
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6'
            >
              Grow Smarter,{' '}
              <motion.span
                className='bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block'
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Not Harder
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10'
            >
              Simplify crop production monitoring and track farmers' planting
              activities with efficient management from seeding to harvest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='flex flex-col sm:flex-row gap-4 justify-center'
            >
              <Link href='/login'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size='lg' className='w-full sm:w-auto gap-2'>
                    Start Monitoring{' '}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className='h-4 w-4' />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link href='#features'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto'
                  >
                    View Features
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='mt-16 md:mt-24 relative'
          >
            <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none' />
            <motion.div
              className='relative rounded-xl overflow-hidden border border-border/50 shadow-2xl'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src='/rice-terra.jpg'
                alt='Agricultural field overview'
                width={1200}
                height={600}
                className='w-full h-[300px] md:h-[500px] object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent' />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 md:py-32' ref={featuresRef}>
        <div className='container mx-auto px-4'>
          <motion.div
            initial='hidden'
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Everything you need to manage agriculture
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Comprehensive tools designed for the Marinduque Provincial
              Agriculture Office to streamline crop monitoring and farmer
              support.
            </p>
          </motion.div>

          <motion.div
            initial='hidden'
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className='group relative p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'
              >
                <motion.div
                  className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className='h-6 w-6 text-primary' />
                </motion.div>
                <h3 className='font-semibold mb-2'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id='about'
        className='py-20 md:py-32 border-t border-border/50'
        ref={aboutRef}
      >
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial='hidden'
              animate={aboutInView ? 'visible' : 'hidden'}
              variants={slideInLeft}
              transition={{ duration: 0.6 }}
            >
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                About Marinduque Provincial Agriculture Office
              </h2>
              <p className='text-muted-foreground mb-8'>
                We are passionate about sustainable agriculture and committed to
                providing high-quality products and services that nourish both
                people and the planet.
              </p>

              <motion.div
                className='space-y-4'
                initial='hidden'
                animate={aboutInView ? 'visible' : 'hidden'}
                variants={staggerContainer}
              >
                {aboutItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center gap-3'
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={aboutInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    >
                      <CheckCircle2 className='h-5 w-5 text-primary flex-shrink-0' />
                    </motion.div>
                    <span className='text-sm'>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial='hidden'
              animate={aboutInView ? 'visible' : 'hidden'}
              variants={slideInRight}
              transition={{ duration: 0.6 }}
              className='flex flex-wrap gap-3'
            >
              {tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    aboutInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                  }}
                  className='px-4 py-2 rounded-full border border-border bg-card text-sm cursor-default transition-colors'
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 md:py-32' ref={ctaRef}>
        <div className='container mx-auto px-4'>
          <motion.div
            initial='hidden'
            animate={ctaInView ? 'visible' : 'hidden'}
            variants={scaleIn}
            transition={{ duration: 0.6 }}
            className='relative rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-8 md:p-16 text-center overflow-hidden'
          >
            <motion.div
              className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
              animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl'
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />

            <div className='relative z-10'>
              <motion.h2
                variants={fadeInUp}
                className='text-3xl md:text-4xl font-bold mb-4'
              >
                Ready to get started?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
                className='text-muted-foreground max-w-xl mx-auto mb-8'
              >
                Join GrowSmart today and transform how you monitor and manage
                agricultural activities in Marinduque.
              </motion.p>
              <Link href='/login'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='inline-block'
                >
                  <Button size='lg' className='gap-2'>
                    Get Started Free{' '}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className='h-4 w-4' />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='border-t border-border py-12'
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <motion.div
              className='flex items-center gap-3'
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src='/no-bg.png'
                alt='GrowSmart Logo'
                width={32}
                height={32}
              />
              <span className='text-sm text-muted-foreground'>
                © 2024 MPAO. All rights reserved.
              </span>
            </motion.div>
            <nav className='flex items-center gap-6'>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                Privacy
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                Terms
              </Link>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href='https://www.facebook.com/PagriDuque'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  <Facebook className='h-5 w-5' />
                  <span className='sr-only'>Facebook</span>
                </Link>
              </motion.div>
            </nav>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
