import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModelsPage() {
  // En un entorno real, obtendríamos esta información de la base de datos
  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Modelo avanzado de lenguaje con fuertes capacidades de razonamiento',
      promptCount: 1250,
    },
    {
      id: 'gpt-3.5',
      name: 'GPT-3.5',
      provider: 'OpenAI',
      description: 'Modelo eficiente de lenguaje para diversas tareas',
      promptCount: 2340,
    },
    {
      id: 'claude-2',
      name: 'Claude 2',
      provider: 'Anthropic',
      description: 'Asistente de IA útil, inofensivo y honesto',
      promptCount: 890,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Modelo multimodal de IA de Google',
      promptCount: 760,
    },
    {
      id: 'llama-2',
      name: 'Llama 2',
      provider: 'Meta',
      description: 'Modelo de lenguaje grande de código abierto',
      promptCount: 520,
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Modelos de IA</h1>
        <p className="text-muted-foreground">
          Explora los diferentes modelos de IA disponibles en nuestra plataforma y encuentra prompts
          específicos para cada uno.
        </p>

        <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
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