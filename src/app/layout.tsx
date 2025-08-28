import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "FindYourPrompt - Marketplace de Prompts de IA",
  description: "Descubre, compra y vende prompts para diferentes modelos de IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-muted border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h3 className="font-semibold">FindYourPrompt</h3>
                    <p className="text-sm text-muted-foreground">
                      El marketplace líder de prompts para IA
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Explorar</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/explore" className="hover:text-foreground">Todos los Prompts</a></li>
                      <li><a href="/models" className="hover:text-foreground">Modelos de IA</a></li>
                      <li><a href="/categories" className="hover:text-foreground">Categorías</a></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Comunidad</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/creators" className="hover:text-foreground">Creadores</a></li>
                      <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
                      <li><a href="/help" className="hover:text-foreground">Ayuda</a></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/privacy" className="hover:text-foreground">Privacidad</a></li>
                      <li><a href="/terms" className="hover:text-foreground">Términos</a></li>
                      <li><a href="/contact" className="hover:text-foreground">Contacto</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                  <p>© 2024 FindYourPrompt. Todos los derechos reservados.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
