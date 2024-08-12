import { useState } from 'react'

const useForm = (initialValues: { [key: string]: any }) => {
  const [values, setValues] = useState(initialValues)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  return [values, handleChange] as const
}

export default useForm
