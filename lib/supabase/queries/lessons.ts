import { createClient } from '@/utils/supabase/server'
import { Lesson } from '@/types'

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index')
  return data || []
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  return data
}
