import Dexie, { type Table } from 'dexie'
import { catalogById } from '../data/lifts'
import { mondayOnOrBefore, toIsoDate } from '../engine/dates'
import { trainingMaxFrom1RM } from '../engine/trainingMax'
import type { CatalogLift, JoinedLift, ProgramLift, SessionLog, Settings } from '../types'

export class WorkoutDB extends Dexie {
  programLifts!: Table<ProgramLift, string>
  sessionLogs!: Table<SessionLog, string>
  settings!: Table<Settings, number>
  customLifts!: Table<CatalogLift, string>

  constructor() {
    super('workout-tracker')
    this.version(1).stores({
      programLifts: 'id, catalogId',
      sessionLogs: 'id, date, programLiftId',
      settings: 'id',
    })
    this.version(2).stores({
      programLifts: 'id, catalogId, addedAt',
    })
    this.version(3).stores({
      customLifts: 'id',
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
  const lifts = await db.programLifts.toArray()
  return lifts.sort((a, b) => (a.addedAt ?? 0) - (b.addedAt ?? 0))
}

export async function getCustomLifts(): Promise<CatalogLift[]> {
  return db.customLifts.toArray()
}

export async function saveCustomLift(lift: CatalogLift): Promise<void> {
  await db.customLifts.put(lift)
}

export async function resolveCatalog(id: string): Promise<CatalogLift | undefined> {
  return catalogById(id) ?? (await db.customLifts.get(id))
}

export async function getJoinedLifts(): Promise<JoinedLift[]> {
  const programs = await getProgramLifts()
  const custom = await getCustomLifts()
  const customById = new Map(custom.map((lift) => [lift.id, lift]))
  return programs.map((program) => {
    const catalog = catalogById(program.catalogId) ??
      customById.get(program.catalogId) ?? {
        id: program.catalogId,
        name: 'Saved lift',
        pattern: 'isolation' as const,
        region: 'upper' as const,
        isMain: false,
        muscles: [],
        custom: true,
      }
    return { program, catalog }
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
  await db.transaction('rw', db.programLifts, db.sessionLogs, db.settings, db.customLifts, async () => {
    await db.programLifts.clear()
    await db.sessionLogs.clear()
    await db.settings.clear()
    await db.customLifts.clear()
  })
}
