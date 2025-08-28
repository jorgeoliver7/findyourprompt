# 🚀 FindYourPrompt - Marketplace de Prompts de IA

> **Marketplace moderno para descubrir, comprar y vender prompts de IA de alta calidad**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

---

## 📋 Estado del Proyecto

### ✅ **Completado**
- 🎨 **UI/UX Moderna**: Diseño responsive con Tailwind CSS y shadcn/ui
- 🔐 **Autenticación**: Sistema completo con Supabase Auth
- 📱 **Páginas Principales**: Home, exploración de prompts, perfiles
- 🛒 **Sistema de Favoritos**: Like y guardar prompts
- 🔍 **Búsqueda y Filtros**: Por categoría, modelo de IA, precio
- 📊 **Dashboard**: Panel de administración básico
- 🎯 **Layout Centrado**: UI profesional y bien estructurada

### ⚡ **Próximo Paso Crítico**
```bash
# Verificar estado actual
npm run status

# Configurar Supabase (15-20 min)
# Sigue la guía: SETUP-SUPABASE.md
```

---

## 🚀 Inicio Rápido

### 1. Verificar Configuración
```bash
# Verificar estado del proyecto
npm run setup:check

# Estado rápido
npm run status
```

### 2. Configurar Supabase (REQUERIDO)
```bash
# Abrir guía de configuración
code SETUP-SUPABASE.md

# Después de configurar Supabase:
npm run setup:database
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
# Abrir http://localhost:3000
```

---

## 🛠️ Comandos Disponibles

### 🔍 **Diagnóstico**
```bash
npm run setup:check    # Verificación completa
npm run status          # Estado rápido
npm run deploy:check    # Verificar antes de deploy
```

### 🚀 **Desarrollo**
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build de producción
npm run lint           # Verificar código
npm run clean          # Limpiar archivos temporales
```

### 🗄️ **Base de Datos**
```bash
npm run setup:database # Inicializar datos
npm run setup:all      # Configuración completa
```

### 🔧 **Herramientas**
```bash
npm run dev:helper     # Menú de herramientas
npm run dev:helper status  # Estado rápido
npm run dev:helper clean   # Limpiar proyecto
```

---

## 📁 Estructura del Proyecto

```
findyourprompt/
├── 📚 Documentación
│   ├── README.md                 # Este archivo
│   ├── NEXT-STEPS.md            # Roadmap detallado
│   ├── SETUP-SUPABASE.md        # Configuración de BD
│   ├── SETUP-INTEGRATIONS.md    # Stripe, OpenAI, etc.
│   └── README-AUTH.md           # Sistema de autenticación
│
├── 🛠️ Scripts
│   ├── scripts/check-setup.js    # Verificación de configuración
│   ├── scripts/setup-database.js # Inicialización de BD
│   └── scripts/dev-helper.js     # Herramientas de desarrollo
│
├── 🎨 Frontend
│   ├── src/app/                  # Páginas de Next.js 15
│   ├── src/components/           # Componentes reutilizables
│   ├── src/lib/                  # Utilidades y configuración
│   └── src/types/                # Tipos de TypeScript
│
├── 🗄️ Base de Datos
│   └── supabase/schema.sql       # Esquema completo de BD
│
└── ⚙️ Configuración
    ├── .env.local                # Variables de entorno
    ├── package.json              # Dependencias y scripts
    ├── tailwind.config.js        # Configuración de Tailwind
    └── next.config.ts            # Configuración de Next.js
```

---

## 🎯 Funcionalidades Principales

### 👤 **Para Usuarios**
- 🔍 **Explorar prompts** por categoría y modelo de IA
- ❤️ **Guardar favoritos** y dar likes
- 🛒 **Comprar prompts premium** con Stripe
- 👤 **Perfil personalizado** con historial
- 📱 **Experiencia móvil** optimizada

### 👨‍💼 **Para Creadores**
- 📝 **Publicar prompts** con editor avanzado
- 💰 **Monetizar contenido** con precios flexibles
- 📊 **Analytics detallados** de ventas y vistas
- 🏷️ **Categorización** y etiquetado
- 🤖 **Soporte multi-modelo** (GPT, Claude, etc.)

### 🔧 **Para Administradores**
- 📊 **Dashboard completo** con métricas
- 👥 **Gestión de usuarios** y contenido
- 💳 **Control de pagos** y comisiones
- 🔍 **Moderación** de contenido
- 📈 **Analytics avanzados**

---

## 🔧 Stack Tecnológico

### **Frontend**
- ⚡ **Next.js 15** - Framework React con App Router
- 🎨 **Tailwind CSS 4** - Estilos utilitarios
- 🧩 **shadcn/ui** - Componentes UI modernos
- 📱 **Responsive Design** - Mobile-first
- 🔤 **TypeScript** - Tipado estático

### **Backend**
- 🗄️ **Supabase** - Base de datos PostgreSQL
- 🔐 **Supabase Auth** - Autenticación completa
- 🔄 **Server Actions** - Lógica del servidor
- 📡 **API Routes** - Endpoints personalizados

### **Integraciones**
- 💳 **Stripe** - Procesamiento de pagos
- 🤖 **OpenAI API** - Generación de prompts
- 📧 **Resend** - Envío de emails
- 🔍 **Algolia** - Búsqueda avanzada
- 📊 **Google Analytics** - Métricas

---

## 🌟 Características Destacadas

### 🎨 **Diseño Moderno**
- ✨ Interfaz limpia y profesional
- 🌙 Modo oscuro/claro
- 📱 Totalmente responsive
- ⚡ Animaciones suaves
- 🎯 UX optimizada

### ⚡ **Rendimiento**
- 🚀 Next.js 15 con Turbopack
- 📦 Componentes lazy-loaded
- 🖼️ Optimización de imágenes
- 💾 Caché inteligente
- 📊 Core Web Vitals optimizados

### 🔒 **Seguridad**
- 🛡️ Row Level Security (RLS)
- 🔐 Autenticación JWT
- 🔒 Variables de entorno seguras
- 🚫 Validación de entrada
- 🔍 Sanitización de datos

---

## 📈 Roadmap

### 🎯 **Fase 1: MVP (Semana 1-2)**
- [x] Configuración inicial del proyecto
- [x] UI/UX y componentes básicos
- [x] Sistema de autenticación
- [ ] Configuración de Supabase real
- [ ] Deploy inicial

### 💰 **Fase 2: Monetización (Semana 3-4)**
- [ ] Integración con Stripe
- [ ] Sistema de pagos
- [ ] Suscripciones premium
- [ ] Comisiones para creadores

### 🚀 **Fase 3: Crecimiento (Mes 2)**
- [ ] SEO y marketing
- [ ] Analytics avanzados
- [ ] API pública
- [ ] Programa de afiliados

### 🔮 **Fase 4: Escalamiento (Mes 3+)**
- [ ] IA para recomendaciones
- [ ] Marketplace de templates
- [ ] Integración con más modelos de IA
- [ ] App móvil nativa

---

## 🆘 Soporte

### 📚 **Documentación**
- 📖 [Próximos Pasos](./NEXT-STEPS.md)
- 🔧 [Configuración de Supabase](./SETUP-SUPABASE.md)
- 🔌 [Integraciones](./SETUP-INTEGRATIONS.md)
- 🔐 [Autenticación](./README-AUTH.md)

### 🛠️ **Herramientas de Diagnóstico**
```bash
# Verificar todo
npm run setup:check

# Estado rápido
npm run status

# Menú de herramientas
npm run dev:helper
```

### 🐛 **Resolución de Problemas**
1. **Error de conexión a Supabase**: Verificar variables en `.env.local`
2. **Error de build**: Ejecutar `npm run clean && npm install`
3. **Error de autenticación**: Revisar configuración de RLS
4. **Error de pagos**: Verificar claves de Stripe

---

## 🤝 Contribuir

### 🔧 **Configuración para Desarrollo**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/findyourprompt.git
cd findyourprompt

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Verificar configuración
npm run setup:check

# Inicializar base de datos
npm run setup:database

# Ejecutar en desarrollo
npm run dev
```

### 📝 **Estándares de Código**
- ✅ TypeScript estricto
- 🎨 Prettier para formateo
- 🔍 ESLint para calidad
- 📝 Comentarios en español
- 🧪 Tests unitarios (próximamente)

---

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles.

---

## 🎉 ¡Empezar Ahora!

**Tu próximo paso:**

1. 📖 Lee [NEXT-STEPS.md](./NEXT-STEPS.md)
2. ⚙️ Configura Supabase siguiendo [SETUP-SUPABASE.md](./SETUP-SUPABASE.md)
3. 🚀 Ejecuta `npm run dev` y ve a http://localhost:3000
4. 💰 Configura Stripe para monetización
5. 🌐 Deploy a producción

**¡En 30 minutos tendrás tu marketplace funcionando! 🚀**

---

*Desarrollado con ❤️ para la comunidad de IA*

*Última actualización: Enero 2025*
