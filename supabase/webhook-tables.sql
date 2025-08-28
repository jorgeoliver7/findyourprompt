-- Agregar campos faltantes para webhooks de Stripe

-- Agregar prompt_id a la tabla purchases (si no existe)
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS prompt_id UUID REFERENCES prompts(id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Crear tabla payment_attempts para registrar intentos fallidos
CREATE TABLE IF NOT EXISTS payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  prompt_id UUID REFERENCES prompts(id),
  stripe_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'failed',
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Agregar campos de suscripción a profiles (si no existen)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

-- Actualizar constraint de subscription_tier para incluir nuevos valores
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'premium', 'pro'));

-- Agregar constraint para subscription_status
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
  CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due', 'trialing'));

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_prompt_id ON purchases(prompt_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_intent_id ON purchases(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_id ON payment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_stripe_payment_intent_id ON payment_attempts(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);

-- Habilitar RLS en nuevas tablas
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payment_attempts
CREATE POLICY "Users can view their own payment attempts" ON payment_attempts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert payment attempts" ON payment_attempts
FOR INSERT WITH CHECK (true);

-- Actualizar políticas de purchases para permitir inserción del sistema
DROP POLICY IF EXISTS "Users can insert their own purchases" ON purchases;
CREATE POLICY "System can insert purchases" ON purchases
FOR INSERT WITH CHECK (true);

-- Función para verificar si un usuario ha comprado un prompt
CREATE OR REPLACE FUNCTION user_has_purchased_prompt(user_id UUID, prompt_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases 
    WHERE purchases.user_id = user_has_purchased_prompt.user_id 
    AND purchases.prompt_id = user_has_purchased_prompt.prompt_id
    AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene suscripción activa
CREATE OR REPLACE FUNCTION user_has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_has_active_subscription.user_id 
    AND subscription_status IN ('active', 'trialing')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE payment_attempts IS 'Registra intentos de pago fallidos para análisis';
COMMENT ON COLUMN profiles.subscription_status IS 'Estado de la suscripción de Stripe';
COMMENT ON COLUMN profiles.subscription_id IS 'ID de suscripción de Stripe';
COMMENT ON COLUMN profiles.subscription_plan IS 'Plan de suscripción (premium, pro, etc.)';
COMMENT ON COLUMN purchases.prompt_id IS 'ID del prompt comprado';
COMMENT ON COLUMN purchases.currency IS 'Moneda del pago';
COMMENT ON COLUMN purchases.status IS 'Estado del pago (completed, refunded, etc.)';

-- Insertar datos de ejemplo para testing (opcional)
-- Estos datos se pueden usar para probar el sistema de pagos

-- Ejemplo de compra completada
-- INSERT INTO purchases (user_id, prompt_id, amount, currency, stripe_payment_intent_id, status)
-- VALUES (
--   (SELECT id FROM profiles LIMIT 1),
--   (SELECT id FROM prompts WHERE is_free = false LIMIT 1),
--   999,
--   'usd',
--   'pi_test_example_payment_intent',
--   'completed'
-- );

-- Ejemplo de intento de pago fallido
-- INSERT INTO payment_attempts (user_id, prompt_id, stripe_payment_intent_id, status, failure_reason)
-- VALUES (
--   (SELECT id FROM profiles LIMIT 1),
--   (SELECT id FROM prompts WHERE is_free = false LIMIT 1),
--   'pi_test_failed_payment_intent',
--   'failed',
--   'Your card was declined.'
-- );

SELECT 'Webhook tables and fields created successfully!' as result;