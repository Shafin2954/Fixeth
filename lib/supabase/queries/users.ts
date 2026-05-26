import { createClient } from '@/utils/supabase/server'
import { User } from '@/types'

export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  return data
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'last_active'>): Promise<User> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: Partial<User>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

