import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCars } from '../hooks/useCars'
import { getMaintenancesByCar } from '../hooks/useMaintenances'
import { MAINTENANCE_TYPES } from '../utils/maintenanceTypes'

function formatEur(val) {
  return Number(val).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export default function StatsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState([]) // [{ car, maintenances }]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCars().then(async cars => {
      const result = await Promise.all(
        cars.map(async car => {
          const maintenances = await getMaintenancesByCar(car.id)
          return { car, maintenances }
        })
      )
      setData(result)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  const allMaintenances = data.flatMap(d => d.maintenances)
  const withCost = allMaintenances.filter(m => m.cost != null)
  const totalGlobal = withCost.reduce((s, m) => s + Number(m.cost), 0)
  const totalCount = allMaintenances.length

  // Gasto por tipo (global)
  const costByType = withCost.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + Number(m.cost)
    return acc
  }, {})
  const topTypes = Object.entries(costByType).sort((a, b) => b[1] - a[1])

  // Gasto por vehículo
  const byVehicle = data.map(({ car, maintenances }) => {
    const cost = maintenances.filter(m => m.cost != null).reduce((s, m) => s + Number(m.cost), 0)
    return { car, cost, count: maintenances.length }
  }).sort((a, b) => b.cost - a.cost)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm flex items-center gap-1">
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-gray-900">Estadísticas</h1>

        {/* Resumen global */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Resumen global</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Vehículos</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Mantenimientos</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600">{formatEur(totalGlobal)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Gasto total</p>
            </div>
          </div>
        </div>

        {/* Gasto por vehículo */}
        {byVehicle.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Gasto por vehículo</p>
            <div className="space-y-3">
              {byVehicle.map(({ car, cost, count }) => {
                const pct = totalGlobal > 0 ? Math.round((cost / totalGlobal) * 100) : 0
                return (
                  <div key={car.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-800">
                        {car.vehicle_type === 'motorcycle' ? '🏍️' : '🚗'} {car.brand} {car.model}
                      </span>
                      <span className="font-bold text-emerald-600">{formatEur(cost)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{count} mantenimientos</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Gasto por tipo */}
        {topTypes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Gasto por tipo</p>
            <div className="space-y-3">
              {topTypes.map(([type, amount]) => {
                const t = MAINTENANCE_TYPES[type] ?? MAINTENANCE_TYPES.custom
                const pct = Math.round((amount / totalGlobal) * 100)
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{t.icon} {t.label}</span>
                      <span className="font-semibold text-gray-800">{formatEur(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalGlobal === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-sm">Añade costes a tus mantenimientos para ver estadísticas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
