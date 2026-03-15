import { useRef, useState } from 'react'

const EMPTY = { brand: '', model: '', year: '', plate: '', current_km: '', engine_cc: '' }

export default function CarForm({ initialData = EMPTY, vehicleType = 'car', onSubmit, onCancel, loading }) {
  const isMoto = vehicleType === 'motorcycle'
  const fileInputRef = useRef(null)

  const [values, setValues] = useState({
    brand:      initialData.brand      ?? '',
    model:      initialData.model      ?? '',
    year:       initialData.year       ?? '',
    plate:      initialData.plate      ?? '',
    current_km: initialData.current_km ?? '',
    engine_cc:  initialData.engine_cc  ?? '',
  })
  const [errors, setErrors] = useState({})
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(initialData.photo_url ?? null)

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: null }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({
      brand:        values.brand.trim(),
      model:        values.model.trim(),
      year:         values.year       ? Number(values.year)       : null,
      plate:        values.plate.trim()     || null,
      current_km:   Number(values.current_km),
      engine_cc:    values.engine_cc  ? Number(values.engine_cc)  : null,
      vehicle_type: vehicleType,
      photo_url:    photoFile ? null : (photoPreview || null),
      _photoFile:   photoFile || null,
    })
  }

  const inputCls = (field) =>
    `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
        <div
          className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 active:opacity-80 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                  Cambiar foto
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Toca para añadir foto</span>
              <span className="text-xs text-gray-300">Cámara o galería</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marca <span className="text-red-500">*</span>
        </label>
        <input
          name="brand" value={values.brand} onChange={handleChange}
          placeholder={isMoto ? 'Honda, Yamaha, BMW...' : 'Toyota, Seat, Ford...'}
          className={inputCls('brand')}
        />
        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modelo <span className="text-red-500">*</span>
        </label>
        <input
          name="model" value={values.model} onChange={handleChange}
          placeholder={isMoto ? 'CBR 600, MT-07, GS 1200...' : 'Corolla, Ibiza, Focus...'}
          className={inputCls('model')}
        />
        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
          <input
            name="year" type="number" value={values.year} onChange={handleChange}
            placeholder="2020" min="1900" max="2099"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
          <input
            name="plate" value={values.plate} onChange={handleChange}
            placeholder="1234 ABC"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className={`grid gap-4 ${isMoto ? 'grid-cols-2' : ''}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kilometraje actual <span className="text-red-500">*</span>
          </label>
          <input
            name="current_km" type="number" value={values.current_km} onChange={handleChange}
            placeholder="50000" min="0"
            className={inputCls('current_km')}
          />
          {errors.current_km && <p className="text-red-500 text-xs mt-1">{errors.current_km}</p>}
        </div>

        {isMoto && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada (cc)</label>
            <input
              name="engine_cc" type="number" value={values.engine_cc} onChange={handleChange}
              placeholder="650" min="0"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2 text-sm hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
