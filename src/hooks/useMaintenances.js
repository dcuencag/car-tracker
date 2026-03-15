import { supabase } from '../lib/supabase'

export async function getMaintenancesByCar(carId) {
  const { data, error } = await supabase
    .from('maintenances')
    .select('*')
    .eq('car_id', carId)
    .order('done_at', { ascending: false, nullsFirst: false })
  if (error) throw error
  return data
}

export async function getMaintenanceById(id) {
  const { data, error } = await supabase
    .from('maintenances')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createMaintenance(maintenance) {
  const { data, error } = await supabase
    .from('maintenances')
    .insert([maintenance])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMaintenance(id, maintenance) {
  const { data, error } = await supabase
    .from('maintenances')
    .update(maintenance)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMaintenance(id) {
  const { error } = await supabase.from('maintenances').delete().eq('id', id)
  if (error) throw error
}
