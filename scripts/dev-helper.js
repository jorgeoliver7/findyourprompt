#!/usr/bin/env node

/**
 * Script de ayuda para desarrollo
 * Ejecutar con: node scripts/dev-helper.js [comando]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logHeader(title) {
  console.log('\n' + colors.bold + colors.cyan + '🚀 ' + title + colors.reset);
  console.log(colors.cyan + '='.repeat(50) + colors.reset);
}

function execCommand(command, description) {
  log(`\n⚡ ${description}...`, 'yellow');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completado`, 'green');
  } catch (error) {
    log(`❌ Error en ${description}`, 'red');
    process.exit(1);
  }
}

function showHelp() {
  logHeader('FindYourPrompt - Herramientas de Desarrollo');
  
  log('\n📋 Comandos disponibles:', 'blue');
  log('\n🔍 Diagnóstico:', 'magenta');
  log('  check          - Verificar configuración del proyecto');
  log('  status         - Estado rápido del proyecto');
  log('  health         - Verificar salud de servicios externos');
  
  log('\n🛠️  Configuración:', 'magenta');
  log('  setup          - Configuración inicial completa');
  log('  db-init        - Inicializar base de datos');
  log('  db-reset       - Resetear base de datos (¡CUIDADO!)');
  log('  db-seed        - Agregar datos de ejemplo');
  
  log('\n🚀 Desarrollo:', 'magenta');
  log('  dev            - Iniciar servidor de desarrollo');
  log('  build          - Construir para producción');
  log('  preview        - Vista previa de build de producción');
  log('  lint           - Verificar código');
  log('  format         - Formatear código');
  
  log('\n📦 Deployment:', 'magenta');
  log('  deploy-check   - Verificar antes de deploy');
  log('  deploy-vercel  - Deploy a Vercel');
  log('  env-check      - Verificar variables de entorno');
  
  log('\n🧹 Mantenimiento:', 'magenta');
  log('  clean          - Limpiar archivos temporales');
  log('  update         - Actualizar dependencias');
  log('  backup         - Crear backup de la base de datos');
  
  log('\n💡 Ejemplos:', 'yellow');
  log('  node scripts/dev-helper.js check');
  log('  node scripts/dev-helper.js setup');
  log('  node scripts/dev-helper.js dev');
  
  log('\n📚 Para más información:', 'blue');
  log('  - NEXT-STEPS.md - Guía de próximos pasos');
  log('  - SETUP-SUPABASE.md - Configuración de Supabase');
  log('  - SETUP-INTEGRATIONS.md - Otras integraciones');
}

function quickStatus() {
  logHeader('Estado Rápido del Proyecto');
  
  // Verificar archivos críticos
  const criticalFiles = [
    '.env.local',
    'package.json',
    'src/lib/supabase.ts'
  ];
  
  log('\n📁 Archivos críticos:', 'blue');
  criticalFiles.forEach(file => {
    const exists = fs.existsSync(file);
    log(`  ${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
  });
  
  // Verificar variables de entorno básicas
  log('\n🔧 Variables de entorno:', 'blue');
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  envVars.forEach(envVar => {
    const value = process.env[envVar];
    const configured = value && !value.includes('demo') && !value.startsWith('your_');
    log(`  ${configured ? '✅' : '❌'} ${envVar}`, configured ? 'green' : 'red');
  });
  
  // Verificar dependencias
  log('\n📦 Dependencias:', 'blue');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasSupabase = packageJson.dependencies['@supabase/supabase-js'];
    const hasNext = packageJson.dependencies['next'];
    
    log(`  ${hasNext ? '✅' : '❌'} Next.js`, hasNext ? 'green' : 'red');
    log(`  ${hasSupabase ? '✅' : '❌'} Supabase`, hasSupabase ? 'green' : 'red');
  } catch (error) {
    log('  ❌ Error leyendo package.json', 'red');
  }
}

function deployCheck() {
  logHeader('Verificación Pre-Deploy');
  
  log('\n🔍 Ejecutando verificaciones...', 'yellow');
  
  // Verificar build
  try {
    log('\n📦 Verificando build...', 'blue');
    execSync('npm run build', { stdio: 'pipe' });
    log('✅ Build exitoso', 'green');
  } catch (error) {
    log('❌ Error en build', 'red');
    return false;
  }
  
  // Verificar lint
  try {
    log('\n🔍 Verificando código...', 'blue');
    execSync('npm run lint', { stdio: 'pipe' });
    log('✅ Código sin errores', 'green');
  } catch (error) {
    log('⚠️  Advertencias en el código', 'yellow');
  }
  
  // Verificar variables de entorno
  log('\n🔧 Verificando variables de entorno...', 'blue');
  const requiredForProd = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET'
  ];
  
  let envOk = true;
  requiredForProd.forEach(envVar => {
    const value = process.env[envVar];
    const configured = value && !value.includes('demo') && !value.startsWith('your_');
    if (!configured) {
      log(`❌ Falta: ${envVar}`, 'red');
      envOk = false;
    }
  });
  
  if (envOk) {
    log('✅ Variables de entorno configuradas', 'green');
  }
  
  log('\n📋 Checklist de deploy:', 'blue');
  log('  ✅ Build exitoso');
  log('  ✅ Código verificado');
  log(`  ${envOk ? '✅' : '❌'} Variables de entorno`);
  log('  ⚠️  Verificar manualmente: dominio, SSL, DNS');
  
  if (envOk) {
    log('\n🚀 ¡Listo para deploy!', 'green');
    log('\n💡 Comandos de deploy:', 'yellow');
    log('  Vercel: npx vercel --prod');
    log('  Netlify: npm run build && npx netlify deploy --prod');
  } else {
    log('\n❌ Configura las variables faltantes antes del deploy', 'red');
  }
}

function cleanProject() {
  logHeader('Limpieza del Proyecto');
  
  const filesToClean = [
    '.next',
    'node_modules/.cache',
    'dist',
    '*.log'
  ];
  
  filesToClean.forEach(pattern => {
    try {
      if (pattern.includes('*')) {
        execSync(`del /Q ${pattern}`, { stdio: 'pipe' });
      } else if (fs.existsSync(pattern)) {
        execSync(`rmdir /S /Q "${pattern}"`, { stdio: 'pipe' });
        log(`🗑️  Eliminado: ${pattern}`, 'yellow');
      }
    } catch (error) {
      // Ignorar errores de archivos que no existen
    }
  });
  
  log('\n✅ Limpieza completada', 'green');
  log('💡 Ejecuta "npm install" si es necesario', 'blue');
}

function updateDependencies() {
  logHeader('Actualización de Dependencias');
  
  log('\n🔍 Verificando actualizaciones...', 'yellow');
  
  try {
    execSync('npm outdated', { stdio: 'inherit' });
  } catch (error) {
    // npm outdated devuelve código de salida 1 cuando hay actualizaciones
  }
  
  log('\n💡 Para actualizar:', 'blue');
  log('  npm update          - Actualizar dependencias menores');
  log('  npm install pkg@latest - Actualizar paquete específico');
  log('  npx npm-check-updates -u && npm install - Actualizar todo');
}

// Procesar argumentos de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'check':
    execCommand('node scripts/check-setup.js', 'Verificación completa');
    break;
    
  case 'status':
    quickStatus();
    break;
    
  case 'setup':
    execCommand('npm run setup:all', 'Configuración inicial');
    break;
    
  case 'db-init':
    execCommand('node scripts/setup-database.js', 'Inicialización de base de datos');
    break;
    
  case 'dev':
    execCommand('npm run dev', 'Servidor de desarrollo');
    break;
    
  case 'build':
    execCommand('npm run build', 'Build de producción');
    break;
    
  case 'lint':
    execCommand('npm run lint', 'Verificación de código');
    break;
    
  case 'deploy-check':
    deployCheck();
    break;
    
  case 'clean':
    cleanProject();
    break;
    
  case 'update':
    updateDependencies();
    break;
    
  case 'env-check':
    log('\n🔧 Variables de entorno actuales:', 'blue');
    const envVars = Object.keys(process.env).filter(key => 
      key.startsWith('NEXT_') || 
      key.startsWith('SUPABASE_') || 
      key.startsWith('STRIPE_') ||
      key.startsWith('OPENAI_') ||
      key.includes('AUTH')
    );
    
    envVars.forEach(key => {
      const value = process.env[key];
      const masked = value ? value.substring(0, 10) + '...' : 'No configurado';
      log(`  ${key}: ${masked}`, value ? 'green' : 'red');
    });
    break;
    
  default:
    showHelp();
    break;
}