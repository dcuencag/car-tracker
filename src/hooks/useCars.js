import { supabase } from '../lib/supabase'

export async function getCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCarById(id) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCar(car) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('cars')
    .insert([{ ...car, user_id: user.id }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCar(id, car) {
  const { data, error } = await supabase
    .from('cars')
    .update(car)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCar(id) {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
}
