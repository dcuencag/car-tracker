import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import MaintenanceList from '../components/MaintenanceList'
import UpdateKmModal from '../components/UpdateKmModal'
import { deleteCar, getCarById, updateCar } from '../hooks/useCars'
import { deleteMaintenance, getMaintenancesByCar } from '../hooks/useMaintenances'
import { getCarStatus, getMaintenanceStatus } from '../utils/alertLogic'
import { MAINTENANCE_TYPES, getTypeLabel } from '../utils/maintenanceTypes'

const STATUS_CONFIG = {
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Al día'           },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Revisión próxima' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'Revisión vencida' },
}

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [maintenances, setMaintenances] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteCar, setShowDeleteCar] = useState(false)
  const [showKmModal, setShowKmModal] = useState(false)
  const [deletingCar, setDeletingCar] = useState(false)
  const [updatingKm, setUpdatingKm] = useState(false)
  const [error, setError] = useState(null)

  async function loadData() {
    try {
      const [carData, maintData] = await Promise.all([
        getCarById(id),
        getMaintenancesByCar(id),
      ])
      setCar(carData)
      setMaintenances(maintData)
    } catch {
      setError('No se pudo cargar el coche')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [id])

  async function handleDeleteCar() {
    setDeletingCar(true)
    try {
      await deleteCar(id)
      navigate('/')
    } catch {
      setError('Error al eliminar')
      setDeletingCar(false)
      setShowDeleteCar(false)
    }
  }

  async function handleUpdateKm(newKm) {
    setUpdatingKm(true)
    try {
      const updated = await updateCar(id, { current_km: newKm })
      setCar(updated)
      setShowKmModal(false)
    } catch {
      setError('Error al actualizar el kilometraje')
    } finally {
      setUpdatingKm(false)
    }
  }

  async function handleDeleteMaintenance(mid) {
    try {
      await deleteMaintenance(mid)
      setMaintenances(prev => prev.filter(m => m.id !== mid))
    } catch {
      setError('Error al eliminar el mantenimiento')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (error && !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="text-blue-600 text-sm">← Volver</button>
        </div>
      </div>
    )
  }

  const carStatus = getCarStatus(car, maintenances)
  const statusCfg = STATUS_CONFIG[carStatus]

  // Upcoming: maintenances with next_date or next_km, sorted by urgency
  const upcoming = maintenances
    .filter(m => m.next_km !== null || m.next_date !== null)
    .map(m => ({ ...m, _status: getMaintenanceStatus(car, m) }))
    .sort((a, b) => {
      const order = { red: 0, yellow: 1, green: 2 }
      return order[a._status] - order[b._status]
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm flex items-center gap-1">
          ← Volver
        </button>

        {/* Foto */}
        {car.photo_url ? (
          <img
            src={car.photo_url}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="w-full h-52 object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-7xl">🚗</span>
          </div>
        )}

        {/* Info + estado */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{car.brand} {car.model}</h1>
              {car.plate && <p className="text-gray-500 text-sm font-mono mt-0.5">{car.plate}</p>}
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {car.year && <p className="text-sm text-gray-500">Año {car.year}</p>}
              <p className="text-blue-600 font-bold text-lg">{car.current_km.toLocaleString()} km</p>
            </div>
            <button
              onClick={() => setShowKmModal(true)}
              className="text-sm text-blue-600 border border-blue-200 px-3 py-2 rounded-xl font-medium"
            >
              Actualizar km
            </button>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* Próximas revisiones */}
        {upcoming.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-3">Próximas revisiones</h2>
            <div className="space-y-2">
              {upcoming.map(m => {
                const s = STATUS_CONFIG[m._status]
                const t = MAINTENANCE_TYPES[m.type] ?? MAINTENANCE_TYPES.custom
                return (
                  <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${s.bg}`}>
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${s.text}`}>
                        {getTypeLabel(m.type, m.label)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {m.next_date && new Date(m.next_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {m.next_date && m.next_km && ' · '}
                        {m.next_km && `${m.next_km.toLocaleString()} km`}
                      </p>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Historial */}
        <MaintenanceList
          maintenances={maintenances}
          onAdd={() => navigate(`/cars/${id}/maintenances/new`)}
          onEdit={(m) => navigate(`/cars/${id}/maintenances/${m.id}/edit`)}
          onDelete={handleDeleteMaintenance}
        />

        {/* Acciones coche */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={() => navigate(`/cars/${id}/edit`)}
            className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-medium"
          >
            Editar coche
          </button>
          <button
            onClick={() => setShowDeleteCar(true)}
            className="flex-1 border border-red-300 text-red-600 rounded-xl py-3 text-sm font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>

      {showKmModal && (
        <UpdateKmModal
          currentKm={car.current_km}
          onConfirm={handleUpdateKm}
          onCancel={() => setShowKmModal(false)}
          loading={updatingKm}
        />
      )}

      {showDeleteCar && (
        <ConfirmDialog
          message={`¿Eliminar el ${car.brand} ${car.model}? Se borrarán también todos sus mantenimientos.`}
          onConfirm={handleDeleteCar}
          onCancel={() => setShowDeleteCar(false)}
        />
      )}
    </div>
  )
}
