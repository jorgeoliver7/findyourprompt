import { Button } from '@/components/ui/button';

export default function ExplorePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explorar Prompts</h1>
          <Button>Filtros</Button>
        </div>
        <p className="text-muted-foreground">
          Descubre prompts para diferentes modelos de IA creados por nuestra comunidad.
        </p>

        {/* Aquí iría un componente de filtros */}
        <div className="my-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Todos los Modelos
          </Button>
          <Button variant="outline" size="sm">
            Precio: Cualquiera
          </Button>
          <Button variant="outline" size="sm">
            Ordenar por: Popularidad
          </Button>
        </div>

        {/* Grid de prompts */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Aquí irían los PromptCard components */}
          <div className="col-span-full flex items-center justify-center py-10">
            <p className="text-muted-foreground">
              Conecta tu base de datos para ver los prompts disponibles.
            </p>
          </div>
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}