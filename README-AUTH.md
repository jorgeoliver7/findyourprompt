# Autenticación con Supabase en FindYourPrompt

Este documento describe cómo se ha implementado la autenticación con Supabase en la aplicación FindYourPrompt.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (o tu URL de producción)
```

### 2. Base de Datos

El esquema de la base de datos ya está definido en `supabase/schema.sql`. Este archivo incluye:

- Tablas para usuarios, modelos de IA, prompts, compras y reseñas
- Funciones y triggers para manejar eventos como la creación de usuarios
- Políticas de Row Level Security (RLS) para proteger los datos
- Datos iniciales para modelos de IA

Para aplicar este esquema, puedes usar la interfaz de SQL de Supabase o ejecutarlo a través de la CLI de Supabase.

## Componentes de Autenticación

### Clientes de Supabase

- `src/lib/supabase.ts`: Contiene funciones para crear clientes de Supabase tanto en el navegador como en el servidor.
- `src/lib/auth.ts`: Proporciona funciones para manejar la autenticación, como obtener el usuario actual y proteger rutas.

### Páginas de Autenticación

- `/login`: Página de inicio de sesión
- `/register`: Página de registro
- `/forgot-password`: Página para solicitar restablecimiento de contraseña
- `/reset-password`: Página para establecer una nueva contraseña
- `/dashboard/settings`: Página para actualizar el perfil y cambiar la contraseña

### Middleware

- `src/middleware.ts`: Protege rutas que requieren autenticación y redirige a los usuarios según su estado de autenticación.

## Flujo de Autenticación

### Registro

1. El usuario completa el formulario de registro
2. Se crea una cuenta en Supabase Auth
3. Se crea automáticamente un perfil en la tabla `users` mediante un trigger
4. El usuario es redirigido al dashboard

### Inicio de Sesión

1. El usuario ingresa sus credenciales
2. Supabase Auth valida las credenciales
3. Se crea una sesión y se almacena en cookies
4. El usuario es redirigido al dashboard

### Recuperación de Contraseña

1. El usuario solicita un enlace de recuperación
2. Supabase envía un correo con un enlace mágico
3. El usuario hace clic en el enlace y es redirigido a la página de restablecimiento
4. El usuario establece una nueva contraseña

### Cierre de Sesión

1. El usuario hace clic en "Cerrar Sesión"
2. Se llama a la ruta `/api/auth/signout`
3. Se elimina la sesión
4. El usuario es redirigido a la página de inicio

## Protección de Rutas

Las rutas que requieren autenticación están protegidas de dos maneras:

1. **Middleware**: Intercepta las solicitudes y redirige a los usuarios no autenticados
2. **Función `requireAuth`**: Se puede usar en componentes del servidor para obtener el usuario actual o redirigir

## Personalización

### Estilos

Los componentes de autenticación utilizan Tailwind CSS y los componentes UI de shadcn/ui. Puedes personalizar su apariencia modificando las clases CSS o los componentes UI.

### Campos Adicionales

Si necesitas campos adicionales en el perfil de usuario:

1. Actualiza la tabla `users` en `schema.sql`
2. Modifica el tipo `User` en `src/types/index.ts`
3. Actualiza los formularios en las páginas de registro y configuración

## Consideraciones de Seguridad

- Las políticas RLS protegen los datos en la base de datos
- Las contraseñas son manejadas por Supabase Auth y nunca se almacenan en texto plano
- El middleware protege las rutas que requieren autenticación
- Las sesiones se almacenan en cookies seguras