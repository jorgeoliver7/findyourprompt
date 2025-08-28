import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAIModels } from '@/lib/prompts';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function ModelsPage() {
  // Obtener modelos de IA de la base de datos
  const { data: models } = await getAIModels();
  
  // Obtener conteo de prompts por modelo
  const supabase = await createSupabaseServerClient();
  const modelsWithCounts = await Promise.all(
    (models || []).map(async (model) => {
      const { count } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('model_id', model.id);
      
      return {
        ...model,
        promptCount: count || 0,
      };
    })
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Modelos de IA</h1>
        <p className="text-muted-foreground">
          Explora los diferentes modelos de IA disponibles en nuestra plataforma y encuentra prompts
          específicos para cada uno.
        </p>

        <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {modelsWithCounts.map((model) => (
            <Card key={model.id}>
              <CardHeader>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.provider}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{model.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {model.promptCount} prompts disponibles
                  </span>
                  <a
                    href={`/explore?model=${model.id}`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Ver prompts
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}