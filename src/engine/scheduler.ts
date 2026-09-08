import type { JoinedLift, LiftPattern } from '../types'

export type ScheduledLift = JoinedLift & {
  isDayMain: boolean
}

export type DayPlan = {
  weekday: number
  lifts: ScheduledLift[]
}

const HEAVY: ReadonlySet<LiftPattern> = new Set([
  'verticalPush',
  'hinge',
  'horizontalPush',
  'squat',
])

const PREFERRED: LiftPattern[] = ['verticalPush', 'hinge', 'horizontalPush', 'squat']
const DEFAULT_DAYS = [1, 2, 4, 5]

export function isHeavyPattern(pattern: LiftPattern): boolean {
  return HEAVY.has(pattern)
}

export function patternsConflict(a: LiftPattern, b: LiftPattern): boolean {
  return (
    (a === 'horizontalPush' && b === 'verticalPush') ||
    (a === 'verticalPush' && b === 'horizontalPush') ||
    (a === 'squat' && b === 'hinge') ||
    (a === 'hinge' && b === 'squat')
  )
}

export function weekdaysConsecutive(a: number, b: number): boolean {
  const d = Math.abs(a - b)
  return d === 1 || d === 6
}

export function pickSpreadWeekdays(available: number[], count: number): number[] {
  const days = [...new Set(available)].sort((a, b) => a - b)
  if (days.length === 0 || count <= 0) return []
  if (count >= days.length) return days
  if (count === 1) return [days[0]!]
  const used = new Set<number>()
  const picked: number[] = []
  for (let i = 0; i < count; i++) {
    let idx = Math.round((i * (days.length - 1)) / (count - 1))
    while (used.has(idx) && idx < days.length - 1) idx += 1
    while (used.has(idx) && idx > 0) idx -= 1
    used.add(idx)
    picked.push(days[idx]!)
  }
  return picked.sort((a, b) => a - b)
}

function attachHost(pattern: LiftPattern, attachTo?: LiftPattern): LiftPattern {
  if (attachTo) return attachTo
  if (pattern === 'horizontalPull') return 'horizontalPush'
  if (pattern === 'verticalPull') return 'verticalPush'
  return pattern
}

function placePatterns(
  patterns: LiftPattern[],
  days: number[],
): Map<LiftPattern, number> | null {
  const map = new Map<LiftPattern, number>()
  const used = new Set<number>()

  function rec(idx: number): boolean {
    if (idx === patterns.length) return true
    const pattern = patterns[idx]!
    for (const day of days) {
      if (used.has(day)) continue
      let legal = true
      for (const [other, otherDay] of map) {
        if (weekdaysConsecutive(day, otherDay) && patternsConflict(pattern, other)) {
          legal = false
          break
        }
      }
      if (!legal) continue
      used.add(day)
      map.set(pattern, day)
      if (rec(idx + 1)) return true
      used.delete(day)
      map.delete(pattern)
    }
    return false
  }

  return rec(0) ? map : null
}

function dayCandidates(preferred: number[], count: number): number[][] {
  return [
    pickSpreadWeekdays(preferred, count),
    pickSpreadWeekdays(DEFAULT_DAYS, count),
    pickSpreadWeekdays([1, 2, 3, 4, 5], count),
  ]
}

function dayConflicts(
  pattern: LiftPattern,
  day: number,
  occupied: Array<{ day: number; pattern: LiftPattern }>,
): boolean {
  return occupied.some(
    (entry) =>
      (entry.day === day || weekdaysConsecutive(day, entry.day)) &&
      patternsConflict(pattern, entry.pattern),
  )
}

export function buildSchedule(items: JoinedLift[], weekdays: number[]): DayPlan[] {
  if (items.length === 0) return []

  const heavy = items.filter((item) => isHeavyPattern(item.catalog.pattern))
  const others = items.filter((item) => !isHeavyPattern(item.catalog.pattern))
  const available = [...(weekdays.length > 0 ? weekdays : DEFAULT_DAYS)].sort((a, b) => a - b)
  if (available.length === 0) return []

  const heavyByPattern = new Map<LiftPattern, JoinedLift[]>()
  for (const item of heavy) {
    const list = heavyByPattern.get(item.catalog.pattern) ?? []
    list.push(item)
    heavyByPattern.set(item.catalog.pattern, list)
  }

  const heavyPatterns = [
    ...PREFERRED.filter((pattern) => heavyByPattern.has(pattern)),
    ...[...heavyByPattern.keys()].filter((pattern) => !PREFERRED.includes(pattern)),
  ]

  let assignment = new Map<LiftPattern, number>()
  if (heavyPatterns.length > 0) {
    const primary = heavyPatterns.slice(0, Math.min(heavyPatterns.length, 4, available.length))
    let days = pickSpreadWeekdays(available, primary.length)
    let placed: Map<LiftPattern, number> | null = null
    for (const candidate of dayCandidates(available, primary.length)) {
      placed = placePatterns(primary, candidate)
      if (placed) {
        days = candidate
        break
      }
    }
    assignment = placed ?? new Map(primary.map((pattern, i) => [pattern, days[i] ?? available[0]!]))
  }

  const occupied: Array<{ day: number; pattern: LiftPattern }> = [...assignment].map(([pattern, day]) => ({
    day,
    pattern,
  }))
  let leftover = available.filter((day) => ![...assignment.values()].includes(day))

  const byDay = new Map<number, ScheduledLift[]>()

  function ensureDay(weekday: number): ScheduledLift[] {
    const existing = byDay.get(weekday)
    if (existing) return existing
    const created: ScheduledLift[] = []
    byDay.set(weekday, created)
    return created
  }

  for (const pattern of heavyPatterns) {
    const weekday = assignment.get(pattern) ?? available[0]!
    const group = heavyByPattern.get(pattern) ?? []
    group.forEach((item, index) => {
      ensureDay(weekday).push({ ...item, isDayMain: index === 0 })
    })
  }

  for (const item of others) {
    const host = attachHost(item.catalog.pattern, item.catalog.attachTo)
    let weekday = assignment.get(host) ?? assignment.get(item.catalog.pattern) ?? available[0]!
    if (leftover.length > 0) {
      const pick =
        leftover.find((day) => !dayConflicts(item.catalog.pattern, day, occupied)) ?? leftover[0]!
      weekday = pick
      leftover = leftover.filter((day) => day !== pick)
      occupied.push({ day: pick, pattern: item.catalog.pattern })
    }
    const list = ensureDay(weekday)
    list.push({ ...item, isDayMain: list.length === 0 })
  }

  return [...byDay.entries()]
    .filter(([, lifts]) => lifts.length > 0)
    .sort((a, b) => a[0] - b[0])
    .map(([weekday, lifts]) => ({ weekday, lifts }))
}

export function consecutiveConflicts(plan: DayPlan[]): Array<[LiftPattern, LiftPattern]> {
  const found: Array<[LiftPattern, LiftPattern]> = []
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i]!
    const b = plan[i + 1]
    if (!b || !weekdaysConsecutive(a.weekday, b.weekday)) continue
    const aMains = a.lifts.filter((l) => isHeavyPattern(l.catalog.pattern)).map((l) => l.catalog.pattern)
    const bMains = b.lifts.filter((l) => isHeavyPattern(l.catalog.pattern)).map((l) => l.catalog.pattern)
    for (const pa of aMains) {
      for (const pb of bMains) {
        if (patternsConflict(pa, pb)) found.push([pa, pb])
      }
    }
  }
  return found
}
