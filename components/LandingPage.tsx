import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { readUserSession } from '@/lib/actions'

const services = [
  {
    title: 'Crop Consulting',
    description:
      'Empower your farming operation with our crop consulting services. Our experts analyze soil, climate conditions, and crop performance to provide data-driven recommendations.',
    image: '/nature.jpg',
  },
  {
    title: 'Pest Management',
    description:
      'Protect your crops with our integrated pest management solutions. We use eco-friendly methods to control pests and diseases effectively.',
    image: '/nature.jpg',
  },
  {
    title: 'Organic Farming',
    description:
      'Transition to organic farming with our comprehensive support. We guide you through certification processes and sustainable practices.',
    image: '/nature.jpg',
  },
  {
    title: 'Farm Management',
    description:
      'Optimize your farm operations with our management services. We help streamline processes and improve overall farm productivity.',
    image: '/nature.jpg',
  },
]

export default async function LandingPage() {
  const { data: userSession } = await readUserSession()

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='relative flex-grow'>
        {/* Background Image */}
        <Image
          src='/rice-terra.jpg'
          alt='Lush green agricultural field'
          fill
          quality={100}
          className='z-0 object-cover'
        />

        {/* Content Overlay */}
        <div className='relative z-10 min-h-screen flex flex-col'>
          {/* Blurred Header */}
          <header className='fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md p-6 flex justify-between items-center'>
            <Button variant='ghost' size='icon' className='text-white'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Menu</span>
            </Button>
            <span className='text-xl font-semibold'>
              Marinduque Provincial Agriculture Office
            </span>
            {userSession.user ? (
              <Link href={'/dashboard'}>
                <Button
                  variant='outline'
                  className='text-white border-white hover:bg-white hover:text-green-900'
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={'/login'}>
                <Button
                  variant='outline'
                  className='text-white border-white hover:bg-white hover:text-green-900'
                >
                  Get Started
                </Button>
              </Link>
            )}
          </header>
          {/* Main Content */}
          <main className='flex-grow flex flex-col justify-between p-6'>
            <div className='self-end max-w-md text-right'>
              <p className='text-lg font-light mt-20'>
                We are passionate about sustainable agriculture and committed to
                providing high-quality products and services that nourish both{' '}
                <span className='font-normal'>people and the planet</span>.
              </p>
            </div>

            <div className='flex flex-col items-center space-y-56'>
              {/* Terra Cultiva Large Text */}
              <h1 className='text-6xl sm:text-8xl font-bold leading-none text-center'>
                GROWSMART
              </h1>

              <div className='space-y-4 w-full'>
                <p className='text-sm font-light italic text-center'>
                  // Roots in Sustainability.
                </p>

                {/* Categories */}
                <div className='flex flex-wrap justify-between text-sm font-light'>
                  <span className='mb-2'>[ Organic Farming ]</span>
                  <span className='mb-2'>[ Hydroponics ]</span>
                  <span className='mb-2'>[ Vertical Farming ]</span>
                  <span className='mb-2'>[ Farm Management ]</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* New Section */}
      {/* <section className='bg-white text-gray-900 py-16'>
        <div className='container mx-auto px-4'>
          <div className='mb-12'>
            <p className='text-sm text-green-700 mb-2'>
              // Harvesting Legacy, Planting Tomorrow.
            </p>
            <h2 className='text-4xl md:text-6xl font-bold mb-6'>
              <span className='text-gray-400'>Rooted in Tradition,</span>
              <br />
              Growing for the Future
            </h2>
            <p className='text-lg max-w-3xl'>
              At Terra Cultiva, we are passionate about sustainable agriculture
              and committed to providing high-quality products and services that
              nourish both people and the planet. With a focus on innovation,
              eco-friendly practices, and community engagement, we strive to be
              a driving force in the future of agriculture.
            </p>
          </div>

          <div className='flex justify-between items-center mb-8'>
            <h3 className='text-2xl font-semibold'>What we do</h3>
            <p className='text-green-700'>Terra Cultiva</p>
            <p className='text-gray-500'>©2024</p>
          </div>

          <div className='mb-8'>
            <p className='text-lg mb-4'>
              We offer a comprehensive range of services to support farmers and
              agricultural enthusiasts in cultivating success sustainably.
            </p>
            <Button className='bg-green-700 hover:bg-green-800 text-white'>
              All Services
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {services.map((service, index) => (
              <Card key={index} className='overflow-hidden'>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={300}
                  height={200}
                  className='w-full h-48 object-cover'
                />
                <CardContent className='p-4'>
                  <h4 className='text-xl font-semibold mb-2'>
                    {service.title}
                  </h4>
                  <p className='text-sm'>{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='flex justify-center mt-8'>
            <Button variant='outline' className='mr-2'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline'>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  )
}
