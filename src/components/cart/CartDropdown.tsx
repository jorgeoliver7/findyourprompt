'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/lib/store';
import { getStripe } from '@/lib/stripe';

export default function CartDropdown() {
  const { items, removeItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = items.length;
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsLoading(true);

    try {
      // En un entorno real, aquí enviaríamos los datos a la API para crear una sesión de Stripe
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: items.map(item => item.id) }),
      // });
      // const { sessionId } = await response.json();
      // const stripe = await getStripe();
      // stripe?.redirectToCheckout({ sessionId });

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('¡Compra simulada con éxito!');
      clearCart();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel>Tu Carrito</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length > 0 ? (
          <>
            <DropdownMenuGroup className="max-h-64 overflow-y-auto">
              {items.map((item) => (
                <DropdownMenuItem key={item.id} className="flex justify-between p-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.model.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>${(item.price / 100).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${(totalPrice / 100).toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => clearCart()}
                >
                  Vaciar
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Pagar'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/explore">Explorar prompts</Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}