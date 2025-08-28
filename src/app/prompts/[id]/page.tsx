import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PromptDetailsPage({ params }: { params: { id: string } }) {
  // En un entorno real, obtendríamos los datos del prompt desde la base de datos
  const _promptId = params.id;

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <span>Explorar</span> &gt; <span>Detalles del Prompt</span>
        </div>

        {/* Prompt Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Título del Prompt</h1>
          <p className="mb-4 text-muted-foreground">
            Descripción detallada del prompt que explica su propósito y cómo utilizarlo efectivamente.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="@usuario" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Nombre del Usuario</p>
                <p className="text-sm text-muted-foreground">Creado el 01/01/2023</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">$9.99</p>
                <p className="text-sm text-muted-foreground">Precio único</p>
              </div>
              <Button size="lg">Comprar Prompt</Button>
            </div>
          </div>
        </div>

        {/* Prompt Content */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Vista Previa del Prompt</h2>
          <div className="rounded-md bg-muted p-4">
            <p className="font-mono text-sm">
              Este es un ejemplo del contenido del prompt. En un entorno real, esto podría estar
              parcialmente oculto hasta que el usuario realice la compra.
            </p>
          </div>
        </Card>

        {/* Prompt Details */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Detalles</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modelo</span>
                <span>GPT-4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor</span>
                <span>OpenAI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compras</span>
                <span>123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valoración</span>
                <span>★★★★☆ (4.5)</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-sm">Productividad</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm">Escritura</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm">Negocios</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Reseñas</h2>
          <div className="space-y-4">
            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Usuario 1</span>
                </div>
                <span className="text-sm">★★★★★</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Excelente prompt, me ha ayudado mucho en mi trabajo diario. Lo recomiendo totalmente.
              </p>
            </Card>

            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U2</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Usuario 2</span>
                </div>
                <span className="text-sm">★★★★☆</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Muy bueno, aunque podría tener algunas mejoras en ciertos aspectos.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}