import { clsx } from 'clsx'

interface LoadingDotsProps {
  className?: string
  color?: string // Add color prop
}

const LoadingDots = ({
  className,
  color = 'text-foreground',
}: LoadingDotsProps) => {
  return (
    <span className={clsx('flex items-center gap-0.5', className)}>
      <span
        className={clsx('animate-[loadingDot_1s_ease-in-out_infinite]', color)}
      >
        .
      </span>
      <span
        className={clsx(
          'animate-[loadingDot_1s_ease-in-out_infinite]',
          '[animation-delay:200ms]',
          color,
        )}
      >
        .
      </span>
      <span
        className={clsx(
          'animate-[loadingDot_1s_ease-in-out_infinite]',
          '[animation-delay:400ms]',
          color,
        )}
      >
        .
      </span>
    </span>
  )
}

export default LoadingDots

// Usage:
// <LoadingDots color="text-green-500" />
// <LoadingDots color="text-blue-500" />
