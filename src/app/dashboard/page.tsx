'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2, Plus, CreditCard, Star, Download } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido de vuelta, {profile?.full_name || user.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">
              Créditos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Prompts</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Prompts creados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Prompts descargados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.0</div>
            <p className="text-xs text-muted-foreground">
              Rating promedio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
            <CardDescription>
              Detalles de tu perfil y suscripción
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nombre:</span>
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || 'No especificado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rol:</span>
              <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                {profile?.role || 'user'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Suscripción:</span>
              <Badge variant={profile?.subscription_tier === 'premium' ? 'default' : 'outline'}>
                {profile?.subscription_tier || 'free'}
              </Badge>
            </div>
            
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/dashboard/settings">
                  Editar Perfil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/prompts/new">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Prompt
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link href="/prompts">
                Explorar Prompts
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/purchases">
                Ver Mis Compras
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/prompts">
                Gestionar Mis Prompts
              </Link>
            </Button>
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