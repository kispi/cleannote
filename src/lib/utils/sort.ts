import type { CleaningLog } from '$lib/types/cleaningLog'
import dayjs from 'dayjs'

export const sortCleaningLogs = (logs: CleaningLog[]) => {
  return [...logs].sort((a, b) => {
    // 1. Calculate Status Priority
    const getPriority = (log: CleaningLog) => {
      const price =
        log.buildingSnapshot?.pricePerClean ?? log.building?.pricePerClean ?? 0
      const diff = (log.earnedAmount || 0) - price

      if (diff < 0) return 0 // Unpaid (Highest Priority)
      if (diff > 0 && price > 0) return 1 // Overpaid
      return 2 // Matched / Normal
    }

    const priorityA = getPriority(a)
    const priorityB = getPriority(b)

    if (priorityA !== priorityB) {
      return priorityA - priorityB // ASC: 0 -> 1 -> 2
    }

    // 2. Sort by Recency (Newest first)
    // Using cleanStart which has time, or id as fallback
    const timeA = dayjs(a.cleanStart).valueOf()
    const timeB = dayjs(b.cleanStart).valueOf()

    if (timeA !== timeB) {
      return timeB - timeA // DESC
    }

    return b.id - a.id // DESC
  })
}
