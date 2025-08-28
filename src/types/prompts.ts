import { Database } from './database';

// Type aliases for easier use
export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];
export type PromptDetails = Database['public']['Views']['prompt_details']['Row'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export type AIModel = Database['public']['Tables']['ai_models']['Row'];

export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

export type Like = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];

export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export type Purchase = Database['public']['Tables']['purchases']['Row'];

// Extended types for UI components
export interface PromptWithDetails extends PromptDetails {
  isLiked?: boolean;
  isFavorited?: boolean;
  isPurchased?: boolean;
}

export interface PromptFormData {
  title: string;
  description: string;
  content: string;
  category_id: string;
  tags: string[];
  price: number;
  is_free: boolean;
  is_public: boolean;
  model_id?: string;
}

export interface PromptFilters {
  category?: string;
  tags?: string[];
  priceRange?: [number, number];
  isFree?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'downloads';
  search?: string;
}

export interface PromptStats {
  totalPrompts: number;
  totalDownloads: number;
  totalLikes: number;
  averageRating: number;
}

// Enums for better type safety
export enum PromptSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  POPULAR = 'popular',
  RATING = 'rating',
  DOWNLOADS = 'downloads'
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}