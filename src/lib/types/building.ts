export interface Building {
  id: number
  userId: number
  name: string
  address: string | null
  apiName: string | null
  apiAddress: string | null
  lat: number | null
  lng: number | null
  pricePerClean: number | null
  scheduledDays: string | null
  memo: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type BuildingUpsert = Partial<Omit<Building, 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId'>> & {
  name: string
}
