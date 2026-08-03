import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export const metadata = {
  title: "Acceder",
};

export default async function LoginPage(props: LoginPageProps) {
  const searchParams = await props.searchParams;
  const next = searchParams.next ?? "/dashboard";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-8 px-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">NovaCore Smart Menu</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Acceso para propietarios, personal de restaurante y administradores de NovaCore. No
          hay registro público: cada cuenta la da de alta el propietario o el equipo de NovaCore.
        </p>
      </div>
      <LoginForm next={next} />
    </main>
  );
}
