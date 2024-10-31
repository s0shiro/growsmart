'use client'

import React, { useRef, useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useFetchHarvestedRice from '@/hooks/reports/useFetchHarvestedRice'
import useFetchTotalHarvestedRice from '@/hooks/reports/useFetchTotalHarvestRiceData'

type SeedData = {
  area: number
  averageYield: number
  production: number
}

type BarangayData = {
  noOfFarmerHarvested: number
  hybridSeeds: SeedData
  registeredSeeds: SeedData
  certifiedSeeds: SeedData
  goodQualitySeeds: SeedData
  farmerSavedSeeds: SeedData
  farmerIds?: Set<string>
}

type ProcessedData = Record<string, Record<string, BarangayData>>

const calculateProduction = (yieldQuantity: number): number => {
  return yieldQuantity / 1000 // Convert kg to MT
}

const calculateAverageYield = (production: number, area: number): number => {
  return area > 0 ? production / area : 0
}

const classificationMap: Record<string, keyof BarangayData> = {
  Hybrid: 'hybridSeeds',
  Registered: 'registeredSeeds',
  Certified: 'certifiedSeeds',
  'Good Quality': 'goodQualitySeeds',
  'Farmer Saved Seeds': 'farmerSavedSeeds',
}

const municipalities = [
  'Boac',
  'Buenavista',
  'Gasan',
  'Mogpog',
  'Santa Cruz',
  'Torrijos',
]
const waterSupplyTypes = ['irrigated', 'rainfed', 'upland', 'total']

export default function HarvestingReportTable() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')
  const [selectedWaterSupply, setSelectedWaterSupply] = useState<string>('')
  const {
    data: specificData,
    isFetching: isFetchingSpecific,
    error: specificError,
  } = useFetchHarvestedRice(selectedMunicipality, selectedWaterSupply)
  const {
    data: totalData,
    isFetching: isFetchingTotal,
    error: totalError,
  } = useFetchTotalHarvestedRice(selectedMunicipality)
  const printableRef = useRef<HTMLDivElement>(null)

  const processedData: ProcessedData = useMemo(() => {
    const dataToProcess =
      selectedWaterSupply === 'total' ? totalData : specificData
    if (!dataToProcess || !Array.isArray(dataToProcess)) return {}

    const barangays: ProcessedData = {}

    dataToProcess.forEach((item) => {
      if (!item || typeof item !== 'object') return

      const { location, category_specific, harvest_records, farmer_id } = item
      if (
        !location ||
        !category_specific ||
        !harvest_records ||
        !Array.isArray(harvest_records) ||
        !farmer_id ||
        typeof farmer_id !== 'object' ||
        !('id' in farmer_id)
      )
        return

      const { barangay, municipality } = location
      const { waterSupply, classification, landType } = category_specific

      if (
        typeof barangay !== 'string' ||
        typeof municipality !== 'string' ||
        typeof waterSupply !== 'string' ||
        typeof classification !== 'string' ||
        typeof landType !== 'string'
      )
        return

      if (selectedWaterSupply === 'upland' && landType !== 'upland') return
      if (
        selectedWaterSupply !== 'upland' &&
        selectedWaterSupply !== 'total' &&
        waterSupply !== selectedWaterSupply
      )
        return

      if (!barangays[municipality]) {
        barangays[municipality] = {}
      }

      if (!barangays[municipality][barangay]) {
        barangays[municipality][barangay] = {
          noOfFarmerHarvested: 0,
          hybridSeeds: { area: 0, averageYield: 0, production: 0 },
          registeredSeeds: { area: 0, averageYield: 0, production: 0 },
          certifiedSeeds: { area: 0, averageYield: 0, production: 0 },
          goodQualitySeeds: { area: 0, averageYield: 0, production: 0 },
          farmerSavedSeeds: { area: 0, averageYield: 0, production: 0 },
          farmerIds: new Set(),
        }
      }

      barangays[municipality][barangay].farmerIds!.add(farmer_id.id)
      barangays[municipality][barangay].noOfFarmerHarvested =
        barangays[municipality][barangay].farmerIds!.size

      const seedType = classificationMap[classification] || 'goodQualitySeeds'
      const area = harvest_records[0]?.area_harvested || 0
      const production = calculateProduction(
        harvest_records[0]?.yield_quantity || 0,
      )
      const averageYield = calculateAverageYield(production, area)

      const seedData = barangays[municipality][barangay][seedType]
      seedData.area += area
      seedData.production += production
      seedData.averageYield = calculateAverageYield(
        seedData.production,
        seedData.area,
      )
    })

    return barangays
  }, [specificData, totalData, selectedWaterSupply])

  const calculateTotal = (data: BarangayData): SeedData => {
    return Object.values(data).reduce(
      (acc, seedData) => {
        if (
          typeof seedData === 'object' &&
          seedData !== null &&
          'area' in seedData
        ) {
          acc.area += seedData.area
          acc.production += seedData.production
        }
        return acc
      },
      { area: 0, averageYield: 0, production: 0 },
    )
  }

  const calculateMunicipalityTotal = (
    barangayData: Record<string, BarangayData>,
  ): BarangayData => {
    const initialTotal: BarangayData = {
      noOfFarmerHarvested: 0,
      hybridSeeds: { area: 0, averageYield: 0, production: 0 },
      registeredSeeds: { area: 0, averageYield: 0, production: 0 },
      certifiedSeeds: { area: 0, averageYield: 0, production: 0 },
      goodQualitySeeds: { area: 0, averageYield: 0, production: 0 },
      farmerSavedSeeds: { area: 0, averageYield: 0, production: 0 },
      farmerIds: new Set(),
    }

    return Object.values(barangayData).reduce((acc, barangay) => {
      acc.noOfFarmerHarvested += barangay.noOfFarmerHarvested
      barangay.farmerIds?.forEach((id) => acc.farmerIds!.add(id))
      Object.keys(acc).forEach((key) => {
        if (key !== 'noOfFarmerHarvested' && key !== 'farmerIds') {
          acc[key].area += barangay[key].area
          acc[key].production += barangay[key].production
          acc[key].averageYield = calculateAverageYield(
            acc[key].production,
            acc[key].area,
          )
        }
      })
      return acc
    }, initialTotal)
  }

  const handlePrint = () => {
    if (printableRef.current) {
      const printContent = printableRef.current.innerHTML
      const printWindow = window.open('', 'PRINT', 'height=600,width=800')

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${selectedWaterSupply.toUpperCase()} Harvesting Report - ${selectedMunicipality}</title>
              <style>
                @page { size: landscape; }
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 4px; text-align: center; font-size: 12px; }
                .irrigated-header { background-color: #FFFF00; }
                .municipality { background-color: #FFA500; text-align: left; }
                .seed-type { background-color: #FFFFFF; }
                .municipality-total { background-color: #90EE90; font-weight: bold; }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      } else {
        alert('Please allow popups for this website')
      }
    }
  }

  const isFetching = isFetchingSpecific || isFetchingTotal
  const error = specificError || totalError

  if (isFetching) return <div>Loading...</div>
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    )

  return (
    <div className='p-4'>
      <div className='flex gap-4 mb-4'>
        <Select onValueChange={(value) => setSelectedMunicipality(value)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Municipality' />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((municipality) => (
              <SelectItem key={municipality} value={municipality}>
                {municipality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSelectedWaterSupply(value)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Water Supply' />
          </SelectTrigger>
          <SelectContent>
            {waterSupplyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className='w-full rounded-md border'>
        <div ref={printableRef}>
          <table className='w-full border-collapse border-2 border-black text-sm'>
            <thead>
              <tr>
                <th
                  rowSpan={3}
                  className='border border-black p-2 bg-white text-black'
                >
                  BARANGAY
                </th>
                <th
                  rowSpan={3}
                  className='border border-black p-2 bg-white text-black'
                >
                  No. of Farmer Harvested
                </th>
                <th
                  colSpan={18}
                  className='border border-black p-2 bg-yellow-300 text-black text-center font-bold irrigated-header'
                >
                  {selectedWaterSupply.toUpperCase()}
                </th>
              </tr>
              <tr>
                {[
                  'HYBRID SEEDS',
                  'REGISTERED SEEDS',
                  'CERTIFIED SEEDS',
                  'GOOD QUALITY SEEDS',
                  'FARMER SAVED SEEDS',
                  'TOTAL',
                ].map((seedType) => (
                  <React.Fragment key={seedType}>
                    <th
                      colSpan={3}
                      className='border border-black p-2 bg-white text-black seed-type'
                    >
                      {seedType}
                    </th>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                {[
                  'HYBRID SEEDS',
                  'REGISTERED SEEDS',
                  'CERTIFIED SEEDS',
                  'GOOD QUALITY SEEDS',
                  'FARMER SAVED SEEDS',
                  'TOTAL',
                ].map((_, index) => (
                  <React.Fragment key={index}>
                    <th className='border border-black p-2 bg-white text-black'>
                      Area
                      <br />
                      (ha)
                    </th>
                    <th className='border border-black p-2 bg-white text-black'>
                      Average Yield
                      <br />
                      (mt/ha)
                    </th>
                    <th className='border border-black p-2 bg-white text-black'>
                      Production
                      <br />
                      (mt)
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(processedData).map(
                ([municipality, barangayData]) => (
                  <React.Fragment key={municipality}>
                    <tr>
                      <td
                        colSpan={20}
                        className='border border-black p-2 bg-orange-300 text-black font-bold municipality'
                      >
                        {municipality.toUpperCase()}
                      </td>
                    </tr>
                    {Object.entries(barangayData).map(([barangay, data]) => {
                      const total = calculateTotal(data)
                      total.averageYield = calculateAverageYield(
                        total.production,
                        total.area,
                      )
                      return (
                        <tr key={barangay}>
                          <td className='border border-black p-2 bg-white text-black'>
                            {barangay}
                          </td>
                          <td className='border border-black p-2 bg-white text-black text-center'>
                            {data.noOfFarmerHarvested}
                          </td>
                          {[
                            'hybridSeeds',
                            'registeredSeeds',
                            'certifiedSeeds',
                            'goodQualitySeeds',
                            'farmerSavedSeeds',
                          ].map((seedType) => (
                            <React.Fragment key={seedType}>
                              <td className='border border-black p-2 bg-white text-black text-center'>
                                {data[seedType].area !== 0
                                  ? data[seedType].area.toFixed(4)
                                  : ''}
                              </td>
                              <td className='border border-black p-2 bg-white text-black text-center'>
                                {data[seedType].averageYield !== 0
                                  ? data[seedType].averageYield.toFixed(4)
                                  : ''}
                              </td>
                              <td className='border border-black p-2 bg-white text-black text-center'>
                                {data[seedType].production !== 0
                                  ? data[seedType].production.toFixed(4)
                                  : ''}
                              </td>
                            </React.Fragment>
                          ))}
                          <td className='border border-black p-2 bg-white text-black text-center'>
                            {total.area !== 0 ? total.area.toFixed(4) : ''}
                          </td>
                          <td className='border border-black p-2 bg-white text-black text-center'>
                            {total.averageYield !== 0
                              ? total.averageYield.toFixed(4)
                              : ''}
                          </td>
                          <td className='border border-black p-2 bg-white text-black text-center'>
                            {total.production !== 0
                              ? total.production.toFixed(4)
                              : ''}
                          </td>
                        </tr>
                      )
                    })}
                    <tr className='municipality-total bg-green-600'>
                      <td className='border border-black p-2 text-black bg-green-600'>
                        TOTAL
                      </td>
                      {(() => {
                        const municipalityTotal =
                          calculateMunicipalityTotal(barangayData)
                        const total = calculateTotal(municipalityTotal)
                        total.averageYield = calculateAverageYield(
                          total.production,
                          total.area,
                        )
                        return (
                          <>
                            <td className='border border-black p-2 text-black text-center'>
                              {municipalityTotal.farmerIds!.size}
                            </td>
                            {[
                              'hybridSeeds',
                              'registeredSeeds',
                              'certifiedSeeds',
                              'goodQualitySeeds',
                              'farmerSavedSeeds',
                            ].map((seedType) => (
                              <React.Fragment key={seedType}>
                                <td className='border border-black p-2 text-black text-center'>
                                  {municipalityTotal[seedType].area !== 0
                                    ? municipalityTotal[seedType].area.toFixed(
                                        4,
                                      )
                                    : ''}
                                </td>
                                <td className='border border-black p-2 text-black text-center'>
                                  {municipalityTotal[seedType].averageYield !==
                                  0
                                    ? municipalityTotal[
                                        seedType
                                      ].averageYield.toFixed(4)
                                    : ''}
                                </td>
                                <td className='border border-black p-2 text-black text-center'>
                                  {municipalityTotal[seedType].production !== 0
                                    ? municipalityTotal[
                                        seedType
                                      ].production.toFixed(4)
                                    : ''}
                                </td>
                              </React.Fragment>
                            ))}
                            <td className='border border-black p-2 text-black text-center'>
                              {total.area !== 0 ? total.area.toFixed(4) : ''}
                            </td>
                            <td className='border border-black p-2 text-black text-center'>
                              {total.area !== 0
                                ? (total.production / total.area).toFixed(4)
                                : ''}
                            </td>
                            <td className='border border-black p-2 text-black text-center'>
                              {total.production !== 0
                                ? total.production.toFixed(4)
                                : ''}
                            </td>
                          </>
                        )
                      })()}
                    </tr>
                  </React.Fragment>
                ),
              )}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <Button
        onClick={handlePrint}
        className='mt-4'
        disabled={!selectedMunicipality || !selectedWaterSupply}
      >
        Print
      </Button>
    </div>
  )
}
