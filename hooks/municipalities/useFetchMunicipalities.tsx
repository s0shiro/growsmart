import { useQuery } from '@tanstack/react-query'

export const useFetchMunicipalities = () => {
  const url =
    'https://psgc.gitlab.io/api/provinces/174000000/municipalities.json'

  const fetchMunicipalities = async () => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch municipalities')
    }
    return response.json()
  }

  return useQuery({
    queryKey: ['municipalities'],
    queryFn: fetchMunicipalities,
  })
}

export const useFetchBarangays = (municipalityCode: string) => {
  const url = `https://psgc.gitlab.io/api/municipalities/${municipalityCode}/barangays.json`

  const fetchBarangays = async () => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch barangays')
    }
    return response.json()
  }

  return useQuery({
    queryKey: ['barangays', municipalityCode],
    queryFn: fetchBarangays,
  })
}
