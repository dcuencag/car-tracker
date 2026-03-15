import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarCard from '../components/CarCard'
import UserMenu from '../components/UserMenu'
import { getCars } from '../hooks/useCars'
import { getMaintenancesByCar } from '../hooks/useMaintenances'
import { getCarStatus, getMaintenanceStatus } from '../utils/alertLogic'
import { MAINTENANCE_TYPES, getTypeLabel } from '../utils/maintenanceTypes'

const TABS = [
  { key: 'car',        label: 'Coches',  icon: '🚗', newRoute: '/cars/new',         emptyText: 'coches',  addLabel: 'Añadir mi primer coche'  },
  { key: 'motorcycle', label: 'Motos',   icon: '🏍️', newRoute: '/motorcycles/new',  emptyText: 'motos',   addLabel: 'Añadir mi primera moto'  },
]

const STATUS_CONFIG = {
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500'    },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('car')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getCars()
      .then(async (data) => {
        setVehicles(data)
        const allAlerts = []
        const entries = await Promise.all(
          data.map(async (car) => {
            const maintenances = await getMaintenancesByCar(car.id)
            maintenances.forEach(m => {
              const s = getMaintenanceStatus(car, m)
              if (s === 'red' || s === 'yellow') {
                allAlerts.push({ vehicle: car, maintenance: m, status: s })
              }
            })
            return [car.id, getCarStatus(car, maintenances)]
          })
        )
        allAlerts.sort((a, b) => (a.status === 'red' ? -1 : 1) - (b.status === 'red' ? -1 : 1))
        setAlerts(allAlerts)
        setStatusMap(Object.fromEntries(entries))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function exportAll() {
    setExporting(true)
    try {
      const cars = await getCars()
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text('PitStop — Todos los vehículos', 14, 18)
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, 14, 26)

      let y = 34
      for (const car of cars) {
        const maintenances = await getMaintenancesByCar(car.id)
        doc.setTextColor(0)
        doc.setFontSize(13)
        doc.text(`${car.brand} ${car.model}${car.year ? ` (${car.year})` : ''}`, 14, y)
        doc.setFontSize(9)
        doc.setTextColor(100)
        doc.text(`${car.current_km.toLocaleString()} km${car.plate ? ' · ' + car.plate : ''}`, 14, y + 6)
        y += 12

        if (maintenances.length === 0) {
          doc.setFontSize(9)
          doc.text('Sin mantenimientos registrados', 14, y)
          y += 10
        } else {
          autoTable(doc, {
            startY: y,
            head: [['Tipo', 'Fecha', 'Km', 'Coste']],
            body: maintenances.map(m => [
              getTypeLabel(m.type, m.label),
              m.done_at ? new Date(m.done_at).toLocaleDateString('es-ES') : '—',
              m.done_km ? `${m.done_km.toLocaleString()} km` : '—',
              m.cost != null ? `${Number(m.cost).toFixed(2)} €` : '—',
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [37, 99, 235] },
            margin: { left: 14, right: 14 },
          })
          y = doc.lastAutoTable.finalY + 12
        }
        if (y > 250) { doc.addPage(); y = 20 }
      }
      doc.save('PitStop_todos_los_vehiculos.pdf')
    } finally {
      setExporting(false)
    }
  }

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

        {/* User bar */}
        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2 mb-4 shadow-sm">
          <p className="text-xs text-gray-500 truncate max-w-[200px]">{user?.email}</p>
          <UserMenu onExportAll={exportAll} exporting={exporting} />
        </div>

        {/* Recordatorios urgentes */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <h2 className="font-bold text-gray-900 text-sm mb-3">
              Pendiente de atención
              <span className="ml-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {alerts.length}
              </span>
            </h2>
            <div className="space-y-2">
              {alerts.map(({ vehicle, maintenance, status }) => {
                const s = STATUS_CONFIG[status]
                const t = MAINTENANCE_TYPES[maintenance.type] ?? MAINTENANCE_TYPES.custom
                return (
                  <div
                    key={`${vehicle.id}-${maintenance.id}`}
                    onClick={() => navigate(`/cars/${vehicle.id}`)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer active:opacity-70 ${s.bg}`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${s.text}`}>
                        {getTypeLabel(maintenance.type, maintenance.label)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {vehicle.brand} {vehicle.model}
                        {maintenance.next_date && ` · ${new Date(maintenance.next_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`}
                        {maintenance.next_km && ` · ${maintenance.next_km.toLocaleString()} km`}
                      </p>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
