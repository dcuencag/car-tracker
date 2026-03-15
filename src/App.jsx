import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import CarDetailPage from './pages/CarDetailPage'
import CarFormPage from './pages/CarFormPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import MaintenanceFormPage from './pages/MaintenanceFormPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import StatsPage from './pages/StatsPage'
import './index.css'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/cars/new" element={<RequireAuth><CarFormPage /></RequireAuth>} />
        <Route path="/cars/:id" element={<RequireAuth><CarDetailPage /></RequireAuth>} />
        <Route path="/cars/:id/edit" element={<RequireAuth><CarFormPage /></RequireAuth>} />
        <Route path="/motorcycles/new" element={<RequireAuth><CarFormPage defaultVehicleType="motorcycle" /></RequireAuth>} />
        <Route path="/cars/:carId/maintenances/new" element={<RequireAuth><MaintenanceFormPage /></RequireAuth>} />
        <Route path="/cars/:carId/maintenances/:mid/edit" element={<RequireAuth><MaintenanceFormPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/stats" element={<RequireAuth><StatsPage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
