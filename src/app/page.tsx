import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Encuentra el prompt perfecto para tus proyectos de IA
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Marketplace de prompts para diferentes modelos de IA. Descubre, compra y vende prompts que potencien tus proyectos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/explore">Explorar Prompts</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/register">Crear Cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                ¿Por qué FindYourPrompt?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre las ventajas de nuestro marketplace de prompts de IA
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">Amplio Catálogo</h3>
              <p className="text-muted-foreground">
                Miles de prompts para diferentes modelos de IA, categorizados y con reseñas de usuarios.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">Monetiza tu Creatividad</h3>
              <p className="text-muted-foreground">
                Vende tus mejores prompts y gana dinero compartiendo tu experiencia con la comunidad.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">Prueba antes de Comprar</h3>
              <p className="text-muted-foreground">
                Visualiza ejemplos de resultados para cada prompt antes de realizar tu compra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Prompts Populares
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre los prompts más utilizados por nuestra comunidad
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            {/* Aquí irían las tarjetas de prompts populares */}
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">Cargando prompts populares...</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore">Ver Todos los Prompts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
