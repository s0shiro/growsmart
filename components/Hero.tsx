import { AuthButtons } from './AuthButton'

const Hero = () => {
  return (
    <div className='py-20 px-44'>
      <div className='flex flex-wrap '>
        <div className='flex items-center w-full lg:w-1/2'>
          <div className='max-w-2xl mb-8'>
            <p className='py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300'>
              Nextly is a free landing page & marketing website template for
              startups and indie projects. Its built with Next.js & TailwindCSS.
              And its completely open-source.
            </p>

            <div className='flex flex-col items-start sm:space-y-0 sm:items-center sm:flex-row'>
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
