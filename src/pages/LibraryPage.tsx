import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { MuscleChips } from '../components/MuscleChips'
import { liftsByPattern } from '../data/lifts'
import { getCustomLifts, getProgramLifts } from '../db/store'
import type { CatalogLift } from '../types'

export function LibraryPage() {
  const groups = liftsByPattern()
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [custom, setCustom] = useState<CatalogLift[]>([])

  useEffect(() => {
    void Promise.all([getProgramLifts(), getCustomLifts()]).then(([lifts, created]) => {
      setAdded(new Set(lifts.map((lift) => lift.catalogId)))
      setCustom(created)
    })
  }, [])

  return (
    <>
      <header className="topbar">
        <p className="kicker">Catalog</p>
        <h1>Lifts</h1>
        <p className="muted">Add what you train. Unknown 1RM still lands on the week as a testing session.</p>
        <Link className="btn" to="/create">
          Create a workout
        </Link>
      </header>
      <main className="page">
        {custom.length > 0 ? (
          <section className="card">
            <h2>Yours</h2>
            <LiftList lifts={custom} added={added} />
          </section>
        ) : null}
        {groups.map((group) => (
          <section className="card" key={group.pattern}>
            <h2>{group.label}</h2>
            <LiftList lifts={group.lifts} added={added} />
          </section>
        ))}
      </main>
    </>
  )
}

function LiftList({ lifts, added }: { lifts: CatalogLift[]; added: Set<string> }) {
  return (
    <div className="list">
      {lifts.map((lift) => (
        <div className="list-item" key={lift.id}>
          <div>
            <span className="lift-name">{lift.name}</span>
            <MuscleChips muscles={lift.muscles} />
          </div>
          {added.has(lift.id) ? (
            <span className="ok">On program</span>
          ) : (
            <Link className="badge" to={`/add/${lift.id}`}>
              Add
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
