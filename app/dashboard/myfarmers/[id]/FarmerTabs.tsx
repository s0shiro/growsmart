'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getOneFarmer } from '@/lib/farmer'
import PlantingRecords from './PlantingRecords'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Phone, User, Briefcase, Users } from 'lucide-react'

const FarmerProfileTabs = ({ id }: { id: string }) => {
  const { data: farmer, isLoading } = useQuery({
    queryKey: ['farmer', id],
    queryFn: () => getOneFarmer(id),
  })

  if (isLoading) {
    return <FarmerProfileSkeleton />
  }

  const {
    firstname,
    lastname,
    gender,
    municipality,
    barangay,
    phone,
    position,
    association_id,
    avatar,
  } = farmer || {}

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src={avatar} alt={lastname} />
              <AvatarFallback className="text-3xl">
                {firstname?.[0]}
                {lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl font-bold">
                {firstname}&apos;s Profile
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage your farmer information
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="planting">Planting Records</TabsTrigger>
              <TabsTrigger value="harvests">Harvests Report</TabsTrigger>
              <TabsTrigger value="interventions">Interventions</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileItem
                      icon={<User className="w-5 h-5" />}
                      label="Full Name"
                      value={`${firstname} ${lastname}`}
                    />
                    <ProfileItem
                      icon={<User className="w-5 h-5" />}
                      label="Gender"
                      value={gender}
                    />
                    <ProfileItem
                      icon={<MapPin className="w-5 h-5" />}
                      label="Address"
                      value={`${barangay}, ${municipality}`}
                    />
                    <ProfileItem
                      icon={<Phone className="w-5 h-5" />}
                      label="Contact No."
                      value={phone}
                    />
                    <ProfileItem
                      icon={<Briefcase className="w-5 h-5" />}
                      label="Position"
                      value={position ?? undefined}
                    />
                    <ProfileItem
                      icon={<Users className="w-5 h-5" />}
                      label="Association ID"
                      value={association_id ?? undefined}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="planting" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Planting Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlantingRecords farmerID={id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="harvests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Harvests Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Harvests report content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="interventions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interventions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Interventions content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

const ProfileItem = ({
                       icon,
                       label,
                       value,
                     }: {
  icon: React.ReactNode
  label: string
  value: string | undefined
}) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg">{value || 'N/A'}</p>
    </div>
  </div>
)

const FarmerProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="text-center md:text-left">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
)

export default FarmerProfileTabs