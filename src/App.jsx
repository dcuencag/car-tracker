import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CarDetailPage from './pages/CarDetailPage'
import CarFormPage from './pages/CarFormPage'
import DashboardPage from './pages/DashboardPage'
import MaintenanceFormPage from './pages/MaintenanceFormPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cars/new" element={<CarFormPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/cars/:id/edit" element={<CarFormPage />} />
        <Route path="/cars/:carId/maintenances/new" element={<MaintenanceFormPage />} />
        <Route path="/cars/:carId/maintenances/:mid/edit" element={<MaintenanceFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
