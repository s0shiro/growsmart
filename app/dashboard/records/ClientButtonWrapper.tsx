'use client'

interface ClientButtonWrapperProps {
  id: string // The ID you want to log
  children: React.ReactNode
}

const ClientButtonWrapper: React.FC<ClientButtonWrapperProps> = ({
  id,
  children,
}) => {
  const handleClick = () => {
    console.log(id)
  }

  return <div onClick={handleClick}>{children}</div>
}

export default ClientButtonWrapper
