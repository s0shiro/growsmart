import { Button } from '@/components/ui/button'
import { Menu, ArrowRight, Facebook } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { readUserSession } from '@/lib/actions'

export default async function LandingPage() {
  const { data: userSession } = await readUserSession()

  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-filter backdrop-blur-md border-b border-border'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src='/no-bg.png'
              alt='GrowSmart Logo'
              width={40}
              height={40}
            />
            <span className='text-xl font-semibold text-primary'>
              GrowSmart
            </span>
          </Link>
          {/*<nav className='hidden md:flex space-x-4'>*/}
          {/*  <Link*/}
          {/*    href='#about'*/}
          {/*    className='text-foreground/80 hover:text-primary transition-colors'*/}
          {/*  >*/}
          {/*    About*/}
          {/*  </Link>*/}
          {/*</nav>*/}
          {userSession.user ? (
            <Link href='/dashboard'>
              <Button variant='default'>Dashboard</Button>
            </Link>
          ) : (
            <Link href='/login'>
              <Button variant='default'>Get Started</Button>
            </Link>
          )}
          <Button variant='ghost' size='icon' className='md:hidden'>
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Menu</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative pt-20 pb-40 md:pt-40 md:pb-60'>
        <Image
          src='/rice-terra.jpg'
          alt='Lush green agricultural field'
          fill
          quality={100}
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/50' />
        <div className='relative z-10 container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center text-white'>
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>
              Grow Smarter, Not Harder
            </h1>
            <p className='text-xl mb-8'>
              GrowSmart is designed to simplify {` `}
              <span className='font-bold'>crop production monitoring</span>,
              helping the Marinduque Provincial Agriculture Office easily track farmers'
              planting activities and ensure efficient management from seeding
              to harvest.
            </p>
            <Button size='lg' asChild>
              <Link href='#about'>
                Learn More <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-6'>About Marinduque Provincial Agriculture Office</h2>
            <p className='text-lg mb-8'>
              We are passionate about sustainable agriculture and committed to
              providing high-quality products and services that nourish both
              <span className='font-semibold'> people and the planet</span>.
            </p>
            <div className='flex flex-wrap justify-center gap-4 text-sm font-light'>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full'>
                Organic Farming
              </span>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full'>
                Hydroponics
              </span>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full'>
                Vertical Farming
              </span>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full'>
                Farm Management
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-background border-t border-border py-8'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <Image
                src='/no-bg.png'
                alt='GrowSmart Logo'
                width={40}
                height={40}
              />
              <p className='mt-2 text-sm text-muted-foreground'>
                © 2024 MPAO. All rights reserved.
              </p>
            </div>
            <nav className='flex items-center space-x-4'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                Terms of Service
              </Link>
              <Link
                href='https://www.facebook.com/PagriDuque'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Facebook className='h-5 w-5' />
                <span className='sr-only'>Facebook</span>
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
