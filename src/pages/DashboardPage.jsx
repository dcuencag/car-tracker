import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarCard from '../components/CarCard'
import { getCars } from '../hooks/useCars'
import { getMaintenancesByCar } from '../hooks/useMaintenances'
import { getCarStatus } from '../utils/alertLogic'

const TABS = [
  { key: 'car',        label: 'Coches',  icon: '🚗', newRoute: '/cars/new',         emptyText: 'coches',  addLabel: 'Añadir mi primer coche'  },
  { key: 'motorcycle', label: 'Motos',   icon: '🏍️', newRoute: '/motorcycles/new',  emptyText: 'motos',   addLabel: 'Añadir mi primera moto'  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('car')

  useEffect(() => {
    getCars()
      .then(async (data) => {
        setVehicles(data)
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

  const tab = TABS.find(t => t.key === activeTab)
  const filtered = vehicles.filter(v => (v.vehicle_type ?? 'car') === activeTab)

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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Mis vehículos</h1>
          <button
            onClick={() => navigate(tab.newRoute)}
            className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-md active:scale-95"
          >
            +
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex bg-gray-200 rounded-xl p-1 mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
              {vehicles.filter(v => (v.vehicle_type ?? 'car') === t.key).length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-300 text-gray-600'
                }`}>
                  {vehicles.filter(v => (v.vehicle_type ?? 'car') === t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">{tab.icon}</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aún no tienes {tab.emptyText}</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              Añade {tab.key === 'car' ? 'tu primer coche' : 'tu primera moto'} para llevar el control de su mantenimiento
            </p>
            <button
              onClick={() => navigate(tab.newRoute)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm"
            >
              {tab.addLabel}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(car => (
              <CarCard key={car.id} car={car} status={statusMap[car.id] ?? 'green'} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
