import { NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="app-shell">
      <Outlet />
      <nav className="nav">
        <NavLink to="/" end>
          Week
        </NavLink>
        <NavLink to="/library">Lifts</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </div>
  )
}
