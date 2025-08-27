export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
};

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon_url?: string;
};

export type Prompt = {
  id: string;
  title: string;
  description: string;
  content: string;
  price: number;
  user_id: string;
  user: User;
  model_id: string;
  model: AIModel;
  tags: string[];
  created_at: string;
  updated_at: string;
  purchases_count: number;
  average_rating: number;
};

export type Purchase = {
  id: string;
  user_id: string;
  prompt_id: string;
  amount: number;
  created_at: string;
  prompt: Prompt;
};

export type Review = {
  id: string;
  user_id: string;
  prompt_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: User;
};