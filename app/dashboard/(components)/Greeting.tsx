import { motion } from 'framer-motion'

interface GreetingProps {
  name: string | null
}

export function Greeting({ name }: GreetingProps) {
  const timeOfDay = new Date().getHours()
  const greeting =
    timeOfDay < 12
      ? 'Good morning'
      : timeOfDay < 18
        ? 'Good afternoon'
        : 'Good evening'

  return (
    <motion.div
      className='text-center sm:text-left'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='text-2xl font-bold text-primary'>
        {`${greeting},  ${name || 'User'}`}
      </h1>
      <p className='text-muted-foreground mt-1 text-2xl'>
        Welcome to your dashboard
      </p>
    </motion.div>
  )
}
