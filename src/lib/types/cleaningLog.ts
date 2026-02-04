import type { Building } from './building'

export interface CleaningLog {
  id: number
  buildingId: number
  building?: Building
  cleanStart: string
  cleanEnd: string
  status: 'completed' | 'skipped'
  earnedAmount: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type CleaningLogUpsert = Partial<Omit<CleaningLog, 'createdAt' | 'updatedAt' | 'deletedAt' | 'building'>> & {
  buildingId: number
  cleanStart: string
  cleanEnd: string
}
