const API_KEY = import.meta.env.VITE_PLATE_API_KEY

export async function lookupPlate(plate) {
  if (!API_KEY) throw new Error('API key no configurada. Añade VITE_PLATE_API_KEY al .env.local')

  const clean = plate.replace(/\s/g, '').toUpperCase()
  const res = await fetch(`https://automotive.openapi.com/ES-car/${clean}`, {
    headers: { apikey: API_KEY },
  })

  if (!res.ok) {
    if (res.status === 404) throw new Error('Matrícula no encontrada')
    if (res.status === 401) throw new Error('API key inválida')
    throw new Error('Error al consultar la matrícula')
  }

  const data = await res.json()

  return {
    brand:     data.CarMake        || data.MakeDescription  || '',
    model:     data.CarModel       || data.ModelDescription || '',
    year:      data.RegistrationYear ? Number(data.RegistrationYear) : null,
    engine_cc: data.EngineSize     ? Math.round(Number(data.EngineSize) * 1000) : null,
    fuel:      data.Fuel           || null,
    color:     data.Color          || null,
    raw:       data,
  }
}
