import { useEffect, useState } from 'react'

export function RestTimer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    if (left == null || left <= 0) return
    const id = window.setInterval(() => {
      setLeft((value) => (value == null ? null : value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [left])

  const label =
    left == null || left <= 0
      ? `Rest ${Math.round(seconds / 60)} min`
      : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`

  return (
    <button className="btn secondary" type="button" onClick={() => setLeft(seconds)}>
      {label}
    </button>
  )
}
