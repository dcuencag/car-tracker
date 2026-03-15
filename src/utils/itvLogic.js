// Reglas ITV España (RD 920/2017)
// Turismos:      < 4 años sin ITV → cada 2 años → >10 años cada 1 año
// Motocicletas:  < 3 años sin ITV → cada 2 años → >7 años cada 1 año

export function getITVSchedule(vehicleYear, vehicleType = 'car') {
  if (!vehicleYear) return null

  const now = new Date()
  const currentYear = now.getFullYear()
  const age = currentYear - vehicleYear

  const isMoto = vehicleType === 'motorcycle'

  const firstITVAge  = isMoto ? 3 : 4
  const highFreqAge  = isMoto ? 7 : 10

  if (age < firstITVAge) {
    const firstYear = vehicleYear + firstITVAge
    return {
      status:    'no_required',
      label:     'No necesita ITV todavía',
      detail:    `Primera ITV en ${firstYear}`,
      nextYear:  firstYear,
      interval:  null,
    }
  }

  const interval = age >= highFreqAge ? 1 : 2
  const yearsFromFirst = age - firstITVAge
  const periodsCompleted = Math.floor(yearsFromFirst / interval)
  const nextYear = (vehicleYear + firstITVAge) + (periodsCompleted + 1) * interval

  const daysUntil = Math.round((new Date(nextYear, now.getMonth(), now.getDate()) - now) / 86400000)

  let status = 'ok'
  if (daysUntil < 0)   status = 'overdue'
  else if (daysUntil < 60) status = 'soon'
  else if (daysUntil < 180) status = 'upcoming'

  return {
    status,
    label:    status === 'overdue' ? 'ITV vencida'
            : status === 'soon'   ? 'ITV próxima'
            : status === 'upcoming' ? 'ITV este año'
            : 'ITV al día',
    detail:   `Cada ${interval} año${interval > 1 ? 's' : ''} · Próxima en ${nextYear}`,
    nextYear,
    daysUntil,
    interval,
  }
}

export const ITV_STATUS_CONFIG = {
  no_required: { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
  ok:          { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  upcoming:    { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  soon:        { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  overdue:     { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
}
