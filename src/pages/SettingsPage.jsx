import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'Dólar (USD)' },
  { code: 'GBP', symbol: '£', label: 'Libra (GBP)' },
  { code: 'MXN', symbol: '$', label: 'Peso mexicano' },
  { code: 'COP', symbol: '$', label: 'Peso colombiano' },
]

const UNITS = [
  { key: 'km', label: 'Kilómetros (km)' },
  { key: 'mi', label: 'Millas (mi)' },
]

export default function SettingsPage() {
  const navigate = useNavigate()

  const [currency, setCurrency] = useState(() => localStorage.getItem('ps_currency') || 'EUR')
  const [unit, setUnit] = useState(() => localStorage.getItem('ps_unit') || 'km')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    localStorage.setItem('ps_currency', currency)
    localStorage.setItem('ps_unit', unit)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm flex items-center gap-1">
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-gray-900">Ajustes</h1>

        {/* Moneda */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-3">Moneda</h2>
          <div className="space-y-2">
            {CURRENCIES.map(c => (
              <label key={c.code} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
                style={{ borderColor: currency === c.code ? '#2563eb' : '#e5e7eb', background: currency === c.code ? '#eff6ff' : 'white' }}>
                <span className="text-sm text-gray-800">{c.symbol} {c.label}</span>
                <input
                  type="radio"
                  name="currency"
                  value={c.code}
                  checked={currency === c.code}
                  onChange={() => setCurrency(c.code)}
                  className="accent-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Unidades */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-3">Unidad de distancia</h2>
          <div className="space-y-2">
            {UNITS.map(u => (
              <label key={u.key} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
                style={{ borderColor: unit === u.key ? '#2563eb' : '#e5e7eb', background: unit === u.key ? '#eff6ff' : 'white' }}>
                <span className="text-sm text-gray-800">{u.label}</span>
                <input
                  type="radio"
                  name="unit"
                  value={u.key}
                  checked={unit === u.key}
                  onChange={() => setUnit(u.key)}
                  className="accent-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Guardar */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium"
        >
          {saved ? 'Guardado' : 'Guardar ajustes'}
        </button>
      </div>
    </div>
  )
}
