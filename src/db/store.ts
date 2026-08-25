import Dexie, { type Table } from 'dexie'
import { catalogById } from '../data/lifts'
import { mondayOnOrBefore, toIsoDate } from '../engine/dates'
import { trainingMaxFrom1RM } from '../engine/trainingMax'
import type { JoinedLift, ProgramLift, SessionLog, Settings } from '../types'

export class WorkoutDB extends Dexie {
  programLifts!: Table<ProgramLift, string>
  sessionLogs!: Table<SessionLog, string>
  settings!: Table<Settings, number>

  constructor() {
    super('workout-tracker')
    this.version(1).stores({
      programLifts: 'id, catalogId',
      sessionLogs: 'id, date, programLiftId',
      settings: 'id',
    })
  }
}

export const db = new WorkoutDB()

export const defaultSettings = (): Settings => ({
  id: 1,
  unit: 'lb',
  weekdays: [1, 2, 4, 5],
  programStartIso: toIsoDate(mondayOnOrBefore(new Date())),
})

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.get(1)
  if (existing) return existing
  const created = defaultSettings()
  await db.settings.put(created)
  return created
}

export async function saveSettings(patch: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
  const current = await getSettings()
  const next = { ...current, ...patch, id: 1 as const }
  await db.settings.put(next)
  return next
}

export async function getProgramLifts(): Promise<ProgramLift[]> {
  return db.programLifts.orderBy('addedAt').toArray()
}

export async function getJoinedLifts(): Promise<JoinedLift[]> {
  const programs = await getProgramLifts()
  return programs.flatMap((program) => {
    const catalog = catalogById(program.catalogId)
    return catalog ? [{ program, catalog }] : []
  })
}

export async function addProgramLift(
  catalogId: string,
  input: { oneRepMaxLb: number | null; needsTesting: boolean; cycleNumber: number },
): Promise<ProgramLift> {
  const lift: ProgramLift = {
    id: crypto.randomUUID(),
    catalogId,
    oneRepMaxLb: input.oneRepMaxLb,
    trainingMaxLb: input.oneRepMaxLb != null ? trainingMaxFrom1RM(input.oneRepMaxLb) : null,
    needsTesting: input.needsTesting,
    addedInCycle: input.cycleNumber,
    addedAt: Date.now(),
  }
  await db.programLifts.add(lift)
  return lift
}

export async function updateProgramLift(
  id: string,
  patch: Partial<Omit<ProgramLift, 'id' | 'catalogId'>>,
): Promise<void> {
  await db.programLifts.update(id, patch)
}

export async function removeProgramLift(id: string): Promise<void> {
  await db.transaction('rw', db.programLifts, db.sessionLogs, async () => {
    await db.sessionLogs.where('programLiftId').equals(id).delete()
    await db.programLifts.delete(id)
  })
}

export async function getLogsForDate(date: string): Promise<SessionLog[]> {
  return db.sessionLogs.where('date').equals(date).toArray()
}

export async function getLogsForLift(programLiftId: string): Promise<SessionLog[]> {
  return db.sessionLogs.where('programLiftId').equals(programLiftId).toArray()
}

export async function hasCompletedTest(programLiftId: string): Promise<boolean> {
  const logs = await getLogsForLift(programLiftId)
  return logs.some((log) => log.kind === 'testing' && log.completedAt != null)
}

export async function upsertSessionLog(log: SessionLog): Promise<void> {
  await db.sessionLogs.put(log)
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.programLifts, db.sessionLogs, db.settings, async () => {
    await db.programLifts.clear()
    await db.sessionLogs.clear()
    await db.settings.clear()
  })
}
