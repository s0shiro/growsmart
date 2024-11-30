export const DamageSeverityEnum = {
  MINIMAL: 'Minimal (0-25%)',
  MODERATE: 'Moderate (26-50%)',
  SEVERE: 'Severe (51-75%)',
  TOTAL: 'Total Loss (76-100%)',
} as const

export const DamageTypesEnum = {
  PEST: 'Pest Infestation',
  DISEASE: 'Plant Disease',
  WEATHER: 'Weather Damage',
  FLOOD: 'Flood Damage',
  DROUGHT: 'Drought Impact',
  SOIL: 'Soil Problems',
  OTHER: 'Other',
} as const

export const GrowthStagesEnum = {
  SEEDLING: 'Seedling',
  VEGETATIVE: 'Vegetative',
  REPRODUCTIVE: 'Reproductive',
  MATURITY: 'Maturity',
} as const
