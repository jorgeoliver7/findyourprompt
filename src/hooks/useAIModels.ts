'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { AIModel } from '@/types/prompts';

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('ai_models')
          .select('*')
          .order('name');

        if (error) {
          setError(error.message);
        } else {
          setModels(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, loading, error };
}