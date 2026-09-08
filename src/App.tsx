import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AddLiftPage } from './pages/AddLiftPage'
import { CreateLiftPage } from './pages/CreateLiftPage'
import { LibraryPage } from './pages/LibraryPage'
import { SessionPage } from './pages/SessionPage'
import { SettingsPage } from './pages/SettingsPage'
import { WeekPage } from './pages/WeekPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WeekPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/create" element={<CreateLiftPage />} />
        <Route path="/add/:catalogId" element={<AddLiftPage />} />
        <Route path="/session/:date" element={<SessionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
