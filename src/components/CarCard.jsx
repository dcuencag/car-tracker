import { useNavigate } from 'react-router-dom'

const STATUS_CONFIG = {
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Al día'           },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Revisión próxima' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'Revisión vencida' },
}

export default function CarCard({ car, status = 'green' }) {
  const navigate = useNavigate()
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.green
  const placeholder = car.vehicle_type === 'motorcycle' ? '🏍️' : '🚗'

  return (
    <div
      onClick={() => navigate(`/cars/${car.id}`)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      {car.photo_url ? (
        <img
          src={car.photo_url}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-6xl">{placeholder}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white truncate">{car.brand} {car.model}</h2>
            {car.plate && <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">{car.plate}</p>}
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <p className="text-blue-600 font-semibold text-sm mt-2">
          {car.current_km.toLocaleString()} km
          {car.engine_cc ? <span className="text-gray-400 dark:text-gray-500 font-normal ml-2">{car.engine_cc} cc</span> : null}
        </p>
      </div>
    </div>
  )
}
