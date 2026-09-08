import { NavLink, Outlet } from 'react-router'

function IconWeek() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconLifts() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 8v8M6 9.5v5M18 9.5v5M21 8v8M6 12h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M6.8 17.2l1.4-1.4M15.8 8.2l1.4-1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Layout() {
  return (
    <div className="app-shell">
      <Outlet />
      <nav className="nav">
        <NavLink to="/" end>
          <IconWeek />
          Week
        </NavLink>
        <NavLink to="/library">
          <IconLifts />
          Lifts
        </NavLink>
        <NavLink to="/settings">
          <IconGear />
          Settings
        </NavLink>
      </nav>
    </div>
  )
}
