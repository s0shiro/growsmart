'use server'

import { createClient } from '@/utils/supabase/server'

type CropData = {
  cropName: string
  cropVariety?: string
  cropCategory: string
}

type SupabaseResponse = {
  success?: boolean
  error?: { message: string } | string
}

// Function to add a crop and its variety
export const addCrop = async ({
  cropCategory,
  cropName,
  cropVariety,
}: CropData): Promise<SupabaseResponse> => {
  const supabase = createClient()

  console.log(cropName)

  try {
    let cropId: string | null = null

    // Check if the cropName is an existing crop ID (when it's already selected from the dropdown)
    if (cropName && cropName.length === 36) {
      // UUIDs are 36 characters long including dashes
      cropId = cropName
    } else {
      // Check if the crop already exists based on the name and category
      const { data: existingCrop, error: cropFetchError } = await supabase
        .from('crops')
        .select('id')
        .eq('name', cropName)
        .eq('category_id', cropCategory)
        .single()

      if (cropFetchError && cropFetchError.code !== 'PGRST116') {
        return {
          error: `Error checking existing crops: ${cropFetchError.message}`,
        }
      }

      if (existingCrop) {
        cropId = existingCrop.id
      } else {
        // Insert the crop into the crops table since it doesn't exist
        const { data: newCrop, error: cropInsertError } = await supabase
          .from('crops')
          .insert([{ name: cropName, category_id: cropCategory }])
          .select()
          .single()

        if (cropInsertError) {
          return { error: `Crop creation error: ${cropInsertError.message}` }
        }

        cropId = newCrop.id
      }
    }

    // If cropVariety is provided, insert it into the crop_varieties table
    if (cropVariety) {
      const { error: varietyError } = await supabase
        .from('crop_varieties')
        .insert([{ name: cropVariety, crop_id: cropId }])

      if (varietyError) {
        return { error: `Variety creation error: ${varietyError.message}` }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error adding crop:', error)
    return { error: (error as Error).message }
  }
}

export const getAllCropCategory = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from('crop_categories').select(`
      *,
      crops (
        *,
        crop_varieties (*)
      )
    `)

  if (error) {
    console.error('Supabase error:', error.message)
    return 0 // Return 0 or handle the error as needed
  }

  return data
}

export const getCropsByCategory = async (categoryId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('crops')
    .select('*')
    .eq('category_id', categoryId)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

export const getVarietiesByCrop = async (cropId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('crop_varieties')
    .select('*')
    .eq('crop_id', cropId)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

export const getAllCategoriesWithCropsAndVarieties = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('crop_categories')
    .select('id, name, crops (id, name, crop_varieties (id, name))')

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  return data
}

export const getAllHarvestedCrops = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `*, farmer_id (id, firstname, lastname), crop_type(id, name), variety(id, name), crop_categoryId(id, name), harvest_records(harvest_date)`,
    )
    .eq('status', 'harvested')

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

// Get all standing crops based on the program coordinator program type
export const getAllStandingCropBasedOnUserProgramType = async () => {
  const supabase = createClient()

  // Get the current user
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error fetching user:', userError.message)
    return []
  }

  //   console.log('User:', JSON.stringify(user, null, 2))

  // Get the user's program type from the metadata
  const programType = user.user?.user_metadata?.programType

  if (!programType) {
    console.error('Program type not found in user metadata')
    return []
  }

  // Fetch standing crops based on the user's program type
  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `id, farmer_id (id, firstname, lastname), crop_type(id, name), variety(id, name), crop_categoryId(id, name), status`,
    )
    .eq('crop_categoryId', programType)
    .eq('status', 'inspection')

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  console.log(JSON.stringify(data, null, 2))

  return data
}

export const getAllHarvestedCropBasedOnUserProgramType = async () => {
  const supabase = createClient()

  // Get the current user
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error fetching user:', userError.message)
    return []
  }

  //   console.log('User:', JSON.stringify(user, null, 2))

  // Get the user's program type from the metadata
  const programType = user.user?.user_metadata?.programType

  if (!programType) {
    console.error('Program type not found in user metadata')
    return []
  }

  // Fetch standing crops based on the user's program type
  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `id, farmer_id (id, firstname, lastname), crop_type(id, name), variety(id, name), crop_categoryId(id, name), status`,
    )
    .eq('crop_categoryId', programType)
    .eq('status', 'harvested')

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  console.log(JSON.stringify(data, null, 2))

  return data
}
