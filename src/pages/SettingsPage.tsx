import { useEffect, useState } from 'react'
import { WEEKDAY_SHORT } from '../engine/dates'
import { clearAllData, getSettings, saveSettings } from '../db/store'
import type { Settings, WeightUnit } from '../types'

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
const INSTALL_URL = 'https://eriknorth87.github.io/workout-app/'

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    void getSettings().then(setSettings)
  }, [])

  if (!settings) return <div className="page muted">Loading…</div>

  async function patch(next: Partial<Settings>) {
    const saved = await saveSettings(next)
    setSettings(saved)
    setNote('Saved.')
  }

  return (
    <>
      <header className="topbar">
        <p className="kicker">Device</p>
        <h1>Settings</h1>
        <p className="muted">Local-only. Same install path as a plate calculator PWA.</p>
      </header>
      <main className="page">
        <section className="card">
          <h2>Weight unit</h2>
          <div className="choice">
            {(['lb', 'kg'] as WeightUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                className="btn secondary"
                aria-pressed={settings.unit === unit}
                onClick={() => void patch({ unit })}
              >
                {unit}
              </button>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Training days</h2>
          <p className="muted">Pick the days you can train. Conflicting muscle groups still will not land on consecutive days.</p>
          <div className="weekday-grid">
            {ALL_DAYS.map((day) => {
              const on = settings.weekdays.includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const weekdays = on
                      ? settings.weekdays.filter((value) => value !== day)
                      : [...settings.weekdays, day].sort((a, b) => a - b)
                    void patch({ weekdays })
                  }}
                >
                  {WEEKDAY_SHORT[day]}
                </button>
              )
            })}
          </div>
        </section>
        <section className="card">
          <h2>Install on your phone</h2>
          <p className="muted">Scan this code, or open the link in Safari (iPhone) or Chrome (Android). Then: Share → Add to Home Screen, or Chrome menu → Install app.</p>
          <div className="install-qr">
            <InstallQr />
            <a className="muted" href={INSTALL_URL}>
              {INSTALL_URL.replace('https://', '')}
            </a>
          </div>
        </section>
        <section className="card">
          <h2>Data</h2>
          <p className="muted">Everything stays on this device. Clearing data cannot be undone.</p>
          <button
            className="btn danger"
            type="button"
            onClick={() => {
              if (window.confirm('Clear all lifts and logs?')) {
                void clearAllData().then(() => {
                  setNote('Cleared.')
                  return getSettings().then(setSettings)
                })
              }
            }}
          >
            Clear all data
          </button>
        </section>
        {note ? <p className="ok">{note}</p> : null}
      </main>
    </>
  )
}

function InstallQr() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37 37"
      width="256"
      height="256"
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code to install Workout Tracker"
    >
      <path fill="#ffffff" d="M0 0h37v37H0z" />
      <path
        stroke="#000000"
        d="M4 4.5h7m2 0h1m1 0h2m1 0h1m1 0h1m2 0h2m1 0h7M4 5.5h1m5 0h1m2 0h2m1 0h1m1 0h3m3 0h1m1 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h2m5 0h2m1 0h1m3 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h2m3 0h1m1 0h3m1 0h1m2 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m4 0h1m2 0h5m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m3 0h1m1 0h3m1 0h1m1 0h1m1 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m2 0h1m2 0h1m1 0h1m1 0h3M4 12.5h1m1 0h5m3 0h2m1 0h2m2 0h1m4 0h5M4 13.5h1m1 0h2m3 0h1m3 0h2m3 0h1m2 0h6m3 0h1M4 14.5h1m4 0h3m7 0h2m5 0h2M4 15.5h1m4 0h1m2 0h4m2 0h1m4 0h4m2 0h1m1 0h1M4 16.5h2m4 0h1m2 0h1m2 0h3m2 0h1m1 0h1m5 0h2M4 17.5h3m1 0h2m2 0h1m5 0h1m1 0h1m1 0h2m1 0h4m3 0h1M4 18.5h1m2 0h1m1 0h3m1 0h1m1 0h2m2 0h1m1 0h2m1 0h1m1 0h5M4 19.5h2m2 0h2m3 0h1m1 0h1m6 0h3m1 0h1m4 0h1M7 20.5h1m2 0h3m2 0h8m1 0h1m4 0h2M4 21.5h1m1 0h2m1 0h1m4 0h1m3 0h1m1 0h4m2 0h3m1 0h1m1 0h1M4 22.5h1m1 0h1m1 0h3m5 0h1m2 0h3m3 0h1m4 0h1M4 23.5h1m2 0h1m1 0h1m1 0h2m7 0h1m1 0h1m2 0h2m1 0h1m2 0h1M4 24.5h1m1 0h1m1 0h4m1 0h2m1 0h2m3 0h1m1 0h6m1 0h3M12 25.5h2m2 0h2m2 0h5m3 0h5M4 26.5h7m3 0h1m1 0h5m1 0h3m1 0h1m1 0h3M4 27.5h1m5 0h1m1 0h2m1 0h2m1 0h1m1 0h1m3 0h1m3 0h1m2 0h2M4 28.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m2 0h3m2 0h5m1 0h3M4 29.5h1m1 0h3m1 0h1m1 0h2m2 0h2m2 0h3m4 0h1m1 0h4M4 30.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h3m2 0h1m1 0h6M4 31.5h1m5 0h1m2 0h1m1 0h1m2 0h1m1 0h1m3 0h1m2 0h3m1 0h1M4 32.5h7m1 0h2m7 0h3m1 0h1m1 0h2m1 0h1"
      />
    </svg>
  )
}
