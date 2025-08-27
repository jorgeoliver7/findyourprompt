import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FindYourPrompt. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground underline underline-offset-4"
          >
            Términos
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground underline underline-offset-4"
          >
            Privacidad
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground underline underline-offset-4"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}