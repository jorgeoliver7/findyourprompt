import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Zap, Shield, ArrowRight } from "lucide-react";
import { CategoryCardSkeletonGrid } from "@/components/prompts/CategoryCardSkeleton";
import { PromptCardSkeletonGrid } from "@/components/prompts/PromptCardSkeleton";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Encuentra el prompt perfecto para tus proyectos de IA
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Marketplace de prompts para diferentes modelos de IA. Descubre, compra y vende prompts que potencien tus proyectos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/explore">
                  Explorar Prompts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/register">Crear Cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                ¿Por qué FindYourPrompt?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Descubre las ventajas de nuestro marketplace de prompts de IA
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-6 w-6 text-primary" />
                  <CardTitle>Amplio Catálogo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Miles de prompts para diferentes modelos de IA, categorizados y con reseñas de usuarios.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <CardTitle>Monetiza tu Creatividad</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vende tus mejores prompts y gana dinero compartiendo tu experiencia con la comunidad.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Prueba antes de Comprar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualiza ejemplos de resultados para cada prompt antes de realizar tu compra.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Explora por Categorías
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Encuentra prompts organizados por temática y propósito
              </p>
            </div>
          </div>
          <Suspense fallback={<CategoryCardSkeletonGrid count={8} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-blue-100 text-blue-600">
                      🎨
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Arte y Diseño
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Prompts creativos para generar arte, diseños y contenido visual
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-green-100 text-green-600">
                      💼
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Negocios
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Prompts para marketing, ventas y estrategias empresariales
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-purple-100 text-purple-600">
                      💻
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Programación
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Prompts para desarrollo de software y resolución de problemas técnicos
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-orange-100 text-orange-600">
                      ✍️
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Escritura
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Prompts para crear contenido, historias y textos creativos
                  </p>
                </CardContent>
              </Card>
            </div>
          </Suspense>
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore">Ver Todas las Categorías</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Prompts Populares
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Los prompts más valorados por nuestra comunidad
              </p>
            </div>
          </div>
          <Suspense fallback={<PromptCardSkeletonGrid count={6} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Generador de Ideas Creativas
                      </CardTitle>
                      <CardDescription>
                        Prompt para generar ideas innovadoras para cualquier proyecto
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Creatividad
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Brainstorming
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⭐ 4.8 (124 valoraciones)</span>
                      <span>💎 Premium</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Optimizador de Código
                      </CardTitle>
                      <CardDescription>
                        Mejora la eficiencia y legibilidad de tu código
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        Programación
                      </span>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                        Optimización
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⭐ 4.9 (89 valoraciones)</span>
                      <span>🆓 Gratis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Escritor de Contenido SEO
                      </CardTitle>
                      <CardDescription>
                        Crea contenido optimizado para motores de búsqueda
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Marketing
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        SEO
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⭐ 4.7 (156 valoraciones)</span>
                      <span>💎 Premium</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Suspense>
          <div className="flex justify-center">
            <Button asChild className="rounded-full">
              <Link href="/prompts">Ver Todos los Prompts <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                ¿Listo para comenzar?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Únete a nuestra comunidad y descubre el poder de los prompts de IA
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/explore">Explorar Prompts</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/register">Registrarse Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
