import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarForm from '../components/CarForm'
import { createCar, getCarById, updateCar } from '../hooks/useCars'

export default function CarFormPage({ defaultVehicleType = 'car' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [car, setCar] = useState(null)
  const [loadingCar, setLoadingCar] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    getCarById(id)
      .then(setCar)
      .catch(() => setError('No se pudo cargar el vehículo'))
      .finally(() => setLoadingCar(false))
  }, [id, isEditing])

  // vehicleType: from loaded car (editing) or from prop (creating)
  const vehicleType = car?.vehicle_type ?? defaultVehicleType
  const isMoto = vehicleType === 'motorcycle'
  const label = isMoto ? 'moto' : 'coche'

  async function handleSubmit(data) {
    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await updateCar(id, data)
      } else {
        await createCar(data)
      }
      navigate('/')
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  if (loadingCar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm mb-4 flex items-center gap-1">
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEditing ? `Editar ${label}` : `Añadir ${label}`}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <CarForm
            initialData={car || undefined}
            vehicleType={vehicleType}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            loading={saving}
          />
        </div>
      </div>
    </div>
  )
}
