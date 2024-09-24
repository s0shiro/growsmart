import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'

interface DropdownMenuProps {
  title: string
  Icon: React.ComponentType<{ className?: string }>
  links: {
    href: string
    Icon: React.ComponentType<{ className?: string }>
    label: string
  }[]
  isActive: (path: string, href: string) => boolean
  activeClass: string
  path: string
}

const DropdownLinks: React.FC<DropdownMenuProps> = ({
  title,
  Icon,
  links,
  isActive,
  activeClass,
  path,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isAnyLinkActive = links.some(({ href }) => isActive(path, href))

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground w-full',
          isAnyLinkActive && activeClass, // Apply active state to the main link
        )}
      >
        <Icon className='h-5 w-5' />
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className='ml-auto h-5 w-5' />
        ) : (
          <ChevronRight className='ml-auto h-5 w-5' />
        )}
      </button>

      {/* Dropdown Links */}
      {isOpen && (
        <div className='ml-6'>
          {links.map(({ href, Icon, label }) => (
            <Link
              key={label}
              href={href}
              className={clsx(
                'flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground',
                isActive(path, href) && activeClass, // Apply active state to individual links
              )}
            >
              <Icon className='h-4 w-4' />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default DropdownLinks
