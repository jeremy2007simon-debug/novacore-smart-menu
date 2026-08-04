"use client";

import { useActionState } from "react";
import { signInWithPassword, type SignInState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignInState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signInWithPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Contraseña</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
        />
      </div>

      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <Button type="submit" disabled={pending} loading={pending} className="mt-2">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
