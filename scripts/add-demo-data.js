const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Modelos de IA actualizados para 2024-2025
const modernAiModels = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Modelo multimodal más rápido y eficiente de OpenAI'
  },
  {
    name: 'GPT-4.5',
    provider: 'OpenAI', 
    description: 'Versión mejorada con capacidades avanzadas de razonamiento'
  },
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Modelo más avanzado de Anthropic con excelente capacidad de código'
  },
  {
    name: 'Claude 4',
    provider: 'Anthropic',
    description: 'Última generación de Claude con capacidades superiores'
  },
  {
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Modelo rápido y eficiente de Google con capacidades multimodales'
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Modelo más completo de Google para tareas complejas'
  },
  {
    name: 'Llama 3.2',
    provider: 'Meta',
    description: 'Modelo open source más reciente de Meta'
  },
  {
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    description: 'Modelo chino de alto rendimiento y código abierto'
  },
  {
    name: 'Grok-3',
    provider: 'xAI',
    description: 'Modelo de IA de Elon Musk con acceso a información en tiempo real'
  },
  {
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Modelo europeo de alta calidad para tareas profesionales'
  }
];

// Datos de demostración más completos y variados
const demoPrompts = [
  {
    title: "Generador de Contenido para Redes Sociales",
    description: "Crea posts atractivos y engagement para Instagram, Twitter y LinkedIn con este prompt optimizado.",
    content: "Actúa como un experto en marketing digital y redes sociales. Necesito que generes contenido atractivo para [PLATAFORMA] sobre [TEMA]. El contenido debe:\n\n1. Captar la atención en los primeros 3 segundos\n2. Incluir un call-to-action claro\n3. Usar hashtags relevantes\n4. Adaptarse al tono de la marca: [TONO]\n\nFormato deseado: [FORMATO]\nAudiencia objetivo: [AUDIENCIA]\n\nGenera 3 variaciones diferentes del mismo contenido.",
    tags: ["marketing", "redes-sociales", "contenido", "engagement"],
    price: 299,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 156,
    views: 892,
    likes: 47,
    rating: 4.8,
    rating_count: 23
  },
  {
    title: "Asistente de Programación Python",
    description: "Prompt especializado para generar código Python limpio, documentado y siguiendo las mejores prácticas.",
    content: "Eres un desarrollador Python senior con 10+ años de experiencia. Tu tarea es:\n\n1. Escribir código Python limpio y eficiente\n2. Seguir PEP 8 y mejores prácticas\n3. Incluir documentación y comentarios\n4. Manejar errores apropiadamente\n5. Sugerir optimizaciones cuando sea posible\n\nProblema a resolver: [DESCRIPCIÓN_PROBLEMA]\n\nRequerimientos específicos:\n- [REQUERIMIENTO_1]\n- [REQUERIMIENTO_2]\n- [REQUERIMIENTO_3]\n\nProporciona el código completo con explicaciones.",
    tags: ["python", "programación", "código", "desarrollo"],
    price: 199,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 234,
    views: 1205,
    likes: 67,
    rating: 4.9,
    rating_count: 31
  },
  {
    title: "Creador de Historias Infantiles",
    description: "Genera cuentos educativos y entretenidos para niños de diferentes edades con valores positivos.",
    content: "Eres un escritor especializado en literatura infantil. Crea una historia original que:\n\n📚 Características de la historia:\n- Edad objetivo: [EDAD] años\n- Tema principal: [TEMA]\n- Valor a enseñar: [VALOR]\n- Longitud: [CORTA/MEDIA/LARGA]\n\n🎭 Elementos requeridos:\n- Personajes memorables y diversos\n- Diálogos apropiados para la edad\n- Situaciones que enseñen el valor elegido\n- Final positivo y esperanzador\n- Lenguaje simple pero rico\n\n✨ Incluye también:\n- 3 preguntas de comprensión\n- 2 actividades relacionadas\n- Moraleja clara",
    tags: ["infantil", "educación", "cuentos", "valores"],
    price: 149,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 89,
    views: 456,
    likes: 28,
    rating: 4.7,
    rating_count: 15
  },
  {
    title: "Analizador de Datos con IA",
    description: "Prompt avanzado para análisis de datos, visualizaciones y insights empresariales usando IA.",
    content: "Actúa como un científico de datos experto. Analiza el siguiente conjunto de datos y proporciona insights valiosos:\n\n📊 Datos a analizar: [DESCRIPCIÓN_DATOS]\n\n🔍 Análisis requerido:\n1. Estadísticas descriptivas básicas\n2. Identificación de patrones y tendencias\n3. Correlaciones significativas\n4. Outliers y anomalías\n5. Predicciones y recomendaciones\n\n📈 Entregables:\n- Resumen ejecutivo (2-3 párrafos)\n- Visualizaciones sugeridas\n- Insights clave (top 5)\n- Recomendaciones accionables\n- Próximos pasos\n\nFormato: Profesional, con métricas específicas y justificaciones.",
    tags: ["datos", "análisis", "business-intelligence", "insights"],
    price: 399,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 78,
    views: 623,
    likes: 34,
    rating: 4.6,
    rating_count: 18
  },
  {
    title: "Generador de Ideas de Negocio",
    description: "Crea ideas de negocio innovadoras y viables basadas en tendencias actuales y análisis de mercado.",
    content: "Eres un consultor de negocios con experiencia en startups exitosas. Genera ideas de negocio innovadoras:\n\n🎯 Parámetros de búsqueda:\n- Industria de interés: [INDUSTRIA]\n- Presupuesto inicial: [PRESUPUESTO]\n- Tiempo de dedicación: [TIEMPO]\n- Habilidades disponibles: [HABILIDADES]\n- Mercado objetivo: [MERCADO]\n\n💡 Para cada idea proporciona:\n1. Descripción del concepto (2-3 líneas)\n2. Problema que resuelve\n3. Propuesta de valor única\n4. Modelo de monetización\n5. Competencia principal\n6. Inversión inicial estimada\n7. Tiempo para generar ingresos\n8. Escalabilidad (1-10)\n\nGenera 5 ideas diferentes, ordenadas por viabilidad.",
    tags: ["negocios", "startups", "emprendimiento", "innovación"],
    price: 249,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 112,
    views: 734,
    likes: 41,
    rating: 4.5,
    rating_count: 22
  },
  {
    title: "Tutor de Idiomas Personalizado",
    description: "Prompt para aprender cualquier idioma de forma estructurada y personalizada según tu nivel.",
    content: "Eres un profesor de idiomas políglota con metodología probada. Crea un plan de aprendizaje personalizado:\n\n🌍 Configuración del aprendizaje:\n- Idioma objetivo: [IDIOMA]\n- Nivel actual: [PRINCIPIANTE/INTERMEDIO/AVANZADO]\n- Tiempo disponible: [TIEMPO] por día\n- Objetivo: [CONVERSACIONAL/PROFESIONAL/ACADÉMICO]\n- Estilo de aprendizaje: [VISUAL/AUDITIVO/KINESTÉSICO]\n\n📚 Plan de estudio semanal:\n- Lunes: [ACTIVIDAD]\n- Martes: [ACTIVIDAD]\n- Miércoles: [ACTIVIDAD]\n- Jueves: [ACTIVIDAD]\n- Viernes: [ACTIVIDAD]\n- Fin de semana: [REPASO/PRÁCTICA]\n\n🎯 Incluye:\n- 10 frases esenciales para empezar\n- Recursos recomendados\n- Métodos de práctica diaria\n- Forma de medir progreso",
    tags: ["idiomas", "educación", "aprendizaje", "personalizado"],
    price: 179,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 167,
    views: 891,
    likes: 52,
    rating: 4.8,
    rating_count: 29
  },
  {
    title: "Optimizador de CV y LinkedIn",
    description: "Mejora tu currículum y perfil de LinkedIn para destacar en procesos de selección.",
    content: "Actúa como un reclutador senior y consultor de carrera. Optimiza el CV y perfil profesional:\n\n👤 Información del candidato:\n- Puesto objetivo: [PUESTO]\n- Industria: [INDUSTRIA]\n- Años de experiencia: [AÑOS]\n- Habilidades clave: [HABILIDADES]\n- Logros principales: [LOGROS]\n\n📄 Optimización de CV:\n1. Headline impactante\n2. Resumen profesional (3-4 líneas)\n3. Reformulación de experiencia laboral\n4. Sección de habilidades optimizada\n5. Palabras clave para ATS\n\n💼 Perfil de LinkedIn:\n1. Titular optimizado\n2. Resumen atractivo\n3. Estrategia de contenido\n4. Networking efectivo\n5. Recomendaciones de mejora\n\nIncluye ejemplos específicos y métricas cuando sea posible.",
    tags: ["carrera", "cv", "linkedin", "empleo"],
    price: 199,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 203,
    views: 1156,
    likes: 73,
    rating: 4.7,
    rating_count: 35
  },
  {
    title: "Planificador de Viajes Inteligente",
    description: "Crea itinerarios de viaje personalizados con presupuesto, actividades y recomendaciones locales.",
    content: "Eres un agente de viajes experto con conocimiento global. Crea un itinerario detallado:\n\n✈️ Detalles del viaje:\n- Destino: [DESTINO]\n- Duración: [DÍAS]\n- Presupuesto: [PRESUPUESTO]\n- Tipo de viajero: [AVENTURERO/CULTURAL/RELAJADO]\n- Acompañantes: [SOLO/PAREJA/FAMILIA/AMIGOS]\n- Intereses: [INTERESES]\n\n🗓️ Itinerario día a día:\n- Actividades principales\n- Restaurantes recomendados\n- Transporte sugerido\n- Presupuesto diario\n- Tips locales\n\n📋 Información adicional:\n- Documentos necesarios\n- Mejor época para viajar\n- Qué empacar\n- Frases útiles en idioma local\n- Apps recomendadas\n- Contactos de emergencia",
    tags: ["viajes", "turismo", "planificación", "itinerario"],
    price: 129,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 145,
    views: 678,
    likes: 38,
    rating: 4.6,
    rating_count: 21
  },
  {
    title: "Entrenador Personal Virtual",
    description: "Prompt gratuito para crear rutinas de ejercicio personalizadas y planes nutricionales básicos.",
    content: "Soy tu entrenador personal certificado. Vamos a crear un plan de fitness personalizado:\n\n💪 Evaluación inicial:\n- Edad: [EDAD]\n- Nivel de actividad: [SEDENTARIO/ACTIVO/MUY_ACTIVO]\n- Objetivo: [PERDER_PESO/GANAR_MÚSCULO/MANTENERSE]\n- Tiempo disponible: [TIEMPO] por sesión\n- Equipamiento: [GIMNASIO/CASA/PARQUE]\n- Limitaciones: [LESIONES/CONDICIONES]\n\n🏋️ Plan de entrenamiento semanal:\n- 3-4 rutinas diferentes\n- Ejercicios específicos con repeticiones\n- Progresión semanal\n- Días de descanso\n\n🥗 Consejos nutricionales básicos:\n- Macronutrientes recomendados\n- Hidratación\n- Pre y post entreno\n\n📊 Seguimiento:\n- Métricas a medir\n- Frecuencia de evaluación",
    tags: ["fitness", "salud", "ejercicio", "bienestar"],
    price: 0,
    is_free: true,
    is_featured: false,
    is_public: true,
    downloads: 312,
    views: 1543,
    likes: 89,
    rating: 4.4,
    rating_count: 67
  },
  {
    title: "Asistente de Cocina Creativo",
    description: "Genera recetas personalizadas basadas en ingredientes disponibles y preferencias dietéticas.",
    content: "Soy un chef profesional con experiencia internacional. Te ayudo a crear recetas deliciosas:\n\n🥘 Información base:\n- Ingredientes disponibles: [INGREDIENTES]\n- Tipo de cocina: [ITALIANA/ASIÁTICA/MEXICANA/LIBRE]\n- Restricciones dietéticas: [VEGETARIANO/VEGANO/SIN_GLUTEN/NINGUNA]\n- Tiempo de preparación: [TIEMPO]\n- Número de porciones: [PORCIONES]\n- Nivel de dificultad: [FÁCIL/INTERMEDIO/AVANZADO]\n\n👨‍🍳 Receta completa:\n1. Lista de ingredientes con cantidades exactas\n2. Preparación paso a paso\n3. Tiempo de cocción\n4. Tips de presentación\n5. Variaciones posibles\n6. Maridajes sugeridos\n\n💡 Bonus:\n- Información nutricional aproximada\n- Consejos de conservación\n- Sustitutos de ingredientes",
    tags: ["cocina", "recetas", "gastronomía", "alimentación"],
    price: 0,
    is_free: true,
    is_featured: false,
    is_public: true,
    downloads: 278,
    views: 1234,
    likes: 76,
    rating: 4.5,
    rating_count: 54
  },
  {
    title: "Experto en Criptomonedas y Blockchain",
    description: "Análisis técnico y fundamental de criptomonedas con estrategias de inversión.",
    content: "Actúa como un analista experto en criptomonedas y blockchain. Proporciona análisis detallado sobre:\n\n🪙 Criptomoneda a analizar: [CRIPTO]\n\n📊 Análisis técnico:\n- Tendencias de precio (corto, medio, largo plazo)\n- Niveles de soporte y resistencia\n- Indicadores técnicos clave\n- Volumen de trading\n\n📈 Análisis fundamental:\n- Tecnología y casos de uso\n- Equipo de desarrollo\n- Partnerships y adopción\n- Competencia en el sector\n- Roadmap y actualizaciones\n\n💰 Estrategia de inversión:\n- Perfil de riesgo recomendado\n- Puntos de entrada y salida\n- Gestión de riesgo\n- Diversificación sugerida\n\n⚠️ Incluye siempre disclaimer sobre riesgos de inversión.",
    tags: ["crypto", "blockchain", "inversión", "análisis"],
    price: 349,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 89,
    views: 567,
    likes: 32,
    rating: 4.6,
    rating_count: 19
  },
  {
    title: "Creador de Presentaciones Ejecutivas",
    description: "Diseña presentaciones impactantes para juntas directivas y clientes importantes.",
    content: "Eres un consultor en comunicación ejecutiva. Crea una presentación profesional:\n\n🎯 Información del proyecto:\n- Tema principal: [TEMA]\n- Audiencia: [AUDIENCIA]\n- Duración: [MINUTOS]\n- Objetivo: [OBJETIVO]\n- Contexto: [CONTEXTO]\n\n📊 Estructura de presentación:\n1. Slide de título impactante\n2. Agenda y objetivos\n3. Situación actual/problema\n4. Propuesta/solución\n5. Beneficios y ROI\n6. Plan de implementación\n7. Próximos pasos\n8. Q&A\n\n💡 Para cada slide incluye:\n- Título claro y directo\n- Puntos clave (máximo 3-4)\n- Sugerencias visuales\n- Notas del presentador\n- Tiempo estimado\n\n🎨 Consejos de diseño y storytelling incluidos.",
    tags: ["presentaciones", "business", "comunicación", "ejecutivo"],
    price: 279,
    is_free: false,
    is_featured: false,
    is_public: true,
    downloads: 134,
    views: 789,
    likes: 45,
    rating: 4.7,
    rating_count: 28
  },
  {
    title: "Psicólogo Virtual de Bienestar",
    description: "Prompt gratuito para técnicas de manejo del estrés y bienestar mental.",
    content: "Actúo como un psicólogo especializado en bienestar mental. Te ayudo con técnicas de autoayuda:\n\n🧠 Situación actual:\n- Describe tu estado emocional: [ESTADO]\n- Factores de estrés principales: [FACTORES]\n- Síntomas que experimentas: [SÍNTOMAS]\n- Objetivos de bienestar: [OBJETIVOS]\n\n🌱 Plan de bienestar personalizado:\n1. Técnicas de respiración y mindfulness\n2. Ejercicios de relajación muscular\n3. Estrategias de manejo del estrés\n4. Rutinas de autocuidado\n5. Técnicas de reestructuración cognitiva\n\n📝 Herramientas prácticas:\n- Diario de emociones\n- Ejercicios de gratitud\n- Técnicas de grounding\n- Apps y recursos recomendados\n\n⚠️ Nota: Este es apoyo informativo, no reemplaza terapia profesional.",
    tags: ["psicología", "bienestar", "salud-mental", "autoayuda"],
    price: 0,
    is_free: true,
    is_featured: false,
    is_public: true,
    downloads: 445,
    views: 2156,
    likes: 123,
    rating: 4.8,
    rating_count: 89
  },
  {
    title: "Especialista en E-commerce y Dropshipping",
    description: "Guía completa para crear y optimizar tiendas online exitosas.",
    content: "Soy un experto en e-commerce con 8+ años de experiencia. Te ayudo a crear tu tienda online:\n\n🛒 Configuración inicial:\n- Nicho de mercado: [NICHO]\n- Presupuesto inicial: [PRESUPUESTO]\n- Plataforma preferida: [SHOPIFY/WOOCOMMERCE/OTRA]\n- Modelo de negocio: [DROPSHIPPING/INVENTARIO/HÍBRIDO]\n\n📦 Estrategia de productos:\n1. Investigación de productos ganadores\n2. Análisis de competencia\n3. Estrategia de precios\n4. Proveedores confiables\n5. Gestión de inventario\n\n📈 Marketing y conversión:\n- SEO para e-commerce\n- Publicidad en Facebook/Google\n- Email marketing\n- Optimización de conversión\n- Retención de clientes\n\n💰 Métricas clave a monitorear:\n- CAC, LTV, AOV, CR\n- Plan de escalamiento\n- Automatizaciones recomendadas",
    tags: ["ecommerce", "dropshipping", "negocios", "marketing"],
    price: 399,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 167,
    views: 923,
    likes: 58,
    rating: 4.5,
    rating_count: 34
  },
  {
    title: "Desarrollador de Apps Móviles",
    description: "Guía técnica para crear aplicaciones móviles nativas y multiplataforma.",
    content: "Soy un desarrollador móvil senior. Te guío en el desarrollo de tu app:\n\n📱 Especificaciones del proyecto:\n- Tipo de app: [NATIVA/HÍBRIDA/PWA]\n- Plataformas: [iOS/ANDROID/AMBAS]\n- Funcionalidades principales: [FUNCIONES]\n- Audiencia objetivo: [AUDIENCIA]\n- Presupuesto: [PRESUPUESTO]\n\n🛠️ Stack tecnológico recomendado:\n- Frontend: React Native/Flutter/Swift/Kotlin\n- Backend: Node.js/Python/Firebase\n- Base de datos: PostgreSQL/MongoDB/Firestore\n- Autenticación: Auth0/Firebase Auth\n- Pagos: Stripe/PayPal\n\n📋 Plan de desarrollo:\n1. Wireframes y mockups\n2. Arquitectura de la app\n3. MVP (características mínimas)\n4. Desarrollo iterativo\n5. Testing y QA\n6. Deployment y distribución\n\n📊 Métricas de éxito y monetización incluidas.",
    tags: ["desarrollo", "mobile", "apps", "programación"],
    price: 449,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 98,
    views: 654,
    likes: 41,
    rating: 4.9,
    rating_count: 22
  },
  {
    title: "Experto en Inteligencia Artificial",
    description: "Implementa soluciones de IA en tu negocio con este prompt especializado.",
    content: "Actúo como consultor en IA con experiencia en implementación empresarial:\n\n🤖 Análisis de necesidades:\n- Industria/sector: [INDUSTRIA]\n- Procesos a optimizar: [PROCESOS]\n- Datos disponibles: [DATOS]\n- Objetivos de negocio: [OBJETIVOS]\n- Presupuesto: [PRESUPUESTO]\n\n🧠 Soluciones de IA recomendadas:\n1. Machine Learning predictivo\n2. Procesamiento de lenguaje natural\n3. Computer Vision\n4. Automatización inteligente\n5. Chatbots y asistentes virtuales\n\n⚙️ Plan de implementación:\n- Fase 1: Proof of Concept\n- Fase 2: Piloto controlado\n- Fase 3: Escalamiento\n- Herramientas y tecnologías\n- Equipo necesario\n- Timeline y milestones\n\n📈 ROI esperado y métricas de éxito\n🔒 Consideraciones éticas y de privacidad",
    tags: ["inteligencia-artificial", "machine-learning", "automatización", "tecnología"],
    price: 599,
    is_free: false,
    is_featured: true,
    is_public: true,
    downloads: 76,
    views: 432,
    likes: 29,
    rating: 4.8,
    rating_count: 16
  }
];

// Usuarios de demostración (sin IDs fijos para evitar conflictos con auth.users)
const demoUsersData = [
  {
    id: randomUUID(),
    email: 'maria.garcia@example.com',
    full_name: 'María García',
    role: 'user',
    subscription_tier: 'premium'
  },
  {
    id: randomUUID(),
    email: 'carlos.rodriguez@example.com',
    full_name: 'Carlos Rodríguez',
    role: 'user',
    subscription_tier: 'free'
  },
  {
    id: randomUUID(),
    email: 'ana.martinez@example.com',
    full_name: 'Ana Martínez',
    role: 'user',
    subscription_tier: 'pro'
  },
  {
    id: randomUUID(),
    email: 'david.lopez@example.com',
    full_name: 'David López',
    role: 'user',
    subscription_tier: 'free'
  },
  {
    id: randomUUID(),
    email: 'sofia.hernandez@example.com',
    full_name: 'Sofía Hernández',
    role: 'admin',
    subscription_tier: 'pro'
  }
];

async function addDemoData() {
  try {
    console.log('🚀 Iniciando inserción de datos de demostración...');

    // Insertar modelos de IA modernos si no existen
    console.log('🤖 Verificando e insertando modelos de IA actualizados...');
    
    for (const model of modernAiModels) {
      const { data: existingModel } = await supabase
        .from('ai_models')
        .select('id')
        .eq('name', model.name)
        .single();
      
      if (!existingModel) {
        const { error } = await supabase
          .from('ai_models')
          .insert(model);
        
        if (error) {
          console.log(`⚠️  Error insertando modelo ${model.name}:`, error.message);
        } else {
          console.log(`✅ Modelo ${model.name} insertado exitosamente`);
        }
      }
    }

    // Obtener categorías y modelos existentes (incluyendo los nuevos)
    const { data: categories } = await supabase.from('categories').select('*');
    const { data: models } = await supabase.from('ai_models').select('*');
    
    if (!categories || !models) {
      console.error('❌ No se encontraron categorías o modelos. Ejecuta primero setup-database.js');
      return;
    }
    
    console.log(`📊 Modelos de IA disponibles: ${models.length}`);

    // Obtener usuarios existentes para asignar prompts
    console.log('👥 Obteniendo usuarios existentes...');
    
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(10);
    
    let profiles = existingProfiles || [];
    
    // Si no hay usuarios, solo insertar categorías y modelos
    if (profiles.length === 0) {
      console.log('ℹ️  No hay usuarios registrados.');
      console.log('📋 Insertando solo categorías y modelos de IA...');
      console.log('💡 Para añadir prompts de demostración:');
      console.log('   1. Regístrate en http://localhost:3000');
      console.log('   2. Ejecuta este script nuevamente');
      
      // Saltar la creación de prompts
      profiles = null;
    } else {
      console.log(`✅ Encontrados ${profiles.length} usuarios existentes`);
    }

    // Mapear categorías por nombre
    const categoryMap = {
      'Writing': categories.find(c => c.name === 'Writing')?.id,
      'Business': categories.find(c => c.name === 'Business')?.id,
      'Education': categories.find(c => c.name === 'Education')?.id,
      'Programming': categories.find(c => c.name === 'Programming')?.id,
      'Creative': categories.find(c => c.name === 'Creative')?.id,
      'Research': categories.find(c => c.name === 'Research')?.id,
      'Personal': categories.find(c => c.name === 'Personal')?.id,
      'Entertainment': categories.find(c => c.name === 'Entertainment')?.id
    };

    // Mapear modelos por nombre (incluyendo modelos modernos)
    const modelMap = {
      // Modelos clásicos
      'GPT-3.5': models.find(m => m.name === 'GPT-3.5')?.id,
      'GPT-4': models.find(m => m.name === 'GPT-4')?.id,
      'Claude 2': models.find(m => m.name === 'Claude 2')?.id,
      'Gemini Pro': models.find(m => m.name === 'Gemini Pro')?.id,
      'Llama 2': models.find(m => m.name === 'Llama 2')?.id,
      // Modelos modernos 2024-2025
      'GPT-4o': models.find(m => m.name === 'GPT-4o')?.id,
      'GPT-4.5': models.find(m => m.name === 'GPT-4.5')?.id,
      'Claude 3.5 Sonnet': models.find(m => m.name === 'Claude 3.5 Sonnet')?.id,
      'Claude 4': models.find(m => m.name === 'Claude 4')?.id,
      'Gemini 2.0 Flash': models.find(m => m.name === 'Gemini 2.0 Flash')?.id,
      'Gemini 2.5 Pro': models.find(m => m.name === 'Gemini 2.5 Pro')?.id,
      'Llama 3.2': models.find(m => m.name === 'Llama 3.2')?.id,
      'DeepSeek-V3': models.find(m => m.name === 'DeepSeek-V3')?.id,
      'Grok-3': models.find(m => m.name === 'Grok-3')?.id,
      'Mistral Large': models.find(m => m.name === 'Mistral Large')?.id
    };

    // Los profiles ya están definidos arriba

    let insertedPrompts = [];
    
    // Solo crear prompts si hay usuarios disponibles
    if (profiles && profiles.length > 0) {
      // Asignar categorías y modelos a los prompts (incluyendo nuevos)
      const promptsWithData = demoPrompts.map((prompt, index) => {
        const categoryNames = [
          'Business', 'Programming', 'Creative', 'Research', 'Business', 'Education', 
          'Business', 'Personal', 'Personal', 'Creative', 'Business', 'Business', 
          'Personal', 'Business', 'Programming', 'Business'
        ];
        const modelNames = [
          'GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 2.5 Pro', 'GPT-4.5', 'Claude 4', 
          'Gemini 2.0 Flash', 'Llama 3.2', 'DeepSeek-V3', 'Grok-3', 'Mistral Large',
          'GPT-4o', 'Claude 4', 'GPT-4.5', 'Gemini 2.5 Pro', 'Claude 3.5 Sonnet', 'GPT-4o'
        ];
        
        return {
          id: randomUUID(),
          ...prompt,
          category_id: categoryMap[categoryNames[index]],
          model_id: modelMap[modelNames[index]],
          author_id: profiles[index % profiles.length].id,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        };
      });

      // Verificar si ya existen prompts con estos títulos
      const existingTitles = demoPrompts.map(p => p.title);
      const { data: existingPrompts } = await supabase
        .from('prompts')
        .select('title')
        .in('title', existingTitles);
      
      // Filtrar prompts que no existen
      const promptsToInsert = promptsWithData.filter(prompt => 
        !existingPrompts?.some(existing => existing.title === prompt.title)
      );
      
      if (promptsToInsert.length > 0) {
        console.log(`📝 Insertando ${promptsToInsert.length} prompts nuevos...`);
        const { data: newPrompts, error: promptsError } = await supabase
          .from('prompts')
          .insert(promptsToInsert)
          .select();
          
        if (promptsError) {
          console.error('❌ Error insertando prompts:', promptsError.message);
          return;
        }
        
        insertedPrompts = newPrompts;
      } else {
        console.log('ℹ️  Todos los prompts de demostración ya existen');
        
        // Obtener los prompts existentes
        const { data: existing } = await supabase
          .from('prompts')
          .select('*')
          .in('title', existingTitles);
          
        insertedPrompts = existing || [];
       }
    } else {
      console.log('ℹ️  No hay usuarios disponibles, saltando creación de prompts');
    }

    console.log(`✅ ${insertedPrompts.length} prompts insertados exitosamente`);

    // Generar algunas compras de ejemplo (solo si hay usuarios reales y prompts)
    if (insertedPrompts.length > 0 && profiles && profiles.length > 0) {
      console.log('💰 Generando compras de ejemplo...');
      
      const samplePurchases = [];
        for (let i = 0; i < Math.min(5, insertedPrompts.length); i++) {
          const prompt = insertedPrompts[i];
          if (!prompt.is_free) {
            samplePurchases.push({
              user_id: profiles[i % profiles.length].id,
              prompt_id: prompt.id,
              amount: prompt.price,
              stripe_payment_intent_id: `demo_pi_${Date.now()}_${i}`,
              status: 'completed'
            });
          }
        }

      if (samplePurchases.length > 0) {
        const { error: purchasesError } = await supabase
          .from('purchases')
          .upsert(samplePurchases);

        if (purchasesError) {
          console.error('❌ Error insertando compras:', purchasesError.message);
        } else {
          console.log(`✅ ${samplePurchases.length} compras de ejemplo generadas`);
        }
      }
    }

    // Generar algunos likes y favoritos (solo si hay usuarios reales y prompts)
    if (profiles && profiles.length > 0 && insertedPrompts.length > 0) {
      console.log('❤️ Generando likes y favoritos...');
      
      const sampleLikes = [];
      const sampleFavorites = [];
      
      for (let i = 0; i < Math.min(8, insertedPrompts.length); i++) {
        const prompt = insertedPrompts[i];
        const userIndex = i % profiles.length;
        
        // Generar likes
        sampleLikes.push({
          user_id: profiles[userIndex].id,
          prompt_id: prompt.id
        });
        
        // Generar algunos favoritos
        if (i % 2 === 0) {
          sampleFavorites.push({
            user_id: profiles[userIndex].id,
            prompt_id: prompt.id
          });
        }
      }

      // Insertar likes
      if (sampleLikes.length > 0) {
        const { error: likesError } = await supabase
          .from('likes')
          .upsert(sampleLikes, { onConflict: 'user_id,prompt_id' });

        if (likesError) {
          console.error('❌ Error insertando likes:', likesError.message);
        } else {
          console.log(`✅ ${sampleLikes.length} likes generados`);
        }
      }

      // Insertar favoritos
      if (sampleFavorites.length > 0) {
        const { error: favoritesError } = await supabase
          .from('favorites')
          .upsert(sampleFavorites, { onConflict: 'user_id,prompt_id' });

        if (favoritesError) {
          console.error('❌ Error insertando favoritos:', favoritesError.message);
        } else {
          console.log(`✅ ${sampleFavorites.length} favoritos generados`);
        }
      }
    } else {
      console.log('ℹ️  Saltando likes y favoritos (no hay usuarios reales o prompts)');
    }

    console.log('\n🎉 ¡Datos de demostración añadidos exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • ${insertedPrompts.length} prompts de demostración`);
    console.log(`   • Usuarios existentes: ${profiles?.length || 0}`);
    if (profiles && profiles.length > 0 && insertedPrompts.length > 0) {
      console.log(`   • Compras, likes y favoritos generados`);
    } else {
      console.log(`   • Solo prompts (sin interacciones de usuario)`);
    }
    console.log('\n🌐 Visita http://localhost:3000 para ver los cambios');
    console.log('\n💡 Tip: Regístrate en la app para ver todas las funcionalidades');
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error.message);
  }
}

// Ejecutar script
if (require.main === module) {
  addDemoData();
}

module.exports = { addDemoData };