export const KM_THRESHOLD = 1000
export const DAYS_THRESHOLD = 30

export function getMaintenanceStatus(car, maintenance) {
  let status = 'green'

  if (maintenance.next_km !== null && maintenance.next_km !== undefined) {
    const kmLeft = maintenance.next_km - car.current_km
    if (kmLeft <= 0) return 'red'
    if (kmLeft <= KM_THRESHOLD) status = 'yellow'
  }

  if (maintenance.next_date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const nextDate = new Date(maintenance.next_date)
    const daysLeft = Math.floor((nextDate - today) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) return 'red'
    if (daysLeft <= DAYS_THRESHOLD && status !== 'red') status = 'yellow'
  }

  return status
}

export function getCarStatus(car, maintenances) {
  if (!maintenances || maintenances.length === 0) return 'green'

  const relevant = maintenances.filter(
    m => m.next_km !== null || m.next_date !== null
  )
  if (relevant.length === 0) return 'green'

  const statuses = relevant.map(m => getMaintenanceStatus(car, m))
  if (statuses.includes('red')) return 'red'
  if (statuses.includes('yellow')) return 'yellow'
  return 'green'
}
