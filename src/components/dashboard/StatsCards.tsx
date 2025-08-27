'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StatsCardsProps = {
  promptsCount: number;
  salesCount: number;
  totalRevenue: number;
  purchasesCount: number;
};

export default function StatsCards({
  promptsCount,
  salesCount,
  totalRevenue,
  purchasesCount,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Prompts Creados</CardTitle>
          <CardDescription>Total de prompts que has creado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{promptsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Prompts Vendidos</CardTitle>
          <CardDescription>Número total de ventas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{salesCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Ingresos</CardTitle>
          <CardDescription>Ingresos totales por ventas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Prompts Comprados</CardTitle>
          <CardDescription>Prompts que has adquirido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{purchasesCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}