import { createSupabaseBrowserClient } from './supabase';
import { toast } from 'sonner';

// Client-side functions
export async function likePrompt(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.rpc('increment_likes', {
      prompt_id: promptId
    });

    if (error) {
      console.error('Error liking prompt:', error);
      toast.error('Failed to like prompt');
      return { error: error.message };
    }

    toast.success('Prompt liked!');
    return { error: null };
  } catch (error) {
    console.error('Error liking prompt:', error);
    toast.error('Failed to like prompt');
    return { error: 'An unexpected error occurred' };
  }
}

export async function unlikePrompt(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.rpc('decrement_likes', {
      prompt_id: promptId
    });

    if (error) {
      console.error('Error unliking prompt:', error);
      toast.error('Failed to unlike prompt');
      return { error: error.message };
    }

    toast.success('Prompt unliked!');
    return { error: null };
  } catch (error) {
    console.error('Error unliking prompt:', error);
    toast.error('Failed to unlike prompt');
    return { error: 'An unexpected error occurred' };
  }
}

export async function createPrompt(prompt: { [key: string]: unknown }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prompts')
      .insert(prompt)
      .select()
      .single();

    if (error) {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
      return { data: null, error: error.message };
    }

    toast.success('Prompt created successfully!');
    return { data, error: null };
  } catch (error) {
    console.error('Error creating prompt:', error);
    toast.error('Failed to create prompt');
    return { data: null, error: 'An unexpected error occurred' };
  }
}

export async function updatePrompt(id: string, updates: { [key: string]: unknown }) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prompt:', error);
      toast.error('Failed to update prompt');
      return { data: null, error: error.message };
    }

    toast.success('Prompt updated successfully!');
    return { data, error: null };
  } catch (error) {
    console.error('Error updating prompt:', error);
    toast.error('Failed to update prompt');
    return { data: null, error: 'An unexpected error occurred' };
  }
}

export async function deletePrompt(id: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
      return { error: error.message };
    }

    toast.success('Prompt deleted successfully!');
    return { error: null };
  } catch (error) {
    console.error('Error deleting prompt:', error);
    toast.error('Failed to delete prompt');
    return { error: 'An unexpected error occurred' };
  }
}

export async function favoritePrompt(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { error: 'Supabase not configured' };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to favorite prompts');
      return { error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: user.id, prompt_id: promptId });

    if (error) {
      console.error('Error favoriting prompt:', error);
      toast.error('Failed to favorite prompt');
      return { error: error.message };
    }

    toast.success('Prompt added to favorites!');
    return { error: null };
  } catch (error) {
    console.error('Error favoriting prompt:', error);
    toast.error('Failed to favorite prompt');
    return { error: 'An unexpected error occurred' };
  }
}

export async function unfavoritePrompt(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    toast.error('Unable to connect to database');
    return { error: 'Supabase not configured' };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to unfavorite prompts');
      return { error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId);

    if (error) {
      console.error('Error unfavoriting prompt:', error);
      toast.error('Failed to unfavorite prompt');
      return { error: error.message };
    }

    toast.success('Prompt removed from favorites!');
    return { error: null };
  } catch (error) {
    console.error('Error unfavoriting prompt:', error);
    toast.error('Failed to unfavorite prompt');
    return { error: 'An unexpected error occurred' };
  }
}

export async function getUserFavorites() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        prompt_id,
        prompts (
          id,
          title,
          description,
          price,
          image_url,
          likes,
          views,
          downloads,
          rating,
          created_at,
          users (id, username, avatar_url),
          categories (id, name, icon),
          ai_models (id, name, provider),
          prompt_tags (tags (id, name))
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user favorites:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return { data: [], error: 'An unexpected error occurred' };
  }
}

export async function incrementViews(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return { error: 'Supabase not configured' };

  try {
    const { error } = await supabase.rpc('increment_views', {
      prompt_id: promptId
    });

    if (error) {
      console.error('Error incrementing views:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function incrementDownloads(promptId: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return { error: 'Supabase not configured' };

  try {
    const { error } = await supabase.rpc('increment_downloads', {
      prompt_id: promptId
    });

    if (error) {
      console.error('Error incrementing downloads:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    return { error: 'An unexpected error occurred' };
  }
}