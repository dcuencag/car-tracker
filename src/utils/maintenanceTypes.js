export const CAR_MAINTENANCE_TYPES = {
  oil:      { label: 'Aceite',            icon: '🛢️', color: 'text-amber-600',  bg: 'bg-amber-50'  },
  tires:    { label: 'Neumáticos',        icon: '⭕', color: 'text-gray-600',   bg: 'bg-gray-100'  },
  itv:      { label: 'ITV',              icon: '📋', color: 'text-blue-600',   bg: 'bg-blue-50'   },
  revision: { label: 'Revisión general', icon: '🔧', color: 'text-purple-600', bg: 'bg-purple-50' },
  custom:   { label: 'Personalizado',    icon: '✏️', color: 'text-teal-600',   bg: 'bg-teal-50'   },
}

export const MOTORCYCLE_MAINTENANCE_TYPES = {
  oil:         { label: 'Aceite',           icon: '🛢️', color: 'text-amber-600',  bg: 'bg-amber-50'   },
  chain:       { label: 'Cadena',           icon: '🔗', color: 'text-orange-600', bg: 'bg-orange-50'  },
  tires:       { label: 'Neumáticos',       icon: '⭕', color: 'text-gray-600',   bg: 'bg-gray-100'   },
  air_filter:  { label: 'Filtro de aire',   icon: '💨', color: 'text-sky-600',    bg: 'bg-sky-50'     },
  spark_plugs: { label: 'Bujías',           icon: '⚡', color: 'text-yellow-600', bg: 'bg-yellow-50'  },
  brakes:      { label: 'Frenos',           icon: '🛑', color: 'text-red-600',    bg: 'bg-red-50'     },
  brake_fluid: { label: 'Líquido frenos',   icon: '🔵', color: 'text-blue-600',   bg: 'bg-blue-50'    },
  custom:      { label: 'Personalizado',    icon: '✏️', color: 'text-teal-600',   bg: 'bg-teal-50'    },
}

// Mapa completo para lookups (historial, alertas)
export const MAINTENANCE_TYPES = {
  ...CAR_MAINTENANCE_TYPES,
  ...MOTORCYCLE_MAINTENANCE_TYPES,
}

export function getTypesForVehicle(vehicleType) {
  return vehicleType === 'motorcycle'
    ? MOTORCYCLE_MAINTENANCE_TYPES
    : CAR_MAINTENANCE_TYPES
}

export function getTypeLabel(type, customLabel) {
  if (type === 'custom' && customLabel) return customLabel
  return MAINTENANCE_TYPES[type]?.label ?? type
}
