import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarCard from '../components/CarCard'
import { getCars } from '../hooks/useCars'
import { getMaintenancesByCar } from '../hooks/useMaintenances'
import { getCarStatus } from '../utils/alertLogic'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCars()
      .then(async (data) => {
        setCars(data)
        const entries = await Promise.all(
          data.map(async (car) => {
            const maintenances = await getMaintenancesByCar(car.id)
            return [car.id, getCarStatus(car, maintenances)]
          })
        )
        setStatusMap(Object.fromEntries(entries))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis coches</h1>
          <button
            onClick={() => navigate('/cars/new')}
            className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-md active:scale-95"
          >
            +
          </button>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🚗</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aún no tienes coches</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              Añade tu primer coche para llevar el control de su mantenimiento
            </p>
            <button
              onClick={() => navigate('/cars/new')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm"
            >
              Añadir mi primer coche
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map(car => (
              <CarCard key={car.id} car={car} status={statusMap[car.id] ?? 'green'} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
