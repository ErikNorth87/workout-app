import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { liftsByPattern } from '../data/lifts'
import { getJoinedLifts } from '../db/store'

export function LibraryPage() {
  const groups = liftsByPattern()
  const [added, setAdded] = useState<Set<string>>(new Set())

  useEffect(() => {
    void getJoinedLifts().then((lifts) => {
      setAdded(new Set(lifts.map((lift) => lift.catalog.id)))
    })
  }, [])

  return (
    <>
      <header className="topbar">
        <h1>Lift library</h1>
        <p className="muted">Add the lifts you want on this cycle.</p>
      </header>
      <main className="page">
        {groups.map((group) => (
          <section className="card" key={group.pattern}>
            <h2>{group.label}</h2>
            <div className="list">
              {group.lifts.map((lift) => (
                <div className="list-item" key={lift.id}>
                  <span>{lift.name}</span>
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
          </section>
        ))}
      </main>
    </>
  )
}
