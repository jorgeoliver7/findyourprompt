#!/usr/bin/env node

/**
 * Script para verificar la configuración del proyecto
 * Ejecutar con: node scripts/check-setup.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logSection(title) {
  console.log('\n' + colors.bold + colors.blue + '='.repeat(50) + colors.reset);
  console.log(colors.bold + colors.blue + title + colors.reset);
  console.log(colors.bold + colors.blue + '='.repeat(50) + colors.reset);
}

function logCheck(item, status, details = '') {
  const icon = status ? '✅' : '❌';
  const color = status ? 'green' : 'red';
  log(`${icon} ${item}`, color);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

async function checkEnvironmentVariables() {
  logSection('VARIABLES DE ENTORNO');
  
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
  };
  
  const optionalVars = {
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY
  };
  
  let allRequired = true;
  
  // Verificar variables requeridas
  for (const [key, value] of Object.entries(requiredVars)) {
    const exists = value && value !== 'demo_key' && value !== 'https://demo.supabase.co';
    logCheck(key, exists, exists ? 'Configurado' : 'Falta o usa valor demo');
    if (!exists) allRequired = false;
  }
  
  // Verificar variables opcionales
  log('\n📋 Variables opcionales:', 'blue');
  for (const [key, value] of Object.entries(optionalVars)) {
    const exists = value && !value.startsWith('your_');
    logCheck(key, exists, exists ? 'Configurado' : 'No configurado');
  }
  
  return allRequired;
}

async function checkSupabaseConnection() {
  logSection('CONEXIÓN A SUPABASE');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    logCheck('Credenciales de Supabase', false, 'Faltan variables de entorno');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar conexión básica
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (error) {
      logCheck('Conexión a Supabase', false, error.message);
      return false;
    }
    
    logCheck('Conexión a Supabase', true, 'Conectado exitosamente');
    
    // Verificar tablas principales
    const tables = ['categories', 'ai_models', 'prompts', 'profiles'];
    let allTablesExist = true;
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (tableError) {
          logCheck(`Tabla ${table}`, false, tableError.message);
          allTablesExist = false;
        } else {
          logCheck(`Tabla ${table}`, true, 'Existe');
        }
      } catch (err) {
        logCheck(`Tabla ${table}`, false, err.message);
        allTablesExist = false;
      }
    }
    
    return allTablesExist;
    
  } catch (error) {
    logCheck('Conexión a Supabase', false, error.message);
    return false;
  }
}

async function checkDatabaseData() {
  logSection('DATOS DE LA BASE DE DATOS');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    logCheck('Verificación de datos', false, 'No se puede conectar a Supabase');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar categorías
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('count');
    
    if (!catError && categories) {
      logCheck('Categorías', categories.length > 0, `${categories.length} categorías encontradas`);
    } else {
      logCheck('Categorías', false, 'No se pudieron obtener');
    }
    
    // Verificar modelos de IA
    const { data: models, error: modError } = await supabase
      .from('ai_models')
      .select('count');
    
    if (!modError && models) {
      logCheck('Modelos de IA', models.length > 0, `${models.length} modelos encontrados`);
    } else {
      logCheck('Modelos de IA', false, 'No se pudieron obtener');
    }
    
    // Verificar prompts
    const { data: prompts, error: promptError } = await supabase
      .from('prompts')
      .select('count');
    
    if (!promptError && prompts) {
      logCheck('Prompts', true, `${prompts.length} prompts encontrados`);
    } else {
      logCheck('Prompts', false, 'No se pudieron obtener');
    }
    
    return true;
    
  } catch (error) {
    logCheck('Verificación de datos', false, error.message);
    return false;
  }
}

function checkProjectFiles() {
  logSection('ARCHIVOS DEL PROYECTO');
  
  const requiredFiles = [
    '.env.local',
    'package.json',
    'next.config.ts',
    'src/lib/supabase.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'supabase/schema.sql'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    logCheck(file, exists, exists ? 'Existe' : 'No encontrado');
    if (!exists) allFilesExist = false;
  }
  
  return allFilesExist;
}

function checkPackageDependencies() {
  logSection('DEPENDENCIAS');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = {
      'next': 'Next.js framework',
      'react': 'React library',
      '@supabase/supabase-js': 'Supabase client',
      'tailwindcss': 'Tailwind CSS',
      'typescript': 'TypeScript'
    };
    
    let allDepsInstalled = true;
    
    for (const [dep, description] of Object.entries(requiredDeps)) {
      const installed = dependencies[dep];
      logCheck(dep, !!installed, installed ? `v${installed}` : 'No instalado');
      if (!installed) allDepsInstalled = false;
    }
    
    return allDepsInstalled;
    
  } catch (error) {
    logCheck('package.json', false, 'No se pudo leer');
    return false;
  }
}

function generateReport(results) {
  logSection('RESUMEN');
  
  const { envVars, supabase, database, files, dependencies } = results;
  
  const overallStatus = envVars && supabase && files && dependencies;
  
  log(`Estado general: ${overallStatus ? '✅ LISTO' : '❌ REQUIERE ATENCIÓN'}`, overallStatus ? 'green' : 'red');
  
  if (!overallStatus) {
    log('\n🔧 ACCIONES RECOMENDADAS:', 'yellow');
    
    if (!envVars) {
      log('   1. Configura las variables de entorno en .env.local', 'yellow');
      log('   2. Sigue la guía en SETUP-SUPABASE.md', 'yellow');
    }
    
    if (!supabase) {
      log('   3. Verifica tu configuración de Supabase', 'yellow');
      log('   4. Ejecuta el schema SQL en tu proyecto de Supabase', 'yellow');
    }
    
    if (!database) {
      log('   5. Ejecuta: node scripts/setup-database.js', 'yellow');
    }
    
    if (!files) {
      log('   6. Verifica que todos los archivos del proyecto estén presentes', 'yellow');
    }
    
    if (!dependencies) {
      log('   7. Ejecuta: npm install', 'yellow');
    }
  } else {
    log('\n🚀 PRÓXIMOS PASOS:', 'green');
    log('   1. Ejecuta: npm run dev', 'green');
    log('   2. Ve a: http://localhost:3000', 'green');
    log('   3. Configura Stripe y OpenAI (opcional)', 'green');
  }
}

async function main() {
  console.clear();
  log('🔍 VERIFICACIÓN DE CONFIGURACIÓN - FindYourPrompt', 'bold');
  
  const results = {
    envVars: await checkEnvironmentVariables(),
    supabase: await checkSupabaseConnection(),
    database: await checkDatabaseData(),
    files: checkProjectFiles(),
    dependencies: checkPackageDependencies()
  };
  
  generateReport(results);
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };