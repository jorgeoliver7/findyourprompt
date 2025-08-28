#!/usr/bin/env node

/**
 * Script para configurar datos iniciales en Supabase
 * Ejecutar con: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.log('Asegúrate de tener configurado:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos iniciales
const initialCategories = [
  {
    name: 'Writing',
    description: 'Creative writing, copywriting, and content creation',
    icon: '✍️',
    color: '#10B981'
  },
  {
    name: 'Business',
    description: 'Business strategy, marketing, and professional communication',
    icon: '💼',
    color: '#3B82F6'
  },
  {
    name: 'Education',
    description: 'Learning, teaching, and educational content',
    icon: '🎓',
    color: '#8B5CF6'
  },
  {
    name: 'Programming',
    description: 'Code generation, debugging, and technical documentation',
    icon: '💻',
    color: '#F59E0B'
  },
  {
    name: 'Creative',
    description: 'Art, design, and creative projects',
    icon: '🎨',
    color: '#EF4444'
  },
  {
    name: 'Research',
    description: 'Data analysis, research, and academic work',
    icon: '🔬',
    color: '#06B6D4'
  },
  {
    name: 'Personal',
    description: 'Personal productivity and lifestyle',
    icon: '👤',
    color: '#84CC16'
  },
  {
    name: 'Entertainment',
    description: 'Games, stories, and fun activities',
    icon: '🎮',
    color: '#F97316'
  }
];

const initialAiModels = [
  {
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Advanced language model with strong reasoning capabilities'
  },
  {
    name: 'GPT-3.5',
    provider: 'OpenAI',
    description: 'Efficient language model for various tasks'
  },
  {
    name: 'Claude 2',
    provider: 'Anthropic',
    description: 'Helpful, harmless, and honest AI assistant'
  },
  {
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Multimodal AI model from Google'
  },
  {
    name: 'Llama 2',
    provider: 'Meta',
    description: 'Open source large language model'
  }
];

const samplePrompts = [
  {
    title: 'Blog Post Writer',
    description: 'Generate engaging blog posts on any topic with SEO optimization',
    content: 'Write a comprehensive blog post about [TOPIC]. Include an engaging introduction, 3-5 main sections with subheadings, and a compelling conclusion. Optimize for SEO with relevant keywords and meta descriptions.',
    tags: ['writing', 'seo', 'content', 'blog'],
    is_featured: true,
    is_free: true
  },
  {
    title: 'Code Reviewer',
    description: 'Professional code review with suggestions for improvement',
    content: 'Review the following code and provide detailed feedback:\n\n[CODE]\n\nPlease analyze:\n1. Code quality and best practices\n2. Performance optimizations\n3. Security considerations\n4. Readability improvements\n5. Potential bugs or issues',
    tags: ['programming', 'code-review', 'development'],
    is_featured: true,
    is_free: true
  },
  {
    title: 'Email Marketing Campaign',
    description: 'Create compelling email marketing campaigns that convert',
    content: 'Create an email marketing campaign for [PRODUCT/SERVICE]. Include:\n\n1. Subject line (A/B test options)\n2. Email body with compelling copy\n3. Clear call-to-action\n4. Follow-up sequence (3 emails)\n\nTarget audience: [AUDIENCE]\nGoal: [GOAL]',
    tags: ['marketing', 'email', 'business', 'conversion'],
    is_featured: false,
    is_free: false,
    price: 299
  }
];

async function setupDatabase() {
  console.log('🚀 Iniciando configuración de base de datos...');
  
  try {
    // Verificar conexión
    console.log('🔍 Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    
    // Insertar categorías
    console.log('📁 Insertando categorías...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert(initialCategories, { onConflict: 'name' })
      .select();
    
    if (categoriesError) {
      console.error('❌ Error insertando categorías:', categoriesError.message);
    } else {
      console.log(`✅ ${categories.length} categorías insertadas`);
    }
    
    // Insertar modelos de IA
    console.log('🤖 Insertando modelos de IA...');
    const { data: models, error: modelsError } = await supabase
      .from('ai_models')
      .upsert(initialAiModels, { onConflict: 'name' })
      .select();
    
    if (modelsError) {
      console.error('❌ Error insertando modelos:', modelsError.message);
    } else {
      console.log(`✅ ${models.length} modelos de IA insertados`);
    }
    
    // Crear usuario demo (opcional)
    console.log('👤 Verificando usuario demo...');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profiles && profiles.length > 0) {
      const demoUserId = profiles[0].id;
      const categoryId = categories?.[0]?.id;
      const modelId = models?.[0]?.id;
      
      if (categoryId && modelId) {
        // Insertar prompts de ejemplo
        console.log('📝 Insertando prompts de ejemplo...');
        const promptsWithIds = samplePrompts.map(prompt => ({
          ...prompt,
          author_id: demoUserId,
          category_id: categoryId,
          model_id: modelId
        }));
        
        const { data: prompts, error: promptsError } = await supabase
          .from('prompts')
          .upsert(promptsWithIds, { onConflict: 'title' })
          .select();
        
        if (promptsError) {
          console.error('❌ Error insertando prompts:', promptsError.message);
        } else {
          console.log(`✅ ${prompts.length} prompts de ejemplo insertados`);
        }
      }
    } else {
      console.log('ℹ️  No hay usuarios registrados. Los prompts se insertarán cuando haya usuarios.');
    }
    
    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   • ${categories?.length || 0} categorías`);
    console.log(`   • ${models?.length || 0} modelos de IA`);
    console.log(`   • Prompts de ejemplo: ${profiles?.length > 0 ? 'insertados' : 'pendientes'}`);
    console.log('\n🌐 Puedes ver los datos en: ' + supabaseUrl + '/project/default/editor');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  }
}

// Ejecutar script
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };