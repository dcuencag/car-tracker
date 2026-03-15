import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import MaintenanceList from '../components/MaintenanceList'
import UpdateKmModal from '../components/UpdateKmModal'
import { deleteCar, getCarById, updateCar } from '../hooks/useCars'
import { deleteMaintenance, getMaintenancesByCar } from '../hooks/useMaintenances'
import { getCarStatus, getMaintenanceStatus } from '../utils/alertLogic'
import { ITV_STATUS_CONFIG, getITVSchedule } from '../utils/itvLogic'
import { MAINTENANCE_TYPES, getTypeLabel } from '../utils/maintenanceTypes'

const STATUS_CONFIG = {
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Al día'           },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Revisión próxima' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'Revisión vencida' },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatEur(val) {
  return Number(val).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
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

  function exportPDF() {
    const doc = new jsPDF()
    const title = `${car.brand} ${car.model}${car.year ? ` (${car.year})` : ''}`

    doc.setFontSize(18)
    doc.text(title, 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(100)
    const infoLines = [
      car.plate ? `Matrícula: ${car.plate}` : null,
      `Kilometraje actual: ${car.current_km.toLocaleString()} km`,
      car.engine_cc ? `Cilindrada: ${car.engine_cc} cc` : null,
      totalCost > 0 ? `Gasto total registrado: ${formatEur(totalCost)}` : null,
    ].filter(Boolean)
    infoLines.forEach((line, i) => doc.text(line, 14, 30 + i * 7))

    const rows = maintenances.map(m => [
      getTypeLabel(m.type, m.label),
      formatDate(m.done_at),
      m.done_km ? `${m.done_km.toLocaleString()} km` : '—',
      m.next_date ? formatDate(m.next_date) : (m.next_km ? `${m.next_km.toLocaleString()} km` : '—'),
      m.cost != null ? formatEur(m.cost) : '—',
      m.notes || '—',
    ])

    autoTable(doc, {
      startY: 30 + infoLines.length * 7 + 8,
      head: [['Tipo', 'Realizado', 'Km', 'Próximo', 'Coste', 'Notas']],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    })

    doc.save(`${car.brand}_${car.model}_mantenimiento.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (error && !car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="text-blue-600 text-sm">← Volver</button>
        </div>
      </div>
    )
  }

  const carStatus = getCarStatus(car, maintenances)
  const statusCfg = STATUS_CONFIG[carStatus]
  const isMoto = car.vehicle_type === 'motorcycle'

  const itvSchedule = getITVSchedule(car.year, car.vehicle_type)
  const itvCfg = itvSchedule ? ITV_STATUS_CONFIG[itvSchedule.status] : null

  const upcoming = maintenances
    .filter(m => m.next_km !== null || m.next_date !== null)
    .map(m => ({ ...m, _status: getMaintenanceStatus(car, m) }))
    .sort((a, b) => ({ red: 0, yellow: 1, green: 2 }[a._status] - { red: 0, yellow: 1, green: 2 }[b._status]))

  const maintWithCost = maintenances.filter(m => m.cost != null)
  const totalCost = maintWithCost.reduce((sum, m) => sum + Number(m.cost), 0)
  const costByType = maintWithCost.reduce((acc, m) => {
    const key = m.type
    acc[key] = (acc[key] || 0) + Number(m.cost)
    return acc
  }, {})
  const topCosts = Object.entries(costByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
            <span className="text-7xl">{isMoto ? '🏍️' : '🚗'}</span>
          </div>
        )}

        {/* Info + estado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{car.brand} {car.model}</h1>
              {car.plate && <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-0.5">{car.plate}</p>}
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {car.year && <p className="text-sm text-gray-500 dark:text-gray-400">Año {car.year}</p>}
              <p className="text-blue-600 font-bold text-lg">{car.current_km.toLocaleString()} km
                {car.engine_cc ? <span className="text-gray-400 dark:text-gray-500 font-normal text-sm ml-2">{car.engine_cc} cc</span> : null}
              </p>
            </div>
            <button
              onClick={() => setShowKmModal(true)}
              className="text-sm text-blue-600 border border-blue-200 dark:border-blue-800 px-3 py-2 rounded-xl font-medium"
            >
              Actualizar km
            </button>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* ITV */}
        {itvSchedule && car.year && (
          <div className={`rounded-2xl shadow-sm p-4 ${itvCfg.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${itvCfg.text}`}>ITV</p>
                <p className={`font-bold text-sm ${itvCfg.text}`}>{itvSchedule.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{itvSchedule.detail}</p>
              </div>
              <div className="text-right">
                {itvSchedule.daysUntil != null && (
                  <p className={`text-2xl font-extrabold ${itvCfg.text}`}>
                    {itvSchedule.daysUntil < 0
                      ? `${Math.abs(itvSchedule.daysUntil)}d`
                      : `${itvSchedule.daysUntil}d`}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {itvSchedule.daysUntil < 0 ? 'vencida' : 'restantes'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Próximas revisiones */}
        {upcoming.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3">Próximas revisiones</h2>
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
                        {m.next_date && formatDate(m.next_date)}
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

        {/* Estadísticas de gastos */}
        {maintWithCost.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3">Gastos registrados</h2>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-emerald-600">{formatEur(totalCost)}</span>
              <span className="text-sm text-gray-400">total</span>
            </div>
            {topCosts.length > 0 && (
              <div className="space-y-2">
                {topCosts.map(([type, amount]) => {
                  const t = MAINTENANCE_TYPES[type] ?? MAINTENANCE_TYPES.custom
                  const pct = Math.round((amount / totalCost) * 100)
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{t.icon} {t.label}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{formatEur(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Historial */}
        <MaintenanceList
          maintenances={maintenances}
          onAdd={() => navigate(`/cars/${id}/maintenances/new`)}
          onEdit={(m) => navigate(`/cars/${id}/maintenances/${m.id}/edit`)}
          onDelete={handleDeleteMaintenance}
        />

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/cars/${id}/edit`)}
            className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={exportPDF}
            className="flex-1 bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium"
          >
            Exportar PDF
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
