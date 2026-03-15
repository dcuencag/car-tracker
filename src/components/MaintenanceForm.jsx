import { useState } from 'react'
import { getTypesForVehicle } from '../utils/maintenanceTypes'

const EMPTY = { type: 'oil', label: '', done_at: '', done_km: '', next_date: '', next_km: '', notes: '', cost: '' }

export default function MaintenanceForm({ initialData = EMPTY, vehicleType = 'car', onSubmit, onCancel, loading }) {
  const types = getTypesForVehicle(vehicleType)
  const defaultType = Object.keys(types)[0]

  const [values, setValues] = useState({
    type:      initialData.type      ?? defaultType,
    label:     initialData.label     ?? '',
    done_at:   initialData.done_at   ?? '',
    done_km:   initialData.done_km   ?? '',
    next_date: initialData.next_date ?? '',
    next_km:   initialData.next_km   ?? '',
    notes:     initialData.notes     ?? '',
    cost:      initialData.cost      ?? '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      type:      values.type,
      label:     values.type === 'custom' ? values.label.trim() || null : null,
      done_at:   values.done_at   || null,
      done_km:   values.done_km   !== '' ? Number(values.done_km)   : null,
      next_date: values.next_date || null,
      next_km:   values.next_km   !== '' ? Number(values.next_km)   : null,
      notes:     values.notes.trim() || null,
      cost:      values.cost      !== '' ? Number(values.cost)      : null,
    })
  }

  const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(types).map(([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => setValues(v => ({ ...v, type: key }))}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                values.type === key
                  ? `${t.bg} ${t.color} border-current`
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {values.type === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del mantenimiento</label>
          <input
            name="label" value={values.label} onChange={handleChange}
            placeholder="Ej: Cambio pastillas de freno"
            className={inputCls}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha realizado</label>
          <input type="date" name="done_at" value={values.done_at} onChange={handleChange}
            className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Km realizados</label>
          <input type="number" name="done_km" value={values.done_km} onChange={handleChange}
            placeholder="50000" min="0"
            className={inputCls} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Próxima revisión (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Por fecha</label>
            <input type="date" name="next_date" value={values.next_date} onChange={handleChange}
              className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Por km</label>
            <input type="number" name="next_km" value={values.next_km} onChange={handleChange}
              placeholder="60000" min="0"
              className={inputCls} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coste (€)</label>
          <input type="number" name="cost" value={values.cost} onChange={handleChange}
            placeholder="0.00" min="0" step="0.01"
            className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas</label>
          <input name="notes" value={values.notes} onChange={handleChange}
            placeholder="Observaciones..."
            className={inputCls} />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
