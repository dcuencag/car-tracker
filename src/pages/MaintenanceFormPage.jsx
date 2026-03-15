import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MaintenanceForm from '../components/MaintenanceForm'
import { getCarById } from '../hooks/useCars'
import {
  createMaintenance,
  getMaintenanceById,
  updateMaintenance,
} from '../hooks/useMaintenances'

export default function MaintenanceFormPage() {
  const { carId, mid } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(mid)

  const [vehicleType, setVehicleType] = useState('car')
  const [maintenance, setMaintenance] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const promises = [
      getCarById(carId).then(car => setVehicleType(car.vehicle_type ?? 'car')),
      isEditing
        ? getMaintenanceById(mid).then(setMaintenance)
        : Promise.resolve(),
    ]
    Promise.all(promises)
      .catch(() => setError('No se pudo cargar los datos'))
      .finally(() => setLoadingData(false))
  }, [carId, mid, isEditing])

  async function handleSubmit(data) {
    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await updateMaintenance(mid, data)
      } else {
        await createMaintenance({ ...data, car_id: carId })
      }
      navigate(`/cars/${carId}`)
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => navigate(`/cars/${carId}`)}
          className="text-blue-600 text-sm mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditing ? 'Editar mantenimiento' : 'Añadir mantenimiento'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <MaintenanceForm
            initialData={maintenance || undefined}
            vehicleType={vehicleType}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/cars/${carId}`)}
            loading={saving}
          />
        </div>
      </div>
    </div>
  )
}
