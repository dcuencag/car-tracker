export const MAINTENANCE_TYPES = {
  oil:      { label: 'Aceite',            icon: '🛢️', color: 'text-amber-600',  bg: 'bg-amber-50'  },
  tires:    { label: 'Neumáticos',        icon: '⭕', color: 'text-gray-600',   bg: 'bg-gray-100'  },
  itv:      { label: 'ITV',              icon: '📋', color: 'text-blue-600',   bg: 'bg-blue-50'   },
  revision: { label: 'Revisión general', icon: '🔧', color: 'text-purple-600', bg: 'bg-purple-50' },
  custom:   { label: 'Personalizado',    icon: '✏️', color: 'text-teal-600',   bg: 'bg-teal-50'   },
}

export function getTypeLabel(type, customLabel) {
  if (type === 'custom' && customLabel) return customLabel
  return MAINTENANCE_TYPES[type]?.label ?? type
}
