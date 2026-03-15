import { useState } from 'react'

export default function UpdateKmModal({ currentKm, onConfirm, onCancel, loading }) {
  const [km, setKm] = useState(String(currentKm))
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const val = Number(km)
    if (isNaN(val) || val < currentKm) {
      setError(`El kilometraje no puede ser menor al actual (${currentKm.toLocaleString()} km)`)
      return
    }
    onConfirm(val)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 sm:items-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Actualizar kilometraje</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Km actuales: {currentKm.toLocaleString()}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={km}
            onChange={e => { setKm(e.target.value); setError(null) }}
            min={currentKm}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
