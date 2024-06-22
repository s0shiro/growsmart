import { createClient } from '@/utils/supabase/server'
import ToggleThemeButton from './MyComponents/shadcn/ToggleThemeButton'
import Profile from './Profile'
import LogOut from './LogOut'

const NavBar: React.FC = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className='flex flex-wrap items-center justify-between p-6 border-b bg-background border-border '>
      <div className='flex items-center flex-shrink-0 mr-6 text-white'>
        <span className='text-xl font-semibold tracking-tight text-foreground'>
          Logo
        </span>
      </div>
      <div className='block lg:hidden'>
        <button className='flex items-center px-3 py-2 text-teal-200 border border-teal-400 rounded hover:text-white hover:border-white'>
          <svg
            className='w-3 h-3 fill-current'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z' />
          </svg>
        </button>
      </div>
      <div className='flex-grow block w-full lg:flex lg:items-center lg:w-auto'>
        <div className='flex justify-center gap-8 text-sm lg:flex-grow'>
          <a
            href='/'
            className='block mt-4 lg:inline-block lg:mt-0 hover:text-primary'
          >
            Home
          </a>
          <a
            href='#responsive-header'
            className='block mt-4 lg:inline-block lg:mt-0 hover:text-primary'
          >
            Examples
          </a>
          <a
            href='#responsive-header'
            className='block mt-4 lg:inline-block lg:mt-0 hover:text-primary'
          >
            Blog
          </a>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        {user && <Profile />}
        <LogOut />
        <ToggleThemeButton className='ml-auto' />
      </div>
    </nav>
  )
}

export default NavBar
