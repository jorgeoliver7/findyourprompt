#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colores para la consola
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
  title: (msg) => console.log(`${colors.cyan}${colors.bright}🔥 ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.magenta}📋${colors.reset} ${msg}`)
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function validateStripeKey(key, type) {
  const patterns = {
    publishable: /^pk_(test_|live_)[a-zA-Z0-9]{24,}$/,
    secret: /^sk_(test_|live_)[a-zA-Z0-9]{24,}$/,
    webhook: /^whsec_[a-zA-Z0-9]{32,}$/
  };
  
  return patterns[type] && patterns[type].test(key);
}

function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log.error('Archivo .env.local no encontrado');
    return null;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return { env, content, path: envPath };
}

function updateEnvFile(envData, updates) {
  let content = envData.content;
  
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  });
  
  fs.writeFileSync(envData.path, content);
}

async function setupStripe() {
  console.clear();
  log.title('Configuración de Stripe para FindYourPrompt');
  console.log();
  
  // Leer archivo .env actual
  const envData = readEnvFile();
  if (!envData) {
    process.exit(1);
  }
  
  log.step('Paso 1: Verificando configuración actual...');
  
  const currentKeys = {
    publishable: envData.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secret: envData.env.STRIPE_SECRET_KEY,
    webhook: envData.env.STRIPE_WEBHOOK_SECRET
  };
  
  // Verificar claves existentes
  const hasValidKeys = {
    publishable: validateStripeKey(currentKeys.publishable, 'publishable'),
    secret: validateStripeKey(currentKeys.secret, 'secret'),
    webhook: validateStripeKey(currentKeys.webhook, 'webhook')
  };
  
  if (hasValidKeys.publishable) {
    log.success('Publishable Key ya configurado');
  } else {
    log.warning('Publishable Key no configurado o inválido');
  }
  
  if (hasValidKeys.secret) {
    log.success('Secret Key ya configurado');
  } else {
    log.warning('Secret Key no configurado o inválido');
  }
  
  if (hasValidKeys.webhook) {
    log.success('Webhook Secret ya configurado');
  } else {
    log.warning('Webhook Secret no configurado o inválido');
  }
  
  console.log();
  
  // Si todas las claves están configuradas, preguntar si quiere reconfigurar
  if (hasValidKeys.publishable && hasValidKeys.secret && hasValidKeys.webhook) {
    log.success('¡Stripe ya está completamente configurado!');
    const reconfigure = await question('¿Quieres reconfigurar las claves? (y/N): ');
    if (reconfigure.toLowerCase() !== 'y' && reconfigure.toLowerCase() !== 'yes') {
      log.info('Configuración mantenida. ¡Listo para usar Stripe!');
      rl.close();
      return;
    }
    console.log();
  }
  
  log.step('Paso 2: Instrucciones para obtener claves de Stripe');
  console.log();
  console.log('📖 Para obtener tus claves de Stripe:');
  console.log('   1. Ve a https://stripe.com y crea una cuenta');
  console.log('   2. Ve a Developers → API keys');
  console.log('   3. Copia la Publishable key (pk_test_...)');
  console.log('   4. Copia la Secret key (sk_test_...)');
  console.log('   5. Para webhook: Developers → Webhooks → Add endpoint');
  console.log('   6. URL: http://localhost:3000/api/webhooks/stripe');
  console.log('   7. Copia el Signing secret (whsec_...)');
  console.log();
  
  const updates = {};
  
  // Configurar Publishable Key
  if (!hasValidKeys.publishable) {
    log.step('Paso 3: Configurar Publishable Key');
    let publishableKey;
    do {
      publishableKey = await question('Ingresa tu Stripe Publishable Key (pk_test_...): ');
      if (!validateStripeKey(publishableKey, 'publishable')) {
        log.error('Clave inválida. Debe empezar con pk_test_ o pk_live_');
      }
    } while (!validateStripeKey(publishableKey, 'publishable'));
    
    updates.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = publishableKey;
    log.success('Publishable Key configurado');
    console.log();
  }
  
  // Configurar Secret Key
  if (!hasValidKeys.secret) {
    log.step('Paso 4: Configurar Secret Key');
    let secretKey;
    do {
      secretKey = await question('Ingresa tu Stripe Secret Key (sk_test_...): ');
      if (!validateStripeKey(secretKey, 'secret')) {
        log.error('Clave inválida. Debe empezar con sk_test_ o sk_live_');
      }
    } while (!validateStripeKey(secretKey, 'secret'));
    
    updates.STRIPE_SECRET_KEY = secretKey;
    log.success('Secret Key configurado');
    console.log();
  }
  
  // Configurar Webhook Secret (opcional)
  if (!hasValidKeys.webhook) {
    log.step('Paso 5: Configurar Webhook Secret (Opcional)');
    console.log('💡 Puedes configurar esto más tarde si aún no has creado el webhook');
    
    const configureWebhook = await question('¿Quieres configurar el Webhook Secret ahora? (y/N): ');
    
    if (configureWebhook.toLowerCase() === 'y' || configureWebhook.toLowerCase() === 'yes') {
      let webhookSecret;
      do {
        webhookSecret = await question('Ingresa tu Stripe Webhook Secret (whsec_...): ');
        if (webhookSecret && !validateStripeKey(webhookSecret, 'webhook')) {
          log.error('Clave inválida. Debe empezar con whsec_');
        }
      } while (webhookSecret && !validateStripeKey(webhookSecret, 'webhook'));
      
      if (webhookSecret) {
        updates.STRIPE_WEBHOOK_SECRET = webhookSecret;
        log.success('Webhook Secret configurado');
      }
    } else {
      log.info('Webhook Secret omitido. Puedes configurarlo más tarde.');
    }
    console.log();
  }
  
  // Actualizar archivo .env
  if (Object.keys(updates).length > 0) {
    log.step('Paso 6: Actualizando archivo .env.local...');
    updateEnvFile(envData, updates);
    log.success('Archivo .env.local actualizado');
  }
  
  console.log();
  log.title('🎉 ¡Configuración de Stripe completada!');
  console.log();
  log.info('Próximos pasos:');
  console.log('   1. Reinicia el servidor: npm run dev');
  console.log('   2. Verifica la configuración: npm run setup:check');
  console.log('   3. Crea productos en tu dashboard de Stripe');
  console.log('   4. ¡Empieza a recibir pagos!');
  console.log();
  log.success('¡Tu marketplace está listo para monetizar! 💰');
  
  rl.close();
}

// Manejar errores
process.on('SIGINT', () => {
  console.log('\n');
  log.info('Configuración cancelada');
  rl.close();
  process.exit(0);
});

setupStripe().catch(error => {
  console.error('\n');
  log.error('Error durante la configuración:');
  console.error(error.message);
  rl.close();
  process.exit(1);
});