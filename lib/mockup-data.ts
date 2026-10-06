import { createServerSupabaseClient } from './supabase'
import type { MockupTemplate } from './types'

export async function getMockupTemplateBySlug(slug: string): Promise<MockupTemplate | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('mockup_templates')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching mockup template:', error.message)
      }
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching mockup template:', error)
    return null
  }
}

export async function getActiveMockupTemplates(): Promise<MockupTemplate[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('mockup_templates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching mockup templates:', error.message)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error('Error fetching mockup templates:', error)
    return []
  }
}
