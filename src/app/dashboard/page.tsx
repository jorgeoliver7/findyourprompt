import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prompts Creados</CardTitle>
            <CardDescription>Total de prompts que has creado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prompts Vendidos</CardTitle>
            <CardDescription>Número total de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ingresos</CardTitle>
            <CardDescription>Ingresos totales por ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0.00</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prompts Comprados</CardTitle>
            <CardDescription>Prompts que has adquirido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mis Prompts</CardTitle>
              <Button asChild size="sm">
                <Link href="/dashboard/prompts/new">Crear Prompt</Link>
              </Button>
            </div>
            <CardDescription>Gestiona tus prompts creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center">
              <p className="text-muted-foreground">No has creado ningún prompt todavía.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/dashboard/prompts/new">Crear tu primer prompt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Compras</CardTitle>
            <CardDescription>Prompts que has comprado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center">
              <p className="text-muted-foreground">No has comprado ningún prompt todavía.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/explore">Explorar prompts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas transacciones y actividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center">
              <p className="text-muted-foreground">No hay actividad reciente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}