import type { CycleWeek } from '../types'

export type CycleProgress = {
  cycleNumber: number
  cycleWeek: CycleWeek
  isDeload: boolean
  weekIndex: number
}

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function mondayOnOrBefore(d: Date): Date {
  const x = startOfDay(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  return x
}

export function addDaysIso(iso: string, days: number): string {
  const d = parseIsoDate(iso)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

export function dateForWeekday(weekMondayIso: string, weekday: number): string {
  const offset = weekday === 0 ? 6 : weekday - 1
  return addDaysIso(weekMondayIso, offset)
}

export function cycleProgress(programStartIso: string, today: Date): CycleProgress {
  const start = startOfDay(parseIsoDate(programStartIso))
  const now = startOfDay(today)
  const diffDays = Math.round((now.getTime() - start.getTime()) / 86_400_000)
  const weekIndex = Math.max(0, Math.floor(diffDays / 7))
  const cycleNumber = Math.floor(weekIndex / 4) + 1
  const cycleWeek = ((weekIndex % 4) + 1) as CycleWeek
  return { cycleNumber, cycleWeek, isDeload: cycleWeek === 4, weekIndex }
}
