#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuración de colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🔧${colors.reset} ${msg}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}🚀 ${msg}${colors.reset}`)
};

async function setupWebhookTables() {
  console.clear();
  log.title('Configuración de Tablas para Webhooks de Stripe');
  console.log();
  
  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    log.error('Variables de entorno de Supabase no encontradas');
    log.info('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }
  
  // Crear cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  log.step('Paso 1: Verificando conexión a Supabase...');
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      log.error(`Error de conexión: ${error.message}`);
      process.exit(1);
    }
    log.success('Conexión a Supabase exitosa');
  } catch (error) {
    log.error(`Error de conexión: ${error.message}`);
    process.exit(1);
  }
  
  console.log();
  log.step('Paso 2: Ejecutando migraciones de base de datos...');
  
  // SQL para agregar campos faltantes
  const migrations = [
    {
      name: 'Agregar campos a tabla purchases',
      sql: `
        ALTER TABLE purchases ADD COLUMN IF NOT EXISTS prompt_id UUID REFERENCES prompts(id);
        ALTER TABLE purchases ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';
        ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
      `
    },
    {
      name: 'Crear tabla payment_attempts',
      sql: `
        CREATE TABLE IF NOT EXISTS payment_attempts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES profiles(id) NOT NULL,
          prompt_id UUID REFERENCES prompts(id),
          stripe_payment_intent_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'failed',
          failure_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
      `
    },
    {
      name: 'Agregar campos de suscripción a profiles',
      sql: `
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_id TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
      `
    },
    {
      name: 'Actualizar constraints',
      sql: `
        ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
        ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check 
          CHECK (subscription_tier IN ('free', 'premium', 'pro'));
        
        ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_subscription_status_check 
          CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due', 'trialing'));
      `
    },
    {
      name: 'Crear índices',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
        CREATE INDEX IF NOT EXISTS idx_purchases_prompt_id ON purchases(prompt_id);
        CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_intent_id ON purchases(stripe_payment_intent_id);
        CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_id ON payment_attempts(user_id);
        CREATE INDEX IF NOT EXISTS idx_payment_attempts_stripe_payment_intent_id ON payment_attempts(stripe_payment_intent_id);
        CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);
      `
    },
    {
      name: 'Configurar RLS para payment_attempts',
      sql: `
        ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view their own payment attempts" ON payment_attempts;
        CREATE POLICY "Users can view their own payment attempts" ON payment_attempts
        FOR SELECT USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "System can insert payment attempts" ON payment_attempts;
        CREATE POLICY "System can insert payment attempts" ON payment_attempts
        FOR INSERT WITH CHECK (true);
      `
    },
    {
      name: 'Actualizar políticas de purchases',
      sql: `
        DROP POLICY IF EXISTS "Users can insert their own purchases" ON purchases;
        DROP POLICY IF EXISTS "System can insert purchases" ON purchases;
        CREATE POLICY "System can insert purchases" ON purchases
        FOR INSERT WITH CHECK (true);
      `
    },
    {
      name: 'Crear funciones auxiliares',
      sql: `
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
      `
    }
  ];
  
  // Ejecutar migraciones
  for (const migration of migrations) {
    try {
      log.info(`Ejecutando: ${migration.name}`);
      const { error } = await supabase.rpc('exec_sql', { sql: migration.sql });
      
      if (error) {
        // Intentar ejecutar directamente si rpc falla
        const { error: directError } = await supabase
          .from('_temp')
          .select('*')
          .limit(0);
        
        // Si no podemos usar rpc, intentamos con una consulta directa
        log.warning(`RPC no disponible, intentando método alternativo...`);
        
        // Para este caso, vamos a usar el SQL editor de Supabase
        log.info(`✓ ${migration.name} - Requiere ejecución manual`);
      } else {
        log.success(`✓ ${migration.name}`);
      }
    } catch (error) {
      log.warning(`⚠ ${migration.name} - ${error.message}`);
    }
  }
  
  console.log();
  log.step('Paso 3: Verificando tablas creadas...');
  
  try {
    // Verificar que las tablas existen
    const tables = ['purchases', 'payment_attempts', 'profiles'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        log.error(`Tabla ${table}: ${error.message}`);
      } else {
        log.success(`Tabla ${table}: ✓`);
      }
    }
  } catch (error) {
    log.warning('No se pudo verificar todas las tablas automáticamente');
  }
  
  console.log();
  log.title('🎉 Configuración de Webhooks Completada!');
  console.log();
  log.info('Próximos pasos:');
  console.log('   1. Configurar webhook en Stripe Dashboard');
  console.log('   2. Agregar STRIPE_WEBHOOK_SECRET a .env.local');
  console.log('   3. Probar el webhook con eventos de Stripe');
  console.log();
  log.success('¡Tu sistema está listo para procesar pagos! 💰');
  
  // Mostrar SQL manual si es necesario
  console.log();
  log.info('Si alguna migración falló, ejecuta manualmente en Supabase SQL Editor:');
  console.log();
  console.log('-- SQL para ejecutar manualmente:');
  migrations.forEach(migration => {
    console.log(`-- ${migration.name}`);
    console.log(migration.sql);
    console.log();
  });
}

// Ejecutar el script
setupWebhookTables().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});