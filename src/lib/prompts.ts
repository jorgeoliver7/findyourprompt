import { createSupabaseServerClient } from './supabase-server';
import { 
  Prompt, 
  PromptInsert, 
  PromptUpdate, 
  PromptDetails, 
  PromptFilters,
  Category,
  AIModel,
  PromptSortBy
} from '@/types/prompts';

// Server-side functions
export async function getPrompts(filters?: PromptFilters) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  let query = supabase
    .from('prompt_details')
    .select('*')
    .eq('is_public', true);

  // Apply filters
  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters?.isFree !== undefined) {
    query = query.eq('is_free', filters.isFree);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.priceRange) {
    query = query
      .gte('price', filters.priceRange[0])
      .lte('price', filters.priceRange[1]);
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case PromptSortBy.NEWEST:
      query = query.order('created_at', { ascending: false });
      break;
    case PromptSortBy.OLDEST:
      query = query.order('created_at', { ascending: true });
      break;
    case PromptSortBy.POPULAR:
      query = query.order('downloads', { ascending: false });
      break;
    case PromptSortBy.RATING:
      query = query.order('average_rating', { ascending: false });
      break;
    case PromptSortBy.DOWNLOADS:
      query = query.order('downloads', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  return { data: data as PromptDetails[] || [], error };
}

export async function getPromptById(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('prompt_details')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  return { data: data as PromptDetails | null, error };
}

export async function getFeaturedPrompts(limit = 6) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('prompt_details')
    .select('*')
    .eq('is_featured', true)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: data as PromptDetails[] || [], error };
}

export async function getCategories() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return { data: data as Category[] || [], error };
}

export async function getAIModels() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .order('name');

  return { data: data as AIModel[] || [], error };
}

export async function getUserPrompts(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('prompt_details')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  return { data: data as PromptDetails[] || [], error };
}