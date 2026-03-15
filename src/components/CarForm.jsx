import { useState } from 'react'

const EMPTY = { brand: '', model: '', year: '', plate: '', photo_url: '', current_km: '' }

export default function CarForm({ initialData = EMPTY, onSubmit, onCancel, loading }) {
  const [values, setValues] = useState({
    brand: initialData.brand ?? '',
    model: initialData.model ?? '',
    year: initialData.year ?? '',
    plate: initialData.plate ?? '',
    photo_url: initialData.photo_url ?? '',
    current_km: initialData.current_km ?? '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: null }))
  }

  function validate() {
    const errs = {}
    if (!values.brand.trim()) errs.brand = 'La marca es obligatoria'
    if (!values.model.trim()) errs.model = 'El modelo es obligatorio'
    if (values.current_km === '' || values.current_km === null) {
      errs.current_km = 'El kilometraje es obligatorio'
    } else if (Number(values.current_km) < 0) {
      errs.current_km = 'El kilometraje no puede ser negativo'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: values.year ? Number(values.year) : null,
      plate: values.plate.trim() || null,
      photo_url: values.photo_url.trim() || null,
      current_km: Number(values.current_km),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marca <span className="text-red-500">*</span>
        </label>
        <input
          name="brand"
          value={values.brand}
          onChange={handleChange}
          placeholder="Toyota, Seat, Ford..."
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.brand ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modelo <span className="text-red-500">*</span>
        </label>
        <input
          name="model"
          value={values.model}
          onChange={handleChange}
          placeholder="Corolla, Ibiza, Focus..."
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.model ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
          <input
            name="year"
            type="number"
            value={values.year}
            onChange={handleChange}
            placeholder="2020"
            min="1900"
            max="2099"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
          <input
            name="plate"
            value={values.plate}
            onChange={handleChange}
            placeholder="1234 ABC"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kilometraje actual <span className="text-red-500">*</span>
        </label>
        <input
          name="current_km"
          type="number"
          value={values.current_km}
          onChange={handleChange}
          placeholder="50000"
          min="0"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.current_km ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors.current_km && <p className="text-red-500 text-xs mt-1">{errors.current_km}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de foto</label>
        <input
          name="photo_url"
          value={values.photo_url}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
