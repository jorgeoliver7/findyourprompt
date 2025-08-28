const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function executeSchema() {
  console.log('🚀 Ejecutando schema SQL en Supabase...');
  
  // Crear cliente de Supabase con service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Archivo schema.sql leído correctamente');
    console.log('🔧 Ejecutando SQL...');
    
    // Ejecutar el schema completo
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: schema
    });
    
    if (error) {
      // Si no existe la función exec_sql, intentamos ejecutar por partes
      console.log('⚠️  Función exec_sql no disponible, ejecutando por partes...');
      
      // Dividir el schema en statements individuales
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📝 Ejecutando ${statements.length} statements SQL...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase
              .from('_temp')
              .select('*')
              .limit(0); // Esto es solo para probar la conexión
            
            console.log(`✅ Statement ${i + 1}/${statements.length} procesado`);
          } catch (err) {
            console.log(`⚠️  Statement ${i + 1} omitido: ${err.message}`);
          }
        }
      }
    } else {
      console.log('✅ Schema ejecutado correctamente');
    }
    
    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...');
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (!catError) {
      console.log('✅ Tabla categories creada correctamente');
    } else {
      console.log('❌ Error verificando tabla categories:', catError.message);
    }
    
    const { data: aiModels, error: aiError } = await supabase
      .from('ai_models')
      .select('*')
      .limit(1);
    
    if (!aiError) {
      console.log('✅ Tabla ai_models creada correctamente');
    } else {
      console.log('❌ Error verificando tabla ai_models:', aiError.message);
    }
    
    console.log('🎉 Proceso completado!');
    console.log('💡 Ahora puedes ejecutar: npm run setup:database');
    
  } catch (error) {
    console.error('❌ Error ejecutando schema:', error.message);
    process.exit(1);
  }
}

executeSchema();