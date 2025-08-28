-- Create tables for our application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create users table for backward compatibility
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create AI models table
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  price INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  model_id UUID REFERENCES ai_models(id),
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  prompt_id UUID REFERENCES prompts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  prompt_id UUID REFERENCES prompts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  prompt_id UUID REFERENCES prompts(id) NOT NULL,
  amount INTEGER NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  prompt_id UUID REFERENCES prompts(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Create functions and triggers

-- Function to update prompt updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update prompt updated_at timestamp
CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON prompts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET likes = likes + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET likes = GREATEST(likes - 1, 0) WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment views count
CREATE OR REPLACE FUNCTION increment_views(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET views = views + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment downloads count
CREATE OR REPLACE FUNCTION increment_downloads(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET downloads = downloads + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  -- Also create in users table for backward compatibility
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a user profile after signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Views

-- View for prompts with user, category and model info
CREATE OR REPLACE VIEW prompt_details AS
SELECT 
  p.*,
  prof.full_name as author_name,
  prof.avatar_url as author_avatar_url,
  c.name as category_name,
  c.color as category_color,
  c.icon as category_icon,
  m.name as model_name,
  m.provider as model_provider,
  m.icon_url as model_icon_url,
  COUNT(DISTINCT pur.id) as purchases_count,
  COUNT(DISTINCT l.id) as likes_count,
  COUNT(DISTINCT f.id) as favorites_count,
  COALESCE(AVG(r.rating), 0) as average_rating
FROM prompts p
JOIN profiles prof ON p.author_id = prof.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN ai_models m ON p.model_id = m.id
LEFT JOIN purchases pur ON p.id = pur.prompt_id
LEFT JOIN likes l ON p.id = l.prompt_id
LEFT JOIN favorites f ON p.id = f.prompt_id
LEFT JOIN reviews r ON p.id = r.prompt_id
GROUP BY p.id, prof.id, c.id, m.id;

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own user record" ON users
FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
FOR SELECT USING (true);

-- AI Models policies
CREATE POLICY "AI Models are viewable by everyone" ON ai_models
FOR SELECT USING (true);

-- Prompts policies
CREATE POLICY "Prompts are viewable by everyone" ON prompts
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own prompts" ON prompts
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts" ON prompts
FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own prompts" ON prompts
FOR DELETE USING (auth.uid() = author_id);

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
FOR DELETE USING (auth.uid() = user_id);

-- Insert some initial data

-- Insert categories
INSERT INTO categories (name, description, icon, color) VALUES
('Writing', 'Creative writing, copywriting, and content creation', '✍️', '#10B981'),
('Business', 'Business strategy, marketing, and professional communication', '💼', '#3B82F6'),
('Education', 'Learning, teaching, and educational content', '🎓', '#8B5CF6'),
('Programming', 'Code generation, debugging, and technical documentation', '💻', '#F59E0B'),
('Creative', 'Art, design, and creative projects', '🎨', '#EF4444'),
('Research', 'Data analysis, research, and academic work', '🔬', '#06B6D4'),
('Personal', 'Personal productivity and lifestyle', '👤', '#84CC16'),
('Entertainment', 'Games, stories, and fun activities', '🎮', '#F97316');

-- Insert AI models
INSERT INTO ai_models (name, provider, description) VALUES
('GPT-4', 'OpenAI', 'Advanced language model with strong reasoning capabilities'),
('GPT-3.5', 'OpenAI', 'Efficient language model for various tasks'),
('Claude 2', 'Anthropic', 'Helpful, harmless, and honest AI assistant'),
('Gemini Pro', 'Google', 'Multimodal AI model from Google'),
('Llama 2', 'Meta', 'Open source large language model');