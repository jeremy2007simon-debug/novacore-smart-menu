import Link from "next/link";

/**
 * Raíz del dominio de NovaCore (no de un restaurante concreto — esos viven
 * en /r/[slug]). Placeholder mientras se construye el resto de la Fase 1.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">NovaCore Smart Menu</h1>
      <p className="text-sm text-neutral-500">
        Plataforma de cartas digitales para restaurantes. La carta pública de cada restaurante
        vive en <code className="rounded bg-neutral-100 px-1 py-0.5">/r/tu-slug</code>.
      </p>
      <Link href="/login" className="text-sm text-neutral-900 underline">
        Acceder al panel de propietario o al panel NovaCore
      </Link>
    </main>
  );
}
