import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { MAINTENANCE_TYPES, getTypeLabel } from '../utils/maintenanceTypes'

export default function MaintenanceItem({ maintenance, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const t = MAINTENANCE_TYPES[maintenance.type] ?? MAINTENANCE_TYPES.custom

  function formatDate(dateStr) {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.bg}`}>
        <span className="text-lg">{t.icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${t.color}`}>
          {getTypeLabel(maintenance.type, maintenance.label)}
        </p>

        <div className="text-xs text-gray-500 mt-0.5 space-y-0.5">
          {maintenance.done_at && (
            <p>Realizado: {formatDate(maintenance.done_at)}{maintenance.done_km ? ` · ${maintenance.done_km.toLocaleString()} km` : ''}</p>
          )}
          {(maintenance.next_date || maintenance.next_km) && (
            <p className="text-blue-600">
              Próximo:{' '}
              {maintenance.next_date && formatDate(maintenance.next_date)}
              {maintenance.next_date && maintenance.next_km && ' · '}
              {maintenance.next_km && `${maintenance.next_km.toLocaleString()} km`}
            </p>
          )}
          {maintenance.notes && (
            <p className="text-gray-400 italic truncate">{maintenance.notes}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={() => onEdit(maintenance)}
          className="text-xs text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"
        >
          Editar
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs text-red-500 px-2 py-1 rounded-lg hover:bg-red-50"
        >
          Borrar
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="¿Eliminar este mantenimiento?"
          onConfirm={() => { setShowConfirm(false); onDelete(maintenance.id) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
